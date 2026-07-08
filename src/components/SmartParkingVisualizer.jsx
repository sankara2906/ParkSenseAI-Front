import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiCpu, FiClock, FiTrendingUp } from 'react-icons/fi';

export default function SmartParkingVisualizer() {
  const [phase, setPhase] = useState(0);
  const [availableCount, setAvailableCount] = useState(6);
  const [occupiedCount, setOccupiedCount] = useState(2);
  const [reservedCount, setReservedCount] = useState(0);

  // Synchronized state machine for the 15-second simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => {
        const next = (prev + 1) % 6;
        
        // Sync HUD counters matching phase states
        if (next === 0) {
          setAvailableCount(8);
          setOccupiedCount(0);
          setReservedCount(0);
        } else if (next === 1) {
          setAvailableCount(5);
          setOccupiedCount(3);
          setReservedCount(0);
        } else if (next === 2) {
          setAvailableCount(4);
          setOccupiedCount(3);
          setReservedCount(1);
        } else if (next === 3 || next === 4) {
          setAvailableCount(3);
          setOccupiedCount(4);
          setReservedCount(1);
        } else if (next === 5) {
          setAvailableCount(3);
          setOccupiedCount(4);
          setReservedCount(2);
        }
        return next;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 bg-[#111827]/40 border border-white/5 rounded-[24px] backdrop-blur-sm relative overflow-hidden select-none">
      
      {/* Blueprint background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,207,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,207,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      {/* Top HUD panel */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
        <div className="flex items-center gap-2">
          <FiCpu className="text-[#00CFFF] text-base animate-pulse" />
          <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">PARKSENSE_NAV_v2.0</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#00CFFF]/10 border border-[#00CFFF]/20 px-2 py-0.5 rounded-full text-[8px] font-stat-mono text-[#00CFFF] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-ping"></span>
          AI OPTIMIZATION ACTIVE
        </div>
      </div>

      {/* Main visualizer viewport */}
      <div className="flex-1 w-full flex items-center justify-center relative my-4">
        
        {/* Radar sweep line (Rotates softly in phase 4) */}
        {phase === 4 && (
          <div className="absolute w-[350px] h-[350px] border border-[#00CFFF]/10 rounded-full flex items-center justify-center pointer-events-none z-10">
            <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_50%,rgba(0,207,255,0.08)_100%)] animate-[spin_3s_linear_infinite]"></div>
          </div>
        )}

        {/* Blueprint SVG map */}
        <svg className="w-full h-full max-h-[260px] text-slate-700" viewBox="0 0 500 240" fill="none">
          {/* LANES AND ROAD MARKINGS */}
          <rect x="10" y="90" width="480" height="60" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          <line x1="10" y1="120" x2="490" y2="120" stroke="rgba(0, 207, 255, 0.08)" strokeWidth="1" strokeDasharray="4 4" />
          <span className="text-[8px] font-stat-mono text-slate-500 font-bold">
            <text x="30" y="112" fill="rgba(0,207,255,0.2)" fontSize="7" letterSpacing="2">DRIVING LANE →</text>
          </span>

          {/* PARKING BAYS LINES - TOP ROW */}
          {/* Bay paint boundaries */}
          {[60, 140, 220, 300, 380, 460].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="90" stroke="#1E293B" strokeWidth="1.5" />
          ))}
          <line x1="60" y1="20" x2="460" y2="20" stroke="#1E293B" strokeWidth="1.5" />

          {/* PARKING BAYS LINES - BOTTOM ROW */}
          {[60, 140, 220, 300, 380, 460].map((x) => (
            <line key={x} x1={x} y1="150" x2={x} y2="220" stroke="#1E293B" strokeWidth="1.5" />
          ))}
          <line x1="60" y1="220" x2="460" y2="220" stroke="#1E293B" strokeWidth="1.5" />

          {/* PARKING SPACES STATES (SLOTS FILLED DYNAMICALLY BASED ON PHASES) */}
          
          {/* SLOT A1 (Top Row 1) */}
          {phase >= 1 && (
            <g className="transition-all duration-500 animate-[fadeIn_0.5s_ease-out]">
              {/* Car outline */}
              <rect x="78" y="25" width="44" height="55" rx="4" fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="1" />
              <text x="96" y="55" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">A1</text>
            </g>
          )}

          {/* SLOT A2 (Top Row 2) */}
          {phase >= 1 && (
            <g className="transition-all duration-500">
              <rect x="158" y="25" width="44" height="55" rx="4" fill="rgba(34, 197, 94, 0.05)" stroke={phase >= 5 ? '#FACC15' : '#22C55E'} strokeWidth="1" className={phase === 4 ? 'animate-pulse' : ''} />
              <text x="176" y="55" fill={phase >= 5 ? '#FACC15' : '#22C55E'} fontSize="8" fontFamily="monospace" fontWeight="bold">A2</text>
              {phase >= 5 && (
                <text x="165" y="40" fill="#FACC15" fontSize="6" fontFamily="sans-serif" fontWeight="bold">RESERVED</text>
              )}
            </g>
          )}

          {/* SLOT A3 (Top Row 3) */}
          {phase >= 1 && (
            <g>
              <rect x="238" y="25" width="44" height="55" rx="4" fill="rgba(0, 207, 255, 0.05)" stroke="#00CFFF" strokeWidth="1" />
              <text x="256" y="55" fill="#00CFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">A3</text>
            </g>
          )}

          {/* SLOT A4 (Top Row 4) */}
          {phase >= 1 && (
            <g>
              <rect x="318" y="25" width="44" height="55" rx="4" fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="1" />
              <text x="336" y="55" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">A4</text>
            </g>
          )}

          {/* SLOT A5 (Top Row 5) - Target Parking Slot */}
          {phase >= 1 && (
            <g>
              <rect x="398" y="25" width="44" height="55" rx="4" 
                fill={phase >= 3 ? 'rgba(250, 204, 21, 0.1)' : 'rgba(34, 197, 94, 0.05)'} 
                stroke={phase >= 3 ? '#FACC15' : '#22C55E'} 
                strokeWidth={phase >= 3 ? 1.5 : 1}
                className={phase === 3 ? 'animate-pulse' : ''} 
              />
              <text x="416" y="55" fill={phase >= 3 ? '#FACC15' : '#22C55E'} fontSize="8" fontFamily="monospace" fontWeight="bold">A5</text>
              {phase === 3 && (
                <text x="404" y="40" fill="#FACC15" fontSize="6" fontFamily="sans-serif" fontWeight="bold">SELECTED</text>
              )}
              {phase >= 4 && (
                <text x="404" y="40" fill="#FACC15" fontSize="6" fontFamily="sans-serif" fontWeight="bold">PARKED</text>
              )}
            </g>
          )}

          {/* BOTTOM ROW BAYS B1-B5 */}
          {phase >= 1 && (
            <>
              {/* B1 (Bottom 1) */}
              <g><rect x="78" y="160" width="44" height="55" rx="4" fill="rgba(34, 197, 94, 0.05)" stroke="#22C55E" strokeWidth="1" className={phase === 4 ? 'animate-pulse' : ''} /><text x="96" y="195" fill="#22C55E" fontSize="8" fontFamily="monospace" fontWeight="bold">B1</text></g>
              {/* B2 (Bottom 2) */}
              <g><rect x="158" y="160" width="44" height="55" rx="4" fill="rgba(239, 68, 68, 0.08)" stroke="#EF4444" strokeWidth="1" /><text x="176" y="195" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">B2</text></g>
              {/* B3 (Bottom 3) */}
              <g><rect x="238" y="160" width="44" height="55" rx="4" fill="rgba(34, 197, 94, 0.05)" stroke="#22C55E" strokeWidth="1" className={phase === 4 ? 'animate-pulse' : ''} /><text x="256" y="195" fill="#22C55E" fontSize="8" fontFamily="monospace" fontWeight="bold">B3</text></g>
              {/* B4 (Bottom 4) */}
              <g><rect x="318" y="160" width="44" height="55" rx="4" fill="rgba(0, 207, 255, 0.05)" stroke="#00CFFF" strokeWidth="1" /><text x="336" y="195" fill="#00CFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">B4</text></g>
              {/* B5 (Bottom 5) */}
              <g><rect x="398" y="160" width="44" height="55" rx="4" fill="rgba(34, 197, 94, 0.05)" stroke="#22C55E" strokeWidth="1" className={phase === 4 ? 'animate-pulse' : ''} /><text x="416" y="195" fill="#22C55E" fontSize="8" fontFamily="monospace" fontWeight="bold">B5</text></g>
            </>
          )}

          {/* 3. GLOWING NAVIGATION PATH & PIN */}
          {phase >= 2 && (
            <g className="animate-[fadeIn_0.5s_ease-out]">
              {/* Location pin at entrance */}
              <circle cx="35" cy="120" r="5" fill="#00CFFF" />
              <circle cx="35" cy="120" r="10" fill="none" stroke="#00CFFF" strokeWidth="1" className="animate-ping" />
              
              {/* Navigation Route */}
              <path 
                id="hud-route" 
                d="M 35 120 L 420 120 L 420 85" 
                fill="none" 
                stroke="#00CFFF" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                strokeDasharray={phase >= 3 ? "0" : "5 5"}
                className={phase === 2 ? 'animate-[dash_2s_linear_infinite]' : ''} 
              />
            </g>
          )}

          {/* 4. VEHICLE ICON MOVING ALONG THE PATH */}
          {phase === 3 && (
            <g className="animate-[moveVehicle_2.5s_linear_infinite]">
              {/* Simple vehicle box representing the car driving */}
              <rect x="-8" y="-5" width="16" height="10" rx="2" fill="#00CFFF" stroke="#FFFFFF" strokeWidth="0.5" />
              {/* Headlights beams */}
              <polygon points="8,-3 16,-8 16,8 8,3" fill="rgba(0, 207, 255, 0.25)" />
            </g>
          )}

          {/* Style rules for vector route translations */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash {
              to {
                stroke-dashoffset: -20;
              }
            }
            @keyframes moveVehicle {
              0% {
                transform: translate(35px, 120px) rotate(0deg);
              }
              70% {
                transform: translate(420px, 120px) rotate(0deg);
              }
              80% {
                transform: translate(420px, 120px) rotate(-90deg);
              }
              100% {
                transform: translate(420px, 85px) rotate(-90deg);
              }
            }
          `}} />
        </svg>
      </div>

      {/* Bottom HUD statistics overlay */}
      <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 z-10 text-center font-stat-mono text-[11px]">
        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
          <p className="text-[9px] text-slate-500 font-sans uppercase">Available</p>
          <p className="text-[#22C55E] font-bold mt-1 text-sm">{availableCount} Spaces</p>
        </div>
        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
          <p className="text-[9px] text-slate-500 font-sans uppercase">Occupied</p>
          <p className="text-[#EF4444] font-bold mt-1 text-sm">{occupiedCount} Spaces</p>
        </div>
        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
          <p className="text-[9px] text-slate-500 font-sans uppercase">Reserved</p>
          <p className="text-[#FACC15] font-bold mt-1 text-sm">{reservedCount} Slots</p>
        </div>
      </div>

    </div>
  );
}
