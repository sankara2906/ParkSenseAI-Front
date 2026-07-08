import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Navigation, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Zap,
  Car,
  Check,
  Crown,
  Accessibility,
  ParkingCircle
} from 'lucide-react';

/* ─────────────────────────────────────────────
   STABLE DATA FOR THE MAP (35 Slots)
─────────────────────────────────────────────── */
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const COLS = [1, 2, 3, 4, 5];

const VEHICLE_PLATES = [
  'MH12 AB 1234', 'TN09 XZ 5678', 'KA03 CD 9012', 'DL01 EF 3456',
  'GJ05 GH 7890', 'RJ14 IJ 2345', 'UP32 KL 6789', 'WB06 MN 0123',
];

// Helper to determine status based on deterministic ID logic, matching SmartReserve V3
function getSlotInitialStatus(id) {
  const col = parseInt(id.slice(1));
  const seed = (id.charCodeAt(0) * 7 + col * 13) % 100;
  if (seed < 5) return 'Disabled';
  if (seed < 18) return 'EV';
  if (seed < 28) return 'VIP';
  if (seed < 48) return 'Occupied';
  if (seed < 60) return 'Reserved';
  return 'Available';
}

// Generate the 35 slots array
const staticSlots = ROWS.flatMap(row => 
  COLS.map(col => {
    const id = `${row}${col}`;
    const status = getSlotInitialStatus(id);
    return {
      id,
      row,
      col,
      status,
      vehicle: status === 'Occupied' ? VEHICLE_PLATES[(id.charCodeAt(0) + col) % VEHICLE_PLATES.length] : null
    };
  })
);

/* ─────────────────────────────────────────────
   COORDINATE LOOKUPS (For SVG positioning)
   Compact Slot cells: width: 90px, height: 120px
   Total canvas width: 1050px, height: 1180px
─────────────────────────────────────────────── */
function getSlotCoords(id) {
  const rowChar = id.charAt(0);
  const colNum = parseInt(id.slice(1));
  const colIdx = colNum - 1;

  const isLeft = ['A', 'C', 'E', 'G'].includes(rowChar);
  // Left starts at x: 20, Right starts at x: 560
  const startX = isLeft ? 20 : 560;
  const slotX = startX + colIdx * 95;
  
  let slotY = 50;
  if (rowChar === 'C' || rowChar === 'D') slotY = 300;
  if (rowChar === 'E' || rowChar === 'F') slotY = 550;
  if (rowChar === 'G') slotY = 800;

  return { x: slotX, y: slotY };
}

function getLaneY(rowChar) {
  if (rowChar === 'A' || rowChar === 'B') return 230;
  if (rowChar === 'C' || rowChar === 'D') return 480;
  if (rowChar === 'E' || rowChar === 'F') return 730;
  return 980; // For Row G
}

// Generate path coordinates
function getPathForSlot(id) {
  const coords = getSlotCoords(id);
  const slotCenterX = coords.x + 45; // Center of 90px width card
  const slotY = coords.y;
  const rowChar = id.charAt(0);
  const laneY = getLaneY(rowChar);

  return [
    { x: 525, y: 1100 }, // Entrance
    { x: 525, y: laneY }, // Vertical intersection
    { x: slotCenterX, y: laneY }, // Horizontal alignment
    { x: slotCenterX, y: slotY + 120 }, // Bay entrance gate
    { x: slotCenterX, y: slotY + 60 } // Final parked position
  ];
}

/* ─────────────────────────────────────────────
   SLOT STYLE HELPER
─────────────────────────────────────────────── */
function getSlotConfig(status, isSelected) {
  if (status === 'Disabled') {
    return { 
      bg: 'bg-slate-900/40', 
      border: 'border-2 border-slate-700/50', 
      label: 'text-slate-500', 
      icon: <Accessibility className="text-slate-500" size={32} strokeWidth={1.8} />,
      dot: 'bg-slate-700'
    };
  }
  if (status === 'Occupied') {
    return { 
      bg: 'bg-red-950/15', 
      border: 'border-2 border-red-500/40', 
      label: 'text-red-400', 
      icon: <Car className="text-red-500" size={34} strokeWidth={1.8} />,
      dot: 'bg-red-500'
    };
  }
  if (status === 'Reserved') {
    return { 
      bg: isSelected ? 'bg-blue-950/40' : 'bg-blue-950/10', 
      border: isSelected ? 'border-2 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]' : 'border-2 border-blue-500/35', 
      label: 'text-blue-400', 
      icon: <Check className="text-blue-400 animate-pulse" size={34} strokeWidth={2.5} />,
      dot: 'bg-blue-500'
    };
  }
  if (status === 'EV') {
    return { 
      bg: isSelected ? 'bg-purple-950/40' : 'bg-purple-950/10', 
      border: isSelected ? 'border-2 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]' : 'border-2 border-purple-500/35', 
      label: 'text-purple-400', 
      icon: <Zap className="text-purple-400" size={32} strokeWidth={1.8} fill="rgba(168,85,247,0.2)" />,
      dot: 'bg-purple-500'
    };
  }
  if (status === 'VIP') {
    return { 
      bg: isSelected ? 'bg-yellow-950/40' : 'bg-yellow-950/10', 
      border: isSelected ? 'border-2 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]' : 'border-2 border-yellow-500/35', 
      label: 'text-yellow-400', 
      icon: <Crown className="text-yellow-400" size={34} strokeWidth={1.8} />,
      dot: 'bg-yellow-500'
    };
  }
  // Available
  return { 
    bg: isSelected ? 'bg-emerald-950/40' : 'bg-emerald-950/10', 
    border: isSelected ? 'border-2 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]' : 'border-2 border-emerald-500/35', 
    label: 'text-emerald-400', 
    icon: <ParkingCircle className="text-emerald-400" size={34} strokeWidth={1.8} />,
    dot: 'bg-emerald-500'
  };
}

/* ─────────────────────────────────────────────
   3D VEHICLE GUIDANCE MARKER
─────────────────────────────────────────────── */
function AutopilotCar({ color = '#00D9FF' }) {
  return (
    <g>
      <circle cx="0" cy="0" r="14" fill="rgba(0, 217, 255, 0.15)" className="animate-ping" />
      <rect x="-10" y="-7" width="20" height="14" rx="3.5" fill={color} stroke="#090B14" strokeWidth="1.5" />
      <rect x="2" y="-5" width="4" height="10" rx="1.2" fill="#090B14" />
      <circle cx="8" cy="-4" r="1.2" fill="#FFFFFF" />
      <circle cx="8" cy="4" r="1.2" fill="#FFFFFF" />
      <rect x="-10" y="-5" width="1" height="2.5" fill="#EF4444" />
      <rect x="-10" y="2.5" width="1" height="2.5" fill="#EF4444" />
    </g>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */
export default function AINavigationCenter() {
  const [selectedSlotId, setSelectedSlotId] = useState('D4'); // Default target
  const [navStatus, setNavStatus]           = useState('idle'); // 'idle' | 'calculating' | 'navigating' | 'completed'
  const [progress, setProgress]             = useState(0); // 0 to 1

  // Path data selection
  const activePath = useMemo(() => getPathForSlot(selectedSlotId), [selectedSlotId]);

  // Total path distance calculation (pixels to meters scale)
  const pathDistance = useMemo(() => {
    let d = 0;
    for (let i = 0; i < activePath.length - 1; i++) {
      d += Math.abs(activePath[i+1].x - activePath[i].x) + Math.abs(activePath[i+1].y - activePath[i].y);
    }
    return Math.round(d * 0.14); // Scale factor
  }, [activePath]);

  // Autopilot navigation loop simulation
  useEffect(() => {
    let frameId;
    if (navStatus === 'navigating') {
      const duration = pathDistance * 320; // 320ms per meter
      const startTime = performance.now();

      const animate = (time) => {
        const elapsed = time - startTime;
        const nextProgress = Math.min(1, elapsed / duration);
        setProgress(nextProgress);

        if (nextProgress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          setNavStatus('completed');
        }
      };
      frameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frameId);
  }, [navStatus, pathDistance]);

  // Start Autopilot Sequence
  const handleStartAutopilot = async () => {
    if (navStatus === 'navigating' || navStatus === 'calculating') return;
    setProgress(0);
    setNavStatus('calculating');

    // Simulated pathing route calculation delay
    await new Promise(r => setTimeout(r, 1500));
    setNavStatus('navigating');
  };

  const handleCancelNav = () => {
    setProgress(0);
    setNavStatus('idle');
  };

  const handleReset = () => {
    setProgress(0);
    setNavStatus('idle');
  };

  // Interpolated car coordinates along path
  const carPosition = useMemo(() => {
    if (!activePath || activePath.length === 0) return { x: 525, y: 1100, angle: 270 };
    if (progress <= 0) return { x: activePath[0].x, y: activePath[0].y, angle: 270 };
    if (progress >= 1) return { x: activePath[activePath.length - 1].x, y: activePath[activePath.length - 1].y, angle: 270 };

    const segments = [];
    let totalLen = 0;
    for (let i = 0; i < activePath.length - 1; i++) {
      const dx = activePath[i+1].x - activePath[i].x;
      const dy = activePath[i+1].y - activePath[i].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      segments.push({ start: activePath[i], end: activePath[i+1], len, dx, dy });
      totalLen += len;
    }

    const targetLen = progress * totalLen;
    let acc = 0;

    for (const seg of segments) {
      if (acc + seg.len >= targetLen) {
        const ratio = (targetLen - acc) / seg.len;
        const x = seg.start.x + seg.dx * ratio;
        const y = seg.start.y + seg.dy * ratio;
        const angle = Math.atan2(seg.dy, seg.dx) * (180 / Math.PI);
        return { x, y, angle };
      }
      acc += seg.len;
    }

    const last = segments[segments.length - 1];
    return { x: last.end.x, y: last.end.y, angle: Math.atan2(last.dy, last.dx) * (180 / Math.PI) };
  }, [activePath, progress]);

  // Render individual slot cards
  const renderSlotCard = (slot) => {
    const isTarget = slot.id === selectedSlotId;
    const cfg = getSlotConfig(slot.status, isTarget);

    const isClickable = navStatus === 'idle' && slot.status !== 'Disabled' && slot.status !== 'Occupied';
    const isDimmed = selectedSlotId && selectedSlotId !== slot.id;
    const isAvailableOrEV = slot.status === 'Available' || slot.status === 'EV';
    const statusLabel = slot.status === 'EV' ? 'EV ⚡' : slot.status === 'VIP' ? 'VIP 👑' : slot.status === 'Disabled' ? 'Disabled' : slot.status;

    return (
      <button
        key={slot.id}
        onClick={() => { if (isClickable) setSelectedSlotId(slot.id); }}
        disabled={!isClickable}
        className={`
          relative flex flex-col items-center justify-between
          rounded-xl text-left
          transition-all duration-300
          ${cfg.bg} ${cfg.border}
          ${isClickable ? 'cursor-pointer hover:scale-[1.04] hover:-translate-y-0.5' : 'cursor-not-allowed'}
          ${isTarget ? 'shadow-[0_0_20px_rgba(0,217,255,0.35)] border-[#00D9FF] ring-2 ring-[#00D9FF] z-10' : ''}
          ${isTarget && navStatus === 'navigating' ? 'animate-[pulse_1.5s_infinite]' : ''}
          ${isDimmed ? 'opacity-40 hover:opacity-100' : 'opacity-100'}
          focus:outline-none
        `}
        style={{ width: 90, height: 120, padding: '8px 5px 6px', flexShrink: 0 }}
      >
        {/* TOP — Status Label */}
        <span className={`text-[10px] font-bold font-mono tracking-wider leading-none uppercase ${cfg.label}`}>
          {statusLabel}
        </span>

        {/* MIDDLE — Centered Icon */}
        <div className="flex-1 flex items-center justify-center w-full my-1">
          {cfg.icon}
        </div>

        {/* BOTTOM — Slot ID & Status indicator */}
        <div className="flex flex-col items-center gap-0.5 w-full">
          <span className={`text-[13px] font-extrabold font-mono tracking-wider ${cfg.label}`}>{slot.id}</span>
          
          {/* Action trigger button inside destination card */}
          {isTarget && navStatus === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => { e.stopPropagation(); handleStartAutopilot(); }}
              className="w-full py-0.5 bg-[#00D9FF] text-[#090B14] rounded-md text-[8px] font-extrabold uppercase tracking-widest text-center shadow-[0_0_8px_rgba(0,217,255,0.4)] hover:bg-white transition-all cursor-pointer"
            >
              Navigate
            </motion.div>
          )}

          {!isTarget && (
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isAvailableOrEV && isClickable ? 'animate-pulse' : ''}`} />
          )}
        </div>

        {/* Border indicators */}
        <span className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full opacity-35" style={{ background: 'currentColor' }} />
        <span className="absolute right-0 top-3 bottom-3 w-[2.5px] rounded-full opacity-35" style={{ background: 'currentColor' }} />

        {/* Pulsing overlay for active target */}
        {isTarget && (
          <motion.span
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="absolute inset-0 rounded-[10px] pointer-events-none"
            style={{ boxShadow: 'inset 0 0 14px rgba(0,217,255,0.25)' }}
          />
        )}
      </button>
    );
  };

  // Section Block renderer
  const renderSection = (row) => {
    const sectionSlots = staticSlots.filter(s => s.row === row);
    
    return (
      <div className="flex-1 min-w-0">
        {/* Futuristic Glowing Header */}
        <div className="flex items-center gap-2 mb-2 select-none">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/20 to-[#00D9FF]/5" />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00D9FF]/5 border border-[#00D9FF]/20">
            <span className="w-1 h-1 rounded-full bg-[#00D9FF] animate-pulse" />
            <span className="text-[8px] font-extrabold font-mono text-[#00D9FF]/80 uppercase tracking-[0.25em]">
              SECTION {row}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#00D9FF]/25 to-[#00D9FF]/5" />
        </div>

        {/* Slots container */}
        <div className="flex flex-wrap gap-[6px] pl-1">
          {sectionSlots.map(slot => renderSlotCard(slot))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full text-left space-y-4">
      
      {/* ── HEADER TERMINAL SUMMARY ── */}
      <div className="glass-panel rounded-[20px] border border-white/10 bg-[#111827]/45 p-4 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[8px] text-[#00D9FF] uppercase tracking-widest font-bold block font-mono">Autonomous Guidance</span>
          <h2 className="text-lg font-extrabold text-white font-heading uppercase mt-0.5">
            Auto-Pilot Valet System
          </h2>
          <p className="text-[9px] text-slate-500 mt-0.5 uppercase font-mono">
            Navigation Deck · Target: <span className="text-[#00D9FF] font-bold">{selectedSlotId}</span> · Status: {navStatus.toUpperCase()}
          </p>
        </div>

        {/* ACTION BUTTONS PANEL */}
        <div className="flex items-center gap-2 bg-[#090B14]/80 p-1 rounded-2xl border border-white/10 shrink-0">
          <button 
            onClick={handleStartAutopilot}
            disabled={navStatus === 'navigating' || navStatus === 'calculating'}
            className="px-4 py-2 bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-[#090B14] font-heading text-[10px] font-bold rounded-xl transition-all shadow-[0_0_10px_rgba(0,217,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
          >
            {navStatus === 'calculating' ? 'Calculating...' : navStatus === 'navigating' ? 'Guidance Active' : 'Start Navigation'}
          </button>
          
          {(navStatus === 'navigating' || navStatus === 'calculating') && (
            <button 
              onClick={handleCancelNav}
              className="px-3.5 py-2 border border-red-500/35 hover:bg-red-500/10 text-red-400 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all"
            >
              Cancel Navigation
            </button>
          )}

          {navStatus === 'completed' && (
            <button 
              onClick={handleReset}
              className="px-3.5 py-2 border border-white/15 bg-white/5 text-white hover:bg-white/10 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all"
            >
              Reset Route
            </button>
          )}
        </div>
      </div>

      {/* ── PARKING NAVIGATION MAP VIEWPORT (FULL-WIDTH COMPACT) ── */}
      <div className="glass-panel rounded-[20px] border border-white/10 bg-[#111827]/30 p-4 shadow-2xl relative overflow-hidden">
        
        {/* Entrance & Exit Indicators */}
        <div className="flex items-center justify-between mb-3 px-2 select-none">
          <div className="flex items-center gap-1 text-[8px] font-mono text-[#00D9FF]/40 uppercase tracking-[0.2em]">
            <ArrowRight size={8} strokeWidth={2.5} className="animate-pulse" />
            ENTRANCE
          </div>
          <div className="flex-1 mx-3 border-t border-dashed border-white/5" />
          <div className="flex items-center gap-1 text-[8px] font-mono text-[#00D9FF]/40 uppercase tracking-[0.2em]">
            EXIT
            <ArrowLeft size={8} strokeWidth={2.5} className="animate-pulse" />
          </div>
        </div>

        {/* MAP INNER VIEWPORT */}
        <div className="relative w-full aspect-[1050/1180] rounded-xl border border-white/5 bg-[#040710] shadow-inner overflow-hidden">
          
          {/* Grid visual overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />

          {/* SVG path layers */}
          <svg viewBox="0 0 1050 1180" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <defs>
              <filter id="cyanGuidanceGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Central vertical lane */}
            <line x1="525" y1="50" x2="525" y2="1100" stroke="rgba(0, 217, 255, 0.12)" strokeWidth="2" strokeDasharray="8 6" />

            {/* Horizontal lanes */}
            <line x1="20" y1="230" x2="1030" y2="230" stroke="rgba(0, 217, 255, 0.08)" strokeWidth="1.5" strokeDasharray="8 6" />
            <line x1="20" y1="480" x2="1030" y2="480" stroke="rgba(0, 217, 255, 0.08)" strokeWidth="1.5" strokeDasharray="8 6" />
            <line x1="20" y1="730" x2="1030" y2="730" stroke="rgba(0, 217, 255, 0.08)" strokeWidth="1.5" strokeDasharray="8 6" />
            <line x1="20" y1="980" x2="1030" y2="980" stroke="rgba(0, 217, 255, 0.08)" strokeWidth="1.5" strokeDasharray="8 6" />

            {/* ROUTING PATH GUIDANCE LINE */}
            {(navStatus === 'navigating' || navStatus === 'completed' || navStatus === 'calculating') && activePath.length > 0 && (
              <>
                <path 
                  d={`M ${activePath.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#00D9FF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#cyanGuidanceGlow)"
                  className="opacity-40"
                />
                <path 
                  d={`M ${activePath.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[dash_2s_linear_infinite]"
                  strokeDasharray="8 12"
                />
              </>
            )}

            {/* VEHICLE SYMBOL */}
            {navStatus === 'navigating' && (
              <g transform={`translate(${carPosition.x}, ${carPosition.y}) rotate(${carPosition.angle})`} className="transition-transform duration-75">
                <AutopilotCar color="#00D9FF" />
              </g>
            )}
          </svg>

          {/* ABSOLUTE SECTION OVERLAYS */}
          <div className="absolute inset-0 z-10 pointer-events-auto">
            
            {/* Row 1: Section A (left) & Section B (right) */}
            <div className="absolute" style={{ left: 20, top: 40, width: 470 }}>
              {renderSection('A')}
            </div>
            <div className="absolute" style={{ left: 560, top: 40, width: 470 }}>
              {renderSection('B')}
            </div>

            {/* Row 2: Section C (left) & Section D (right) */}
            <div className="absolute" style={{ left: 20, top: 290, width: 470 }}>
              {renderSection('C')}
            </div>
            <div className="absolute" style={{ left: 560, top: 290, width: 470 }}>
              {renderSection('D')}
            </div>

            {/* Row 3: Section E (left) & Section F (right) */}
            <div className="absolute" style={{ left: 20, top: 540, width: 470 }}>
              {renderSection('E')}
            </div>
            <div className="absolute" style={{ left: 560, top: 540, width: 470 }}>
              {renderSection('F')}
            </div>

            {/* Row 4: Section G (left, solo) */}
            <div className="absolute" style={{ left: 20, top: 790, width: 470 }}>
              {renderSection('G')}
            </div>
          </div>

          {/* Autopilot reached popup overlay */}
          <AnimatePresence>
            {navStatus === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md bg-emerald-950/80 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block">Destination Reached</span>
                    <h4 className="text-xs font-bold text-white font-mono mt-0.5">Parking Completed Successfully in Slot {selectedSlotId}</h4>
                  </div>
                </div>
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-[#090B14] font-bold text-[10px] font-mono rounded-xl uppercase transition-all"
                >
                  Confirm &amp; Reset
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Calculating popup overlay */}
          <AnimatePresence>
            {navStatus === 'calculating' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#090B14]/90 z-20 flex flex-col items-center justify-center text-center p-6"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 rounded-full border-2 border-transparent border-t-[#00D9FF] border-r-[#00D9FF]/40 mb-3"
                />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest font-heading">Calculating Best Route...</h4>
                <p className="text-[9px] text-slate-500 font-mono mt-1">Analyzing lane congestion · detour bypass active</p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
        
        {/* Entrance indicator banner */}
        <p className="mt-3 text-center text-[8px] font-mono text-slate-600 uppercase tracking-widest">
          AUTOPILOT PORT ACTIVE · CLICK AN OPEN SLOT AND TAP NAVIGATE TO START PILOT MODE
        </p>
      </div>

      {/* DASHED GUIDANCE LINE CSS KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}} />
    </div>
  );
}
