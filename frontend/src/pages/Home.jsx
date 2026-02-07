import React from 'react';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import WhyNektly from '../components/landing/WhyNektly';
import MentorCTA from '../components/landing/MentorCTA';
import Footer from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WhyNektly />
      <MentorCTA />
      <Footer />
    </div>
  );
}