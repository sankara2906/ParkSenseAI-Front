import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import { 
  FiTrendingUp, FiActivity, FiCpu, FiCheckCircle, FiDatabase, 
  FiServer, FiRadio, FiClock, FiGrid, FiArrowUpRight, FiSliders, FiAlertCircle 
} from 'react-icons/fi';

// Simulated 24-hour occupancy data (Historic)
const occupancyHistory = [
  { time: '06:00', rate: 35 },
  { time: '08:00', rate: 58 },
  { time: '10:00', rate: 74 },
  { time: '12:00', rate: 82 },
  { time: '14:00', rate: 68 },
  { time: '16:00', rate: 79 },
  { time: '18:00', rate: 88 },
  { time: '20:00', rate: 62 },
  { time: '22:00', rate: 45 },
  { time: '00:00', rate: 30 },
  { time: '02:00', rate: 18 },
  { time: '04:00', rate: 22 },
];

// Simulated 24-hour predicted occupancy data (Future)
const predictedOccupancyData = [
  { time: '06:00', actual: 35, predicted: 38 },
  { time: '08:00', actual: 58, predicted: 62 },
  { time: '10:00', actual: 74, predicted: 84 },
  { time: '12:00', actual: 82, predicted: 89 },
  { time: '14:00', actual: 68, predicted: 72 },
  { time: '16:00', actual: 79, predicted: 83 },
  { time: '18:00', actual: 88, predicted: 92 },
  { time: '20:00', actual: 62, predicted: 68 },
  { time: '22:00', actual: null, predicted: 50 },
  { time: '00:00', actual: null, predicted: 32 },
  { time: '02:00', actual: null, predicted: 20 },
  { time: '04:00', actual: null, predicted: 25 },
];

// Simulated daily demand forecast
const dailyDemandData = [
  { hour: '06:00', demand: 150 },
  { hour: '08:00', demand: 420 },
  { hour: '10:00', demand: 610 },
  { hour: '12:00', demand: 680 },
  { hour: '14:00', demand: 490 },
  { hour: '16:00', demand: 620 },
  { hour: '18:00', demand: 780 },
  { hour: '20:00', demand: 450 },
];

// Predicted weekly trend
const predictedWeeklyData = [
  { day: 'Mon', capacity: 74 },
  { day: 'Tue', capacity: 78 },
  { day: 'Wed', capacity: 84 },
  { day: 'Thu', capacity: 80 },
  { day: 'Fri', capacity: 89 },
  { day: 'Sat', capacity: 95 },
  { day: 'Sun', capacity: 82 },
];

// Monthly Comparison Forecast (Predicted vs Actual)
const monthlyCompareData = [
  { month: 'Jul', actual: 2450, predicted: 2400 },
  { month: 'Aug', actual: 2320, predicted: 2500 },
  { month: 'Sep', actual: 2010, predicted: 2150 },
  { month: 'Oct', actual: 1850, predicted: 1950 },
  { month: 'Nov', actual: null, predicted: 2100 },
  { month: 'Dec', actual: null, predicted: 2400 },
];

// Simulated hourly counts
const hourlyVehicleData = [
  { hour: '06', count: 120 },
  { hour: '08', count: 340 },
  { hour: '10', count: 520 },
  { hour: '12', count: 610 },
  { hour: '14', count: 430 },
  { hour: '16', count: 580 },
  { hour: '18', count: 720 },
  { hour: '20', count: 390 },
];

// Simulated weekly trends
const weeklyData = [
  { day: 'Mon', count: 820 },
  { day: 'Tue', count: 940 },
  { day: 'Wed', count: 1080 },
  { day: 'Thu', count: 990 },
  { day: 'Fri', count: 1248 },
  { day: 'Sat', count: 1420 },
  { day: 'Sun', count: 1150 },
];

// Simulated monthly bookings
const monthlyData = [
  { month: 'Jan', bookings: 1200 },
  { month: 'Feb', bookings: 1450 },
  { month: 'Mar', bookings: 1680 },
  { month: 'Apr', bookings: 1540 },
  { month: 'May', bookings: 1890 },
  { month: 'Jun', bookings: 2100 },
  { month: 'Jul', bookings: 2450 },
  { month: 'Aug', bookings: 2320 },
  { month: 'Sep', bookings: 2010 },
  { month: 'Oct', bookings: 1850 },
  { month: 'Nov', bookings: 1980 },
  { month: 'Dec', bookings: 2240 },
];

function AnalyticsDashboard() {
  const [viewMode, setViewMode] = useState('telemetry'); // 'telemetry' or 'prediction'
  const [occupancy, setOccupancy] = useState(78);
  const [vehiclesToday, setVehiclesToday] = useState(1248);
  const [revenue, setRevenue] = useState(18450);
  
  // Real-time auto-scrolling logs
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 'timeline-init-1', time: '17:39', text: 'Camera 03 synchronized.' },
    { id: 'timeline-init-2', time: '17:36', text: 'AI updated occupancy prediction.' },
    { id: 'timeline-init-3', time: '17:35', text: 'Vehicle exited Slot P09.' },
    { id: 'timeline-init-4', time: '17:31', text: 'Slot P14 Reserved.' },
    { id: 'timeline-init-5', time: '17:28', text: 'Vehicle TN-59-AB-1234 entered Gate 2.' },
  ]);

  // AI Prediction states
  const [predOccupancyData, setPredOccupancyData] = useState(predictedOccupancyData);
  const [predDailyDemandData, setPredDailyDemandData] = useState(dailyDemandData);
  const [predWeeklyData, setPredWeeklyData] = useState(predictedWeeklyData);
  const [predMonthlyCompareData, setPredMonthlyCompareData] = useState(monthlyCompareData);
  const [predictedPeakOccupancy, setPredictedPeakOccupancy] = useState(84);
  const [predictedAvailableSlots, setPredictedAvailableSlots] = useState(14);
  const [arrivalForecast, setArrivalForecast] = useState(142);
  const [aiConfidence, setAiConfidence] = useState(98.6);
  const [busyZonesList, setBusyZonesList] = useState([
    { zone: 'Zone A', count: 'Normal Load (48% expected)', rate: 48, color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { zone: 'Zone B', count: 'Zone Full (92% expected)', rate: 92, color: 'border-red-500 bg-red-500/10 text-red-400 animate-pulse' },
    { zone: 'Zone C', count: 'Busy Load (84% expected)', rate: 84, color: 'border-orange-500 bg-orange-500/10 text-orange-400' },
    { zone: 'Zone D', count: 'Normal Load (35% expected)', rate: 35, color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { zone: 'Zone E', count: 'Available (18% expected)', rate: 18, color: 'border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF]' },
  ]);

  // Simulate counting up statistics
  useEffect(() => {
    const timer = setInterval(() => {
      setOccupancy(prev => Math.min(95, Math.max(50, prev + Math.floor(Math.random() * 3) - 1)));
      setVehiclesToday(prev => prev + 1);
      setRevenue(prev => prev + 60);

      // Append logs dynamically
      const newTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
      const vehiclePlates = ['DL-03-CV-8899', 'MH-12-EV-7766', 'KA-01-MJ-4321', 'HR-26-Z-1002'];
      const slots = ['P02', 'P05', 'P08', 'P10', 'P12'];
      const actions = [
        `Vehicle ${vehiclePlates[Math.floor(Math.random() * vehiclePlates.length)]} entered Gate 1.`,
        `Slot ${slots[Math.floor(Math.random() * slots.length)]} Occupied.`,
        `Vehicle vacated Slot ${slots[Math.floor(Math.random() * slots.length)]}.`,
        'Database transaction complete.'
      ];
      
      setTimelineEvents(prev => [
        { id: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, time: newTime, text: actions[Math.floor(Math.random() * actions.length)] },
        ...prev.slice(0, 8)
      ]);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // AI Prediction live update simulation cycle (4s interval)
  useEffect(() => {
    const timer = setInterval(() => {
      setAiConfidence(prev => {
        const next = prev + (Math.random() * 0.4 - 0.2);
        return +(Math.max(98.2, Math.min(99.8, next)).toFixed(1));
      });

      setPredictedPeakOccupancy(prev => {
        const diff = Math.floor(Math.random() * 3) - 1;
        return Math.max(80, Math.min(96, prev + diff));
      });

      setPredictedAvailableSlots(prev => {
        const diff = Math.floor(Math.random() * 3) - 1;
        return Math.max(10, Math.min(20, prev + diff));
      });

      setArrivalForecast(prev => {
        const diff = Math.floor(Math.random() * 5) - 2;
        return Math.max(135, Math.min(155, prev + diff));
      });

      setPredOccupancyData(prevData => 
        prevData.map(item => {
          const predDiff = Math.floor(Math.random() * 5) - 2;
          const nextPred = Math.max(10, Math.min(98, (item.predicted || 0) + predDiff));
          let nextActual = null;
          if (item.actual !== null) {
            const actDiff = Math.floor(Math.random() * 5) - 2;
            nextActual = Math.max(10, Math.min(98, item.actual + actDiff));
          }
          return { ...item, actual: nextActual, predicted: nextPred };
        })
      );

      setPredDailyDemandData(prevData =>
        prevData.map(item => {
          const diff = Math.floor(Math.random() * 21) - 10;
          return { ...item, demand: Math.max(100, Math.min(850, item.demand + diff)) };
        })
      );

      setPredWeeklyData(prevData =>
        prevData.map(item => {
          const diff = Math.floor(Math.random() * 5) - 2;
          return { ...item, capacity: Math.max(55, Math.min(98, item.capacity + diff)) };
        })
      );

      setPredMonthlyCompareData(prevData =>
        prevData.map(item => {
          const predDiff = Math.floor(Math.random() * 81) - 40;
          const nextPred = Math.max(1500, Math.min(3000, item.predicted + predDiff));
          let nextActual = null;
          if (item.actual !== null) {
            const actDiff = Math.floor(Math.random() * 81) - 40;
            nextActual = Math.max(1500, Math.min(3000, item.actual + actDiff));
          }
          return { ...item, actual: nextActual, predicted: nextPred };
        })
      );

      setBusyZonesList(prevList =>
        prevList.map(z => {
          const diff = Math.floor(Math.random() * 5) - 2;
          const nextRate = Math.max(10, Math.min(98, z.rate + diff));
          let countText = '';
          let colorClass = '';

          if (nextRate >= 90) {
            countText = `Zone Full (${nextRate}% expected)`;
            colorClass = 'border-red-500 bg-red-500/10 text-red-400 animate-pulse';
          } else if (nextRate >= 75) {
            countText = `Busy Load (${nextRate}% expected)`;
            colorClass = 'border-orange-500 bg-orange-500/10 text-orange-400';
          } else if (nextRate >= 30) {
            countText = `Normal Load (${nextRate}% expected)`;
            colorClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400';
          } else {
            countText = `Available (${nextRate}% expected)`;
            colorClass = 'border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF]';
          }

          return { ...z, rate: nextRate, count: countText, color: colorClass };
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const ringOffset = 138.2 - (138.2 * occupancy) / 100;
  const occupancyColor = occupancy > 90 ? '#EF4444' : occupancy > 80 ? '#FACC15' : '#10B981';
  
  const predPeakOffset = 138.2 - (138.2 * predictedPeakOccupancy) / 100;

  return (
    <div className="w-full space-y-8 font-sans">
      
      {/* Visual Mode Sub-tab Navigator */}
      <div className="flex justify-between items-center bg-[#111827]/40 p-4 rounded-[22px] border border-white/10 shadow-lg">
        <div className="flex flex-col text-left">
          <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-wider uppercase font-bold">ANALYTICS SEGMENT</span>
          <h3 className="font-heading font-extrabold text-base text-white mt-0.5">Control Center Telemetry</h3>
        </div>

        <div className="flex bg-[#090B14] p-1.5 rounded-xl border border-white/15">
          <button
            onClick={() => setViewMode('telemetry')}
            className={`font-heading text-[10px] px-6 py-2.5 rounded-lg transition-all ${
              viewMode === 'telemetry'
                ? 'bg-[#00D9FF] text-[#090B14] font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 HISTORIC TELEMETRY
          </button>
          <button
            onClick={() => setViewMode('prediction')}
            className={`font-heading text-[10px] px-6 py-2.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'prediction'
                ? 'bg-[#00D9FF] text-[#090B14] font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FiCpu className="animate-pulse" />
            <span>🧠 AI PREDICTION CENTER</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: HISTORIC TELEMETRY DASHBOARD */}
        {viewMode === 'telemetry' && (
          <motion.div
            key="telemetry"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* ROW 1: 4 KPI STATISTIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* KPI 1: Occupancy Dial */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-[#00D9FF]/30 transition-all duration-300">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Parking Occupancy</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-white">{occupancy}%</p>
                  <p className="text-[9px] text-slate-400">Total capacity usage rate</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" fill="none" />
                    <circle 
                      cx="32" cy="32" r="22" 
                      stroke={occupancyColor} 
                      strokeWidth="3.5" 
                      fill="none" 
                      strokeDasharray="138.2"
                      strokeDashoffset={ringOffset}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-stat-mono text-slate-300">
                    {occupancy < 80 ? 'OK' : 'BUSY'}
                  </div>
                </div>
              </div>

              {/* KPI 2: Vehicles Today */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-[#00D9FF]/30 transition-all duration-300">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Vehicles Today</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-[#00D9FF]">{vehiclesToday.toLocaleString()}</p>
                  <p className="text-[9px] text-slate-400">Continuous arrivals ticker</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] text-xl shadow-[0_0_15px_rgba(0,217,255,0.15)]">
                  <FiActivity className="animate-pulse" />
                </div>
              </div>

              {/* KPI 3: Revenue Today */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-[#00D9FF]/30 transition-all duration-300">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Revenue Today</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-white">₹{revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-stat-mono font-bold mt-1">
                    <FiArrowUpRight /> +12.4%
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  ₹
                </div>
              </div>

              {/* KPI 4: YOLOv8 Accuracy */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-[#00D9FF]/30 transition-all duration-300">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">AI Detection Accuracy</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-white">99.4%</p>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> YOLOv8 Active
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] text-xl">
                  <FiCpu className="animate-spin" style={{ animationDuration: '6s' }} />
                </div>
              </div>
            </div>

            {/* ROW 2: LIVE CHART & HEAT MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              {/* Left: Occupancy line chart */}
              <div className="lg:col-span-7 glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl flex flex-col justify-between text-left">
                <div className="flex justify-between items-center pb-4">
                  <div className="flex flex-col">
                    <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">LIVE TREND DATA</span>
                    <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Live Occupancy Rate (24h)</h4>
                  </div>
                  <span className="bg-[#00D9FF]/15 border border-[#00D9FF]/20 text-[#00D9FF] px-4 py-1.5 rounded-full uppercase tracking-wider font-stat-mono text-[9px] font-bold">
                    Active Sync
                  </span>
                </div>
                <div className="w-full h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={occupancyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: '#00D9FF', fontFamily: 'monospace', fontSize: 10 }}
                        itemStyle={{ color: '#ffffff', fontSize: 11 }}
                      />
                      <Area type="monotone" dataKey="rate" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#colorOccupancy)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: AI Heatmap */}
              <div className="lg:col-span-3 glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl flex flex-col justify-between text-left">
                <div className="flex flex-col pb-4">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI COMPUTER VISION</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Parking Zone Heatmap</h4>
                </div>
                <div className="flex-1 flex flex-col gap-3.5 my-4">
                  {[
                    { zone: 'Zone A', count: '78% occupied', color: 'border-orange-500 bg-orange-500/10 text-orange-400' },
                    { zone: 'Zone B', count: '42% occupied', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
                    { zone: 'Zone C', count: '95% occupied', color: 'border-red-500 bg-red-500/10 text-red-400' },
                    { zone: 'Zone D', count: '15% occupied', color: 'border-[#00D9FF] bg-[#00D9FF]/10 text-[#00D9FF] animate-pulse' },
                    { zone: 'Zone E', count: '64% occupied', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
                  ].map((z) => (
                    <div key={z.zone} className={`p-4 rounded-xl border flex items-center justify-between text-xs font-stat-mono ${z.color}`}>
                      <span className="font-bold">{z.zone}</span>
                      <span>{z.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ROW 3: HOURLY BAR CHART & PEAK METRICS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left">
                <div className="flex flex-col pb-4">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">HOURLY DISTRIBUTION</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Hourly Vehicle Count</h4>
                </div>
                <div className="w-full h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyVehicleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: '#00D9FF', fontFamily: 'monospace', fontSize: 10 }}
                        itemStyle={{ color: '#ffffff', fontSize: 11 }}
                      />
                      <Bar dataKey="count" fill="#00D9FF" radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left flex flex-col justify-between">
                <div className="flex flex-col pb-4 border-b border-white/10">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">PEAK SUMMARY</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Peak Performance Indicators</h4>
                </div>
                <div className="grid grid-cols-2 gap-8 my-6 flex-1 py-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-nav-text tracking-wider">Peak Time</span>
                    <p className="text-2xl font-stat-mono font-extrabold text-white">6:30 PM</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-nav-text tracking-wider">Average Stay</span>
                    <p className="text-2xl font-stat-mono font-extrabold text-white">2h 18m</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-nav-text tracking-wider">Longest Stay</span>
                    <p className="text-2xl font-stat-mono font-extrabold text-white">6h 52m</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 uppercase font-nav-text tracking-wider">Today's Capacity</span>
                    <p className="text-2xl font-stat-mono font-extrabold text-[#00D9FF]">{occupancy}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: 3 EQUAL COMPARATIVE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-lg text-left space-y-4">
                <div className="flex flex-col">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">WEEKLY COMPARATIVE</span>
                  <h4 className="font-heading font-extrabold text-xs text-white mt-0.5">Weekly Trend</h4>
                </div>
                <div className="w-full h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="count" stroke="#00D9FF" strokeWidth={1.5} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-lg text-left space-y-4">
                <div className="flex flex-col">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">ANNUAL VOLUME</span>
                  <h4 className="font-heading font-extrabold text-xs text-white mt-0.5">Monthly Bookings</h4>
                </div>
                <div className="w-full h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={8} fontFamily="monospace" />
                      <Bar dataKey="bookings" fill="#00D9FF" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-lg text-left flex flex-col justify-between">
                <div className="flex flex-col border-b border-white/10 pb-3">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI PREDICTIVE ANALYTICS</span>
                  <h4 className="font-heading font-extrabold text-xs text-white mt-0.5">AI Prediction (24h)</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1 py-3 text-[10px] font-stat-mono text-slate-400">
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase">ARRIVALS:</span>
                    <p className="text-white font-bold">+82</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase">DEPARTURES:</span>
                    <p className="text-white font-bold">+61</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase">PREDICTED OCCUPANCY:</span>
                    <p className="text-[#00D9FF] font-bold">84%</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase">TRAFFIC RISK:</span>
                    <p className="text-emerald-400 font-bold">LOW</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 5: SYSTEM HEALTH & TIMELINE LOG */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left flex flex-col justify-between min-h-[220px]">
                <div className="flex flex-col pb-4 border-b border-white/10">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">SYSTEM DIAGNOSTICS</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">System Health Panel</h4>
                </div>
                <div className="grid grid-cols-2 gap-5 my-4 flex-1 py-2 font-stat-mono text-xs text-slate-400">
                  <div className="flex items-center justify-between pr-4">
                    <span>Camera Network:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-4">
                    <span>YOLOv8 Detection:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> ACTIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-4">
                    <span>Database:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> CONNECTED
                    </span>
                  </div>
                  <div className="flex items-center justify-between pr-4">
                    <span>Cloud Sync:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> HEALTHY
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between text-[10px] font-stat-mono text-slate-500">
                  <span>PING NODE LATENCY:</span>
                  <span className="text-[#00D9FF] font-bold">42 ms</span>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left flex flex-col justify-between min-h-[220px] max-h-[260px] overflow-hidden">
                <div className="flex flex-col pb-4 border-b border-white/10 mb-3">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">LIVE TELEMETRY STREAM</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Live Activity Feed</h4>
                </div>
                <div className="space-y-3 overflow-y-auto pr-1 flex-1 font-stat-mono text-xs text-slate-400">
                  {timelineEvents.map((e) => (
                    <div key={e.id} className="flex gap-4 border-l-2 border-[#00D9FF]/20 pl-4 py-0.5">
                      <span className="text-[#00D9FF] font-bold">{e.time}</span>
                      <span className="text-white truncate">{e.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: AI PREDICTION CENTER FORECASTING DASHBOARD */}
        {viewMode === 'prediction' && (
          <motion.div
            key="prediction"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* ROW 1: 4 FORECASTING KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Predicted Peak Occupancy */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg group hover:border-[#00D9FF]/30 transition-all">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Predicted Peak Occupancy</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-white">{predictedPeakOccupancy}%</p>
                  <p className="text-[9px] text-slate-400">Expected congestion peaks today</p>
                </div>
                <div className="relative w-16 h-16 transform -rotate-90">
                  <svg className="w-full h-full">
                    <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" fill="none" />
                    <circle cx="32" cy="32" r="22" stroke="#00D9FF" strokeWidth="3.5" fill="none" strokeDasharray="138.2" strokeDashoffset={predPeakOffset} className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] font-stat-mono text-slate-300 transform rotate-90">
                    {predictedPeakOccupancy}%
                  </div>
                </div>
              </div>

              {/* Predicted Available Slots */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg group hover:border-[#00D9FF]/30 transition-all">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Predicted Available Slots</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-[#00D9FF]">{predictedAvailableSlots} Slots</p>
                  <p className="text-[9px] text-slate-400">Forecasted availability minimums</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] text-xl shadow-[0_0_15px_rgba(0,217,255,0.15)]">
                  <FiGrid />
                </div>
              </div>

              {/* Vehicle Arrivals Forecast */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg group hover:border-[#00D9FF]/30 transition-all">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Arrival Forecast (24h)</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-white">+{arrivalForecast} Cars</p>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-stat-mono font-bold mt-1">
                    <FiArrowUpRight /> +23% Traffic
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                  +{arrivalForecast}
                </div>
              </div>

              {/* AI Engine Confidence */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg group hover:border-[#00D9FF]/30 transition-all">
                <div className="text-left space-y-1">
                  <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">AI Engine Confidence</span>
                  <p className="text-3xl font-stat-mono font-extrabold text-white">{aiConfidence}%</p>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Predictor Active
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] text-xl">
                  <FiCpu className="animate-pulse" />
                </div>
              </div>

            </div>

            {/* ROW 2: 24H PREDICTION AREA CHART & ZONE CONGESTION MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
              
              {/* Occupancy Prediction Line Chart (70%) */}
              <div className="lg:col-span-7 glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4">
                  <div className="flex flex-col">
                    <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI CONGESTION MODEL</span>
                    <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Predicted Occupancy Bounds (Next 24h)</h4>
                  </div>
                  <span className="bg-[#00D9FF]/15 border border-[#00D9FF]/20 text-[#00D9FF] px-4 py-1.5 rounded-full uppercase tracking-wider font-stat-mono text-[9px] font-bold">
                    Forecast Active
                  </span>
                </div>
                <div className="w-full h-72 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predOccupancyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        labelStyle={{ color: '#00D9FF', fontFamily: 'monospace', fontSize: 10 }}
                        itemStyle={{ color: '#ffffff', fontSize: 11 }}
                      />
                      <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'monospace', paddingTop: 10 }} />
                      <Area name="Actual Load" type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={1.5} fill="none" isAnimationActive={true} />
                      <Area name="Predicted (AI)" type="monotone" dataKey="predicted" stroke="#00D9FF" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPredicted)" isAnimationActive={true} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Predicted Zone Congestion Heatmap (30%) */}
              <div className="lg:col-span-3 glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left flex flex-col justify-between">
                <div className="flex flex-col pb-4">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI CONGESTION INDEX</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Predicted Busy Zones</h4>
                </div>
                <div className="flex-1 flex flex-col gap-3.5 my-4">
                  {busyZonesList.map((z) => (
                    <div key={z.zone} className={`p-4 rounded-xl border flex items-center justify-between text-xs font-stat-mono ${z.color}`}>
                      <span className="font-bold">{z.zone}</span>
                      <span className="text-[10px] text-right">{z.count}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ROW 3: DAILY DEMAND FORECAST & RECOMMENDATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Daily Parking Demand Graph */}
              <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left">
                <div className="flex flex-col pb-4">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">LOAD DISTRIBUTION FORECAST</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Daily Parking Demand Forecast</h4>
                </div>
                <div className="w-full h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predDailyDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="hour" stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Bar dataKey="demand" fill="#00D9FF" radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={true} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Peak Hours & AI Recommendations */}
              <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left flex flex-col justify-between">
                <div className="flex flex-col pb-4 border-b border-white/10">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI RECOMMENDATIONS</span>
                  <h4 className="font-heading font-extrabold text-base text-white mt-0.5">System Optimization Directives</h4>
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-5 my-6">
                  <div className="flex items-start gap-4 p-4.5 bg-red-500/5 border border-red-500/20 rounded-2xl text-xs font-sans text-red-400">
                    <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Zone B Congestion Alert</p>
                      <p className="text-[10px] text-slate-400 mt-1">Parking Zone B will reach 92% occupancy at 10:30 AM.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4.5 bg-[#00D9FF]/5 border border-[#00D9FF]/20 rounded-2xl text-xs font-sans text-[#00D9FF]">
                    <FiCpu className="text-lg shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Overflow Parking Recommendation</p>
                      <p className="text-[10px] text-slate-400 mt-1">Recommend opening Overflow Parking.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4.5 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-xs font-sans text-orange-400">
                    <FiTrendingUp className="text-lg shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Traffic Index Forecast</p>
                      <p className="text-[10px] text-slate-400 mt-1">Traffic expected to increase by 23%.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ROW 4: 2 EQUAL COMPARATIVE WIDGETS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Weekly Trend Capacity forecast */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-lg text-left space-y-4">
                <div className="flex flex-col">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">WEEKLY COMPARATIVE CAPACITY</span>
                  <h4 className="font-heading font-extrabold text-sm text-white">Weekly Trend Capacity Forecast</h4>
                </div>
                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={predWeeklyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Line type="monotone" dataKey="capacity" stroke="#00D9FF" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={true} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Predicted Comparison Chart */}
              <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-lg text-left space-y-4">
                <div className="flex flex-col">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">MONTHLY COMPARISON VOLUME</span>
                  <h4 className="font-heading font-extrabold text-sm text-white">Monthly Comparison Forecast (Predicted vs Actual)</h4>
                </div>
                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predMonthlyCompareData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                      <Tooltip contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'monospace' }} />
                      <Bar name="Actual" dataKey="actual" fill="#3b82f6" radius={[2, 2, 0, 0]} isAnimationActive={true} />
                      <Bar name="Predicted" dataKey="predicted" fill="#00D9FF" radius={[2, 2, 0, 0]} stroke="#00D9FF" strokeDasharray="2 2" fillOpacity={0.4} isAnimationActive={true} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}

export default React.memo(AnalyticsDashboard);
