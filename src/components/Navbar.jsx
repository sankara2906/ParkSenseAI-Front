import React from 'react';
import { FiCpu, FiArrowRight } from 'react-icons/fi';

export default function Navbar({ navigate }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-white/5 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FiCpu className="text-primaryNeon text-xl animate-pulse" />
        <span className="font-heading font-extrabold text-lg tracking-tight text-white">
          PARKSENSE <span className="text-primaryNeon">AI</span>
        </span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 font-nav-text text-[11px] text-slate-300">
        <a href="#hero" className="hover:text-primaryNeon transition-colors">HOME</a>
        <a href="#problem" className="hover:text-primaryNeon transition-colors">THE PROBLEM</a>
        <a href="#solution" className="hover:text-primaryNeon transition-colors">SOLUTION</a>
        <a href="#demo" className="hover:text-primaryNeon transition-colors">LIVE DEMO</a>
        <a href="#dashboard" className="hover:text-primaryNeon transition-colors">DASHBOARD</a>
        <a href="#technology" className="hover:text-primaryNeon transition-colors">TECH STACK</a>
      </div>

      <div className="flex items-center gap-4">
        <a 
          href="/login" 
          className="font-nav-text text-[11px] text-white hover:text-primaryNeon transition-colors hidden sm:block"
        >
          LOGIN
        </a>
        <button 
          onClick={() => navigate ? navigate('/dashboard') : (window.location.href = '/dashboard')}
          className="neon-btn font-button-text text-xs rounded-full px-5 py-2.5 border border-primaryNeon/50 text-primaryNeon bg-primaryNeon/5 hover:bg-primaryNeon hover:text-black transition-all flex items-center gap-2 relative z-[9999] pointer-events-auto cursor-pointer"
        >
          GET STARTED <FiArrowRight />
        </button>
      </div>
    </nav>
  );
}
