import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { 
  FiCpu, FiTv, FiCalendar, FiActivity, FiMapPin, 
  FiLayers, FiChevronDown, FiTrendingUp, FiShield, FiArrowRight, FiZap 
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AIBackground from '../../components/AIBackground';
import SmartParkingVisualizer from '../../components/SmartParkingVisualizer';
import HowItWorksVisualizer from '../../components/HowItWorksVisualizer';

export default function Landing({ navigate }) {
  // Slots for the interactive preview inside the Scene 6 Demo container
  const [demoSlots, setDemoSlots] = useState([
    { id: 'S1', status: 'Available', position: [-3, 0, -1.8] },
    { id: 'S2', status: 'Occupied', position: [-1, 0, -1.8] },
    { id: 'S3', status: 'Available', position: [1, 0, -1.8] },
    { id: 'S4', status: 'Reserved', position: [3, 0, -1.8] },
    { id: 'S5', status: 'Available', position: [-3, 0, 1.8] },
    { id: 'S6', status: 'Occupied', position: [-1, 0, 1.8] },
    { id: 'S7', status: 'Available', position: [1, 0, 1.8] },
    { id: 'S8', status: 'Occupied', position: [3, 0, 1.8] },
  ]);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll (ensures smooth scrolling)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleDemoSlotClick = (slot) => {
    setDemoSlots(prev => prev.map(s => {
      if (s.id === slot.id) {
        return {
          ...s,
          status: s.status === 'Available' ? 'Reserved' : s.status === 'Reserved' ? 'Available' : s.status
        };
      }
      return s;
    }));
  };

  return (
    <div className="relative w-full bg-[#090B14] text-[#F8FAFC] overflow-x-hidden">
      {/* HUD Navbar */}
      <Navbar navigate={navigate} />

      {/* PREMIUM ANIMATED AI BACKGROUND */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <AIBackground />
      </div>

      {/* ======================================================== */}
      {/* SCENE 1 — HERO SECTION (FULL SCREEN) */}
      {/* ======================================================== */}
      <section id="hero" className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 z-20 gap-8 pt-24 max-w-[1500px] mx-auto w-full">
        {/* Left Column: Typography Header */}
        <div className="space-y-6 text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#00CFFF]/5 border border-[#00CFFF]/20 font-nav-text text-[10px] text-[#00CFFF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00CFFF] animate-pulse"></span>
            Orchestrating Urban Spaces
          </div>
          
          <h1 className="font-hero-title text-5xl md:text-8xl tracking-[-0.03em] leading-[0.9] uppercase text-white">
            Find Smarter.<br />
            Park Faster.
          </h1>
          
          <p className="font-body-text text-sm md:text-lg max-w-xl text-slate-300 leading-relaxed">
            Meet the next generation of parking. Web-native routing analytics, YOLOv8 CCTV scanning streams, and real-time interactive reservation dashboards.
          </p>
          
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => navigate('/login')}
              className="neon-glow-btn font-button-text text-xs rounded-full px-8 py-3.5 border border-[#00CFFF]/50 text-[#00CFFF] bg-[#00CFFF]/5 hover:bg-[#00CFFF] hover:text-[#090B14] transition-all"
            >
              LOGIN
            </button>
            <button className="font-button-text text-xs hover:text-[#00CFFF] border border-white/10 hover:border-[#00CFFF] px-8 py-3.5 rounded-full transition-all">
              WATCH DEMO
            </button>
          </div>
        </div>

        {/* Right Column: Blueprint-style Routing SVG Visualization */}
        <div className="flex-1 w-full max-w-[450px] lg:max-w-[500px] h-[450px] relative z-20">
          <SmartParkingVisualizer />
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 2 — THE PROBLEM (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="problem" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="max-w-xl space-y-6">
          <h2 className="font-section-title text-3xl md:text-5xl uppercase text-white">
            Finding Parking<br />
            Shouldn't Be This<br />
            <span className="text-red-400">Difficult.</span>
          </h2>
          <p className="font-body-text text-sm md:text-base">
            Every day, millions of drivers circle urban gridlocks, pumping CO2 into the air and wasting valuable hours. Finding a spot is a chaotic guessing game.
          </p>

          <div className="grid grid-cols-2 gap-8 pt-2">
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-red-500 shadow-lg">
              <p className="font-stat-mono text-3xl font-bold text-white">12 <span className="text-xs font-normal font-sans text-white/50">MINS</span></p>
              <p className="text-[10px] font-nav-text text-slate-500 mt-1">AVG SEARCH TIME</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-red-500 shadow-lg">
              <p className="font-stat-mono text-3xl font-bold text-white">30%</p>
              <p className="text-[10px] font-nav-text text-slate-500 mt-1">CITY TRAFFIC FROM PARKING SEARCH</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 3 — OUR SOLUTION (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="solution" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="space-y-8">
          <div>
            <h2 className="font-section-title text-3xl md:text-5xl uppercase text-white">
              Meet ParkSense <span className="text-[#00CFFF]">AI</span>
            </h2>
            <p className="font-body-text text-sm max-w-lg mt-2">
              An intelligent, real-time spatial network that tracks, predicts, and reserves parking spaces autonomously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-xl space-y-3 cursor-pointer shadow-lg">
              <FiCpu className="text-[#00CFFF] text-2xl" />
              <h4 className="font-heading font-bold text-sm text-white">AI DETECTION</h4>
              <p className="font-body-text text-xs text-slate-500 leading-normal">YOLOv8 networks scanning camera streams to instantly locate vacant spots.</p>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-3 cursor-pointer shadow-lg">
              <FiTv className="text-[#00CFFF] text-2xl" />
              <h4 className="font-heading font-bold text-sm text-white">LIVE CCTV TELEMETRY</h4>
              <p className="font-body-text text-xs text-slate-500 leading-normal">High-speed RTSP feed analysis keeping a live dashboard up to date.</p>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-3 cursor-pointer shadow-lg">
              <FiCalendar className="text-[#00CFFF] text-2xl" />
              <h4 className="font-heading font-bold text-sm text-white">SMART RESERVATIONS</h4>
              <p className="font-body-text text-xs text-slate-500 leading-normal">Lock your parking node from your mobile browser before arrival.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 4 — HOW IT WORKS (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="how-it-works" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Workflow Steps */}
          <div className="space-y-8">
            <h2 className="font-section-title text-3xl md:text-5xl uppercase text-white">
              HOW IT WORKS
            </h2>

            <div className="relative border-l border-[#00CFFF]/20 pl-8 space-y-8 py-2">
              <div className="relative">
                <span className="absolute -left-11 top-1 w-6 h-6 rounded-full bg-[#090B14] border border-[#00CFFF] flex items-center justify-center text-xs text-[#00CFFF] font-stat-mono font-bold">1</span>
                <h4 className="font-heading font-bold text-sm text-white">CAMERA FEED ACCESS</h4>
                <p className="font-body-text text-xs text-slate-500 mt-1 max-w-md">Our cloud nodes tap into standard facility surveillance lines via secure RTSP tunnels.</p>
              </div>
              
              <div className="relative">
                <span className="absolute -left-11 top-1 w-6 h-6 rounded-full bg-[#090B14] border border-[#00CFFF] flex items-center justify-center text-xs text-[#00CFFF] font-stat-mono font-bold">2</span>
                <h4 className="font-heading font-bold text-sm text-white">YOLOv8 AI CLASSIFICATION</h4>
                <p className="font-body-text text-xs text-slate-500 mt-1 max-w-md">Edge systems execute visual checks, plotting box contours over vehicles and empty spaces.</p>
              </div>

              <div className="relative">
                <span className="absolute -left-11 top-1 w-6 h-6 rounded-full bg-[#090B14] border border-[#00CFFF] flex items-center justify-center text-xs text-[#00CFFF] font-stat-mono font-bold">3</span>
                <h4 className="font-heading font-bold text-sm text-white">DATABASE TELEMETRY SYNC</h4>
                <p className="font-body-text text-xs text-slate-500 mt-1 max-w-md">Synchronize telemetry data in real-time with our secure cloud datastores, instantly dispatching navigation guides to dashboards.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Parallax HowItWorksVisualizer */}
          <div className="w-full relative z-20">
            <HowItWorksVisualizer />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 5 — AI DETECTION VIEW (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="ai-detection" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="max-w-xl space-y-6">
          <h2 className="font-section-title text-3xl md:text-5xl uppercase text-white">
            AI CCTV DETECTION
          </h2>
          <p className="font-body-text text-sm md:text-base">
            Automated image parsing filters objects and detects plate numbers within 12 milliseconds, updating databases and dashboards simultaneously.
          </p>
          <div className="p-4 bg-white/5 border border-white/5 rounded-xl font-stat-mono text-[10px] text-slate-400 space-y-2">
            <p className="text-[#00CFFF]">[AI CHECK] Bounding boxes resolved. Accuracy 98.9%.</p>
            <p className="text-emerald-400">[DETECTION] License Plate: 7X89-US (Confidence: 99.4%)</p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 6 — LIVE CCTV DEMO (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="demo" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-nav-text text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Interactive Lot
            </div>
            <h2 className="font-section-title text-3xl md:text-5xl uppercase leading-tight text-white">
              RESERVATION DEMO
            </h2>
            <p className="font-body-text text-xs md:text-sm">
              Test the integration! Hover and click on vacant spots inside the 2D layout grid to toggle reservations manually.
            </p>
          </div>

          {/* Premium 2D interactive layout grid */}
          <div className="lg:col-span-3 p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between min-h-[320px] shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="font-nav-text text-[9px] text-[#00CFFF]">REAL-TIME TELEMETRY ON</span>
              <span className="font-stat-mono text-[10px] text-slate-500">interactive dashboard</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 flex-1">
              {demoSlots.map((slot) => {
                const isAvailable = slot.status === 'Available';
                const isReserved = slot.status === 'Reserved';
                
                let cardColor = 'border-slate-800 text-slate-500 hover:border-[#00CFFF]/30';
                let indicator = 'bg-slate-700';

                if (isAvailable) {
                  cardColor = 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(34,197,94,0.08)]';
                  indicator = 'bg-emerald-500 animate-pulse';
                } else if (isReserved) {
                  cardColor = 'border-blue-500/20 text-[#00CFFF] hover:border-blue-500/60';
                  indicator = 'bg-[#00CFFF]';
                } else {
                  cardColor = 'border-red-500/20 text-red-400 bg-red-950/5';
                  indicator = 'bg-red-500';
                }

                return (
                  <button
                    key={slot.id}
                    onClick={() => handleDemoSlotClick(slot)}
                    disabled={slot.status === 'Occupied'}
                    className={`relative border-l-2 border-r-2 h-20 flex flex-col justify-between items-center p-3 rounded-lg transition-all duration-300 transform hover:scale-[1.03] ${cardColor}`}
                  >
                    <span className="font-stat-mono text-[10px] font-bold">{slot.id}</span>
                    <div className="w-full text-center">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${indicator}`}></span>
                      <p className="text-[7px] font-sans text-slate-400 mt-0.5 uppercase font-semibold">
                        {slot.status}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 text-[9px] font-sans text-slate-500 text-center">
              Click on available (green) spaces to toggle reservation state.
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 7 — RESERVATION (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="reservation" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="max-w-xl space-y-6">
          <h2 className="font-section-title text-3xl md:text-5xl uppercase text-white">
            Smart Parking Reservations
          </h2>
          <p className="font-body-text text-sm md:text-base">
            Reserve and lock specific parking space nodes directly from your device before arrival to ensure seamless parking availability.
          </p>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 8 — TECHNOLOGY STACK (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="technology" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="max-w-4xl mx-auto w-full space-y-8 text-center">
          <h2 className="font-section-title text-3xl md:text-5xl uppercase text-white">
            THE TECHNOLOGY STACK
          </h2>
          <p className="font-body-text text-xs md:text-sm max-w-lg mx-auto text-slate-400">
            ParkSense AI operates on state-of-the-art frameworks to deliver sub-millisecond telemetry response speeds.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pt-4 font-nav-text text-xs tracking-widest">
            <div className="glass-card py-6 rounded-xl flex flex-col items-center gap-3 shadow-lg">
              <div className="text-2xl text-[#00CFFF]"><FiCpu /></div>
              <span>REACT</span>
            </div>
            <div className="glass-card py-6 rounded-xl flex flex-col items-center gap-3 shadow-lg">
              <div className="text-2xl text-[#00CFFF]"><FiLayers /></div>
              <span>TAILWIND</span>
            </div>
            <div className="glass-card py-6 rounded-xl flex flex-col items-center gap-3 shadow-lg">
              <div className="text-2xl text-[#00CFFF]"><FiCpu /></div>
              <span>FASTAPI</span>
            </div>
            <div className="glass-card py-6 rounded-xl flex flex-col items-center gap-3 shadow-lg">
              <div className="text-2xl text-[#00CFFF]"><FiTv /></div>
              <span>YOLOv8</span>
            </div>
            <div className="glass-card py-6 rounded-xl flex flex-col items-center gap-3 shadow-lg">
              <div className="text-2xl text-[#00CFFF]"><FiActivity /></div>
              <span>OPENCV</span>
            </div>
            <div className="glass-card py-6 rounded-xl flex flex-col items-center gap-3 shadow-lg">
              <div className="text-2xl text-[#00CFFF]"><FiShield /></div>
              <span>SQLITE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 9 — STATISTICS OVERVIEW (CONTENT-BASED HEIGHT, PY-20) */}
      {/* ======================================================== */}
      <section id="statistics" className="relative py-20 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="glass-panel p-8 rounded-2xl text-center space-y-2 border-t-2 border-[#00CFFF] shadow-xl">
            <p className="font-stat-mono text-4xl md:text-6xl font-extrabold text-white">98%</p>
            <p className="font-nav-text text-[10px] text-slate-500 uppercase">Detection Accuracy</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl text-center space-y-2 border-t-2 border-[#00CFFF] shadow-xl">
            <p className="font-stat-mono text-4xl md:text-6xl font-extrabold text-white">120+</p>
            <p className="font-nav-text text-[10px] text-slate-500 uppercase">Parking Slots</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl text-center space-y-2 border-t-2 border-[#00CFFF] shadow-xl">
            <p className="font-stat-mono text-4xl md:text-6xl font-extrabold text-white">500+</p>
            <p className="font-nav-text text-[10px] text-slate-500 uppercase">Reservations / Day</p>
          </div>

          <div className="glass-panel p-8 rounded-2xl text-center space-y-2 border-t-2 border-[#00CFFF] shadow-xl">
            <p className="font-stat-mono text-4xl md:text-6xl font-extrabold text-white">24/7</p>
            <p className="font-nav-text text-[10px] text-slate-500 uppercase">Active Monitoring</p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SCENE 10 — CALL TO ACTION (CONTENT-BASED HEIGHT, PY-24) */}
      {/* ======================================================== */}
      <section className="relative py-24 z-20 max-w-[1500px] mx-auto w-full px-6 md:px-12 flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00CFFF]/5 rounded-full filter blur-[120px] pointer-events-none"></div>

        <div className="max-w-2xl space-y-8 relative z-10">
          <h2 className="font-hero-title text-4xl md:text-6xl uppercase tracking-[-0.03em] leading-[0.9] text-white">
            The Future Of Parking<br />
            <span className="gradient-text-neon text-neon">Starts Here.</span>
          </h2>
          
          <p className="font-body-text text-xs md:text-sm max-w-md mx-auto">
            Ready to upgrade your municipal structure, parking garage, or commercial complex? Establish your control center instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="neon-glow-btn font-button-text text-xs rounded-full px-8 py-4 border border-[#00CFFF]/50 text-[#00CFFF] bg-[#00CFFF]/5 hover:bg-[#00CFFF] hover:text-[#090B14] transition-colors"
            >
              LAUNCH MANAGEMENT NODE
            </button>
            <button className="border border-white/10 hover:border-[#00CFFF] text-white hover:text-[#00CFFF] font-button-text text-xs px-8 py-4 rounded-full transition-all">
              TALK TO AN ENGINEER
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
