import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  ArrowLeft,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Activity,
  CreditCard,
  Layers,
  Cpu,
  RefreshCw,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SIMULATED ANALYTICS HISTORIC DATA
───────────────────────────────────────────── */
const revenueTrendData = [
  { day: 'Mon', revenue: 12400 },
  { day: 'Tue', revenue: 14200 },
  { day: 'Wed', revenue: 13800 },
  { day: 'Thu', revenue: 16500 },
  { day: 'Fri', revenue: 18200 },
  { day: 'Sat', revenue: 22400 },
  { day: 'Sun', revenue: 20900 },
];

const occupancyVsRevenue = [
  { time: '08:00', occupancy: 42, revenue: 3200 },
  { time: '10:00', occupancy: 78, revenue: 5800 },
  { time: '12:00', occupancy: 85, revenue: 6400 },
  { time: '14:00', occupancy: 65, revenue: 4900 },
  { time: '16:00', occupancy: 58, revenue: 4200 },
  { time: '18:00', occupancy: 92, revenue: 8100 },
  { time: '20:00', occupancy: 80, revenue: 6200 },
];

const peakHoursData = [
  { hour: '09:00', transactions: 124 },
  { hour: '11:00', transactions: 156 },
  { hour: '13:00', transactions: 98 },
  { hour: '15:00', transactions: 84 },
  { hour: '17:00', transactions: 210 },
  { hour: '19:00', transactions: 185 },
];

const paymentBreakdown = [
  { name: 'UPI ID', value: 45, color: '#00D9FF' },
  { name: 'Google Pay', value: 25, color: '#10B981' },
  { name: 'PhonePe', value: 15, color: '#A855F7' },
  { name: 'Credit/Debit Card', value: 15, color: '#3B82F6' },
];

const locationPerformance = [
  { name: 'Phoenix Marketcity', revenue: 124000, occupancy: 84, trend: '+12.4%' },
  { name: 'Airport Terminal 2', revenue: 112500, occupancy: 91, trend: '+8.6%' },
  { name: 'Fortis Hospital', revenue: 84000, occupancy: 68, trend: '+3.1%' },
  { name: 'Hitech IT Park', revenue: 78400, occupancy: 74, trend: '-2.4%' },
  { name: 'Cricket Stadium Bay', revenue: 54000, occupancy: 95, trend: '+22.1%' },
];

export default function ProfitDashboard({ navigate }) {
  const [filterRange, setFilterRange] = useState('7D'); // 'TODAY' | '7D' | '30D' | 'ALL'
  const [liveRevenue, setLiveRevenue] = useState(482900);
  const [exporting, setExporting]     = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Live revenue counter simulation increments
  useEffect(() => {
    const interval = setInterval(() => {
      const inc = Math.floor(Math.random() * 80) + 40; // ₹40 - ₹120 increments
      setLiveRevenue(prev => prev + inc);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setExportSuccess(false);
    await new Promise(r => setTimeout(r, 1800));
    setExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Dynamically calculate metrics based on filterRange selection
  const metrics = useMemo(() => {
    const baseMult = filterRange === 'TODAY' ? 0.15 : filterRange === '30D' ? 3.8 : filterRange === 'ALL' ? 12.5 : 1;
    return {
      total: Math.round(liveRevenue * baseMult),
      today: 14250,
      weekly: 98400,
      monthly: 412000,
    };
  }, [liveRevenue, filterRange]);

  return (
    <div className="relative min-h-screen bg-[#050816] text-left p-6 md:p-10 overflow-x-hidden font-sans">
      
      {/* Decorative Grid & neon ambient glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none" />

      {/* ── TOP HEADER SECTION ── */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-white/10 relative z-10">
        
        {/* Navigation back button */}
        <div className="space-y-3">
          <motion.button 
            onClick={() => navigate('/dashboard')} 
            whileHover={{ scale: 1.03, x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 font-mono text-[10px] text-slate-400 hover:text-[#00D9FF] transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
          >
            <ArrowLeft size={11} strokeWidth={2.5} /> BACK TO OPERATIONS
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center">
              <TrendingUp className="text-[#00D9FF] animate-pulse" size={20} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[8px] text-[#00D9FF] uppercase tracking-[0.2em] font-bold block font-mono">FINANCIAL CONTROL TERMINAL</span>
              <h1 className="text-xl md:text-2xl font-extrabold text-white font-heading uppercase tracking-tight">Profit &amp; Revenue Analytics</h1>
            </div>
          </div>
        </div>

        {/* Action controllers (date filters + export) */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Date Filter Tabs */}
          <div className="flex bg-[#090B14]/80 p-1 rounded-xl border border-white/10 shrink-0">
            {[
              { id: 'TODAY', label: '1D' },
              { id: '7D', label: '7D' },
              { id: '30D', label: '30D' },
              { id: 'ALL', label: 'ALL TIME' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setFilterRange(tab.id)}
                className={`text-[9px] font-mono px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                  filterRange === tab.id
                    ? 'bg-[#00D9FF] text-[#090B14] shadow-[0_0_10px_rgba(0,217,255,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Report trigger button */}
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-mono text-[10px] font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,217,255,0.05)] disabled:opacity-50 uppercase tracking-wider ml-auto lg:ml-0"
          >
            {exporting ? (
              <>
                <RefreshCw size={12} className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={12} strokeWidth={2.5} />
                Export CSV/PDF
              </>
            )}
          </button>

          {/* Export success banner popup */}
          <AnimatePresence>
            {exportSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-full mt-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl text-[10px] font-mono flex items-center gap-2 shadow-2xl backdrop-blur"
              >
                <Sparkles size={11} /> ✓ FINANCIAL REPORT DOWNLOAD STARTED SUCCESSFULLY
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* ── TOP STATS GRID ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 relative z-10">
        
        {/* Total Live Revenue Counter card */}
        <div className="glass-panel p-5 rounded-2xl border border-[#00D9FF]/20 bg-[#111827]/40 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-3 text-[#00D9FF]/20">
            <DollarSign size={40} />
          </div>
          <span className="text-[9px] text-[#00D9FF] font-bold font-mono tracking-widest block uppercase">LIVE SYSTEM REVENUE</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-mono">
              ₹{metrics.total.toLocaleString('en-IN')}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0 mb-1" />
          </div>
          <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">Updates automatically every 4.5s</p>
        </div>

        {/* Today's Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-3 text-slate-700/25">
            <Clock size={40} />
          </div>
          <span className="text-[9px] text-slate-500 font-bold font-mono tracking-widest block uppercase">TODAY'S REVENUE</span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            ₹{metrics.today.toLocaleString('en-IN')}
          </h3>
          <p className="text-[9px] text-emerald-400 font-mono mt-1 uppercase flex items-center gap-1">
            <ArrowUpRight size={10} /> +8.4% since yesterday
          </p>
        </div>

        {/* Weekly Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-3 text-slate-700/25">
            <Calendar size={40} />
          </div>
          <span className="text-[9px] text-slate-500 font-bold font-mono tracking-widest block uppercase">WEEKLY STATS</span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            ₹{metrics.weekly.toLocaleString('en-IN')}
          </h3>
          <p className="text-[9px] text-[#00D9FF] font-mono mt-1 uppercase flex items-center gap-1">
            <ArrowUpRight size={10} /> optimal utilization active
          </p>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-3 text-slate-700/25">
            <Layers size={40} />
          </div>
          <span className="text-[9px] text-slate-500 font-bold font-mono tracking-widest block uppercase">MONTHLY ACCUMULATED</span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mt-2 font-mono">
            ₹{metrics.monthly.toLocaleString('en-IN')}
          </h3>
          <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">Monthly goal threshold: 92%</p>
        </div>

      </section>

      {/* ── CHARTS SECTION (2 COLUMNS) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 relative z-10">
        
        {/* CHART 1: Revenue growth trend */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Revenue Growth Trend</h3>
            </div>
            <span className="text-[8px] font-mono text-slate-500 uppercase">WEEKLY HISTORY OVERVIEW</span>
          </div>
          <div className="h-[260px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Occupancy rate vs Hourly Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Occupancy vs Revenue Analytics</h3>
            </div>
            <span className="text-[8px] font-mono text-slate-500 uppercase">HOURLY EFFICIENCY RATIO</span>
          </div>
          <div className="h-[260px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyVsRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="revenue" fill="#00D9FF" radius={[4, 4, 0, 0]} name="Hourly Revenue (₹)" />
                <Line type="monotone" dataKey="occupancy" stroke="#10B981" strokeWidth={2} name="Occupancy Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* ── LOWER CHARTS AND LISTS SECTION ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 relative z-10">
        
        {/* CHART 3: Payment method breakdown (Pie) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Payment Method Split</h3>
            </div>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val}%`} contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend labels */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-mono border-t border-white/5 pt-3">
            {paymentBreakdown.map(pm => (
              <div key={pm.name} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pm.color }} />
                <span className="text-slate-500 uppercase truncate">{pm.name}</span>
                <span className="text-white font-bold ml-auto">{pm.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 4: Peak Hours Transactions (Bar) */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Peak Hours Transactions</h3>
            </div>
          </div>
          <div className="h-[210px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: 'rgba(255,255,255,0.08)' }} />
                <Bar dataKey="transactions" fill="#A855F7" radius={[4, 4, 0, 0]} name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LIST 5: Top Performing Parking Locations */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/40 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Venue Performance</h3>
            </div>
            <span className="text-[8px] font-mono text-emerald-400 font-bold">LIVE METRICS</span>
          </div>

          <div className="divide-y divide-white/5 font-mono text-[9px] space-y-2.5">
            {locationPerformance.map((loc, idx) => (
              <div key={loc.name} className="flex items-center justify-between pt-2.5 first:pt-0">
                <div className="min-w-0">
                  <span className="text-white font-bold block truncate">{loc.name}</span>
                  <span className="text-slate-500 uppercase tracking-wide">Occupancy: {loc.occupancy}%</span>
                </div>
                <div className="text-right">
                  <span className="text-[#00D9FF] font-bold block font-mono">₹{loc.revenue.toLocaleString('en-IN')}</span>
                  <span className={`text-[8px] font-bold ${loc.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                    {loc.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── FOOTER GUIDELINES ── */}
      <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-slate-500 relative z-10">
        <span>PARKSENSE FINANCIAL SERVICES DECK V3.0</span>
        <span className="text-[#00D9FF] font-bold animate-pulse">📡 SECURE SSL ENCRYPTED CONNECTION</span>
      </footer>

    </div>
  );
}
