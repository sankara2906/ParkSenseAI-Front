import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle, 
  Flame, 
  MapPin, 
  Clock, 
  Truck, 
  Activity, 
  Cpu, 
  Eye, 
  AlertTriangle, 
  Zap, 
  Radio, 
  Play, 
  Plus, 
  Lock, 
  Power,
  ChevronRight,
  Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/* ─────────────────────────────────────────────
   MOCK INCIDENT DATA
───────────────────────────────────────────── */
const INITIAL_INCIDENTS = [
  {
    id: 'inc-1',
    type: 'fire',
    title: 'Fire Alert',
    severity: 'Critical',
    color: '#EF4444',
    location: 'Zone A, Building 3',
    time: '12:08 PM',
    units: ['Fire-03', 'Ambulance-12'],
    eta: '1m 40s',
    icon: '🔥',
    desc: 'Thermal alarm detected soot and high temperature levels.'
  },
  {
    id: 'inc-2',
    type: 'security',
    title: 'Unauthorized Intrusion',
    severity: 'High',
    color: '#F97316',
    location: 'Gate 2 Entrance Corridor',
    time: '12:15 PM',
    units: ['Police-09'],
    eta: '3m 15s',
    icon: '🚨',
    desc: 'Blacklisted vehicle plate read by camera OCR node.'
  },
  {
    id: 'inc-3',
    type: 'medical',
    title: 'Medical Emergency',
    severity: 'Medium',
    color: '#EAB308',
    location: 'Slot D15 Level 2',
    time: '12:22 PM',
    units: ['Ambulance-04'],
    eta: '4m 50s',
    icon: '🚑',
    desc: 'SOS distress button pressed on emergency parking pillar.'
  },
  {
    id: 'inc-4',
    type: 'system',
    title: 'OCR Camera Offline',
    severity: 'Information',
    color: '#3B82F6',
    location: 'Node Camera 08, Block C',
    time: '12:30 PM',
    units: ['Support-02'],
    eta: '10m 00s',
    icon: '📹',
    desc: 'Heartbeat ping failed for security server database cluster.'
  }
];

const ANALYTICS_DATA = [
  { time: '08 AM', incidents: 2 },
  { time: '10 AM', incidents: 4 },
  { time: '12 PM', incidents: 9 },
  { time: '02 PM', incidents: 6 },
  { time: '04 PM', incidents: 8 },
  { time: '06 PM', incidents: 3 }
];

export default function EmergencyDashboard() {
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [activeIncidentId, setActiveIncidentId] = useState('inc-1');
  const [toastMessage, setToastMessage] = useState('');
  
  // Dynamic stats
  const [liveEmergencies, setLiveEmergencies] = useState(3);
  const [teamsOnline, setTeamsOnline] = useState(28);
  const [ambulancesAvailable, setAmbulancesAvailable] = useState(12);
  const [fireUnitsAvailable, setFireUnitsAvailable] = useState(8);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const activeIncident = useMemo(() => {
    return incidents.find(inc => inc.id === activeIncidentId) || incidents[0];
  }, [activeIncidentId, incidents]);

  // Dispatch Action Handler
  const handleDispatch = (units) => {
    triggerToast(`🚨 DISPATCH SUCCESS: Units ${units.join(', ')} routed immediately.`);
  };

  // Resolve Action Handler
  const handleResolve = (id) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    setLiveEmergencies(prev => Math.max(0, prev - 1));
    triggerToast('✓ Incident resolved and archived.');
    if (activeIncidentId === id) {
      setActiveIncidentId('inc-2');
    }
  };

  // Quick Action Buttons
  const handleEvacAlert = () => {
    triggerToast('📢 BROADCAST INITIATED: Emergency evacuation alerts pushed to all users.');
  };

  const handleLockZone = () => {
    triggerToast('🚧 ACCESS GRANTED: Parking gates and barriers locked.');
  };

  const handleShutdown = () => {
    triggerToast('🛑 POWER SHUTDOWN: Non-essential systems disconnected.');
  };

  return (
    <div className="space-y-8 relative z-[1] max-w-[1700px] w-full mx-auto text-left pb-24">
      
      {/* Toast Alert popup - elevated z-index */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-28 left-1/2 z-[1000] bg-[#0d1117]/95 border border-[#EF4444]/40 text-[#EF4444] px-6 py-3 rounded-2xl text-[10px] font-mono shadow-[0_0_25px_rgba(239,68,68,0.35)] backdrop-blur font-bold"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing Emergency warning frame overlay when critical alerts are active */}
      {liveEmergencies > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 border-4 border-red-500/25 shadow-[inset_0_0_40px_rgba(239,68,68,0.15)] animate-pulse" />
      )}

      {/* Custom sliding push notifications portal - stacks vertically at top-right, showing only 1 at a time to prevent overlapping */}
      <div className="fixed top-28 right-8 z-[1000] flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {incidents.slice(0, 1).map(inc => (
            <motion.div
              key={inc.id}
              initial={{ opacity: 0, x: 80, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 80 }}
              className="p-4 rounded-2xl border border-red-500/30 bg-red-950/90 text-red-200 shadow-2xl pointer-events-auto flex flex-col gap-1 backdrop-blur-md"
            >
              <div className="flex items-center gap-2 font-bold tracking-wider text-[10px]">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>CRITICAL ALARM ACTIVE</span>
              </div>
              <span className="text-slate-300 text-[10px] mt-1">{inc.title} detected inside {inc.location}.</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER SECTION - z-index 50 */}
      <div className="glass-panel p-6 rounded-[28px] border border-white/10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-[#111827]/40 shadow-xl z-[50] relative mb-8">
        <div>
          <span className="text-[9px] font-mono text-red-500 tracking-widest font-extrabold uppercase flex items-center gap-1.5">
            <Radio size={10} className="animate-pulse" /> Incident Control Deck
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-white mt-1 uppercase tracking-tight">
            Emergency Response Center
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Futuristic AI Smart City Evacuation & Rescue System
          </p>
        </div>
        <div className="flex gap-2.5">
          <span className="px-4 py-2 rounded-xl text-[9px] font-mono font-bold bg-[#EF4444]/10 border border-[#EF4444]/25 text-red-400 animate-pulse">
            🚨 ACTIVE ALERTS: {liveEmergencies}
          </span>
          <span className="px-4 py-2 rounded-xl text-[9px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase">
            🟢 DECK SECURE
          </span>
        </div>
      </div>

      {/* UPPER METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/30 text-left">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Active Cases</span>
          <span className="text-2xl font-extrabold font-heading text-red-400 block mt-1">{liveEmergencies}</span>
          <span className="text-[7.5px] font-mono text-slate-600 block mt-1 uppercase">1 Resolved Recently</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/30 text-left">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Response Teams</span>
          <span className="text-2xl font-extrabold font-heading text-white block mt-1">{teamsOnline}</span>
          <span className="text-[7.5px] font-mono text-[#00D9FF] block mt-1 uppercase">28 Units Synchronized</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/30 text-left">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Avg Response Speed</span>
          <span className="text-2xl font-extrabold font-heading text-white block mt-1">2m 18s</span>
          <span className="text-[7.5px] font-mono text-emerald-400 block mt-1 uppercase">✓ Within SLA Limits</span>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/30 text-left">
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">System Telemetry Health</span>
          <span className="text-2xl font-extrabold font-heading text-[#00D9FF] block mt-1">99.8%</span>
          <span className="text-[7.5px] font-mono text-slate-600 block mt-1 uppercase">9 Nodes Calibrated</span>
        </div>
      </div>

      {/* FULL-WIDTH CITY MAP CONTAINER - proper padding and height to prevent clipping */}
      <div className="glass-panel p-8 rounded-[28px] border border-white/10 bg-[#111827]/40 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[8px] font-mono text-[#00D9FF] uppercase tracking-widest block">Tactical Command Map</span>
            <h4 className="font-heading font-extrabold text-sm text-white uppercase mt-0.5">Metropolitan Emergency Grid</h4>
          </div>
          <span className="text-[8px] font-mono text-slate-500">Live Traffic & Asset Flow</span>
        </div>

        <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#050816] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,217,255,0.025)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <svg className="w-full h-full" viewBox="0 0 1000 350">
            {/* Drivable Lane roads */}
            <line x1="80" y1="110" x2="920" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="18" strokeLinecap="round" />
            <line x1="80" y1="240" x2="920" y2="240" stroke="rgba(255,255,255,0.03)" strokeWidth="18" strokeLinecap="round" />
            <line x1="500" y1="50" x2="500" y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="18" strokeLinecap="round" />
            
            {/* Grid Gridlines */}
            <rect x="50" y="20" width="900" height="310" fill="none" stroke="rgba(0,217,255,0.05)" strokeWidth="1" strokeDasharray="4,4" />

            {/* Base Assets nodes */}
            <g transform="translate(180, 110)">
              <circle cx="0" cy="0" r="10" fill="rgba(16,185,129,0.1)" stroke="#10B981" strokeWidth="1" />
              <text y="3" fill="#10B981" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">🏥 HOSP</text>
            </g>
            <g transform="translate(820, 240)">
              <circle cx="0" cy="0" r="10" fill="rgba(59,130,246,0.1)" stroke="#3B82F6" strokeWidth="1" />
              <text y="3" fill="#3B82F6" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">🚒 FIRE</text>
            </g>
            <g transform="translate(500, 80)">
              <circle cx="0" cy="0" r="10" fill="rgba(234,179,8,0.1)" stroke="#EAB308" strokeWidth="1" />
              <text y="3" fill="#EAB308" fontSize="6" fontFamily="monospace" fontWeight="bold" textAnchor="middle">🚓 POLICE</text>
            </g>

            {/* Pulsing Incidents Location Markers */}
            {incidents.map(inc => {
              let coord = { x: 250, y: 180 };
              if (inc.id === 'inc-1') coord = { x: 300, y: 110 };
              else if (inc.id === 'inc-2') coord = { x: 500, y: 180 };
              else if (inc.id === 'inc-3') coord = { x: 720, y: 240 };
              else if (inc.id === 'inc-4') coord = { x: 220, y: 240 };

              const isActive = inc.id === activeIncidentId;

              return (
                <g 
                  key={inc.id}
                  transform={`translate(${coord.x}, ${coord.y})`}
                  className="cursor-pointer"
                  onClick={() => setActiveIncidentId(inc.id)}
                >
                  <circle cx="0" cy="0" r={isActive ? 16 : 10} fill="none" stroke={inc.color} strokeWidth="1.5" className="animate-ping" />
                  <circle cx="0" cy="0" r="6" fill={inc.color} />
                  <text y="-14" fill={inc.color} fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                    {inc.title.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* HUD helper */}
          <div className="absolute bottom-4 left-4 bg-black/90 border border-white/10 px-4 py-2 rounded-xl text-[8px] font-mono text-slate-500 uppercase flex justify-between w-[96%]">
            <span>ZOOM LEVEL: METRO_SCAN_V1</span>
            <span className="text-[#00D9FF] font-bold">Active incident lock: {activeIncident.title}</span>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN GRID: Left Column (Incidents/Actions) & Right Column (AI Mission Control/CCTV) - perfectly aligned Y positions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Incidents List & Quick Actions (60%) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* ACTIVE INCIDENTS FEED */}
          <div className="space-y-4">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Active Telemetry Incidents</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {incidents.map(inc => {
                const isActive = inc.id === activeIncidentId;
                
                return (
                  <div 
                    key={inc.id}
                    onClick={() => setActiveIncidentId(inc.id)}
                    className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-[155px] ${
                      isActive 
                        ? 'border-[#00D9FF] bg-[#00D9FF]/5 shadow-[0_0_15px_rgba(0,217,255,0.12)]' 
                        : 'border-white/5 hover:border-white/10 bg-[#111827]/10'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center leading-none">
                        <span className="text-base">{inc.icon}</span>
                        <span 
                          style={{ backgroundColor: `${inc.color}15`, color: inc.color, borderColor: `${inc.color}30` }}
                          className="text-[7.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase"
                        >
                          {inc.severity}
                        </span>
                      </div>
                      <h4 className="font-heading font-extrabold text-[12px] text-white uppercase mt-2">{inc.title}</h4>
                      <span className="text-[8.5px] font-mono text-slate-400 block mt-1 uppercase tracking-wide">{inc.location}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-white/5 mt-1 text-[8.5px] font-mono">
                      <div>
                        <span className="text-slate-500 block uppercase text-[7px]">ETA response</span>
                        <span className="text-white block mt-0.5 font-bold">{inc.eta}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDispatch(inc.units);
                          }}
                          className="px-2 py-1 border border-[#00D9FF]/20 bg-[#00D9FF]/5 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] rounded-lg uppercase tracking-wider transition-all font-bold cursor-pointer"
                        >
                          Dispatch
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(inc.id);
                          }}
                          className="px-2 py-1 bg-white/5 border border-white/10 text-slate-400 hover:text-white rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EMERGENCY QUICK ACTIONS */}
          <div className="glass-panel p-6 rounded-[28px] border border-white/10 bg-[#111827]/40 shadow-xl space-y-4">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Emergency Direct Quick Action overrides</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => handleDispatch(['Ambulance-12'])}
                className="p-3.5 bg-[#EF4444]/10 border border-[#EF4444]/30 hover:bg-[#EF4444] hover:text-white text-[#EF4444] font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(239,68,68,0.08)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                🚑 Dispatch Ambulance
              </button>
              <button 
                onClick={() => handleDispatch(['Fire-03'])}
                className="p-3.5 bg-[#F97316]/10 border border-[#F97316]/30 hover:bg-[#F97316] hover:text-white text-[#F97316] font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(249,115,22,0.08)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                🚒 Dispatch Fire Team
              </button>
              <button 
                onClick={() => handleDispatch(['Police-09'])}
                className="p-3.5 bg-[#3B82F6]/10 border border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white text-[#3B82F6] font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(59,130,246,0.08)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                👮 Dispatch Police
              </button>
              <button 
                onClick={handleEvacAlert}
                className="p-3.5 bg-[#00D9FF]/10 border border-[#00D9FF]/30 hover:bg-[#00D9FF] hover:text-[#090B14] text-[#00D9FF] font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(0,217,255,0.08)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                📢 Broadcast Alert
              </button>
              <button 
                onClick={handleLockZone}
                className="p-3.5 bg-[#EAB308]/10 border border-[#EAB308]/30 hover:bg-[#EAB308] hover:text-white text-[#EAB308] font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(234,179,8,0.08)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                🚧 Lock Parking Zone
              </button>
              <button 
                onClick={handleShutdown}
                className="p-3.5 bg-rose-950/20 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-rose-400 font-mono text-[9px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(244,63,94,0.1)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                🛑 Emergency Shutdown
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI Mission Control & Analysis (40%) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* AI MISSION CONTROL CARD */}
          <div className="glass-panel p-6 rounded-[28px] border border-[#EF4444]/35 bg-[#111827]/40 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-red-400 animate-pulse" />
                <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">AI Mission Control</h3>
              </div>
              <span className="text-[7.5px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 uppercase tracking-widest font-bold">Threat level: Critical</span>
            </div>

            {/* AI THREAT ANALYSIS */}
            <div className="space-y-3 text-left">
              <span className="text-[8px] font-mono text-[#00D9FF] uppercase tracking-widest block font-bold">AI Threat Analysis</span>
              
              <div className="bg-[#090B14]/80 border border-white/5 rounded-2xl p-4 space-y-2.5 font-mono text-[9.5px] leading-relaxed text-slate-300">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-slate-500">Classification</span>
                  <span className="text-white font-bold uppercase">{activeIncident.title}</span>
                </div>
                <p>
                  Fire risk model computes <span className="text-red-400 font-bold">98% probability</span>. Thermal readings lock coordinates at {activeIncident.location}. Evacuation corridor 2 clearance is advised.
                </p>
                <div className="flex justify-between border-t border-white/5 pt-1 text-[8.5px]">
                  <span className="text-slate-500">Nearest Fire Node</span>
                  <span className="text-[#00D9FF] font-bold">1.2 km (Station 4)</span>
                </div>
                <div className="flex justify-between text-[8.5px]">
                  <span className="text-slate-500">Est. Containment Time</span>
                  <span className="text-white font-bold">6 minutes</span>
                </div>
              </div>
            </div>

            {/* LIVE CCTV SIMULATOR BOX */}
            <div className="space-y-3">
              <span className="text-[8px] font-mono text-[#00D9FF] uppercase tracking-widest block font-bold">Surveillance Node Live Feed</span>
              
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] flex flex-col justify-between p-4">
                <div className="absolute inset-0 bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.8))] pointer-events-none" />
                
                <div className="flex justify-between items-start z-10 font-mono text-[8px]">
                  <div className="bg-black/80 px-2 py-1 rounded border border-white/10 text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> LIVE STREAM
                  </div>
                  <span className="bg-black/80 px-2 py-1 rounded border border-white/10 text-slate-400">CAM_NODE_08_Z_A</span>
                </div>

                <div className="flex flex-col items-center justify-center py-6 text-center select-none z-10 opacity-30">
                  <Flame size={32} className="text-red-500 animate-pulse mb-1" />
                  <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest block">Thermal Feed Active</span>
                </div>

                <div className="bg-black/80 border border-white/5 rounded-xl p-2.5 z-10 font-mono text-[8px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Detection Classification</span>
                    <span className="text-red-400 font-bold">Thermal Anomaly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Confidence</span>
                    <span className="text-white font-bold">99.6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase">Census count</span>
                    <span className="text-white font-bold">3 Vehicles / 12 Persons</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI PREDICTIONS (PROGRESS BARS) */}
            <div className="space-y-3.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">AI Predictions (Neural Forecast)</span>
              
              <div className="space-y-3 font-mono text-[9px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Thermal Spread Rate</span>
                    <span className="text-red-400 font-bold">88% (Critical)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#090B14] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-red-500" style={{ width: '88%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Evacuation Corridor load</span>
                    <span className="text-orange-400 font-bold">62% (Moderate)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#090B14] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-orange-500" style={{ width: '62%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400 uppercase">Traffic Congestion Probability</span>
                    <span className="text-yellow-400 font-bold">45% (Low)</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#090B14] rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-yellow-500" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* RESPONSE RESOURCE MONITORS */}
            <div className="space-y-3.5">
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Resource Asset Status</span>
              
              <div className="divide-y divide-white/5 font-mono text-[9px] space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400 uppercase">Ambulance Fleets</span>
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold">4 Free</span>
                    <span className="text-slate-600">/ 8 Busy</span>
                  </div>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400 uppercase">Fire Trucks</span>
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold">3 Free</span>
                    <span className="text-slate-600">/ 5 Busy</span>
                  </div>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 uppercase">Emergency Medkits</span>
                  <span className="text-[#00D9FF] font-bold">120 Units</span>
                </div>
              </div>
            </div>

            {/* LIVE OPERATIONS TIMELINE */}
            <div className="space-y-3.5 pt-4 border-t border-white/5">
              <span className="text-[8px] font-mono text-[#00D9FF] uppercase tracking-widest block font-bold">Live Operations Timeline</span>
              
              <div className="space-y-3 text-[9px] font-mono text-slate-400 leading-normal pl-2 border-l border-white/10">
                <div className="relative pl-3">
                  <div className="absolute -left-[14.5px] top-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-white font-bold block text-[8px]">12:08 PM</span>
                  <span>Fire detected by Camera Node OCR.</span>
                </div>
                <div className="relative pl-3 mt-2">
                  <div className="absolute -left-[14px] top-1 w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                  <span className="text-white block text-[8px]">12:10 PM</span>
                  <span>AI classifies incident severity scale to CRITICAL.</span>
                </div>
                <div className="relative pl-3 mt-2">
                  <div className="absolute -left-[14px] top-1 w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
                  <span className="text-white block text-[8px]">12:11 PM</span>
                  <span>Local Fire Department crews dispatched automatically.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM ANALYTICS PANEL */}
      <div className="glass-panel p-6 rounded-[28px] border border-white/10 bg-[#111827]/40 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Tactical Analytics</span>
            <h3 className="font-heading font-extrabold text-sm text-white uppercase mt-0.5">Emergency Operations metrics</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="lg:col-span-2 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090B14', borderColor: 'rgba(239, 68, 68, 0.3)', borderRadius: '12px' }} 
                  labelStyle={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: 10 }}
                  itemStyle={{ color: '#EF4444', fontFamily: 'monospace', fontSize: 10 }}
                />
                <Area type="monotone" dataKey="incidents" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncidents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#090B14]/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left font-mono text-[9.5px]">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Response summary</span>
            
            <div className="divide-y divide-white/5 space-y-2.5">
              <div className="flex justify-between pt-1 border-b border-white/5">
                <span className="text-slate-500 uppercase">Resolved Today</span>
                <span className="text-emerald-400 font-bold">14 Cases</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500 uppercase">Pending Review</span>
                <span className="text-yellow-400 font-bold">2 Cases</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500 uppercase">False Alarm triggers</span>
                <span className="text-slate-400 font-bold">1 Case</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#00D9FF] font-bold uppercase">Lives Assisted</span>
                <span className="text-[#00D9FF] font-bold">428 citizens</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
