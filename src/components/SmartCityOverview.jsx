import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Zap, 
  Tv, 
  Database, 
  TrendingUp, 
  Users, 
  Cpu, 
  Activity 
} from 'lucide-react';

const BUILDING_TOWERS = [
  {
    id: 'mall',
    sector: 'Shopping Malls',
    facility: 'Phoenix Marketcity',
    title: 'Phoenix Mall Parking Tower',
    icon: '🛍️',
    slots: '142 / 600',
    pct: 76,
    revenue: '₹48,200',
    aiHealth: '99.4%',
    cctv: '24 nodes active'
  },
  {
    id: 'airport',
    sector: 'Airports',
    facility: 'Chennai Airport T4',
    title: 'Terminal 4 Airport Parking',
    icon: '✈️',
    slots: '412 / 1200',
    pct: 65,
    revenue: '₹1,24,000',
    aiHealth: '99.8%',
    cctv: '64 nodes active'
  },
  {
    id: 'railway',
    sector: 'Railway Stations',
    facility: 'Chennai Central Station',
    title: 'Railway Hub Parking Terminal',
    icon: '🚉',
    slots: '85 / 800',
    pct: 89,
    revenue: '₹89,500',
    aiHealth: '99.1%',
    cctv: '32 nodes active'
  },
  {
    id: 'hospital',
    sector: 'Hospitals',
    facility: 'Apollo Hospitals',
    title: 'Apollo General Hospital Deck',
    icon: '🏥',
    slots: '214 / 850',
    pct: 74,
    revenue: '₹52,000',
    aiHealth: '99.7%',
    cctv: '20 nodes active'
  },
  {
    id: 'office',
    sector: 'IT Parks',
    facility: 'Tidel Park IT Hub',
    title: 'Tidel IT Park Office Block',
    icon: '🏢',
    slots: '430 / 1500',
    pct: 71,
    revenue: '₹1,85,000',
    aiHealth: '99.9%',
    cctv: '80 nodes active'
  },
  {
    id: 'university',
    sector: 'Colleges',
    facility: 'Anna University Campus',
    title: 'University Campus Parking',
    icon: '🎓',
    slots: '180 / 500',
    pct: 64,
    revenue: '₹12,400',
    aiHealth: '98.9%',
    cctv: '12 nodes active'
  }
];

export default function SmartCityOverview({ onSelectBuilding }) {
  return (
    <div className="space-y-6 w-full text-left relative">
      
      {/* Dynamic Smart City header banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[#00D9FF]/3 pointer-events-none filter blur-2xl"></div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#00D9FF] tracking-widest font-extrabold uppercase animate-pulse">
            🌐 Urban Command Deck
          </span>
          <h2 className="text-xl font-heading font-extrabold text-white mt-0.5">Smart City Parking Overview</h2>
          <p className="text-xs text-slate-400 font-sans max-w-lg">
            Monitor real-time occupancy status, traffic load profiles, and automated financial cash flows across all major public parking infrastructures.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <div className="bg-[#090B14]/80 border border-white/5 px-4 py-2.5 rounded-xl text-center font-mono min-w-[90px]">
            <span className="text-[7.5px] text-slate-500 uppercase block font-bold">Active Hubs</span>
            <span className="text-white font-extrabold text-base block mt-0.5">6 Hubs</span>
          </div>
          <div className="bg-[#090B14]/80 border border-white/5 px-4 py-2.5 rounded-xl text-center font-mono min-w-[90px]">
            <span className="text-[7.5px] text-slate-500 uppercase block font-bold">Total Slots</span>
            <span className="text-[#00D9FF] font-extrabold text-base block mt-0.5">5,450</span>
          </div>
        </div>
      </div>

      {/* Grid towers blocks with increased spacing (24px to 32px) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {BUILDING_TOWERS.map((b) => (
          <div
            key={b.id}
            onClick={() => onSelectBuilding(b.sector, b.facility)}
            className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#00D9FF]/30 bg-[#111827]/20 hover:bg-[#111827]/40 transition-all duration-300 shadow-xl cursor-pointer group flex flex-col justify-between gap-4 relative overflow-hidden"
          >
            {/* Corner hover glow effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#00D9FF]/3 rounded-bl-full pointer-events-none group-hover:bg-[#00D9FF]/6 transition-colors" />

            {/* Title / Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#00D9FF]/10 flex items-center justify-center text-xl transition-all duration-300 shadow-inner shrink-0">
                {b.icon}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-mono text-[#00D9FF] uppercase tracking-wider block font-bold">{b.sector}</span>
                <h4 className="font-heading font-extrabold text-sm text-white mt-0.5 group-hover:text-[#00D9FF] transition-colors truncate">
                  {b.facility}
                </h4>
              </div>
            </div>

            {/* Slots Occupancy Telemetry Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>Available slots</span>
                <span className="text-white font-bold">{b.slots}</span>
              </div>
              
              <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 bottom-0 rounded-full transition-all duration-500 ${
                    b.pct > 80 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]'
                  }`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono text-slate-500">
                <span>Occupancy rate</span>
                <span>{b.pct}% filled</span>
              </div>
            </div>

            {/* Telemetry Grid details (Simplified grid of 4 vital stats) */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3 font-mono text-[9px] text-slate-500">
              
              <div className="space-y-0.5 text-left">
                <span className="block text-[7.5px] uppercase tracking-wide">AI Core Health</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <Cpu size={10} className="text-[#00D9FF]" /> {b.aiHealth}
                </span>
              </div>

              <div className="space-y-0.5 text-left">
                <span className="block text-[7.5px] uppercase tracking-wide">Daily Revenue</span>
                <span className="text-emerald-400 font-extrabold block">
                  {b.revenue}
                </span>
              </div>

              <div className="space-y-0.5 text-left col-span-2 border-t border-white/5 pt-2 flex justify-between items-center">
                <span className="block text-[7.5px] uppercase tracking-wide">Surveillance Feed</span>
                <span className="text-white font-bold flex items-center gap-1 text-[8.5px]">
                  <Tv size={10} className="text-emerald-400" /> {b.cctv}
                </span>
              </div>

            </div>

            {/* Footer Rounded Button */}
            <div className="border-t border-white/5 pt-3 mt-1 text-center">
              <span className="w-full h-9 rounded-full bg-[#00D9FF]/10 group-hover:bg-[#00D9FF] group-hover:text-[#090B14] border border-[#00D9FF]/20 text-[#00D9FF] transition-all duration-300 font-semibold text-xs flex items-center justify-center gap-1">
                Open Live View →
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
