import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { DollarSign, Clock, Sparkles, ArrowRight } from 'lucide-react';

export default function MentorCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            College Students: Share Your Experience, Get Paid
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Help high schoolers navigate their college journey while earning money on your own schedule
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-amber-300" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">$40</div>
                <div className="text-sm text-white/70">per session</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-300" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">45 min</div>
                <div className="text-sm text-white/70">video calls</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-300" />
              <div className="text-left">
                <div className="text-2xl font-bold text-white">Flexible</div>
                <div className="text-sm text-white/70">your schedule</div>
              </div>
            </div>
          </div>

          <Link to={createPageUrl('CollegeSignUp')}>
            <Button size="lg" className="bg-white text-violet-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
              Become a Mentor
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}