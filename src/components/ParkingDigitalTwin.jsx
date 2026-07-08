import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FiZap, FiTv, FiDatabase, FiActivity, FiRadio, FiNavigation, FiInfo } from 'react-icons/fi';

const TopDownCar = React.memo(({ color, headlightsOn, brakeLightsOn, isSelected, wheelAngle = 0 }) => {
  return (
    <g className={isSelected ? "animate-pulse" : ""}>
      {isSelected && (
        <rect 
          x="-22" 
          y="-13" 
          width="44" 
          height="26" 
          rx="7" 
          fill="none" 
          stroke="#00D9FF" 
          strokeWidth="1.2" 
          strokeDasharray="3 3"
          className="animate-[spin_8s_linear_infinite]"
        />
      )}

      {/* Ambient Shadow */}
      <rect 
        x="-20" 
        y="-10" 
        width="40" 
        height="20" 
        rx="5" 
        fill="rgba(0, 0, 0, 0.45)" 
        style={{ filter: 'blur(2.5px)' }}
        transform="translate(2, 2)"
      />

      {/* Front Wheels (Steering) */}
      <g transform={`rotate(${wheelAngle} 10.5 -9.25)`}>
        <rect x="7" y="-10.5" width="7" height="2.5" rx="0.8" fill="#1e293b" />
      </g>
      <g transform={`rotate(${wheelAngle} 10.5 9.25)`}>
        <rect x="7" y="8" width="7" height="2.5" rx="0.8" fill="#1e293b" />
      </g>

      {/* Rear Wheels (Fixed) */}
      <rect x="-14" y="-10.5" width="7" height="2.5" rx="0.8" fill="#1e293b" />
      <rect x="-14" y="8" width="7" height="2.5" rx="0.8" fill="#1e293b" />

      {/* Metallic Body */}
      <path 
        d="M -18,-7.5 
           C -19,-7.5 -20,-5.5 -20,-3.5 
           L -20,3.5 
           C -20,5.5 -19,7.5 -18,7.5 
           L -14,7.5 
           C -13,9 -11,9 -10,7.5 
           L 5,7.5 
           C 6,9 8,9 9,7.5 
           L 15,7.5 
           C 17,7.5 19,5.5 19,2 
           L 19,-2 
           C 19,-5.5 17,-7.5 15,-7.5 
           L 9,-7.5 
           C 8,-9 6,-9 5,-7.5 
           L -10,-7.5 
           C -11,-9 -13,-9 -14,-7.5 
           Z" 
        fill="#050816" 
        stroke={color} 
        strokeWidth="1.5" 
        style={{
          filter: isSelected ? 'drop-shadow(0 0 4px #00D9FF)' : 'none'
        }}
      />

      {/* Side Mirrors */}
      <path d="M 5,-7.5 C 5,-10 3,-10 2,-7.5" fill="none" stroke={color} strokeWidth="1" />
      <path d="M 5,7.5 C 5,10 3,10 2,7.5" fill="none" stroke={color} strokeWidth="1" />

      {/* Hood Detailing */}
      <path d="M 11,-4.5 L 16,-1.5 M 11,4.5 L 16,1.5" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" fill="none" />

      {/* Windshield */}
      <path d="M 3,-5.5 C 4.5,-5.5 7,-3.5 7,0 C 7,3.5 4.5,5.5 3,5.5 L 0,5.5 C 1,2.5 1,-2.5 0,-5.5 Z" fill="rgba(0, 217, 255, 0.22)" stroke="rgba(0, 217, 255, 0.4)" strokeWidth="0.5" />

      {/* Roof Glass Panel */}
      <rect x="-8" y="-5" width="9" height="10" rx="1" fill="rgba(255, 255, 255, 0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      <path d="M -7,3.5 L -2.5,-3.5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

      {/* Rear window */}
      <path d="M -11,-4.5 C -10,-4.5 -9,-2.5 -9,0 C -9,2.5 -10,4.5 -11,4.5 Z" fill="rgba(0, 217, 255, 0.12)" stroke="rgba(0, 217, 255, 0.2)" strokeWidth="0.5" />

      {/* Headlights */}
      <polygon points="17,-6.5 19,-7.5 18,-4.5" fill="#FFFFFF" opacity="0.9" />
      <polygon points="17,6.5 19,7.5 18,4.5" fill="#FFFFFF" opacity="0.9" />
      {headlightsOn && (
        <>
          <path d="M 18,-6 C 24,-11 34,-11 38,-5 L 18,-4.5 Z" fill="rgba(0, 217, 255, 0.1)" />
          <path d="M 18,6 C 24,11 34,11 38,5 L 18,4.5 Z" fill="rgba(0, 217, 255, 0.1)" />
        </>
      )}

      {/* Taillights */}
      <path d="M -20,-4 L -20,4" stroke={brakeLightsOn ? "#FF4D5A" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" />
      {brakeLightsOn && (
        <path d="M -20,-6 C -24,-6 -24,6 -20,6" fill="none" stroke="rgba(255, 77, 90, 0.2)" strokeWidth="2" />
      )}
    </g>
  );
});

const StaticDigitalTwinMap = React.memo(({ gateAngle }) => {
  return (
    <>
      {/* BACKGROUND DECORATIVE TREES */}
      {/* Left margin trees */}
      {[30, 80, 260, 310].map((y, idx) => (
        <g key={`tree-l-${idx}`}>
          <circle cx="20" cy={y} r="10" fill="rgba(34, 197, 94, 0.08)" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" />
          <circle cx="20" cy={y} r="6" fill="none" stroke="rgba(34, 197, 94, 0.15)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}
      {/* Right margin trees */}
      {[30, 80, 260, 310].map((y, idx) => (
        <g key={`tree-r-${idx}`}>
          <circle cx="480" cy={y} r="10" fill="rgba(34, 197, 94, 0.08)" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" />
          <circle cx="480" cy={y} r="6" fill="none" stroke="rgba(34, 197, 94, 0.15)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      ))}

      {/* STREET LIGHTS CASTING AMBIENT YELLOW CONES */}
      {[[110, 85], [380, 85], [110, 215], [380, 215]].map(([x, y], idx) => (
        <g key={`light-${idx}`}>
          {/* Light cone */}
          <polygon points={`${x},${y} ${x-40},${y + (y<150 ? 50 : -50)} ${x+40},${y + (y<150 ? 50 : -50)}`} fill="rgba(250, 204, 21, 0.04)" />
          {/* Lamp pole */}
          <circle cx={x} cy={y} r="2.5" fill="#FACC15" />
          <circle cx={x} cy={y} r="6" stroke="#FACC15" strokeWidth="0.5" fill="none" className="animate-pulse" />
        </g>
      ))}

      {/* MAIN VEHICLE LANES & BOUNDARY ROAD MARKINGS */}
      <rect x="40" y="110" width="420" height="80" fill="rgba(255,255,255,0.005)" stroke="rgba(0,217,255,0.03)" strokeWidth="1" />
      <line x1="40" y1="150" x2="460" y2="150" stroke="rgba(0, 217, 255, 0.08)" strokeWidth="1.2" strokeDasharray="6 6" />

      {/* ENTRANCE GATE SYSTEM */}
      {/* Gate base */}
      <rect x="35" y="140" width="6" height="20" fill="#1E293B" rx="1" />
      {/* Gate boom arm (rotates when car approaches) */}
      <line 
        x1="38" y1="150" x2="38" y2="110" 
        stroke="#EF4444" strokeWidth="3" 
        strokeLinecap="round"
        style={{
          transform: `rotate(${gateAngle}deg)`,
          transformOrigin: '38px 150px',
          transition: 'transform 0.8s ease-in-out'
        }}
      />
    </>
  );
});

const slotLocations = {
  P1: { x: 70, y: 60, angle: 90 },
  P2: { x: 140, y: 60, angle: 90 },
  P3: { x: 210, y: 60, angle: 90 },
  P4: { x: 280, y: 60, angle: 90 },
  P5: { x: 350, y: 60, angle: 90 },
  P6: { x: 420, y: 60, angle: 90 },
  P7: { x: 70, y: 240, angle: -90 },
  P8: { x: 140, y: 240, angle: -90 },
  P9: { x: 210, y: 240, angle: -90 },
  P10: { x: 280, y: 240, angle: -90 },
  P11: { x: 350, y: 240, angle: -90 },
  P12: { x: 420, y: 240, angle: -90 },
};

function ParkingDigitalTwin({ selectedSlotId, onSlotClick, slotsData, onSlotStatusChange }) {
  const [particles, setParticles] = useState([]);
  const [slots, setSlots] = useState({
    P1: 'Occupied',
    P2: 'Available',
    P3: 'Available', // Car 1 target
    P4: 'Reserved',
    P5: 'Occupied',
    P6: 'Available',
    P7: 'Occupied',
    P8: 'Available', // Car 2 target
    P9: 'Occupied',
    P10: 'Available',
    P11: 'Occupied',
    P12: 'Reserved',
  });

  useEffect(() => {
    if (!slotsData) return;
    
    // Scan for new reservations to launch target vehicle animations
    slotsData.forEach(s => {
      // Only launch animations for slots that exist in our visual coordinate map
      if (!slotLocations[s.id]) return;
      
      const prevStatus = slots[s.id];
      if (prevStatus === 'Available' && s.status === 'Reserved') {
        const carId = `car-res-${s.id}`;
        const newCar = {
          id: carId,
          label: 'RESERVED EV',
          plate: 'TN-47-AB-1234',
          confidence: '99.8%',
          x: -40,
          y: 150,
          rotate: 0,
          visible: true,
          phase: 'entering',
          targetSlot: s.id,
          progress: 0,
        };
        
        setCars(prev => {
          const filtered = prev.filter(c => c.targetSlot !== s.id);
          return [...filtered, newCar];
        });
        
        setEvents(prev => [
          { id: `ev-${s.id}-${Date.now()}`, time: new Date().toTimeString().split(' ')[0], text: `AI Reservation: Dispatching EV to slot ${s.id}` },
          ...prev.slice(0, 5)
        ]);
      }
    });

    const newSlots = {};
    slotsData.forEach(s => {
      newSlots[s.id] = s.status;
    });
    setSlots(newSlots);
  }, [slotsData]);

  const [cars, setCars] = useState([
    {
      id: 'car-1',
      label: 'Vehicle #07',
      plate: 'MH-12-EV-7766',
      confidence: '99.4%',
      x: -40,
      y: 150,
      rotate: 0,
      visible: true,
      phase: 'entering',
      targetSlot: 'P3',
      progress: 0,
    },
    {
      id: 'car-2',
      label: 'Vehicle #14',
      plate: 'DL-03-CV-8899',
      confidence: '98.7%',
      x: -40,
      y: 150,
      rotate: 0,
      visible: false,
      phase: 'inactive',
      targetSlot: 'P8',
      progress: 0,
    }
  ]);

  const [events, setEvents] = useState([
    { id: 'ev-init-1', time: '17:02:40', text: 'System diagnostics clean. AI operational.' },
    { id: 'ev-init-2', time: '17:02:45', text: 'Telemetry sync complete with central DB.' },
  ]);

  const [gateAngle, setGateAngle] = useState(0); // 0 = closed, -75 = open
  const [timeString, setTimeString] = useState('17:02:52');

  // Sync clock time
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeString(d.toTimeString().split(' ')[0]);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Frame tick animation loop
  useEffect(() => {
    let frameId;
    
    const updateSimulation = () => {
      setCars((prevCars) => {
        const nextCars = prevCars.map((car) => {
          if (car.phase === 'inactive') {
            if (Math.random() < 0.007) {
              const nextTarget = car.id === 'car-1' ? 'P3' : 'P8';
              setSlots(prev => {
                const nextSlots = { ...prev, [nextTarget]: 'Available' };
                return nextSlots;
              });
              if (onSlotStatusChange) setTimeout(() => onSlotStatusChange(nextTarget, 'Available'), 0);
              
              // Log event entry
              setEvents(prev => [
                { id: `ev-${car.id}-entering-${Date.now()}`, time: new Date().toTimeString().split(' ')[0], text: `${car.label} entering gate.` },
                ...prev.slice(0, 5)
              ]);

              return {
                ...car,
                phase: 'entering',
                x: -40,
                y: 150,
                rotate: 0,
                progress: 0,
                visible: true,
              };
            }
            return car;
          }

          let { phase, x, y, rotate, progress, targetSlot } = car;
          const targetCoord = slotLocations[targetSlot] || slotLocations['P3'];

          // Entrance gate animation: opens when car is nearby
          if (x > -30 && x < 40) {
            setGateAngle(-75); // Open gate
          } else {
            setGateAngle(0); // Close gate
          }

          if (phase === 'entering') {
            x += 2;
            rotate = 0;
            if (x >= targetCoord.x) {
              x = targetCoord.x;
              phase = 'parking';
              progress = 0;
            }
          } else if (phase === 'parking') {
            progress += 0.015;
            const dir = targetCoord.y < 150 ? -1 : 1;
            y = 150 + dir * (progress * 90);
            rotate = dir === -1 ? -90 : 90;
            
            if (progress >= 1.0) {
              y = targetCoord.y;
              phase = 'parked';
              progress = 0;
              setSlots((prev) => {
                const nextSlots = { ...prev, [targetSlot]: 'Occupied' };
                return nextSlots;
              });
              if (onSlotStatusChange) setTimeout(() => onSlotStatusChange(targetSlot, 'Occupied'), 0);
              
              // Log event parked
              setEvents(prev => [
                { id: `ev-${car.id}-parked-${Date.now()}`, time: new Date().toTimeString().split(' ')[0], text: `${car.label} parked successfully at ${targetSlot}.` },
                ...prev.slice(0, 5)
              ]);
            }
          } else if (phase === 'parked') {
            progress += 1;
            if (progress >= 120) {
              phase = 'leaving';
              progress = 0;
              setSlots((prev) => {
                const nextSlots = { ...prev, [targetSlot]: 'Available' };
                return nextSlots;
              });
              if (onSlotStatusChange) setTimeout(() => onSlotStatusChange(targetSlot, 'Available'), 0);
              
              // Log event leaving
              setEvents(prev => [
                { id: `ev-${car.id}-leaving-${Date.now()}`, time: new Date().toTimeString().split(' ')[0], text: `${car.label} vacating slot ${targetSlot}.` },
                ...prev.slice(0, 5)
              ]);
            }
          } else if (phase === 'leaving') {
            progress += 0.015;
            const dir = targetCoord.y < 150 ? -1 : 1;
            y = targetCoord.y - dir * (progress * 90);
            rotate = dir === -1 ? 90 : -90;
            
            if (progress >= 1.0) {
              y = 150;
              phase = 'exiting';
              progress = 0;
            }
          } else if (phase === 'exiting') {
            x += 2;
            rotate = 0;
            if (x > 540) {
              phase = 'inactive';
            }
          }

          return {
            ...car,
            x,
            y,
            rotate,
            phase,
            progress,
          };
        });

        // Generate particles from nextCars that are moving
        const bornParticles = [];
        nextCars.forEach(car => {
          if (car.phase !== 'inactive' && car.phase !== 'parked') {
            if (Math.random() < 0.3) {
              const color = car.id.includes('car-res') ? '#A855F7' : '#00D9FF';
              bornParticles.push({
                id: `p-${car.id}-${Date.now()}-${Math.random()}`,
                x: car.x + (Math.random() * 4 - 2),
                y: car.y + (Math.random() * 4 - 2),
                opacity: 0.8,
                scale: 1.0,
                color
              });
            }
          }
        });

        if (bornParticles.length > 0) {
          setParticles(prev => 
            [...prev.map(p => ({
              ...p,
              opacity: p.opacity - 0.03,
              scale: p.scale - 0.02
            })).filter(p => p.opacity > 0), ...bornParticles]
          );
        } else {
          setParticles(prev => 
            prev.map(p => ({
              ...p,
              opacity: p.opacity - 0.03,
              scale: p.scale - 0.02
            })).filter(p => p.opacity > 0)
          );
        }

        return nextCars;
      });

      frameId = requestAnimationFrame(updateSimulation);
    };

    frameId = requestAnimationFrame(updateSimulation);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute live statistics for HUD
  const totalSlots = Object.keys(slots).length;
  const occupiedCount = Object.values(slots).filter((s) => s === 'Occupied').length;
  const reservedCount = Object.values(slots).filter((s) => s === 'Reserved').length;
  const availableCount = totalSlots - occupiedCount - reservedCount;
  const occupancyPercent = Math.round((occupiedCount / totalSlots) * 100);

  // Identify active vehicle details
  const activeCar = cars.find(c => c.phase !== 'inactive') || cars[0];

  return (
    <div className="w-full flex flex-col gap-8">
      
      {/* ======================================================== */}
      {/* HUGE LIVE DIGITAL TWIN CONTAINER WITH HUD OVERLAYS */}
      {/* ======================================================== */}
      <div className="w-full h-[520px] bg-[#050816] rounded-[24px] border border-white/10 relative overflow-hidden flex items-center justify-center shadow-[0_0_50px_rgba(0,217,255,0.08)]">
        
        {/* Blueprint grid layout */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.02)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none"></div>

        {/* -------------------------------------------------------- */}
        {/* HUD OVERLAY: TOP LEFT */}
        {/* -------------------------------------------------------- */}
        <div className="absolute top-6 left-6 z-10 space-y-1 bg-[#0b1325]/75 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <FiRadio className="text-[#00D9FF] text-base animate-pulse" />
            <span className="font-heading font-extrabold text-xs text-white uppercase tracking-wider block">LIVE DIGITAL TWIN</span>
          </div>
          <span className="text-[8px] font-stat-mono text-emerald-400 uppercase tracking-widest block font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> REAL-TIME SYNC
          </span>
        </div>

        {/* -------------------------------------------------------- */}
        {/* HUD OVERLAY: TOP RIGHT (AI Detection panel with preview) */}
        {/* -------------------------------------------------------- */}
        <div className="absolute top-6 right-6 z-10 w-64 bg-[#0b1325]/75 border border-white/5 p-5 rounded-2xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-nav-text text-[9px] text-[#00D9FF] uppercase font-bold">AI DETECTION PANEL</span>
            <span className="font-stat-mono text-[8px] text-slate-500">{timeString}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Wireframe vector car preview */}
            <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center relative overflow-hidden">
              <svg className="w-10 h-10 text-[#00D9FF]" viewBox="0 0 40 40" fill="none" stroke="currentColor">
                <rect x="12" y="6" width="16" height="28" rx="4" strokeWidth="1.2" />
                <line x1="12" y1="14" x2="28" y2="14" strokeWidth="0.8" />
                <line x1="12" y1="28" x2="28" y2="28" strokeWidth="0.8" />
                <circle cx="16" cy="10" r="1" fill="#00D9FF" />
                <circle cx="24" cy="10" r="1" fill="#00D9FF" />
              </svg>
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_60%,rgba(0,217,255,0.1)_100%)] animate-[spin_3s_linear_infinite]"></div>
            </div>

            <div className="text-left flex-1 min-w-0 font-stat-mono text-[9px] text-slate-400 space-y-1">
              <p className="text-white font-bold truncate">{activeCar?.label}</p>
              <p className="truncate">PLATE: <span className="text-white">{activeCar?.plate}</span></p>
              <p>CONFIDENCE: <span className="text-emerald-400">{activeCar?.confidence}</span></p>
              <p className="truncate">STATUS: <span className="text-[#00D9FF] uppercase">{activeCar?.phase}</span></p>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* HUD OVERLAY: BOTTOM RIGHT (Rotating radar scan) */}
        {/* -------------------------------------------------------- */}
        <div className="absolute bottom-6 right-6 z-10 w-24 h-24 rounded-full border border-[#00D9FF]/20 flex items-center justify-center bg-[#050816]/75 backdrop-blur-md shadow-2xl">
          <div className="w-full h-full rounded-full bg-[conic-gradient(from_0deg,transparent_60%,rgba(0,217,255,0.15)_100%)] animate-[spin_4s_linear_infinite]"></div>
          <div className="absolute w-16 h-16 rounded-full border border-[#00D9FF]/10"></div>
          <div className="absolute w-8 h-8 rounded-full border border-[#00D9FF]/10"></div>
          <span className="absolute w-1.5 h-1.5 rounded-full bg-[#00D9FF]"></span>
          {/* Signal dots */}
          <span className="absolute top-5 left-6 w-1 h-1 rounded-full bg-[#22C55E] animate-ping" style={{ animationDuration: '3s' }}></span>
          <span className="absolute bottom-6 right-7 w-1 h-1 rounded-full bg-[#EF4444] animate-ping" style={{ animationDuration: '4.5s' }}></span>
        </div>

        {/* -------------------------------------------------------- */}
        {/* MAIN MAP (VECTOR DRAWINGS OF STREET LIGHTS, TREES, LOTS) */}
        {/* -------------------------------------------------------- */}
        <svg className="w-full h-full max-h-[380px] z-0" viewBox="0 0 500 300" fill="none">
          <StaticDigitalTwinMap gateAngle={gateAngle} />

          {/* 12 PARKING SPACES */}
          {Object.entries(slotLocations).map(([id, pos]) => {
            const state = slots[id];
            const isTopRow = pos.y === 60;
            const slotW = 46;
            const slotH = 70;
            const rx = pos.x - slotW/2;
            const ry = pos.y - slotH/2;
            
            // Available = Neon Blue outlines + Soft pulse
            // Occupied = Red outlines
            // Reserved = Green outlines + Blinking
            let outlineColor = 'rgba(255,255,255,0.08)';
            let sensorColor = 'rgba(255,255,255,0.2)';
            let animClass = '';

            if (state === 'Available') {
              outlineColor = '#00D9FF';
              sensorColor = '#00D9FF';
              animClass = 'animate-[pulseSlot_2s_infinite]';
            } else if (state === 'Occupied') {
              outlineColor = 'rgba(239, 68, 68, 0.2)';
              sensorColor = '#EF4444';
            } else if (state === 'Reserved') {
              outlineColor = '#22C55E';
              sensorColor = '#22C55E';
              animClass = 'animate-[blinkSlot_3s_infinite]';
            }

            // Highlighting active user selection if selected in planner
            const isSelected = selectedSlotId === id;
            if (isSelected) {
              outlineColor = '#FACC15';
              sensorColor = '#FACC15';
              animClass = 'animate-pulse';
            }

            return (
              <g key={id} onClick={() => onSlotClick && onSlotClick({ id, status: state })} className="cursor-pointer">
                {/* Slot borders */}
                <rect 
                  x={rx} 
                  y={ry} 
                  width={slotW} 
                  height={slotH} 
                  stroke={outlineColor} 
                  strokeWidth="1.2" 
                  fill="rgba(0,0,0,0.2)"
                  className={animClass}
                />
                
                {/* AI Camera Sensor node indicator */}
                <circle 
                  cx={pos.x} 
                  cy={isTopRow ? ry + 8 : ry + slotH - 8} 
                  r="2" 
                  fill={sensorColor} 
                  className={state === 'Available' ? 'animate-ping' : ''}
                />
                
                {/* Label text */}
                <text 
                  x={pos.x} 
                  y={isTopRow ? ry + 22 : ry + slotH - 18} 
                  fill="rgba(255,255,255,0.2)" 
                  fontSize="6.5" 
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {id}
                </text>
              </g>
            );
          })}

          {/* ACTIVE AI ROUTING PATH LINES */}
          {cars.map((car) => {
            if (car.phase === 'entering' || car.phase === 'parking') {
              const target = slotLocations[car.targetSlot] || slotLocations['P3'];
              return (
                <g key={`path-${car.id}`} className="animate-[fadeIn_0.5s_ease-out]">
                  <path 
                    d={`M -20 150 L ${target.x} 150 L ${target.x} ${target.y}`} 
                    fill="none" 
                    stroke="#00D9FF" 
                    strokeWidth="2.2" 
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                    className="animate-[dash_1.5s_linear_infinite]"
                  />
                </g>
              );
            }
            return null;
          })}

          {/* TRAILING NAVIGATION PARTICLES */}
          {particles.map((p) => (
            <circle 
              key={p.id} 
              cx={p.x} 
              cy={p.y} 
              r={1.2 * p.scale} 
              fill={p.color} 
              opacity={p.opacity} 
              style={{ transition: 'opacity 0.1s linear, transform 0.1s linear' }}
            />
          ))}

          {/* ELECTRIC VECHILE VECTORS & AI BOUNDING BOXES */}
          {cars.map((car) => {
            if (!car.visible || car.phase === 'inactive') return null;
            
            const isLeftTurn = car.rotate === -90;
            const isBlinkingPhase = car.phase === 'parking' || car.phase === 'leaving';
            
            // Color Mapping
            const isSelected = selectedSlotId && car.targetSlot === selectedSlotId;
            const slotStatus = slots[car.targetSlot];
            
            let carColor = '#00D9FF'; // Available (Neon Blue)
            if (isSelected) {
              carColor = '#00E5FF'; // Selected (Bright Cyan)
            } else if (slotStatus === 'Reserved') {
              carColor = '#32FF87'; // Reserved (Neon Green)
            } else if (car.phase === 'parked') {
              carColor = '#FF4D5A'; // Occupied (Matte Crimson Red)
            }
            
            // Idling floating transform when parked
            const idleOffset = car.phase === 'parked' ? 'translate(0px, 0.5px)' : 'none';

            // Calculate front steering wheel rotation angle
            let wheelAngle = 0;
            if (car.phase === 'parking' || car.phase === 'leaving') {
              if (car.progress < 0.4) {
                const targetPos = slotLocations[car.targetSlot] || slotLocations['P3'];
                const dir = targetPos.y < 150 ? -1 : 1;
                wheelAngle = car.phase === 'parking' ? dir * 25 : -dir * 25;
              }
            }

            return (
              <g 
                key={car.id} 
                style={{ 
                  transform: `translate3d(${car.x}px, ${car.y}px, 0) rotate(${car.rotate}deg)`, 
                  transformOrigin: '0px 0px', 
                  transition: 'transform 0.05s linear',
                  willChange: 'transform'
                }}
              >
                <g style={{ transform: idleOffset, transition: 'transform 0.5s ease-in-out' }}>
                  
                  {/* Top-down premium vehicle vector */}
                  <TopDownCar 
                    color={carColor} 
                    headlightsOn={car.phase !== 'parked'} 
                    brakeLightsOn={car.phase === 'parking' || car.phase === 'parked'} 
                    isSelected={isSelected}
                    wheelAngle={wheelAngle}
                  />

                  {/* Blinking Turn Signal indicators using pure CSS keyframes */}
                  {isBlinkingPhase && (
                    <>
                      <circle cx="17" cy={isLeftTurn ? "-7" : "7"} r="1.5" fill="#FACC15" className="animate-[blinkSignal_0.6s_steps(2,start)_infinite]" />
                      <circle cx="-18" cy={isLeftTurn ? "-7" : "7"} r="1.5" fill="#FACC15" className="animate-[blinkSignal_0.6s_steps(2,start)_infinite]" />
                    </>
                  )}

                  {/* Bounding box AI detection outlines */}
                  <rect 
                    x="-22" 
                    y="-14" 
                    width="44" 
                    height="28" 
                    rx="1.5" 
                    fill="none" 
                    stroke={carColor} 
                    strokeWidth="0.8" 
                    strokeDasharray="2 2"
                    className="animate-pulse"
                  />
                  
                  {/* AI plate tag overlay */}
                  <g style={{ transform: 'translate(-20px, -20px)' }}>
                    <rect x="0" y="0" width="40" height="9" rx="1.5" fill="rgba(5, 8, 22, 0.85)" stroke={carColor} strokeWidth="0.5" />
                    <text x="20" y="6.5" fill="#FFFFFF" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                      {car.plate.substring(0, 7)}
                    </text>
                  </g>

                </g>
              </g>
            );
          })}
        </svg>

      </div>

      {/* ======================================================== */}
      {/* HUD COMPONENT STATS BAR (7 columns / 3 columns layout) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* HUD Analytics Summary */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">TOTAL SPACES</span>
            <p className="font-stat-mono text-lg font-bold text-white">{totalSlots}</p>
          </div>

          <div className="space-y-1">
            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AVAILABLE SPACES</span>
            <p className="font-stat-mono text-lg font-bold text-emerald-400">{availableCount}</p>
          </div>

          <div className="space-y-1">
            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">OCCUPANCY RATE</span>
            <p className="font-stat-mono text-lg font-bold text-white">{occupancyPercent}%</p>
          </div>

          <div className="space-y-1">
            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI NETWORK STATUS</span>
            <span className="text-[10px] font-stat-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> SYSTEM ACTIVE
            </span>
          </div>
        </div>

        {/* Live Vector Line Chart representation */}
        <div className="lg:col-span-3 glass-panel p-4.5 rounded-2xl border border-white/5 flex flex-col justify-between max-h-[140px] overflow-hidden text-left">
          <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">LIVE TELEMETRY FLOW</span>
          <svg className="w-full h-12 mt-2" viewBox="0 0 100 40">
            <path d="M 0 40 Q 25 10 50 25 T 100 8" fill="none" stroke="#00D9FF" strokeWidth="1.5" />
            {/* Chart grid ticks */}
            <line x1="0" y1="35" x2="100" y2="35" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Live Event Timeline log */}
        <div className="lg:col-span-3 glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between max-h-[140px] overflow-hidden">
          <span className="font-nav-text text-[9px] text-slate-400 block mb-2">LIVE EVENTS TIMELINE</span>
          <div className="space-y-2 overflow-y-auto pr-1 flex-1 font-stat-mono text-[8px] text-slate-400">
            {events.map((e) => (
              <div key={e.id} className="flex gap-2 border-l border-[#00D9FF]/20 pl-2 py-0.5">
                <span className="text-[#00D9FF]">{e.time}</span>
                <span className="text-white truncate">{e.text}</span>
              </div>
            ))}
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
        @keyframes pulseSlot {
          0%, 100% {
            stroke: rgba(0, 217, 255, 0.4);
          }
          50% {
            stroke: rgba(0, 217, 255, 1);
          }
        }
        @keyframes blinkSlot {
          0%, 100% {
            stroke: rgba(34, 197, 94, 0.25);
          }
          50% {
            stroke: rgba(34, 197, 94, 1);
          }
        }
        @keyframes blinkSignal {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
}

export default React.memo(ParkingDigitalTwin);
