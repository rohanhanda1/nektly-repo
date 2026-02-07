import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Home', page: 'Home' },
    { name: 'Community', page: 'Community' },
    { name: 'About', page: 'About' },
  ];

  const isActive = (page) => {
    const pageUrl = createPageUrl(page);
    return location.pathname === pageUrl;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to={createPageUrl('Home')} className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Nektly
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.page) 
                    ? 'text-violet-600' 
                    : 'text-gray-600 hover:text-violet-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to={createPageUrl('HighSchoolSignUp')}>
              <Button variant="ghost" className="text-sm font-medium text-gray-600 hover:text-violet-600">
                High School
              </Button>
            </Link>
            <Link to={createPageUrl('CollegeSignUp')}>
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm rounded-xl">
                Become a Mentor
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="px-6 py-4 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  onClick={() => setMobileOpen(false)}
                  className={`block text-lg font-medium ${
                    isActive(link.page) ? 'text-violet-600' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link to={createPageUrl('HighSchoolSignUp')} onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    I'm a High Schooler
                  </Button>
                </Link>
                <Link to={createPageUrl('CollegeSignUp')} onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl">
                    Become a Mentor
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}