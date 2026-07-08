import React, { useState, useEffect, useRef } from 'react';
import { FiTv, FiDatabase, FiCpu, FiTrendingUp } from 'react-icons/fi';

export default function HowItWorksVisualizer() {
  const containerRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [activeStep, setActiveStep] = useState(1);
  const [dbPulse, setDbPulse] = useState(false);
  const [occupancy, setOccupancy] = useState(45);

  // Parallax / 3D rotation on mouse move
  const handleMouseMove = (e) => {
    const card = containerRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Max 12 degrees tilt
    setRotate({
      x: -y / (rect.height / 24),
      y: x / (rect.width / 24)
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Workflow steps sequence manager
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev % 6) + 1;
        // Trigger database pulse when step 6 (sync) is active
        if (next === 6) {
          setDbPulse(true);
          setTimeout(() => setDbPulse(false), 1200);
        }
        // Change occupancy rating dynamically
        if (next === 4) {
          setOccupancy(74);
        } else if (next === 1) {
          setOccupancy(45);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(stepInterval);
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
      className="w-full h-full min-h-[480px] flex items-center justify-center relative cursor-pointer"
    >
      {/* Outer 3D Rotatable glass panel card */}
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="w-full max-w-[550px] bg-[#111827]/40 border border-white/10 rounded-[24px] p-6 backdrop-blur-lg shadow-2xl relative space-y-6 overflow-hidden flex flex-col justify-between"
      >
        {/* Holographic scanning grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.015)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none rounded-[24px]"></div>
        
        {/* Top Header details */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-center gap-2">
            <FiTv className="text-[#00CFFF] text-base" />
            <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">AI_DETECTION_NODE_STREAM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-stat-mono text-[9px] text-[#00CFFF] bg-[#00CFFF]/10 border border-[#00CFFF]/20 px-2 py-0.5 rounded-full uppercase">
              STEP {activeStep} / 6
            </span>
          </div>
        </div>

        {/* Core system container */}
        <div className="flex-1 w-full relative h-[280px] flex items-center justify-center my-2" style={{ transform: 'translateZ(40px)' }}>
          
          {/* STEP 1: CCTV CAMERA VECTOR IN TOP LEFT */}
          <div className="absolute top-2 left-2 flex flex-col items-center z-20">
            {/* Oscillating CCTV Body */}
            <svg 
              className="w-10 h-10 text-[#00CFFF] transition-all duration-[3000ms] ease-in-out"
              style={{
                transform: `rotate(${activeStep % 2 === 0 ? '-10deg' : '20deg'})`,
              }}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-2-2h-5L9 3H3v13h6l5-3h5a2 2 0 0 0 2-2z" />
              <circle cx="6" cy="9" r="1.5" fill="#EF4444" className="animate-pulse" />
            </svg>
            <span className="text-[6px] font-stat-mono text-slate-500 mt-1 uppercase">CCTV_01</span>
          </div>

          {/* STEP 1-2: SCANNING LASER BEAM SWEEPING */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 500 240">
            <defs>
              <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00CFFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00CFFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Pulsing scanning cone */}
            <polygon 
              points={`25,35 ${activeStep * 80},160 ${activeStep * 80 + 70},160`} 
              fill="url(#scanBeam)" 
              className="transition-all duration-[3000ms] ease-in-out"
            />
          </svg>

          {/* STEP 2-3: PARKING BAYS + YOLO BOUNDING BOXES */}
          <div className="grid grid-cols-4 gap-6 w-full px-8 mt-8">
            {[
              { id: 'S1', type: 'CAR', status: 'Occupied', color: 'border-red-500/30 text-red-400 bg-red-950/5' },
              { id: 'S2', type: 'SUV', status: 'Occupied', color: 'border-red-500/30 text-red-400 bg-red-950/5' },
              { id: 'S3', type: 'EMPTY', status: 'Available', color: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500' },
              { id: 'S4', type: 'BIKE', status: 'Occupied', color: 'border-red-500/30 text-red-400 bg-red-950/5' }
            ].map((slot, index) => {
              const isTarget = slot.id === 'S3';
              
              return (
                <div
                  key={slot.id}
                  className={`relative border-l-2 border-r-2 h-32 flex flex-col justify-between items-center py-3 rounded-lg transition-all duration-500 ${slot.color} ${
                    isTarget && activeStep >= 5 ? 'border-[#00CFFF] text-[#00CFFF] shadow-[0_0_15px_rgba(0,229,255,0.25)] animate-pulse' : ''
                  }`}
                >
                  <span className="font-stat-mono text-[10px] font-bold">{slot.id}</span>
                  
                  {/* Bounding box overlays */}
                  {activeStep >= 2 && (
                    <div className={`absolute inset-1.5 border border-dashed rounded transition-all duration-500 ${
                      slot.status === 'Occupied' ? 'border-red-500/60' : 'border-emerald-500/60'
                    }`}>
                      {/* Bounding box corners */}
                      <span className="absolute -top-0.5 -left-0.5 w-1 h-1 bg-white"></span>
                      <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 bg-white"></span>
                    </div>
                  )}

                  {/* YOLO classification tags */}
                  {activeStep >= 3 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#090B14] border border-white/5 px-1 py-0.5 rounded text-[6px] font-stat-mono font-bold tracking-tight shadow-md">
                      {slot.type === 'EMPTY' ? 'VACANT' : slot.type}
                    </span>
                  )}

                  {/* Render vehicles vector if occupied */}
                  {slot.status === 'Occupied' ? (
                    <svg className="w-8 h-10 text-red-500/70" viewBox="0 0 40 60" fill="currentColor">
                      <rect x="8" y="5" width="24" height="50" rx="5" />
                      <rect x="10" y="15" width="20" height="15" rx="2" fill="#111827" />
                    </svg>
                  ) : (
                    <span className={`w-1.5 h-1.5 rounded-full ${isTarget && activeStep >= 5 ? 'bg-[#00CFFF]' : 'bg-emerald-500'} animate-ping`}></span>
                  )}

                  <span className="text-[7px] font-nav-text uppercase tracking-wider">{slot.status}</span>
                </div>
              );
            })}
          </div>

          {/* STEP 5: NAVIGATION GENERATION */}
          {activeStep >= 5 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 animate-[fadeIn_0.5s_ease-out]" viewBox="0 0 500 240">
              {/* Dash line from entrance to slot 3 */}
              <path 
                d="M 40 185 L 290 185 L 290 140" 
                fill="none" 
                stroke="#00CFFF" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeDasharray="4 4"
                className="animate-[dash_1.5s_linear_infinite]"
              />
              <circle cx="290" cy="140" r="3" fill="#00CFFF" className="animate-ping" />
            </svg>
          )}

          {/* STEP 6: DATABASE SYNC PARTICLES */}
          {activeStep === 6 && (
            <div className="absolute top-2 right-2 flex flex-col items-center gap-1.5 animate-[fadeIn_0.5s_ease-out] z-20">
              <FiDatabase className={`text-xl transition-all duration-300 ${dbPulse ? 'text-[#00CFFF] scale-125' : 'text-slate-500'}`} />
              <span className="text-[6px] font-stat-mono text-[#00CFFF] tracking-widest uppercase">DB_SYNC_OK</span>
              
              {/* Rising particles */}
              <span className="absolute w-1 h-1 bg-[#00CFFF] rounded-full animate-[particle1_1.2s_ease-out_infinite]"></span>
              <span className="absolute w-1 h-1 bg-[#4FDFFF] rounded-full animate-[particle2_1s_ease-out_infinite_0.2s]"></span>
            </div>
          )}

        </div>

        {/* Bottom analytics cards */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 z-10 text-center font-stat-mono text-[10px]" style={{ transform: 'translateZ(30px)' }}>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner">
            <p className="text-[8px] text-slate-500 font-sans uppercase">OCCUPANCY</p>
            <p className="text-white font-bold mt-1 text-xs transition-all duration-500">{occupancy}%</p>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner">
            <p className="text-[8px] text-slate-500 font-sans uppercase">AI CONFIDENCE</p>
            <p className="text-[#00CFFF] font-bold mt-1 text-xs">99.4%</p>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner">
            <p className="text-[8px] text-slate-500 font-sans uppercase">CCTV FEED</p>
            <p className="text-emerald-400 font-bold mt-1 text-xs uppercase flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYNCED
            </p>
          </div>
        </div>

      </div>

      {/* Styled vector keyframes helper */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes particle1 {
          0% {
            transform: translate(-120px, 120px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0px, 0px) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes particle2 {
          0% {
            transform: translate(-60px, 120px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(0px, 0px) scale(0.2);
            opacity: 0;
          }
        }
      `}} />
    </div>
  );
}
