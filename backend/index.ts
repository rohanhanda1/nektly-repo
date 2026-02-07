import express from 'express';
import Airtable from 'airtable';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import serverlessExpress from '@vendia/serverless-express';

const app = express();
app.use(cors());
app.use(express.json());

const base = new Airtable({
  apiKey: 'patIjnkQmg6MfPffu.13bc89ba78fdbd33f661283cb68cdca674ce277f11d39eac528ef3dd47db07f3',
}).base('appRQsm8WfEQBg4Xs');

const ISSUER = 'https://login-test.amtrak.com/aa637bd2-50b5-492b-b3b1-5332c8e113f4/v2.0/';
const JWKS_URI = 'https://login-test.amtrak.com/amtrakb2ctst.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1a_webapp_signin';

const client = jwksClient({
  jwksUri: JWKS_URI,
  cache: true,
  timeout: 30000,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    callback(null, key!.getPublicKey());
  });
}

app.post('/validate', (req, res) => {
  const token = req.headers.authorization?.substring(7);
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, getKey, { algorithms: ['RS256'], issuer: ISSUER }, (err, decoded) => {
    if (err) return res.status(401).json({ valid: false, error: err.message });
    res.json({ valid: true, claims: decoded });
  });
});


app.post("/college-signup", async (req, res) => {
    try {
      const data = req.body;
  
      await base(process.env.AIRTABLE_TABLE!).create([
        {
          fields: {
            Name: data.name,
            Email: data.email,
            University: data.university,
            Major: data.major,
            Year: data.year,
            Interests: data.interests,
            Experience: data.experience,
            Bio: data.bio,
            Availability: data.availability,
            CalendlyLink: data.calendly_link,
            Status: "Pending",
            TotalSessions: 0,
          },
        },
      ]);
  
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save" });
    }
  });
  
  
  app.post("/student-signup", async (req, res) => {
      try {
        const data = req.body;
  
        console.log("Student data"+JSON.stringify(data))
    
        await base("Students").create([
          {
            fields: {
              Name: data.name,
              Email: data.email,
              HighSchool: data.high_school,
              IntendedMajor: Array.isArray(data.intended_majors) 
              ? data.intended_majors.join(", ") 
              : data.intended_majors || "",
              GraduationYear: data.graduation_year ? Number(data.graduation_year) : null,
              Interests: data.interests,
              Goals: data.goals,
              Availability: data.availability,
              CollegesOfInterest:data.colleges_of_interest,
              Status: "Pending"
              
            },
          },
        ]);
    
        res.json({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save" });
      }
    });
  
  app.get("/community-posts", async (req, res) => {
      try {
        const posts = await base("CommunityPosts")
          .select({ sort: [{ field: "created_at", direction: "desc" }] })
          .all();
    
        const answers = await base("Answers").select().all();
        const pollOptions = await base("PollOptions").select().all();
  
        console.log('answerds::'+JSON.stringify(answers));
        console.log('pollOptions::'+JSON.stringify(pollOptions));
  
    
        const answersByPost = {};
        for (const a of answers) {
          const postId = a.fields.community_post?.[0]; // ⚠️ case-sensitive
          console.log('postid::'+postId);
          if (!postId) continue;
    
          answersByPost[postId] ??= [];
          answersByPost[postId].push({
            id: a.id,
            ...a.fields,
          });
        }
    
        const pollOptionsByPost = {};
        for (const o of pollOptions) {
          const postId = o.fields.community_post?.[0];
          if (!postId) continue;
    
          pollOptionsByPost[postId] ??= [];
          pollOptionsByPost[postId].push({
            id: o.id,
            text: o.fields.option_text,
            votes: o.fields.votes || 0,
          });
        }
    
        res.json(
          posts.map(p => ({
            id: p.id,
            ...p.fields,
            answers: answersByPost[p.id] || [],
            poll_options: pollOptionsByPost[p.id] || [],
          }))
        );
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch posts" });
      }
    });  
  
  
  async function fetchBaseSchema(baseId) {
      const resp = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`, // PAT with metadata scope
          "Content-Type": "application/json",
        },
      });
    
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Metadata API error ${resp.status}: ${txt}`);
      }
      const data = await resp.json();
      // data.tables = [ { id, name, fields: [ { name, type, options? } ] } ... ]
      return data;
    }
    
  
  
  app.get("/college-options", async (req, res) => {
      try {
        const baseId = process.env.AIRTABLE_BASE_ID;
        const tableName = "Students";
        const fieldName = "CollegesOfInterest";
    
        const schema = await fetchBaseSchema(baseId);
    
        const table = schema.tables.find(t => t.name === tableName);
        if (!table) {
          return res.status(404).json({ error: `Table '${tableName}' not found` });
        }
    
        const field = table.fields.find(f => f.name === fieldName);
        if (!field) {
          return res.status(404).json({ error: `Field '${fieldName}' not found` });
        }
    
        // For select fields, options.choices is an array like:
        // [{ id, name, color? }, ...]
        const isSelect =
          field.type === "singleSelect" || field.type === "multipleSelects";
    
        if (!isSelect || !field.options?.choices) {
          return res.status(400).json({
            error: `Field '${fieldName}' is of type '${field.type}', not a select with choices.`,
          });
        }
    
        const optionNames = field.options.choices.map(c => c.name);
        res.json({ field: fieldName, options: optionNames });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err.message || err) });
      }
    });
    
  
    app.get("/debug-answers", async (req, res) => {
      const answers = await base("Answers").select().all();
    
      res.json(
        answers.map(a => ({
          id: a.id,
          fields: a.fields,
        }))
      );
    });
  
    app.post("/community-posts", async (req, res) => {
  
  
      try {
  
          console.log("body::"+JSON.stringify(req.body))
  
        const post = await base("CommunityPosts").create({
          type: "Question",   
          title: req.body.title,
          content: req.body.content,
          author_name: req.body.author_name,
          author_type: req.body.author_type,
          tags: req.body.tags,
          likes: 0,
        });
    
        res.json({ id: post.id, ...post.fields });
      } catch (err) {
          console.error("Airtable error:", err);
          console.error(err?.error);
        res.status(500).json({ error: "Failed to create post" });
      }
    });
  
    app.patch("/community-posts/:id", async (req, res) => {
      try {
        await base("CommunityPosts").update(req.params.id, req.body);
        res.json({ success: true });
      } catch {
        res.status(500).json({ error: "Failed to update post" });
      }
    });
  
    app.post("/answers", async (req, res) => {
      const { postId, ...data } = req.body;
      
      console.log("ans::"+JSON.stringify(data))
  
      await base("Answers").create({
        ...data,
        community_post: [postId]
      });
    
      res.json({ success: true });
    });
  
    app.post("/poll-options/vote", async (req, res) => {
      const { optionId } = req.body;
    
      const record = await base("PollOptions").find(optionId);
      const rawVotes = record.fields.votes;
      const votes =
        typeof rawVotes === 'number' ? rawVotes : 0;
    
      await base("PollOptions").update(optionId, {
        votes: votes + 1,
      });
    
      res.json({ success: true });
    });
  


export const handler = serverlessExpress({ app });

// Local dev support
if (process.env.IS_LOCAL === 'true') {
  app.listen(4000, () => console.log('Backend running on http://localhost:4000'));
}