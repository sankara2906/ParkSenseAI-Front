import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Cpu,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  AlertTriangle,
  Zap,
  Car,
  Lightbulb,
  Share2,
  RefreshCw,
  Compass
} from 'lucide-react';

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const COLS = [1, 2, 3, 4, 5];

function CarIcon({ color = '#00D9FF' }) {
  return (
    <svg viewBox="0 0 36 60" fill="none" className="w-[22px] h-[34px]">
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

export default function AIVehicleFinder() {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState('idle'); // 'idle' | 'scanning' | 'found'
  const [scanProgress, setScanProgress] = useState(0);

  // Real-time navigation telemetry states
  const [distanceRemaining, setDistanceRemaining] = useState(42);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [routeProgress, setRouteProgress] = useState(0);
  const [navigationStatus, setNavigationStatus] = useState('Navigating...');
  
  const [toastMessage, setToastMessage] = useState('');

  // DOM Layout path states
  const [navPath, setNavPath] = useState('');
  const [pathLength, setPathLength] = useState(600);
  const [markers, setMarkers] = useState(null);
  const mapRef = useRef(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync user context on mount
  useEffect(() => {
    const raw = localStorage.getItem('parksense_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setCurrentUser(parsed);
        setSearchQuery(parsed.vehicleNumber || 'TN47AB1234');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loggedInVehicle = currentUser?.vehicleNumber || 'TN47AB1234';
  const loggedInOwner   = currentUser?.fullName || 'Sankara Narayanan';

  // Initiate AI Search Simulation
  const handleFindVehicle = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      triggerToast('⚠️ Please enter a vehicle number.');
      return;
    }

    setSearchStatus('scanning');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSearchStatus('found');
          triggerToast('✓ Vehicle located successfully.');
          return 100;
        }
        return prev + 5;
      });
    }, 90);
  };

  // Dynamic Drivable Path Calculation (Intersection Routing)
  const calculateDrivablePath = () => {
    const mapEl = mapRef.current;
    const entranceEl = document.getElementById('finder-entrance');
    
    // Target slot card: default to B4 (Row B, Col 4)
    const targetSlotId = 'finder-slot-B4';
    const targetEl = document.getElementById(targetSlotId);

    // References for finding main drive lane intersections
    const col3El = document.getElementById('finder-slot-B3');
    const col4El = document.getElementById('finder-slot-B4');
    const rowBEl = document.getElementById('finder-slot-B4');
    const rowCEl = document.getElementById('finder-slot-C4');

    if (!mapEl || !entranceEl || !targetEl || !col3El || !col4El || !rowBEl || !rowCEl) return;

    const mapRect = mapEl.getBoundingClientRect();
    const entRect = entranceEl.getBoundingClientRect();
    const tarRect = targetEl.getBoundingClientRect();
    const c3Rect = col3El.getBoundingClientRect();
    const c4Rect = col4El.getBoundingClientRect();
    const rBRect = rowBEl.getBoundingClientRect();
    const rCRect = rowCEl.getBoundingClientRect();

    // 1. Entrance coordinates (Relative to Map Container)
    const startX = entRect.left + entRect.width / 2 - mapRect.left;
    const startY = entRect.top + entRect.height / 2 - mapRect.top;

    // 2. Target slot coordinates
    const targetX = tarRect.left + tarRect.width / 2 - mapRect.left;
    const targetY = tarRect.top + tarRect.height / 2 - mapRect.top;

    // 3. Vertical drive lane runs between Col 3 and Col 4
    const vertAisleX = ((c3Rect.right + c4Rect.left) / 2) - mapRect.left;

    // 4. Horizontal drive lane runs between Row B and Row C
    const horizAisleY = ((rBRect.bottom + rCRect.top) / 2) - mapRect.top;

    // Build the 90° Manhattan route
    // Start (Entrance) -> Move horizontally to vertical main aisle -> Move vertically up main aisle -> Turn onto Horizontal Aisle B -> Enter Slot B4
    const d = `M ${startX} ${startY} L ${vertAisleX} ${startY} L ${vertAisleX} ${horizAisleY} L ${targetX} ${horizAisleY} L ${targetX} ${targetY}`;
    
    setNavPath(d);

    // Compute exact path length for dashes drawing animation
    const len = Math.abs(vertAisleX - startX) + Math.abs(horizAisleY - startY) + Math.abs(targetX - vertAisleX) + Math.abs(targetY - horizAisleY);
    setPathLength(len || 650);

    setMarkers({
      startX,
      startY,
      targetX,
      targetY,
      vertAisleX,
      horizAisleY
    });
  };

  // Recalculate path on status change or window resize
  useEffect(() => {
    if (searchStatus === 'found') {
      const timer = setTimeout(() => {
        calculateDrivablePath();
      }, 150);

      window.addEventListener('resize', calculateDrivablePath);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', calculateDrivablePath);
      };
    }
  }, [searchStatus, searchQuery]);

  // Run dynamic navigation telemetry countdown once vehicle is located successfully
  useEffect(() => {
    if (searchStatus !== 'found') return;

    setDistanceRemaining(42);
    setTimeRemaining(30);
    setRouteProgress(0);
    setNavigationStatus('Navigating...');

    const durationMs = 3800; // 3.8s navigation path animation
    const intervalMs = 50;
    const steps = durationMs / intervalMs;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      const ratio = stepCount / steps;
      
      setRouteProgress(Math.min(100, Math.round(ratio * 100)));
      setDistanceRemaining(Math.max(0, Math.round(42 - ratio * 42)));
      setTimeRemaining(Math.max(0, Math.round(30 - ratio * 30)));

      if (stepCount >= steps) {
        clearInterval(timer);
        setNavigationStatus('✓ Destination Reached');
        triggerToast('📍 Arrived at your vehicle.');
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [searchStatus]);

  // Flash vehicle lights command
  const handleFlashLights = () => {
    triggerToast('📡 FLASH COMMAND SENT: Vehicle lights flashing.');
  };

  // Share location command
  const handleShareLocation = () => {
    triggerToast('✓ Parking location link copied to clipboard.');
  };

  // Mock slot status generator
  const slotsGrid = useMemo(() => {
    return ROWS.map(row => 
      COLS.map(col => {
        const id = `${row}${col}`;
        let status = 'Available';
        let type = 'standard';
        
        if (id === 'B4') {
          status = 'Occupied';
          type = 'standard';
        } else if (id === 'A2' || id === 'C3') {
          status = 'Occupied';
          type = 'standard';
        } else if (id === 'D1') {
          status = 'Reserved';
          type = 'standard';
        } else if (id === 'E5') {
          status = 'EV';
          type = 'ev';
        }
        
        return { id, row, col, status, type };
      })
    );
  }, []);

  return (
    <div className="space-y-8 relative z-10 max-w-[1700px] w-full mx-auto text-left">
      
      {/* Styles for dynamic SVG route arrow indicator pathing along the DOM calculated path */}
      {navPath && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes moveArrow {
            0% { offset-distance: 0%; opacity: 1; }
            100% { offset-distance: 100%; opacity: 1; }
          }
          .nav-arrow {
            offset-path: path('${navPath}');
            animation: moveArrow 3.8s linear infinite;
          }
        `}} />
      )}

      {/* Local Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-[#0d1117] border border-[#00D9FF]/30 text-[#00D9FF] px-6 py-3 rounded-2xl text-[10px] font-mono shadow-[0_0_20px_rgba(0,217,255,0.25)] backdrop-blur"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TITLE */}
      <div className="border-b border-white/10 pb-6">
        <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-widest uppercase font-bold flex items-center gap-1.5">
          <Cpu size={10} className="animate-spin animate-duration-3000" /> Metropolitan Search Network
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight uppercase mt-1">
          AI Vehicle Finder
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-2">
          Locate Your Parked Vehicle Instantly
        </p>
      </div>

      {/* TOP SEARCH PANEL */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 shadow-xl relative"
      >
        <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-[#00D9FF]">
          SECURE CONNECTION
        </div>

        <form onSubmit={handleFindVehicle} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          <div className="lg:col-span-4 space-y-1.5">
            <label className="block text-[9px] font-mono text-slate-500 uppercase tracking-widest">Vehicle Number Input</label>
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value.toUpperCase())}
              placeholder="Enter Vehicle Number (e.g. TN47AB1234)"
              className="w-full bg-[#090B14] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all uppercase"
            />
          </div>

          <div className="lg:col-span-4 bg-[#090B14]/40 border border-white/5 rounded-2xl p-3 flex items-center justify-between text-[10px] font-mono">
            <div>
              <span className="text-slate-500 block uppercase text-[8px]">Current Logged-in Vehicle</span>
              <span className="text-[#00D9FF] font-bold block mt-0.5">{loggedInVehicle}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block uppercase text-[8px]">Registered Owner</span>
              <span className="text-white block mt-0.5">{loggedInOwner}</span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <button 
              type="submit"
              disabled={searchStatus === 'scanning'}
              className="w-full py-3 bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_12px_rgba(0,217,255,0.08)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search size={12} strokeWidth={2.5} /> Find My Vehicle
            </button>
          </div>

        </form>
      </motion.div>

      {/* SCANNING STATE */}
      <AnimatePresence mode="wait">
        {searchStatus === 'scanning' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-10 rounded-3xl border border-[#00D9FF]/20 bg-[#111827]/40 shadow-xl flex flex-col items-center justify-center space-y-6 h-[260px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,217,255,0.04),transparent_50%)] pointer-events-none" />
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#00D9FF] animate-spin flex items-center justify-center">
              <Cpu size={16} className="text-[#00D9FF]" />
            </div>
            <div className="space-y-1.5 text-center">
              <span className="text-[#00D9FF] font-bold font-mono text-[11px] uppercase tracking-widest block">Scanning Parking Database...</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{scanProgress}% SECURE DECRYPT ACTIVE</span>
            </div>
            <div className="w-64 h-1.5 bg-[#090B14] rounded-full border border-white/5 overflow-hidden">
              <motion.div 
                className="h-full bg-[#00D9FF]" 
                style={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCAN SUCCESS LAYOUT */}
      {searchStatus === 'found' && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* MAP AND ROUTE (8 COLS) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="glass-panel p-6 rounded-[32px] border border-white/10 bg-[#111827]/40 shadow-2xl relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[8px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> NETWORK SYNCHRONIZATION: LIVE
              </div>

              <div className="text-left mb-6">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Ground Floor Mapping</span>
                <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider mt-0.5">Section Layout Grid</h3>
              </div>

              {/* Slot grid container using DOM refs for perfect coordinate mapping */}
              <div 
                ref={mapRef}
                id="finder-map-container"
                className="relative overflow-x-auto select-none border border-white/5 bg-[#090B14]/40 p-6 rounded-2xl flex flex-col justify-between h-[810px]"
              >
                
                {/* SVG path route overlay calculated dynamically from DOM rectangles */}
                {navPath && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    
                    {/* Glowing Route path drawing itself from entrance */}
                    <motion.path 
                      d={navPath} 
                      fill="none" 
                      stroke="#00D9FF" 
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ strokeDashoffset: pathLength }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 2.2, ease: 'easeInOut' }}
                      style={{
                        strokeDasharray: pathLength,
                        filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.6))'
                      }}
                    />

                    {/* Small glowing dots continuously moving along the path */}
                    <motion.path 
                      d={navPath} 
                      fill="none" 
                      stroke="#ffffff" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="8, 30"
                      animate={{ strokeDashoffset: [-38, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                      style={{ filter: 'drop-shadow(0 0 3px #00D9FF)' }}
                    />

                    {/* Glow indicators at the turn */}
                    {markers && (
                      <>
                        <circle cx={markers.turnX} cy={markers.turnY} r="6" fill="#00D9FF" opacity="0.3" className="animate-pulse" />
                        <circle cx={markers.turnX} cy={markers.turnY} r="3" fill="#00D9FF" />
                      </>
                    )}

                    {/* START Marker at entrance */}
                    {markers && (
                      <g transform={`translate(${markers.startX}, ${markers.startY - 15})`}>
                        <rect x="-18" y="-12" width="36" height="16" rx="4" fill="#090B14" stroke="#00D9FF" strokeWidth="1" />
                        <text y="-2" fill="#00D9FF" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">START</text>
                      </g>
                    )}

                    {/* DESTINATION Marker above target slot */}
                    {markers && (
                      <g transform={`translate(${markers.targetX}, ${markers.targetY - 50})`}>
                        <rect x="-26" y="-14" width="52" height="18" rx="4" fill="#0d1117" stroke="#00D9FF" strokeWidth="1" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 217, 255, 0.4))' }} />
                        <text y="-2" fill="#00D9FF" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">DESTINATION</text>
                      </g>
                    )}

                    {/* Animated navigation arrow moving along the route */}
                    <g className="nav-arrow" transform="translate(-6, -6)">
                      <circle cx="6" cy="6" r="6" fill="#00D9FF" style={{ filter: 'drop-shadow(0 0 8px #00D9FF)' }} />
                      <polygon points="6,3 9,8 6,6 3,8" fill="#090B14" transform="rotate(90 6 6)" />
                    </g>

                  </svg>
                )}

                {/* HTML grid layout elements */}
                <div className="flex flex-col justify-between w-full h-[710px]">
                  {ROWS.map(row => (
                    <div key={row} className="flex items-center justify-between h-[85px] w-full">
                      <span className="w-8 font-mono text-xs font-extrabold text-slate-500 text-center">{row}</span>
                      
                      <div className="flex-1 flex justify-between ml-4">
                        {COLS.map(col => {
                          const id = `${row}${col}`;
                          const isTarget = id === 'B4';
                          const isOccupied = id === 'A2' || id === 'C3' || id === 'B4';
                          const isReserved = id === 'D1';
                          const isEV = id === 'E5';

                          // Status styles mapping
                          let borderClass = 'border-white/10';
                          let bgClass = 'bg-[#111827]/10';
                          let textClass = 'text-slate-400';
                          
                          if (isTarget) {
                            borderClass = 'border-[#00D9FF]';
                            bgClass = 'bg-[#00D9FF]/10';
                            textClass = 'text-[#00D9FF]';
                          } else if (isOccupied) {
                            borderClass = 'border-red-500/30';
                            bgClass = 'bg-red-950/15';
                            textClass = 'text-red-400';
                          } else if (isReserved) {
                            borderClass = 'border-blue-500/30';
                            bgClass = 'bg-blue-950/15';
                            textClass = 'text-blue-400';
                          } else if (isEV) {
                            borderClass = 'border-purple-500/30';
                            bgClass = 'bg-purple-950/15';
                            textClass = 'text-purple-400';
                          }

                          return (
                            <div 
                              key={id}
                              id={`finder-slot-${id}`}
                              className={`
                                w-[110px] h-[85px] border-2 rounded-xl flex flex-col justify-between p-2 relative transition-all duration-300
                                ${bgClass} ${borderClass}
                                ${isTarget ? 'shadow-[0_0_25px_rgba(0,217,255,0.45)] z-20 scale-[1.05]' : 'opacity-40'}
                              `}
                            >
                              {/* Glowing beacon pulse effect on Target B4 */}
                              {isTarget && (
                                <>
                                  <span className="absolute -inset-1 rounded-xl ring-2 ring-[#00D9FF] animate-ping opacity-60 pointer-events-none" />
                                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[7px] text-[#00D9FF] bg-[#0d1117] border border-[#00D9FF]/40 px-1.5 py-0.5 rounded uppercase tracking-widest whitespace-nowrap">
                                    YOUR VEHICLE 🛞
                                  </span>
                                </>
                              )}

                              <div className="flex justify-between items-center text-[9px] font-mono font-bold leading-none">
                                <span className={textClass}>{id}</span>
                                <span className="text-[7px] text-slate-500 uppercase">
                                  {isTarget ? 'Target' : isOccupied ? 'Occupied' : isReserved ? 'Reserved' : 'Available'}
                                </span>
                              </div>

                              <div className="flex-1 flex items-center justify-center">
                                {isOccupied ? (
                                  <motion.div 
                                    animate={isTarget && routeProgress === 100 ? { y: [0, -6, 0] } : {}}
                                    transition={{ duration: 0.6, repeat: isTarget ? Infinity : 0, repeatType: 'reverse' }}
                                  >
                                    <CarIcon color={isTarget ? '#00D9FF' : '#EF4444'} />
                                  </motion.div>
                                ) : isReserved ? (
                                  <CheckCircle size={18} className="text-blue-400" />
                                ) : isEV ? (
                                  <Zap size={18} className="text-purple-400 fill-purple-500/10" />
                                ) : (
                                  <span className="text-emerald-400 font-extrabold text-xs font-mono">P</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Entrance element below Row G layout */}
                <div 
                  id="finder-entrance"
                  className="w-20 py-2 border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] font-mono text-[8px] font-bold uppercase tracking-wider rounded-xl text-center mx-auto mt-4 shrink-0"
                >
                  Entrance
                </div>

              </div>

            </div>

            {/* QUICK ACTIONS BUTTONS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <button 
                onClick={() => triggerToast('📡 VEHICLE TRANSPONDER: Route navigation sync started.')}
                className="p-3.5 rounded-xl border border-[#00D9FF]/20 bg-[#00D9FF]/5 hover:bg-[#00D9FF] hover:text-[#090B14] text-[#00D9FF] font-mono text-[9px] font-bold uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,217,255,0.08)] flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <Navigation size={13} /> Navigate to Vehicle
              </button>
              <button 
                onClick={handleFlashLights}
                className="p-3.5 rounded-xl border border-white/10 bg-white/4 hover:border-[#00D9FF]/40 text-slate-300 hover:text-white font-mono text-[9px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb size={13} /> Flash Vehicle Lights
              </button>
              <button 
                onClick={handleFindVehicle}
                className="p-3.5 rounded-xl border border-white/10 bg-white/4 hover:border-[#00D9FF]/40 text-slate-300 hover:text-white font-mono text-[9px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={13} /> Locate Again
              </button>
              <button 
                onClick={handleShareLocation}
                className="p-3.5 rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-mono text-[9px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1.5 shadow-[0_0_12px_rgba(0,217,255,0.1)] cursor-pointer"
              >
                <Share2 size={13} /> Share Location
              </button>
            </div>

          </div>

          {/* RIGHT COL: Vehicle Found & Navigation Telemetry Info card (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI ROUTE GUIDANCE INFO PANEL */}
            <div className="glass-panel p-6 rounded-3xl border border-[#00D9FF]/35 bg-[#111827]/40 shadow-xl flex flex-col justify-between h-full relative">
              <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-[#00D9FF] tracking-wider animate-pulse">
                📡 ROUTING TELEMETRY ACTIVE
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Compass className="text-[#00D9FF] animate-spin" style={{ animationDuration: '8s' }} />
                    <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">AI Route Guidance</h3>
                  </div>
                </div>

                {/* Info List */}
                <div className="divide-y divide-white/5 font-mono text-[10px] space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-500 uppercase tracking-wide">Current Position</span>
                    <span className="text-white font-bold">{routeProgress === 100 ? 'Slot B4 (Arrived)' : 'Entrance Gate'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-500 uppercase tracking-wide">Next Turn</span>
                    <span className="text-[#00D9FF] font-bold">{routeProgress >= 70 ? 'Arrived' : 'Right after Section A'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-500 uppercase tracking-wide">Distance Remaining</span>
                    <span className="text-white font-bold">{distanceRemaining} m</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-slate-500 uppercase tracking-wide">Estimated Time</span>
                    <span className="text-white font-bold">{timeRemaining} sec</span>
                  </div>
                  <div className="flex flex-col gap-2 py-2 border-b border-white/5">
                    <span className="text-slate-500 uppercase tracking-wide">Route Progress</span>
                    <div className="w-full h-2 bg-[#090B14] rounded-full border border-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00D9FF] transition-all duration-300"
                        style={{ width: `${routeProgress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 uppercase tracking-wide">Navigation Status</span>
                    <span className={`font-bold uppercase tracking-wider ${routeProgress === 100 ? 'text-emerald-400' : 'text-[#00D9FF] animate-pulse'}`}>
                      {navigationStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI INSIGHTS BAR */}
              <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
                <span className="text-[8px] font-mono text-[#00D9FF] uppercase tracking-widest block font-bold">AI SMART TELEMETRY</span>
                
                <div className="space-y-2 text-[9px] font-mono text-slate-400 leading-normal">
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span>
                    <span>Fastest walking route generated from Entrance coordinates.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span>
                    <span>Vehicle is parked safely inside Section B block.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">✔</span>
                    <span>CCTV monitoring network active on Slot B4 coordinates.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      )}

    </div>
  );
}
