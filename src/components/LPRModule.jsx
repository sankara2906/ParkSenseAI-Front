import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCpu, 
  FiDatabase, 
  FiCamera, 
  FiShield, 
  FiClock, 
  FiZap, 
  FiCheckCircle, 
  FiFileText,
  FiActivity
} from 'react-icons/fi';

const ocrVehicles = [
  { 
    plate: 'TN47AB1234', 
    vehicle: 'Tesla Model 3', 
    owner: 'Rahul Kumar', 
    slot: 'P12', 
    status: 'Active', 
    entry: '11:42:05 AM', 
    exit: 'Active Session', 
    payment: 'Auto-Paid',
    confidence: 99.6,
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800',
    // Position of license plate on image
    box: { top: '71%', left: '43.5%', width: '13%', height: '5.5%' }
  },
  { 
    plate: 'MH12EV2026', 
    vehicle: 'BMW i4 M50', 
    owner: 'Anjali Sharma', 
    slot: 'P03', 
    status: 'Active', 
    entry: '11:51:12 AM', 
    exit: 'Active Session', 
    payment: 'Auto-Paid',
    confidence: 99.2,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
    box: { top: '63%', left: '46%', width: '9%', height: '5%' }
  },
  { 
    plate: 'KA01MJ4321', 
    vehicle: 'Hyundai Ioniq 5', 
    owner: 'Vikram Singh', 
    slot: 'P08', 
    status: 'Active', 
    entry: '11:58:30 AM', 
    exit: 'Active Session', 
    payment: 'Pending',
    confidence: 98.9,
    image: 'https://images.unsplash.com/photo-1669830913955-4a654924c292?auto=format&fit=crop&q=80&w=800',
    box: { top: '69%', left: '40.5%', width: '16%', height: '6%' }
  }
];

export default function LPRModule() {
  const [ocrIndex, setOcrIndex] = useState(0);
  const [ocrScanning, setOcrScanning] = useState(false);
  const [scanStep, setScanStep] = useState(7); // 0 to 7 steps of OCR pipeline
  const [displayedPlate, setDisplayedPlate] = useState('');
  const [displayedConfidence, setDisplayedConfidence] = useState(99.6);

  const currentVehicle = ocrVehicles[ocrIndex];

  // Rotate vehicles every 8 seconds
  useEffect(() => {
    const mainInterval = setInterval(() => {
      setOcrScanning(true);
      setScanStep(0);
      
      // Step-by-step pipeline sequence simulation
      let step = 0;
      const stepInterval = setInterval(() => {
        step++;
        setScanStep(step);
        if (step >= 7) {
          clearInterval(stepInterval);
          setOcrScanning(false);
        }
      }, 250);

    }, 8500);

    return () => clearInterval(mainInterval);
  }, []);

  // Set next vehicle index when scanning finishes
  useEffect(() => {
    if (ocrScanning && scanStep === 0) {
      setOcrIndex((prev) => (prev + 1) % ocrVehicles.length);
    }
  }, [ocrScanning, scanStep]);

  // Scramble / Decrypt OCR text animation
  useEffect(() => {
    const targetPlate = currentVehicle.plate;
    if (ocrScanning) {
      // Scramble characters randomly during scan
      const interval = setInterval(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*';
        let randomStr = '';
        for (let i = 0; i < targetPlate.length; i++) {
          randomStr += chars[Math.floor(Math.random() * chars.length)];
        }
        setDisplayedPlate(randomStr);
        setDisplayedConfidence(+(Math.random() * 15 + 80).toFixed(1));
      }, 60);
      return () => clearInterval(interval);
    } else {
      // Decrypt and lock in characters left to right
      let currentIteration = 0;
      const totalSteps = targetPlate.length;
      const interval = setInterval(() => {
        if (currentIteration >= totalSteps) {
          setDisplayedPlate(targetPlate);
          setDisplayedConfidence(currentVehicle.confidence);
          clearInterval(interval);
          return;
        }
        
        let result = '';
        for (let i = 0; i < totalSteps; i++) {
          if (i <= currentIteration) {
            result += targetPlate[i];
          } else {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayedPlate(result);
        setDisplayedConfidence(+(currentVehicle.confidence - (totalSteps - currentIteration) * 0.1).toFixed(1));
        currentIteration++;
      }, 70);
      return () => clearInterval(interval);
    }
  }, [ocrScanning, ocrIndex]);

  // Flowchart steps mapping
  const pipelineSteps = [
    { label: 'Live Camera', icon: <FiCamera /> },
    { label: 'AI Detection', icon: <FiActivity /> },
    { label: 'OCR Reading', icon: <FiCpu /> },
    { label: 'Database Lookup', icon: <FiDatabase /> },
    { label: 'Parking Assignment', icon: <FiZap /> },
    { label: 'Entry Time', icon: <FiClock /> },
    { label: 'Exit Time', icon: <FiClock /> },
    { label: 'Payment Status', icon: <FiShield /> }
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-10 items-start text-left w-full animate-[fadeIn_0.4s_ease-out]">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanLaser {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes pulseBorder {
          0%, 100% { border-color: rgba(0, 217, 255, 0.4); box-shadow: 0 0 10px rgba(0, 217, 255, 0.2); }
          50% { border-color: rgba(0, 217, 255, 1); box-shadow: 0 0 25px rgba(0, 217, 255, 0.5); }
        }
      `}} />

      {/* LEFT COLUMN: LIVE OCR VIDEO (68%) */}
      <div className="w-full xl:w-[68%] space-y-8">
        <div className="glass-panel p-8 rounded-[28px] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden bg-[#111827]/40">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#00D9FF] animate-ping"></span>
              <div>
                <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-wider uppercase font-bold">OCR ENGINE</span>
                <h4 className="font-heading font-extrabold text-base text-white mt-0.5">CAMERA_01_LPR (PLATE RECOGNITION)</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-stat-mono text-slate-400">
              <span className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] px-3 py-1 rounded-full uppercase tracking-wider font-bold text-[10px] animate-pulse">
                OCR ACTIVE
              </span>
              <span className="text-white font-bold">LIVE TELEMETRY</span>
            </div>
          </div>

          {/* OCR Scanning Video feed viewport */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
            <img 
              src={currentVehicle.image} 
              className={`w-full h-full object-cover transition-all duration-700 ${ocrScanning ? 'brightness-50 blur-[1px]' : 'brightness-90'}`}
              alt="LPR Feed"
            />
            
            {/* Animated Target Detection Bounding Box */}
            <div 
              style={{
                position: 'absolute',
                top: currentVehicle.box.top,
                left: currentVehicle.box.left,
                width: currentVehicle.box.width,
                height: currentVehicle.box.height,
                animation: ocrScanning ? 'pulseBorder 1.5s infinite' : 'none',
                transition: 'all 0.5s ease-in-out'
              }}
              className="border-2 border-[#00D9FF] rounded-sm bg-cyan-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,255,0.4)]"
            >
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00D9FF] -mt-[2px] -ml-[2px]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00D9FF] -mt-[2px] -mr-[2px]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00D9FF] -mb-[2px] -ml-[2px]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00D9FF] -mb-[2px] -mr-[2px]"></div>

              {/* Scanlaser */}
              {ocrScanning && (
                <div className="absolute left-0 right-0 h-0.5 bg-[#00D9FF] shadow-[0_0_8px_rgba(0,217,255,0.9)]" style={{ animation: 'scanLaser 1.5s ease-in-out infinite' }}></div>
              )}

              {/* YOLO overlay tag */}
              <div className="absolute -top-5 left-0 bg-[#00D9FF] text-[#090B14] font-stat-mono text-[7px] font-extrabold uppercase px-1 rounded">
                YOLO: PLATE {displayedConfidence}%
              </div>
            </div>

            {/* Target lock visualizer text */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[#090B14]/80 border border-white/10 px-4 py-2.5 rounded-xl backdrop-blur-md">
              <span className="font-stat-mono text-[9px] text-[#00D9FF] tracking-wider uppercase font-bold animate-pulse">
                {ocrScanning ? '🤖 RUNNING REAL-TIME OCR ALIGNMENT...' : `🎯 TARGET LOCKED: ${displayedPlate}`}
              </span>
              <span className="font-stat-mono text-[9px] text-emerald-400 font-bold">
                FPS: 60.0 | RES: 1080P
              </span>
            </div>

            <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg border border-white/10 text-[9px] font-stat-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              OCR CONFIDENCE INDEX
            </div>

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4))] pointer-events-none"></div>
          </div>
        </div>

        {/* HIGH-TECH PIPELINE FLOWCHART */}
        <div className="glass-panel p-6 rounded-[24px] border border-white/10 space-y-4 shadow-lg bg-[#111827]/40">
          <div className="flex flex-col text-left">
            <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-wider uppercase font-bold">LPR Operational pipeline</span>
            <h4 className="font-heading font-extrabold text-sm text-white mt-0.5 uppercase">Neural Detection Flow</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 pt-2">
            {pipelineSteps.map((step, idx) => {
              const isPassed = scanStep > idx;
              const isCurrent = scanStep === idx;
              
              let borderStyle = 'border-white/5 bg-[#090B14]/50 text-slate-500';
              let badgeColor = 'bg-slate-800 text-slate-600';
              
              if (isPassed) {
                borderStyle = 'border-emerald-500/20 bg-emerald-950/15 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]';
                badgeColor = 'bg-emerald-500/20 text-emerald-400';
              } else if (isCurrent) {
                borderStyle = 'border-[#00D9FF]/40 bg-[#00D9FF]/5 text-white font-bold shadow-[0_0_15px_rgba(0,217,255,0.15)] animate-[pulse_2s_infinite]';
                badgeColor = 'bg-[#00D9FF] text-[#090B14]';
              }
              
              return (
                <div 
                  key={step.label} 
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center gap-2.5 transition-all duration-300 relative ${borderStyle}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${badgeColor}`}>
                    {step.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-heading font-bold uppercase tracking-wider line-clamp-1">{step.label}</span>
                    <span className="text-[7px] font-stat-mono tracking-widest mt-0.5 block uppercase">
                      {isPassed ? 'OK ✓' : isCurrent ? 'SCANNING' : 'PENDING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: OCR TELEMETRY DETAILS (32%) */}
      <div className="w-full xl:w-[32%] space-y-8">
        
        {/* LPR Telemetry Card */}
        <div className="glass-panel p-6 rounded-[28px] border border-white/10 space-y-6 shadow-2xl bg-[#111827]/40 text-left min-h-[350px] relative overflow-hidden">
          <div className="border-b border-white/10 pb-4">
            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">AI TELEMETRY READOUT</span>
            <h4 className="font-heading font-extrabold text-base text-white mt-0.5">LPR OCR Recognition</h4>
          </div>

          <div className="space-y-4 font-stat-mono text-xs text-slate-400">
            <div className="bg-[#090B14] p-4.5 rounded-xl border border-white/5 space-y-1">
              <span className="text-[9px] uppercase text-slate-500 font-nav-text block">OCR READING</span>
              <span className="text-2xl text-white font-extrabold tracking-wider font-stat-mono">
                {displayedPlate}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] uppercase text-slate-500 block">AI CONFIDENCE</span>
                <span className="text-emerald-400 font-extrabold text-sm">{displayedConfidence}%</span>
              </div>
              <div>
                <span className="text-[8px] uppercase text-slate-500 block">STATUS</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  {ocrScanning ? 'RESOLVING...' : currentVehicle.status}
                </span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] uppercase text-slate-500 block">VEHICLE</span>
                <span className="text-white font-bold">{currentVehicle.vehicle}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase text-slate-500 block">OWNER</span>
                <span className="text-white">{currentVehicle.owner}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[8px] uppercase text-slate-500 block">ASSIGNED SLOT</span>
                <span className="text-[#00D9FF] font-bold">{currentVehicle.slot}</span>
              </div>
              <div>
                <span className="text-[8px] uppercase text-slate-500 block">PAYMENT STATUS</span>
                <span className={`font-bold ${currentVehicle.payment === 'Auto-Paid' ? 'text-emerald-400' : 'text-yellow-500'}`}>
                  {currentVehicle.payment}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DB Lookup Timeline Panel */}
        <div className="glass-panel p-6 rounded-[28px] border border-white/10 space-y-4 shadow-2xl bg-[#111827]/40 text-left">
          <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">AI DB LOOKUP PIPELINE</span>
          
          <div className="space-y-3 font-stat-mono text-[10px] text-slate-400">
            <div className="flex items-center justify-between border-l-2 border-emerald-500 pl-3">
              <span>Live Camera Feed Connected</span>
              <span className="text-emerald-400 font-bold">OK</span>
            </div>

            <div className="flex items-center justify-between border-l-2 border-emerald-500 pl-3">
              <span>AI Vehicle Detection</span>
              <span className="text-emerald-400 font-bold">{scanStep >= 1 ? 'OK' : 'PENDING'}</span>
            </div>

            <div className="flex items-center justify-between border-l-2 border-emerald-500 pl-3">
              <span>OCR Reading Scan</span>
              <span className="text-emerald-400 font-bold">
                {scanStep >= 2 ? (ocrScanning ? 'SCANNING...' : 'DONE') : 'PENDING'}
              </span>
            </div>

            <div className="flex items-center justify-between border-l-2 border-[#00D9FF] pl-3">
              <span>Registry database lookup</span>
              <span className="text-white">
                {scanStep >= 3 ? (ocrScanning ? 'SEARCHING...' : currentVehicle.owner) : 'PENDING'}
              </span>
            </div>

            <div className="flex items-center justify-between border-l-2 border-[#00D9FF] pl-3">
              <span>Parking allocation</span>
              <span className="text-[#00D9FF] font-bold">
                {scanStep >= 4 ? (ocrScanning ? 'ASSIGNING...' : currentVehicle.slot) : 'PENDING'}
              </span>
            </div>

            <div className="border-t border-white/5 pt-2 flex justify-between pl-3 text-slate-500">
              <span>ENTRY TIME:</span>
              <span className="text-white font-bold">
                {scanStep >= 5 ? currentVehicle.entry : 'PENDING'}
              </span>
            </div>

            <div className="flex justify-between pl-3 text-slate-500">
              <span>EXIT TIME:</span>
              <span className="text-slate-500">
                {scanStep >= 6 ? currentVehicle.exit : 'PENDING'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
