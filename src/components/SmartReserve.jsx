import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, CheckCircle, XCircle, Clock, Car,
  BarChart2, Activity, MapPin, X, CalendarCheck2,
  ChevronRight, ShieldCheck, Layers, Navigation,
  ParkingCircle, Cpu, WifiHigh, Timer, Route,
  ArrowRight, ArrowLeft
} from 'lucide-react';

/* ─────────────────────────────────────────────
   DATA — 7 rows × 5 slots = 35 total (UNCHANGED)
─────────────────────────────────────────────── */
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const COLS = [1, 2, 3, 4, 5];

const VEHICLE_PLATES = [
  'MH12 AB 1234', 'TN09 XZ 5678', 'KA03 CD 9012', 'DL01 EF 3456',
  'GJ05 GH 7890', 'RJ14 IJ 2345', 'UP32 KL 6789', 'WB06 MN 0123',
];

function makeSlot(row, col) {
  const id = `${row}${col}`;
  const seed = (id.charCodeAt(0) * 7 + col * 13) % 100;
  let status, type, vehicle, duration;
  if (seed < 5)       { status = 'Disabled'; type = 'disabled'; }
  else if (seed < 18) { status = 'EV';       type = 'ev'; }
  else if (seed < 28) { status = 'VIP';      type = 'vip'; }
  else if (seed < 48) { status = 'Occupied'; type = 'standard'; vehicle = VEHICLE_PLATES[seed % VEHICLE_PLATES.length]; duration = `${1 + (seed % 3)}h ${(seed * 7) % 60}m`; }
  else if (seed < 60) { status = 'Reserved'; type = 'standard'; }
  else                { status = 'Available'; type = 'standard'; }
  return { id, row, col, status, type, vehicle: vehicle || null, duration: duration || null, floor: 'Ground Floor' };
}

function buildFloorData(floorName) {
  const offset = { 'Level 1': 20, 'Level 2': 40, 'Level 3': 60, 'Basement': 80 }[floorName] || 0;
  return ROWS.map(row =>
    COLS.map(col => {
      const base = makeSlot(row, col);
      const id2 = `${floorName}${row}${col}`;
      const seed2 = (id2.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + offset) % 100;
      let status, type, vehicle, dur;
      if (seed2 < 5)       { status = 'Disabled'; type = 'disabled'; }
      else if (seed2 < 17) { status = 'EV';       type = 'ev'; }
      else if (seed2 < 26) { status = 'VIP';      type = 'vip'; }
      else if (seed2 < 46) { status = 'Occupied'; type = 'standard'; vehicle = VEHICLE_PLATES[seed2 % VEHICLE_PLATES.length]; dur = `${1 + seed2 % 3}h ${(seed2 * 7) % 60}m`; }
      else if (seed2 < 58) { status = 'Reserved'; type = 'standard'; }
      else                  { status = 'Available'; type = 'standard'; }
      return { ...base, status, type, vehicle: vehicle || null, duration: dur || null };
    })
  );
}

const INITIAL_FLOOR_DATA = {
  'Ground Floor': buildFloorData('Ground Floor'),
  'Level 1':      buildFloorData('Level 1'),
  'Level 2':      buildFloorData('Level 2'),
  'Level 3':      buildFloorData('Level 3'),
  'Basement':     buildFloorData('Basement'),
};

const FLOORS = ['Ground Floor', 'Level 1', 'Level 2', 'Level 3', 'Basement'];

/* ─────────────────────────────────────────────
   SLOT CONFIG HELPERS (UNCHANGED)
─────────────────────────────────────────────── */
function getSlotConfig(slot, isSelected) {
  if (slot.status === 'Disabled') return { bg: 'bg-slate-900/40', border: 'border-slate-700/30', glow: '', label: 'text-slate-600', dot: 'bg-slate-700' };
  if (slot.status === 'Occupied') return { bg: 'bg-red-950/20', border: 'border-red-500/30', glow: '', label: 'text-red-400', dot: 'bg-red-500' };
  if (slot.status === 'Reserved') return { bg: isSelected ? 'bg-blue-950/40' : 'bg-blue-950/10', border: isSelected ? 'border-blue-400' : 'border-blue-500/40', glow: isSelected ? 'shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'shadow-[0_0_8px_rgba(59,130,246,0.15)]', label: 'text-blue-400', dot: 'bg-blue-500' };
  if (slot.status === 'EV')       return { bg: isSelected ? 'bg-purple-950/50' : 'bg-purple-950/15', border: isSelected ? 'border-purple-400' : 'border-purple-500/40', glow: isSelected ? 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' : '', label: 'text-purple-400', dot: 'bg-purple-500' };
  if (slot.status === 'VIP')      return { bg: isSelected ? 'bg-yellow-950/50' : 'bg-yellow-950/15', border: isSelected ? 'border-yellow-400' : 'border-yellow-500/30', glow: isSelected ? 'shadow-[0_0_20px_rgba(234,179,8,0.4)]' : '', label: 'text-yellow-400', dot: 'bg-yellow-500' };
  return { bg: isSelected ? 'bg-emerald-950/50' : 'bg-emerald-950/10', border: isSelected ? 'border-emerald-400' : 'border-emerald-500/25', glow: isSelected ? 'shadow-[0_0_20px_rgba(34,197,94,0.4)]' : '', label: 'text-emerald-400', dot: 'bg-emerald-500' };
}

function statusColor(s) {
  return { Available: 'text-emerald-400', Occupied: 'text-red-400', Reserved: 'text-blue-400', EV: 'text-purple-400', VIP: 'text-yellow-400', Disabled: 'text-slate-500' }[s] || 'text-slate-400';
}
function statusBadgeBg(s) {
  return { Available: 'bg-emerald-500/10 border-emerald-500/30', Occupied: 'bg-red-500/10 border-red-500/30', Reserved: 'bg-blue-500/10 border-blue-500/30', EV: 'bg-purple-500/10 border-purple-500/30', VIP: 'bg-yellow-500/10 border-yellow-500/30', Disabled: 'bg-slate-800/40 border-slate-600/30' }[s] || 'bg-slate-800 border-white/10';
}

/* ─────────────────────────────────────────────
   CAR SVG — UNCHANGED
─────────────────────────────────────────────── */
function CarIcon({ color = '#EF4444' }) {
  return (
    <svg viewBox="0 0 36 60" fill="none" style={{ width: 26, height: 42 }}>
      <rect x="4" y="2" width="28" height="56" rx="8" fill="#1e293b" stroke={color} strokeWidth="1.5" />
      <rect x="7" y="10" width="22" height="20" rx="4" fill={color} opacity="0.85" />
      <rect x="9" y="13" width="18" height="13" rx="2" fill="#090B14" />
      <path d="M9 13 L27 13 L24 9 L12 9 Z" fill="#475569" />
      <path d="M9 26 L27 26 L25 30 L11 30 Z" fill="#475569" />
      <circle cx="8" cy="5" r="2.5" fill="#FDE047" opacity="0.9" />
      <circle cx="28" cy="5" r="2.5" fill="#FDE047" opacity="0.9" />
      <rect x="6" y="52" width="6" height="3" rx="1.5" fill={color} />
      <rect x="24" y="52" width="6" height="3" rx="1.5" fill={color} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SLOT CELL — 18% smaller (48×74px), all animations preserved
─────────────────────────────────────────────── */
function SlotCell({ slot, isSelected, onSelect }) {
  const cfg = getSlotConfig(slot, isSelected);
  const isAvailableOrEV = slot.status === 'Available' || slot.status === 'EV';

  // Status label text
  const statusLabel = slot.status === 'EV' ? 'EV ⚡' : slot.status === 'VIP' ? 'VIP 👑' : slot.status === 'Disabled' ? 'Disabled' : slot.status;

  return (
    <motion.button
      onClick={() => onSelect(slot)}
      disabled={slot.status === 'Disabled'}
      whileHover={slot.status !== 'Disabled' ? { scale: 1.06, y: -3 } : {}}
      whileTap={slot.status !== 'Disabled' ? { scale: 0.93 } : {}}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      title={`Slot ${slot.id} — ${slot.status}${slot.vehicle ? ` | ${slot.vehicle}` : ''}`}
      className={`
        relative flex flex-col items-center justify-between
        border-2 rounded-xl
        transition-all duration-300
        ${cfg.bg} ${cfg.border} ${cfg.glow}
        ${slot.status === 'Disabled' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[#090B14] ring-[#00D9FF] z-10' : ''}
        focus:outline-none
      `}
      style={{ width: 88, height: 112, padding: '8px 6px 7px', flexShrink: 0 }}
    >
      {/* TOP — Status label */}
      <span className={`text-[8px] font-bold font-mono tracking-wider leading-none uppercase ${cfg.label}`}>
        {statusLabel}
      </span>

      {/* MIDDLE — Large icon */}
      <div className="flex-1 flex items-center justify-center w-full">
        {slot.status === 'Occupied' && (
          <div className="flex items-center justify-center" style={{ width: 36, height: 56 }}>
            <CarIcon color="#EF4444" />
          </div>
        )}
        {slot.status === 'Available' && (
          <div className="flex flex-col items-center gap-2">
            {/* Parking P symbol */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="w-8 h-8 rounded-full border-2 border-emerald-500/50 flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}
            >
              <span className="text-emerald-400 font-extrabold text-lg font-mono leading-none">P</span>
            </motion.div>
            <motion.span
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400"
              style={{ boxShadow: '0 0 8px rgba(34,197,94,0.8)' }}
            />
          </div>
        )}
        {slot.status === 'Reserved' && (
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{ boxShadow: ['0 0 6px rgba(59,130,246,0.3)', '0 0 14px rgba(59,130,246,0.7)', '0 0 6px rgba(59,130,246,0.3)'] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-8 h-8 rounded-full border-2 border-blue-500/50 flex items-center justify-center"
            >
              <CheckCircle size={16} className="text-blue-400" strokeWidth={2} />
            </motion.div>
          </div>
        )}
        {slot.status === 'EV' && (
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="flex flex-col items-center gap-1"
          >
            <Zap size={28} className="text-purple-400" strokeWidth={2.5} fill="rgba(168,85,247,0.25)" />
            <motion.div
              animate={{ width: ['20%', '80%', '20%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-0.5 bg-purple-500/60 rounded-full"
            />
          </motion.div>
        )}
        {slot.status === 'VIP' && (
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-3xl leading-none select-none"
            style={{ filter: 'drop-shadow(0 0 8px rgba(234,179,8,0.6))' }}
          >
            👑
          </motion.div>
        )}
        {slot.status === 'Disabled' && (
          <span className="text-3xl leading-none select-none opacity-50">♿</span>
        )}
      </div>

      {/* BOTTOM — Slot ID */}
      <div className="flex flex-col items-center gap-0.5">
        <span className={`text-[11px] font-extrabold font-mono tracking-wider ${cfg.label}`}>{slot.id}</span>
        {/* Pulsing availability dot */}
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${isAvailableOrEV && !isSelected ? 'animate-pulse' : ''}`} />
      </div>

      {/* Parking bay side-line marks (decorative) */}
      <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-20" style={{ background: 'currentColor' }} />
      <span className="absolute right-0 top-3 bottom-3 w-0.5 rounded-full opacity-20" style={{ background: 'currentColor' }} />

      {/* Selected scan-line overlay */}
      {isSelected && (
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 16px rgba(0,217,255,0.18), 0 0 16px rgba(0,217,255,0.12)' }}
        />
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER — glowing neon divider
─────────────────────────────────────────────── */
function SectionHeader({ row }) {
  return (
    <div className="flex items-center gap-2 mb-2 select-none">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#00D9FF]/25 to-[#00D9FF]/10" />
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
        bg-[#00D9FF]/6 border border-[#00D9FF]/22
        shadow-[0_0_10px_rgba(0,217,255,0.07)]">
        <ParkingCircle size={9} className="text-[#00D9FF]/70" strokeWidth={2.5} />
        <span className="text-[8px] font-extrabold font-mono text-[#00D9FF]/75 uppercase tracking-[0.22em]">
          SECTION {row}
        </span>
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-1 rounded-full bg-[#00D9FF]"
        />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#00D9FF]/25 to-[#00D9FF]/10" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   DRIVE LANE — realistic parking lane separator
─────────────────────────────────────────────── */
function DriveLane() {
  return (
    <div className="relative my-3 overflow-hidden select-none pointer-events-none" style={{ height: 28 }}>
      {/* Road surface */}
      <div className="absolute inset-0 bg-[#0a0e1a]/80 border-t border-b border-[#00D9FF]/8" />

      {/* Dashed centre line */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center">
        <div className="w-full border-t-2 border-dashed border-[#00D9FF]/12" />
      </div>

      {/* Entrance label */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <ArrowRight size={8} className="text-[#00D9FF]/25" strokeWidth={2.5} />
        <span className="text-[7px] font-mono text-[#00D9FF]/22 uppercase tracking-widest">Enter</span>
      </div>

      {/* DRIVE LANE centre badge */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded
        bg-[#090B14]/90 border border-dashed border-[#00D9FF]/15">
        {/* Animated moving dot */}
        <motion.span
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-1 h-1 rounded-full bg-[#00D9FF]/50 shadow-[0_0_4px_rgba(0,217,255,0.6)]"
        />
        <span className="text-[7px] font-mono text-[#00D9FF]/35 uppercase tracking-[0.18em] whitespace-nowrap">
          ← DRIVE LANE →
        </span>
        <motion.span
          animate={{ x: [0, -40, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-1 h-1 rounded-full bg-[#00D9FF]/50 shadow-[0_0_4px_rgba(0,217,255,0.6)]"
        />
      </div>

      {/* Exit label */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <span className="text-[7px] font-mono text-[#00D9FF]/22 uppercase tracking-widest">Exit</span>
        <ArrowLeft size={8} className="text-[#00D9FF]/25" strokeWidth={2.5} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TWO-COLUMN SECTION PAIR
─────────────────────────────────────────────── */
function SectionPair({ leftRow, rightRow, leftIdx, rightIdx, grid, selectedSlot, onSelect }) {
  const colNums = COLS.map(c => (
    <div key={c} style={{ width: 48 }} className="text-center text-[7px] font-mono text-slate-700 select-none">{c}</div>
  ));

  const renderRowSlots = (rowIdx) =>
    grid[rowIdx].map(slot => (
      <SlotCell
        key={slot.id}
        slot={slot}
        isSelected={selectedSlot?.id === slot.id}
        onSelect={onSelect}
      />
    ));

  const SectionBlock = ({ row, rowIdx }) => (
    <div className="flex-1 min-w-0">
      <SectionHeader row={row} />

      {/* Entrance arrow */}
      <div className="flex items-center gap-1 mb-2 pl-1">
        <ArrowRight size={9} className="text-[#00D9FF]/35" strokeWidth={2.5} />
        <span className="text-[7px] font-mono text-[#00D9FF]/30 uppercase tracking-[0.18em]">Entrance</span>
      </div>

      {/* Slots — flex-wrap so they flow 3+2 naturally */}
      <div className="flex flex-wrap gap-[8px] pl-1">
        {renderRowSlots(rowIdx)}
      </div>

      {/* Exit arrow */}
      <div className="flex items-center gap-1 mt-2 pl-1">
        <ArrowLeft size={9} className="text-[#00D9FF]/35" strokeWidth={2.5} />
        <span className="text-[7px] font-mono text-[#00D9FF]/30 uppercase tracking-[0.18em]">Exit</span>
      </div>
    </div>
  );

  return (
    <div className="flex gap-4 w-full">
      <SectionBlock row={leftRow} rowIdx={leftIdx} />

      {/* Vertical separator */}
      <div className="w-px bg-gradient-to-b from-transparent via-[#00D9FF]/10 to-transparent self-stretch shrink-0 mx-1" />

      {rightRow ? (
        <SectionBlock row={rightRow} rowIdx={rightIdx} />
      ) : (
        /* If odd row (Section G), fill half the space */
        <div className="flex-1 min-w-0" />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOP STATUS CHIPS
─────────────────────────────────────────────── */
function StatusChips({ allSlots, floor }) {
  const counts = {
    total:     allSlots.length,
    available: allSlots.filter(s => s.status === 'Available').length,
    occupied:  allSlots.filter(s => s.status === 'Occupied').length,
    reserved:  allSlots.filter(s => s.status === 'Reserved').length,
    ev:        allSlots.filter(s => s.status === 'EV').length,
    vip:       allSlots.filter(s => s.status === 'VIP').length,
    disabled:  allSlots.filter(s => s.status === 'Disabled').length,
  };
  const chips = [
    { label: 'Capacity',  value: counts.total,     color: 'text-white',        bg: 'bg-white/5 border-white/10', dot: null },
    { label: 'Available', value: counts.available,  color: 'text-emerald-400',  bg: 'bg-emerald-500/8 border-emerald-500/20', dot: 'bg-emerald-500' },
    { label: 'Occupied',  value: counts.occupied,   color: 'text-red-400',      bg: 'bg-red-500/8 border-red-500/20',     dot: 'bg-red-500' },
    { label: 'Reserved',  value: counts.reserved,   color: 'text-blue-400',     bg: 'bg-blue-500/8 border-blue-500/20',   dot: 'bg-blue-500' },
    { label: 'VIP',       value: counts.vip,        color: 'text-yellow-400',   bg: 'bg-yellow-500/8 border-yellow-500/20', dot: 'bg-yellow-500' },
    { label: 'EV',        value: counts.ev,         color: 'text-purple-400',   bg: 'bg-purple-500/8 border-purple-500/20', dot: 'bg-purple-500' },
  ];
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Floor badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D9FF]/8 border border-[#00D9FF]/25 mr-1">
        <Layers size={10} className="text-[#00D9FF]" strokeWidth={2.5} />
        <span className="text-[9px] font-bold font-mono text-[#00D9FF] uppercase tracking-wider">{floor}</span>
      </div>
      {chips.map(c => (
        <div key={c.label} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${c.bg}`}>
          {c.dot && <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />}
          <span className={`text-[9px] font-bold font-mono uppercase tracking-wide ${c.color}`}>
            {c.label}: {c.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BOTTOM LEGEND
─────────────────────────────────────────────── */
function BottomLegend() {
  const items = [
    { emoji: '🟢', label: 'Available', dot: 'bg-emerald-500' },
    { emoji: '🔴', label: 'Occupied',  dot: 'bg-red-500'     },
    { emoji: '🔵', label: 'Reserved',  dot: 'bg-blue-500'    },
    { emoji: '🟣', label: 'EV ⚡',    dot: 'bg-purple-500'  },
    { emoji: '🟡', label: 'VIP 👑',   dot: 'bg-yellow-500'  },
    { emoji: '⚫', label: 'Disabled ♿', dot: 'bg-slate-600' },
  ];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1.5 justify-center mt-3">
      {items.map(i => (
        <div key={i.label} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${i.dot}`} />
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">{i.emoji} {i.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   STATS PANEL (right column)
─────────────────────────────────────────────── */
function StatsPanel({ allSlots }) {
  const counts = {
    total:     allSlots.length,
    available: allSlots.filter(s => s.status === 'Available').length,
    occupied:  allSlots.filter(s => s.status === 'Occupied').length,
    reserved:  allSlots.filter(s => s.status === 'Reserved').length,
    ev:        allSlots.filter(s => s.status === 'EV').length,
    vip:       allSlots.filter(s => s.status === 'VIP').length,
    disabled:  allSlots.filter(s => s.status === 'Disabled').length,
  };
  const occupancyPct = Math.round((counts.occupied / counts.total) * 100);
  const circumference = 2 * Math.PI * 20;
  const stats = [
    { label: 'Available', value: counts.available, color: '#22c55e', dot: 'bg-emerald-500' },
    { label: 'Occupied',  value: counts.occupied,  color: '#EF4444', dot: 'bg-red-500'    },
    { label: 'Reserved',  value: counts.reserved,  color: '#3B82F6', dot: 'bg-blue-500'   },
    { label: 'EV',        value: counts.ev,        color: '#A855F7', dot: 'bg-purple-500' },
    { label: 'VIP',       value: counts.vip,        color: '#EAB308', dot: 'bg-yellow-500' },
    { label: 'Disabled',  value: counts.disabled,  color: '#64748b', dot: 'bg-slate-600'  },
  ];
  return (
    <div className="glass-panel rounded-[20px] border border-white/10 bg-[#111827]/40 p-4 shadow-xl text-left space-y-4">
      <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
        <BarChart2 size={14} className="text-[#00D9FF]" strokeWidth={2.4} />
        <div>
          <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Live Telemetry</span>
          <span className="text-xs font-extrabold text-white font-heading uppercase">Statistics</span>
        </div>
      </div>
      {/* Donut */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <motion.circle cx="24" cy="24" r="20" fill="none" stroke="#00D9FF" strokeWidth="4"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (occupancyPct / 100) * circumference }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeDasharray={circumference}
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold text-white">{occupancyPct}%</span>
        </div>
        <div>
          <span className="text-[8px] text-slate-500 uppercase tracking-wider block">Occupancy</span>
          <span className={`text-[10px] font-bold font-mono ${occupancyPct > 75 ? 'text-red-400' : 'text-emerald-400'}`}>
            {occupancyPct > 75 ? '⚠ HIGH DEMAND' : '✓ NORMAL'}
          </span>
          <span className="text-[8px] text-slate-500 block">{counts.total} Total Slots</span>
        </div>
      </div>
      {/* Stat rows */}
      <div className="space-y-1.5">
        {stats.map(s => (
          <div key={s.label} className="flex items-center justify-between bg-[#090B14]/40 px-2.5 py-1.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
              <span className="text-[8px] font-mono text-slate-400 uppercase tracking-wide">{s.label}</span>
            </div>
            <span className="text-[9px] font-bold font-mono" style={{ color: s.color }}>
              {s.value.toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SLOT INFO PANEL — expanded with AI fields
─────────────────────────────────────────────── */
function SlotInfoPanel({ slot, floor, onClose, onOpenPayment }) {
  if (!slot) return null;
  const canReserve = slot.status === 'Available' || slot.status === 'EV';

  // AI-generated supplementary fields
  const walkDist = `${(slot.col * 12 + 8)}m`;
  const exitTime = slot.duration
    ? (() => {
        const h = parseInt(slot.duration) || 0;
        const d = new Date(Date.now() + h * 3600000);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
      })()
    : '—';
  const aiPrediction = slot.status === 'Available'
    ? 'High availability in next 2h'
    : slot.status === 'EV'
    ? 'EV bay — fast charge 45 min'
    : slot.status === 'Occupied'
    ? `Exit est. ${exitTime}`
    : '—';
  const vehicleType = slot.status === 'EV' ? 'Electric Vehicle' : slot.status === 'VIP' ? 'VIP — Premium' : slot.vehicle ? 'Sedan / SUV' : '—';

  return (
    <AnimatePresence>
      <motion.div
        key={slot.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ type: 'spring', stiffness: 370, damping: 28 }}
        className="glass-panel rounded-[20px] border border-white/10 bg-[#111827]/50 backdrop-blur-xl p-4 shadow-2xl relative text-left space-y-3"
      >
        <button onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all border border-white/5">
          <X size={11} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-2.5 pr-6">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold font-mono shrink-0 border text-sm ${statusBadgeBg(slot.status)} ${statusColor(slot.status)}`}>
            {slot.id}
          </div>
          <div>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold block">Slot Info</span>
            <span className="text-sm font-extrabold text-white font-heading uppercase block">Slot {slot.id}</span>
          </div>
        </div>

        {/* Status badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-bold font-mono uppercase tracking-wider ${statusBadgeBg(slot.status)} ${statusColor(slot.status)}`}>
          <span className={`w-1 h-1 rounded-full ${slot.status === 'Available' || slot.status === 'EV' ? 'animate-pulse' : ''} bg-current`} />
          {slot.status === 'EV' ? '⚡ EV Charging' : slot.status === 'VIP' ? '👑 VIP' : slot.status === 'Disabled' ? '♿ Disabled' : slot.status}
        </div>

        {/* Detail rows */}
        <div className="bg-[#090B14]/50 rounded-xl border border-white/5 divide-y divide-white/5 text-[9px] font-mono overflow-hidden">
          {[
            { label: 'Slot ID',        value: slot.id,       icon: <MapPin size={9} />,       color: null },
            { label: 'Section',        value: `Section ${slot.row}`, icon: <Layers size={9} />, color: null },
            { label: 'Floor',          value: floor,          icon: <Activity size={9} />,     color: null },
            { label: 'Status',         value: slot.status,    icon: <ShieldCheck size={9} />,  color: statusColor(slot.status) },
            { label: 'Vehicle Type',   value: vehicleType,    icon: <Car size={9} />,          color: null },
            slot.vehicle && { label: 'Vehicle No.',  value: slot.vehicle,   icon: <Car size={9} />,     color: null },
            slot.duration && { label: 'Duration',     value: slot.duration,  icon: <Clock size={9} />,   color: null },
            { label: 'Est. Exit',      value: exitTime,       icon: <Timer size={9} />,        color: 'text-orange-400' },
            { label: 'Walk Distance',  value: walkDist,       icon: <Route size={9} />,        color: 'text-sky-400' },
            slot.status === 'EV' && { label: 'Charging',   value: 'Fast Charge', icon: <Zap size={9} />, color: 'text-purple-400' },
          ].filter(Boolean).map(row => (
            <div key={row.label} className="flex items-center justify-between px-2.5 py-1.5">
              <span className="flex items-center gap-1 text-slate-600 uppercase tracking-wider">
                <span className="text-slate-700">{row.icon}</span>
                {row.label}
              </span>
              <span className={`font-bold truncate max-w-[90px] text-right ${row.color || 'text-white'}`}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* AI Prediction */}
        <div className="flex items-start gap-2 px-2.5 py-2 rounded-xl bg-[#00D9FF]/5 border border-[#00D9FF]/12">
          <Cpu size={10} className="text-[#00D9FF] shrink-0 mt-0.5" strokeWidth={2.5} />
          <div>
            <span className="text-[7px] text-[#00D9FF]/70 font-bold uppercase tracking-widest block">AI Prediction</span>
            <span className="text-[9px] text-slate-300 font-mono">{aiPrediction}</span>
          </div>
        </div>

        {/* Reserve button — opens inline payment drawer */}
        {canReserve && (
          <motion.button
            onClick={() => onOpenPayment(slot)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-xl font-heading text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all bg-[#00D9FF] text-[#090B14] shadow-[0_0_18px_rgba(0,217,255,0.35)] hover:shadow-[0_0_26px_rgba(0,217,255,0.5)] border border-[#00D9FF]"
          >
            <CalendarCheck2 size={12} strokeWidth={2.5} />
            Reserve &amp; Pay — Slot {slot.id}
            <ChevronRight size={12} strokeWidth={2.5} />
          </motion.button>
        )}
        {slot.status === 'Occupied' && (
          <div className="w-full py-2 rounded-xl border border-red-500/20 bg-red-950/10 text-red-400 text-[9px] font-bold font-mono text-center uppercase flex items-center justify-center gap-1.5">
            <XCircle size={11} strokeWidth={2.4} />Slot Occupied
          </div>
        )}
        {slot.status === 'Reserved' && (
          <div className="w-full py-2 rounded-xl border border-blue-500/20 bg-blue-950/10 text-blue-400 text-[9px] font-bold font-mono text-center uppercase flex items-center justify-center gap-1.5">
            <CheckCircle size={11} strokeWidth={2.4} />Pre-Reserved
          </div>
        )}
        {slot.status === 'VIP' && (
          <div className="w-full py-2 rounded-xl border border-yellow-500/20 bg-yellow-950/10 text-yellow-400 text-[9px] font-bold font-mono text-center uppercase">
            👑 VIP Access Required
          </div>
        )}
        {slot.status === 'Disabled' && (
          <div className="w-full py-2 rounded-xl border border-slate-600/20 bg-slate-900/20 text-slate-500 text-[9px] font-bold font-mono text-center uppercase">
            ♿ Accessibility Reserved
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   FAKE QR CODE (deterministic SVG)
───────────────────────────────────────────── */
function QRCodeSVG({ value = 'parksense' }) {
  const S = 21;
  const cells = [];
  const seed = value.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0);
  for (let r = 0; r < S; r++) {
    for (let c = 0; c < S; c++) {
      const inFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= S - 7) ||
        (r >= S - 7 && c < 7);
      const onBorder =
        (r === 0 || r === 6 || c === 0 || c === 6) && r < 7 && c < 7 ||
        (r === 0 || r === 6 || c === S - 1 || c === S - 7) && r < 7 && c >= S - 7 ||
        (r === S - 1 || r === S - 7 || c === 0 || c === 6) && r >= S - 7 && c < 7;
      const inside =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= S - 5 && c <= S - 3) ||
        (r >= S - 5 && r <= S - 3 && c >= 2 && c <= 4);
      const data = !inFinder && (((seed * (r + 1) * (c + 3)) % 17) < 8);
      const filled = inFinder ? (onBorder || inside) : data;
      cells.push({ r, c, filled });
    }
  }
  return (
    <svg viewBox={`0 0 ${S * 5} ${S * 5}`} width="100%" height="100%">
      <rect width={S * 5} height={S * 5} fill="#0d1117" rx="4" />
      {cells.map(({ r, c, filled }) =>
        filled ? <rect key={`${r}-${c}`} x={c * 5 + 1} y={r * 5 + 1} width={4} height={4} fill="#e2e8f0" rx="0.5" /> : null
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PAYMENT DRAWER — inline reservation + pay
───────────────────────────────────────────── */
const PAYMENT_METHODS = [
  { id: 'gpay',   label: 'Google Pay',     emoji: '🟢', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/8' },
  { id: 'phonepe',label: 'PhonePe',        emoji: '🟣', color: 'text-purple-400',  border: 'border-purple-500/30',  bg: 'bg-purple-500/8'  },
  { id: 'paytm',  label: 'Paytm',          emoji: '🔵', color: 'text-blue-400',    border: 'border-blue-500/30',    bg: 'bg-blue-500/8'    },
  { id: 'upi',    label: 'UPI ID',         emoji: '💳', color: 'text-cyan-400',    border: 'border-cyan-500/30',    bg: 'bg-cyan-500/8'    },
  { id: 'card',   label: 'Credit / Debit', emoji: '🏦', color: 'text-slate-300',   border: 'border-slate-500/30',   bg: 'bg-slate-500/8'   },
  { id: 'cash',   label: 'Cash at Exit',   emoji: '💵', color: 'text-yellow-400',  border: 'border-yellow-500/30',  bg: 'bg-yellow-500/8'  },
];

const VEHICLE_RATES = { Bike: 20, Car: 40, SUV: 60, EV: 35 };

function PaymentDrawer({ slot, floor, onClose, onPaymentSuccess }) {
  const [step, setStep]           = useState('form');   // 'form' | 'paying' | 'success'
  const [duration, setDuration]   = useState(1);
  const [vehicle, setVehicle]     = useState(slot?.status === 'EV' ? 'EV' : 'Car');
  const [method, setMethod]       = useState('gpay');
  const [upiInput, setUpiInput]   = useState('');
  const [receiptId]               = useState(`PKS-${slot?.id}-${Math.floor(Math.random() * 90000 + 10000)}`);
  const [bookingTime]             = useState(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));

  const baseRate    = VEHICLE_RATES[vehicle] || 40;
  const baseFee     = baseRate * duration;
  const gst         = +(baseFee * 0.18).toFixed(2);
  const svcFee      = +(baseFee * 0.07).toFixed(2);
  const total       = +(baseFee + gst + svcFee).toFixed(2);
  const exitTime    = new Date(Date.now() + duration * 3600000)
    .toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const upiRef      = `PKUPI${Date.now().toString().slice(-8)}`;

  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method);
  const showQR = ['gpay', 'phonepe', 'paytm'].includes(method);
  const showUpiInput = method === 'upi';

  const handlePay = async () => {
    setStep('paying');
    await new Promise(r => setTimeout(r, 2200));
    setStep('success');
    onPaymentSuccess(slot, receiptId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-stretch justify-end"
      style={{ backdropFilter: 'blur(6px)', background: 'rgba(9,11,20,0.7)' }}
      onClick={(e) => { if (e.target === e.currentTarget && step !== 'paying') onClose(); }}
    >
      {/* Drawer panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        className="relative w-full max-w-[440px] h-full bg-[#0d1117] border-l border-[#00D9FF]/15 shadow-[−20px_0_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
      >
        {/* Neon top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-60" />

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/25 flex items-center justify-center">
              <Car size={14} className="text-[#00D9FF]" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[8px] text-[#00D9FF] uppercase tracking-widest font-bold block">Smart Reserve</span>
              <span className="text-sm font-extrabold text-white font-heading uppercase">Parking Reservation</span>
            </div>
          </div>
          {step !== 'paying' && (
            <button onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all border border-white/8">
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* ═════ STEP: FORM ═════ */}
          {step === 'form' && (
            <>
              {/* Slot summary */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#00D9FF]/5 border border-[#00D9FF]/15">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold font-mono text-base border ${statusBadgeBg(slot.status)} ${statusColor(slot.status)}`}>
                  {slot.id}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block">Selected Slot</span>
                  <span className="text-sm font-extrabold text-white font-heading block">Slot {slot.id} · Section {slot.row}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{floor} · Phoenix Marketcity</span>
                </div>
                <motion.span
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"
                  style={{ boxShadow: '0 0 8px rgba(34,197,94,0.7)' }}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-2">Parking Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 6, 8, 12].map(h => (
                    <button key={h} onClick={() => setDuration(h)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-mono uppercase border transition-all ${
                        duration === h
                          ? 'bg-[#00D9FF] text-[#090B14] border-[#00D9FF] shadow-[0_0_10px_rgba(0,217,255,0.35)]'
                          : 'bg-white/4 text-slate-400 border-white/8 hover:border-[#00D9FF]/30 hover:text-white'
                      }`}
                    >{h}H</button>
                  ))}
                </div>
              </div>

              {/* Vehicle type */}
              <div>
                <label className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-2">Vehicle Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(VEHICLE_RATES).map(v => (
                    <button key={v} onClick={() => setVehicle(v)}
                      className={`py-2 rounded-xl text-[9px] font-bold font-mono uppercase border transition-all flex flex-col items-center gap-1 ${
                        vehicle === v
                          ? 'bg-[#00D9FF]/15 text-[#00D9FF] border-[#00D9FF]/40 shadow-[0_0_8px_rgba(0,217,255,0.2)]'
                          : 'bg-white/4 text-slate-500 border-white/8 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{v === 'Bike' ? '🚲' : v === 'Car' ? '🚗' : v === 'SUV' ? '🚙' : '⚡'}</span>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="rounded-2xl border border-white/8 bg-[#090B14]/60 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <span className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest">Pricing Breakdown</span>
                </div>
                <div className="divide-y divide-white/5 text-[10px] font-mono">
                  {[
                    { label: 'Base Fee', sub: `₹${baseRate}/hr × ${duration}hr`, value: `₹${baseFee}`, color: 'text-white' },
                    { label: 'GST (18%)',   sub: '',                              value: `₹${gst}`,     color: 'text-slate-400' },
                    { label: 'Service',     sub: '(7%)',                          value: `₹${svcFee}`,  color: 'text-slate-400' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-slate-500">{r.label} <span className="text-slate-700">{r.sub}</span></span>
                      <span className={`font-bold ${r.color}`}>{r.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#00D9FF]/5">
                    <span className="text-[12px] font-extrabold text-white uppercase tracking-wide">Total Amount</span>
                    <span className="text-[16px] font-extrabold text-[#00D9FF]" style={{ textShadow: '0 0 12px rgba(0,217,255,0.5)' }}>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Payment methods */}
              <div>
                <label className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map(pm => (
                    <button key={pm.id} onClick={() => setMethod(pm.id)}
                      className={`p-2.5 rounded-xl border text-[9px] font-bold font-mono flex flex-col items-center gap-1 transition-all ${
                        method === pm.id
                          ? `${pm.bg} ${pm.border} ${pm.color} shadow-[0_0_10px_rgba(0,0,0,0.3)]`
                          : 'bg-white/4 border-white/8 text-slate-500 hover:text-white hover:border-white/15'
                      }`}
                    >
                      <span className="text-base">{pm.emoji}</span>
                      <span className="text-center leading-tight">{pm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QR code for UPI methods */}
              {showQR && (
                <motion.div
                  key={method}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[#00D9FF]/15 bg-[#090B14]/80 p-4 flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedMethod.emoji}</span>
                    <span className={`text-[11px] font-extrabold font-mono uppercase ${selectedMethod.color}`}>{selectedMethod.label}</span>
                  </div>
                  <div className="w-36 h-36 rounded-xl overflow-hidden border border-white/10 p-1 bg-[#0d1117]">
                    <QRCodeSVG value={`${method}-${slot.id}-${total}`} />
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] text-slate-600 uppercase tracking-widest block">UPI ID</span>
                    <span className="text-[10px] font-bold font-mono text-slate-300">parksense@{method === 'gpay' ? 'okaxis' : method === 'phonepe' ? 'ybl' : 'paytm'}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[8px] text-slate-600 uppercase block">Ref</span>
                    <span className="text-[9px] font-mono text-[#00D9FF]">{upiRef}</span>
                  </div>
                  <div className={`w-full py-2 rounded-xl text-[10px] font-extrabold font-mono text-center uppercase tracking-wider ${selectedMethod.bg} border ${selectedMethod.border} ${selectedMethod.color}`}>
                    Pay ₹{total} via {selectedMethod.label}
                  </div>
                </motion.div>
              )}

              {/* UPI input */}
              {showUpiInput && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <label className="text-[9px] font-bold font-mono text-slate-500 uppercase tracking-widest block">Enter UPI ID</label>
                  <input
                    value={upiInput}
                    onChange={e => setUpiInput(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full bg-[#090B14]/80 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-mono text-white placeholder-slate-600 focus:outline-none focus:border-[#00D9FF]/40 transition-all"
                  />
                </motion.div>
              )}

              {/* Cash info */}
              {method === 'cash' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/15 text-[9px] font-mono text-yellow-400">
                  💵 Pay ₹{total} cash at the exit gate. Slot will be held for 15 minutes.
                </motion.div>
              )}
            </>
          )}

          {/* ═════ STEP: PAYING ═════ */}
          {step === 'paying' && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#00D9FF] border-r-[#00D9FF]/40"
                />
                <div className="absolute inset-2 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center">
                  <span className="text-lg">{selectedMethod.emoji}</span>
                </div>
              </div>
              <div className="text-center">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-xs font-bold font-mono text-[#00D9FF] uppercase tracking-widest block"
                >
                  Processing Payment…
                </motion.span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1">{selectedMethod.label} · ₹{total}</span>
              </div>
              <div className="w-full bg-[#090B14]/60 rounded-xl p-3 border border-white/5 text-[9px] font-mono text-slate-500 space-y-1">
                <div className="flex justify-between"><span>Slot</span><span className="text-white font-bold">{slot.id}</span></div>
                <div className="flex justify-between"><span>Amount</span><span className="text-[#00D9FF] font-bold">₹{total}</span></div>
                <div className="flex justify-between"><span>Method</span><span className="text-white">{selectedMethod.label}</span></div>
              </div>
            </div>
          )}

          {/* ═════ STEP: SUCCESS ═════ */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-5 py-6">
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, delay: 0.1 }}
                className="relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-emerald-500/20"
                  style={{ transform: 'scale(1.4)' }}
                />
                <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle size={36} className="text-emerald-400" strokeWidth={1.5} />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
                <span className="text-[9px] text-emerald-400/70 uppercase tracking-widest font-bold block">Payment Successful</span>
                <h3 className="text-xl font-extrabold text-white font-heading mt-1">Slot {slot.id} Reserved!</h3>
                <span className="text-[10px] font-mono text-[#00D9FF]">{receiptId}</span>
              </motion.div>

              {/* Receipt */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="w-full rounded-2xl border border-emerald-500/20 bg-emerald-950/10 divide-y divide-white/5 text-[10px] font-mono overflow-hidden"
              >
                {[
                  { label: 'Reservation ID',  value: receiptId,       color: 'text-[#00D9FF]' },
                  { label: 'Slot',             value: slot.id,         color: 'text-white' },
                  { label: 'Section',          value: `Section ${slot.row}`, color: 'text-white' },
                  { label: 'Duration',         value: `${duration} Hour${duration > 1 ? 's' : ''}`, color: 'text-white' },
                  { label: 'Vehicle',          value: vehicle,         color: 'text-white' },
                  { label: 'Paid via',         value: selectedMethod.label, color: selectedMethod.color },
                  { label: 'Amount Paid',      value: `₹${total}`,     color: 'text-emerald-400' },
                  { label: 'Booking Time',     value: bookingTime,     color: 'text-slate-300' },
                  { label: 'Est. Exit',        value: exitTime,        color: 'text-orange-400' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-slate-500 uppercase tracking-wide">{r.label}</span>
                    <span className={`font-bold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </motion.div>

              {/* Receipt download button */}
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                onClick={() => window.print()}
                className="w-full py-2.5 rounded-xl border border-[#00D9FF]/25 bg-[#00D9FF]/8 text-[#00D9FF] text-[10px] font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#00D9FF]/15 transition-all"
              >
                📄 Download Receipt
              </motion.button>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-white/4 text-white text-[10px] font-bold font-mono uppercase tracking-wider hover:bg-white/8 transition-all"
              >
                Close
              </motion.button>
            </div>
          )}
        </div>

        {/* ── FOOTER (form step only) ── */}
        {step === 'form' && (
          <div className="px-6 py-4 border-t border-white/6 flex gap-3 shrink-0 bg-[#0d1117]">
            <button onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 bg-white/4 text-slate-400 text-[10px] font-bold font-mono uppercase tracking-wider hover:bg-white/8 hover:text-white transition-all">
              Cancel
            </button>
            <motion.button
              onClick={handlePay}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-[2] py-3 rounded-xl bg-[#00D9FF] text-[#090B14] text-[11px] font-extrabold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(0,217,255,0.6)] transition-all"
            >
              <CheckCircle size={14} strokeWidth={2.5} />
              Pay ₹{total} &amp; Reserve
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   RESERVATION SUCCESS OVERLAY (UNCHANGED)
─────────────────────────────────────────────── */
function ReservationSuccess({ slot, onDismiss }) {
  const receipt = `PKS-${slot.id}-${Math.floor(Math.random() * 90000 + 10000)}`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-40 rounded-[20px] bg-[#090B14]/97 backdrop-blur-xl flex flex-col items-center justify-center p-5 text-center gap-3"
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
        <CheckCircle size={28} className="text-emerald-400" strokeWidth={2} />
      </motion.div>
      <div>
        <span className="text-[8px] text-slate-500 uppercase tracking-widest block">Booking Confirmed</span>
        <h3 className="text-base font-extrabold text-white font-heading uppercase">Slot {slot.id} Reserved!</h3>
        <span className="text-[9px] font-mono text-[#00D9FF] font-bold">{receipt}</span>
      </div>
      <div className="w-full text-[9px] font-mono text-left border-t border-b border-white/5 py-2.5 space-y-1">
        <div className="flex justify-between"><span className="text-slate-500">SLOT:</span><span className="text-white font-bold">{slot.id}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">SECTION:</span><span className="text-white">Section {slot.row}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">TYPE:</span><span className="text-white">{slot.status === 'EV' ? 'EV Charging' : 'Standard'}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">RECEIPT:</span><span className="text-emerald-400 font-bold">{receipt}</span></div>
      </div>
      <button onClick={onDismiss}
        className="w-full py-2 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-bold font-mono hover:bg-[#00D9FF] hover:text-[#090B14] hover:border-[#00D9FF] transition-all">
        DISMISS
      </button>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────── */
export default function SmartReserve({ selectedSector, triggerToast }) {
  const [floorData, setFloorData]       = useState(INITIAL_FLOOR_DATA);
  const [activeFloor, setActiveFloor]   = useState('Ground Floor');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reserving, setReserving]       = useState(false);
  const [successSlot, setSuccessSlot]   = useState(null);
  // Payment drawer state
  const [paymentSlot, setPaymentSlot]   = useState(null);
  const [paymentOpen, setPaymentOpen]   = useState(false);

  const grid     = floorData[activeFloor];
  const allSlots = useMemo(() => grid.flat(), [grid]);

  const handleSelect = useCallback((slot) => {
    setSelectedSlot(prev => prev?.id === slot.id ? null : slot);
  }, []);

  const handleOpenPayment = useCallback((slot) => {
    setPaymentSlot(slot);
    setPaymentOpen(true);
    setSelectedSlot(null);
  }, []);

  const handlePaymentSuccess = useCallback((slot, receiptId) => {
    // Update slot to Reserved in grid
    setFloorData(prev => ({
      ...prev,
      [activeFloor]: prev[activeFloor].map(row =>
        row.map(s => s.id === slot.id ? { ...s, status: 'Reserved' } : s)
      )
    }));
    setSuccessSlot(slot);
    triggerToast?.(`✓ Slot ${slot.id} reserved · Payment received via ${receiptId}`, 'success');
  }, [activeFloor, triggerToast]);

  const handleClosePayment = useCallback(() => {
    setPaymentOpen(false);
    setTimeout(() => setPaymentSlot(null), 350);
  }, []);

  const handleReserve = useCallback(async (slot) => {
    setReserving(true);
    await new Promise(r => setTimeout(r, 1800));
    setFloorData(prev => ({
      ...prev,
      [activeFloor]: prev[activeFloor].map(row =>
        row.map(s => s.id === slot.id ? { ...s, status: 'Reserved' } : s)
      )
    }));
    setReserving(false);
    setSuccessSlot(slot);
    setSelectedSlot(null);
    triggerToast?.(`✓ Slot ${slot.id} reserved successfully!`, 'success');
  }, [activeFloor, triggerToast]);

  // Pair rows: [A,B], [C,D], [E,F], [G, null]
  const rowPairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < ROWS.length; i += 2) {
      pairs.push([ROWS[i], ROWS[i + 1] || null, i, i + 1 < ROWS.length ? i + 1 : null]);
    }
    return pairs;
  }, []);

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full text-left">

      {/* ═══════ PAYMENT DRAWER (fixed overlay) ═══════ */}
      <AnimatePresence>
        {paymentOpen && paymentSlot && (
          <PaymentDrawer
            key={paymentSlot.id}
            slot={paymentSlot}
            floor={activeFloor}
            onClose={handleClosePayment}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════
          LEFT — PARKING GRID AREA
      ══════════════════════════════════════ */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* ── Header card ── */}
        <div className="glass-panel rounded-[20px] border border-white/10 bg-[#111827]/40 p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[8px] text-[#00D9FF] uppercase tracking-widest font-bold block">Smart Reserve · AI Control</span>
              <h2 className="text-lg font-extrabold text-white font-heading uppercase mt-0.5">
                Interactive Parking Grid
              </h2>
              <p className="text-[9px] text-slate-500 mt-0.5">
                Sections A–G · 35 Slots · Two-column layout{selectedSector ? ` · ${selectedSector}` : ''}
              </p>
            </div>
            {/* Floor tabs */}
            <div className="flex bg-[#090B14]/80 p-1 rounded-2xl border border-white/10 overflow-x-auto gap-0.5 shrink-0">
              {FLOORS.map(f => (
                <button key={f}
                  onClick={() => { setActiveFloor(f); setSelectedSlot(null); }}
                  className={`font-heading text-[9px] px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap font-bold ${
                    activeFloor === f
                      ? 'bg-[#00D9FF] text-[#090B14] shadow-[0_0_12px_rgba(0,217,255,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}>
                  {f === 'Ground Floor' ? 'GF' : f.replace('Level ', 'L').replace('Basement', 'B1')}
                </button>
              ))}
            </div>
          </div>

          {/* Status chips */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <StatusChips allSlots={allSlots} floor={activeFloor} />
          </div>
        </div>

        {/* ── Parking grid panel ── */}
        <div className="glass-panel rounded-[20px] border border-white/10 bg-[#111827]/30 p-5 shadow-2xl">

          {/* Entrance / Exit header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#00D9FF]/30 uppercase tracking-[0.18em]">
              <ArrowRight size={9} strokeWidth={2.5} />
              ENTRANCE
            </div>
            <div className="flex-1 mx-3 border-t border-dashed border-white/5" />
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#00D9FF]/30 uppercase tracking-[0.18em]">
              EXIT
              <ArrowLeft size={9} strokeWidth={2.5} />
            </div>
          </div>

          {/* Scrollable section pairs */}
          <div className="overflow-y-auto" style={{ maxHeight: 640 }}>
            <div className="space-y-0 bg-[#090B14]/70 rounded-[16px] border border-white/5 p-4">
              {rowPairs.map(([leftRow, rightRow, leftIdx, rightIdx], pairIdx) => (
                <React.Fragment key={leftRow}>
                  <SectionPair
                    leftRow={leftRow}
                    rightRow={rightRow}
                    leftIdx={leftIdx}
                    rightIdx={rightIdx}
                    grid={grid}
                    selectedSlot={selectedSlot}
                    onSelect={handleSelect}
                  />
                  {/* Drive lane between pairs (not after last) */}
                  {pairIdx < rowPairs.length - 1 && <DriveLane />}
                </React.Fragment>
              ))}
            </div>

            {/* Bottom legend */}
            <BottomLegend />
          </div>

          {/* Tap hint */}
          <p className="mt-3 text-center text-[8px] font-mono text-slate-700 uppercase tracking-wider">
            Tap any slot · Available &amp; EV slots can be reserved · {activeFloor} — ParkSense AI
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT — STICKY STATS + INFO PANEL (~255px)
      ══════════════════════════════════════ */}
      <div className="w-full xl:w-[255px] shrink-0 space-y-4 xl:sticky xl:top-4 self-start">

        {/* Stats */}
        <StatsPanel allSlots={allSlots} />

        {/* Slot info / empty state */}
        <AnimatePresence mode="wait">
          {selectedSlot ? (
            <div className="relative" key="panel">
              <SlotInfoPanel
                slot={selectedSlot}
                floor={activeFloor}
                onClose={() => setSelectedSlot(null)}
                onOpenPayment={handleOpenPayment}
              />
            </div>
          ) : (
            <motion.div key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-panel rounded-[20px] border border-white/8 bg-[#111827]/30 p-4 text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-[#00D9FF]/5 border border-[#00D9FF]/15 flex items-center justify-center mx-auto mb-1.5">
                <MapPin size={16} className="text-[#00D9FF]/50" strokeWidth={2} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono block">No Slot Selected</span>
              <span className="text-[9px] text-slate-600 font-mono block">Click any parking slot to view its details and reserve it.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Last reserved badge */}
        <AnimatePresence>
          {successSlot && !selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-[16px] border border-emerald-500/25 bg-emerald-950/15 p-3 flex items-center gap-2.5">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <span className="text-[8px] text-emerald-400 font-bold font-mono uppercase block">Last Reserved</span>
                <span className="text-[10px] font-bold text-white font-mono block truncate">Slot {successSlot.id} · Section {successSlot.row}</span>
              </div>
              <button onClick={() => setSuccessSlot(null)} className="text-slate-600 hover:text-slate-400 shrink-0">
                <X size={11} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
