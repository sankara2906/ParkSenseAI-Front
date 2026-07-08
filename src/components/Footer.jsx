import React from 'react';
import { FiGithub, FiTwitter, FiCpu } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050816] border-t border-white/5 py-12 px-8 z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <FiCpu className="text-primaryNeon text-lg" />
            <span className="font-heading font-extrabold text-base tracking-tight text-white">
              PARKSENSE <span className="text-primaryNeon">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Autonomous Space Orchestration Platform © 2026. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 font-nav-text text-[10px] text-slate-400">
          <a href="#" className="hover:text-primaryNeon transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-primaryNeon transition-colors">TERMS OF SERVICE</a>
          <a href="#" className="hover:text-primaryNeon transition-colors">DOCUMENTATION</a>
          <a href="#" className="hover:text-primaryNeon transition-colors">API STATUS</a>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-button-text text-emerald-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            SYS: ACTIVE
          </div>
          
          <div className="flex gap-4 text-slate-400 text-lg">
            <a href="#" className="hover:text-primaryNeon transition-colors"><FiGithub /></a>
            <a href="#" className="hover:text-primaryNeon transition-colors"><FiTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
