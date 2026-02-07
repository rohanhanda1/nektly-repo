import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Video } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up",
    description: "Tell us about yourself, your interests, and what you want to learn about college life",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50"
  },
  {
    icon: Users,
    title: "Get Matched",
    description: "We'll connect you with a college student who shares your interests and goals",
    color: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50"
  },
  {
    icon: Video,
    title: "Have a Call",
    description: "Schedule a 45-minute video call and get all your questions answered",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting real college advice has never been easier
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-gray-200 to-transparent" />
              )}
              
              <div className={`${step.bgColor} rounded-3xl p-8 h-full hover:scale-105 transition-transform duration-300`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-semibold text-gray-400 mb-2">Step {index + 1}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}