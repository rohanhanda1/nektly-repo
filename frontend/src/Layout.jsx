import React from 'react';
import Navbar from './components/shared/Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  );
}