import React, { useState,useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Sparkles, X, Loader2 } from 'lucide-react';
import Footer from '../components/landing/Footer';

const INTERESTS = [
  "STEM", "Business", "Arts", "Humanities", "Pre-Med", "Engineering", 
  "Computer Science", "Social Sciences", "Music", "Sports", "Research",
  "Entrepreneurship", "Writing", "Film/Media", "Politics", "Law"
];

const GOALS = [
  "Admissions advice", "Campus life", "Academic workload", "Choosing a major",
  "Extracurriculars", "Social life", "Study abroad", "Career planning",
  "Greek life", "Housing", "Internships", "Research opportunities"
];

const GRADUATION_YEARS = [2025, 2026, 2027, 2028, 2029];

export default function HighSchoolSignUp() {

    const [collegeOptions, setCollegeOptions] = useState([]);
    const [filteredColleges, setFilteredColleges] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    high_school: '',
    graduation_year: '',
    intended_majors: [],
    colleges_of_interest: [],
    interests: [],
    goals: [],
    availability: ''
  });
  const [majorInput, setMajorInput] = useState('');
  const [collegeInput, setCollegeInput] = useState('');

  useEffect(() => {
    fetch("https://clw4mxgv55.execute-api.us-east-1.amazonaws.com/prod/college-options")
      .then(res => res.json())
      .then((data) => {
        const colleges = Array.isArray(data?.options)
        ? data.options.filter(
            c => typeof c === "string" && c.trim()
          )
        : [];

      setCollegeOptions(colleges);
      console.log("Loaded colleges:", colleges.length);
      })
      .catch(console.error);
  }, []);

  const handleCollegeChange = (value) => {
    console.log("Typing:", value);
    setCollegeInput(value);
  
    if (!value.trim()) {
      setShowDropdown(false);
      return;
    }
  
    const matches = collegeOptions
      .filter(c =>
        c.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 8); // limit dropdown size
      console.log("Matches:", matches.length);
      
    setFilteredColleges(matches);
    setShowDropdown(true);
  };

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const addToArray = (field, value, setInput) => {
    console.log('Add to CL:'+value)
    console.log('Add to Field:'+field)
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setInput('');
    }
  };

  const removeFromArray = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(i => i !== value)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
        const res = await fetch("https://clw4mxgv55.execute-api.us-east-1.amazonaws.com/prod/student-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
      
          if (!res.ok) throw new Error("Failed");
      setIsComplete(true);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.high_school && formData.graduation_year;
      case 2:
        return formData.intended_majors.length > 0 || formData.colleges_of_interest.length > 0;
      case 3:
        return formData.interests.length > 0 && formData.goals.length > 0;
      default:
        return true;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 pt-24">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">You're all set! 🎉</h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              We're finding you the perfect college mentor. You'll receive an email soon with your match and a link to schedule your call.
            </p>
            <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
              <Sparkles className="w-8 h-8 text-violet-500 mx-auto mb-3" />
              <p className="text-gray-700">
                <strong>What happens next?</strong><br />
                Check your inbox ({formData.email}) for an email with your matched college student's info and scheduling link.
              </p>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 pt-24">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= s 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-1 mx-2 rounded ${step > s ? 'bg-violet-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl">Let's get to know you</CardTitle>
                  <CardDescription className="text-lg">Tell us a bit about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-base">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school" className="text-base">High School</Label>
                    <Input
                      id="school"
                      placeholder="Your high school name"
                      value={formData.high_school}
                      onChange={(e) => updateForm('high_school', e.target.value)}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Graduation Year</Label>
                    <Select value={formData.graduation_year} onValueChange={(v) => updateForm('graduation_year', v)}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADUATION_YEARS.map((year) => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl">Your college goals</CardTitle>
                  <CardDescription className="text-lg">What are you interested in studying?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label className="text-base">Intended Majors</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a major (e.g., Computer Science)"
                        value={majorInput}
                        onChange={(e) => setMajorInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('intended_majors', majorInput, setMajorInput))}
                        className="h-12 rounded-xl"
                      />
                      <Button 
                        type="button"
                        onClick={() => addToArray('intended_majors', majorInput, setMajorInput)}
                        className="h-12 px-6 rounded-xl bg-violet-600 hover:bg-violet-700"
                      >
                        Add
                      </Button>
                    </div>
                    {formData.intended_majors.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.intended_majors.map((major) => (
                          <Badge key={major} variant="secondary" className="px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full">
                            {major}
                            <button onClick={() => removeFromArray('intended_majors', major)} className="ml-2">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 relative">
  <Label className="text-base">Colleges of Interest</Label>

  <div className="flex gap-2 relative">
    <Input
      placeholder="Start typing a college name"
      value={collegeInput}
      onChange={(e) => handleCollegeChange(e.target.value)}
      onFocus={() => collegeInput && setShowDropdown(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          addToArray("colleges_of_interest", collegeInput, setCollegeInput);
          setShowDropdown(false);
        }
      }}
      className="h-12 rounded-xl"
    />

    <Button
      type="button"
      onClick={() => {
        addToArray("colleges_of_interest", collegeInput, setCollegeInput);
        setShowDropdown(false);
      }}
      className="h-12 px-6 rounded-xl bg-violet-600 hover:bg-violet-700"
    >
      Add
    </Button>
  </div>

  {showDropdown && filteredColleges.length > 0 && (
    <ul className="absolute z-50 mt-1 w-full bg-white border rounded-xl shadow-lg max-h-64 overflow-auto">
      {filteredColleges.map((college) => (
        <li
        onMouseDown={() => {
          addToArray("colleges_of_interest", college, setCollegeInput);
          setShowDropdown(false);
        }}
        className="px-4 py-2 cursor-pointer hover:bg-violet-50"
      >
          {college}
        </li>
      ))}
    </ul>
  )}
  {formData.colleges_of_interest.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-3">
    {formData.colleges_of_interest.map((college) => (
      <span
        key={college}
        className="bg-violet-100 text-violet-800 px-3 py-1 rounded-full text-sm"
      >
        {college}
      </span>
    ))}
  </div>
)}
</div>


                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl">Almost there!</CardTitle>
                  <CardDescription className="text-lg">What do you want to talk about?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-3">
                    <Label className="text-base">Your Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                          className={`px-4 py-2 cursor-pointer rounded-full transition-all ${
                            formData.interests.includes(interest)
                              ? 'bg-violet-600 text-white hover:bg-violet-700'
                              : 'hover:bg-violet-50 hover:border-violet-300'
                          }`}
                          onClick={() => toggleArrayItem('interests', interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Topics You Want to Discuss</Label>
                    <div className="flex flex-wrap gap-2">
                      {GOALS.map((goal) => (
                        <Badge
                          key={goal}
                          variant={formData.goals.includes(goal) ? 'default' : 'outline'}
                          className={`px-4 py-2 cursor-pointer rounded-full transition-all ${
                            formData.goals.includes(goal)
                              ? 'bg-pink-500 text-white hover:bg-pink-600'
                              : 'hover:bg-pink-50 hover:border-pink-300'
                          }`}
                          onClick={() => toggleArrayItem('goals', goal)}
                        >
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-base">Your Availability (Optional)</Label>
                    <Textarea
                      id="availability"
                      placeholder="e.g., Weekday evenings after 6pm, weekends anytime"
                      value={formData.availability}
                      onChange={(e) => updateForm('availability', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className="rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl px-6"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Find My Mentor
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}