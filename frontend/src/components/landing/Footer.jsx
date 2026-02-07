import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Nektly
              </span>
            </h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Connecting high school students with college mentors for real advice about college life, majors, and campus culture.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('Home')} className="text-gray-400 hover:text-violet-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('About')} className="text-gray-400 hover:text-violet-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('Community')} className="text-gray-400 hover:text-violet-400 transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Get Started</h4>
            <ul className="space-y-3">
              <li>
                <Link to={createPageUrl('HighSchoolSignUp')} className="text-gray-400 hover:text-violet-400 transition-colors">
                  High School Sign Up
                </Link>
              </li>
              <li>
                <Link to={createPageUrl('CollegeSignUp')} className="text-gray-400 hover:text-violet-400 transition-colors">
                  College Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Nektly. Built by students, for students.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <span className="hover:text-violet-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-violet-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}