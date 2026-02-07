import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Lightbulb, Users } from 'lucide-react';
import Footer from '../components/landing/Footer';
import AadityaImg from '../assets/Aadi.png'
import RohanImg from '../assets/Rohan.png';

const founders = [
  {
    name: "Aaditya Akare",
    role: "Co-Founder",
    school: "Westford Academy (MA)",
    initial: "A",
    image: AadityaImg,
    color: "from-violet-500 to-purple-500"
  },
  {
    name: "Rohan Handa",
    role: "Co-Founder",
    school: "American Heritage School (FL)",
    initial: "R",
    image: RohanImg,
    color: "from-pink-500 to-rose-500"
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-violet-50 pt-24">
      {/* Hero */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Built by students,{' '}
              <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                for students
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We know how confusing college decisions can be. That's why we created Nektly — to give high schoolers the honest, real advice we wish we had.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                When we started looking at colleges, we realized something frustrating: most of the information out there is generic, polished, or written by adults who haven't been in a dorm room in decades.
              </p>
              <p>
                We wanted to know the <em>real</em> stuff. What's the workload actually like? Are the dining halls any good? Do people actually go to office hours? What's the social scene like for someone who isn't into parties?
              </p>
              <p>
                So we built Nektly — a platform where high school students can talk directly with college students who are living the experience right now. No filters, no sales pitches, just honest conversations.
              </p>
              <p>
                Our mission is simple: make college decisions a little less scary and a lot more informed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What We Believe In
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Authenticity",
                description: "Real conversations beat rehearsed answers. We value honesty over perfection.",
                color: "from-pink-500 to-rose-500",
                bg: "bg-pink-50"
              },
              {
                icon: Users,
                title: "Peer Support",
                description: "Students helping students. The best advice often comes from people who've just been there.",
                color: "from-violet-500 to-purple-500",
                bg: "bg-violet-50"
              },
              {
                icon: Lightbulb,
                title: "Accessibility",
                description: "Everyone deserves access to real college insights, regardless of their network.",
                color: "from-amber-500 to-orange-500",
                bg: "bg-amber-50"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${value.bg} rounded-2xl p-6`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet the Founders
          </motion.h2>
          <motion.p
            className="text-gray-600 text-center mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Two high school students who decided to build the resource they wished existed
          </motion.p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow text-center"
              >
                <div className={`avatar-wrapper mx-auto mb-6`}>
                
  
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="avatar-img"
                  />
                  

                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{founder.name}</h3>
                <p className="text-violet-600 font-medium mb-2">{founder.role}</p>
                <p className="text-gray-500">{founder.school}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get real college advice?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join hundreds of students already using Nektly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/HighSchoolSignUp" className="inline-flex items-center justify-center px-8 py-4 bg-white text-violet-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                Get Started
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}