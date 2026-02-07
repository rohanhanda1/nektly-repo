import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: "Real Conversations",
    description: "No scripted answers. Just honest, real talk from students who've been in your shoes."
  },
  {
    icon: Heart,
    title: "Perfect Matches",
    description: "Matched based on your interests, goals, and dream schools for relevant advice."
  },
  {
    icon: Zap,
    title: "Quick & Easy",
    description: "Sign up in minutes, get matched fast, and schedule at your convenience."
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    description: "All our college mentors are verified students at their universities."
  }
];

export default function WhyNektly() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why students love Nektly
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            College decisions are big. We make them a little easier.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-50 transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}