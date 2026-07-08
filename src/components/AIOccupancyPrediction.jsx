import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { 
  Cpu,
  Brain,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Activity,
  CalendarCheck
} from 'lucide-react';

/* ─────────────────────────────────────────────
   INITIAL PREDICTION TIMELINE DATA
───────────────────────────────────────────── */
const INITIAL_CHART_DATA = [
  { time: '06 AM', occupancy: 20, confidence: 94.2 },
  { time: '09 AM', occupancy: 42, confidence: 96.8 },
  { time: '12 PM', occupancy: 88, confidence: 97.8 },
  { time: '03 PM', occupancy: 75, confidence: 95.1 },
  { time: '06 PM', occupancy: 96, confidence: 98.4 },
  { time: '09 PM', occupancy: 61, confidence: 93.9 }
];

export default function AIOccupancyPrediction() {
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
  const [lastUpdated, setLastUpdated] = useState(0); // seconds ago
  const [insightsTrigger, setInsightsTrigger] = useState(true);

  // Live Prediction Update Simulation (Every 15 Seconds)
  useEffect(() => {
    const updateTimer = setInterval(() => {
      // Simulate real-time LSTM adjustment +/- 4%
      setChartData(prev => prev.map(pt => {
        const delta = Math.floor(Math.random() * 9) - 4; // -4 to +4
        const nextOcc = Math.max(10, Math.min(100, pt.occupancy + delta));
        const nextConf = Math.max(90, Math.min(99.9, pt.confidence + (Math.random() * 0.4 - 0.2)));
        return {
          ...pt,
          occupancy: nextOcc,
          confidence: Number(nextConf.toFixed(1))
        };
      }));
      setLastUpdated(0);
      setInsightsTrigger(prev => !prev); // Trigger staggered animation of insights
    }, 15000);

    const secondsCounter = setInterval(() => {
      setLastUpdated(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(updateTimer);
      clearInterval(secondsCounter);
    };
  }, []);

  // Compute peak time and details dynamically based on chartData
  const summaryMetrics = useMemo(() => {
    let peak = chartData[0];
    chartData.forEach(pt => {
      if (pt.occupancy > peak.occupancy) {
        peak = pt;
      }
    });

    // Compute status indicators for bottom cards
    const morningPt = chartData.find(d => d.time === '09 AM') || { occupancy: 40 };
    const afternoonPt = chartData.find(d => d.time === '03 PM') || { occupancy: 75 };
    const eveningPt = chartData.find(d => d.time === '06 PM') || { occupancy: 96 };

    return {
      peakTime: peak.time === '06 PM' ? '6:00 PM' : peak.time === '12 PM' ? '12:00 PM' : peak.time,
      peakOccupancy: peak.occupancy,
      peakConfidence: peak.confidence,
      morningOcc: morningPt.occupancy,
      afternoonOcc: afternoonPt.occupancy,
      eveningOcc: eveningPt.occupancy
    };
  }, [chartData]);

  // AI insights array
  const aiInsightsList = useMemo(() => {
    return [
      `✔ Afternoon demand increasing rapidly (${summaryMetrics.afternoonOcc}% expected at 3 PM).`,
      `✔ EV charging slots likely to reach capacity by 5 PM.`,
      `✔ Recommend reserving before peak hours (target arrival before 5:15 PM).`,
      `✔ Zone B expected to become full first.`,
    ];
  }, [summaryMetrics]);

  // Custom tooltips matching futuristic cyber theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3 border border-[#00D9FF]/30 bg-[#0d1117]/90 text-[10px] font-mono text-left space-y-1.5 shadow-2xl rounded-xl">
          <p className="text-white font-extrabold uppercase tracking-wide border-b border-white/10 pb-1">{data.time} Forecast</p>
          <p className="text-[#00D9FF]">Occupancy: <span className="font-bold">{data.occupancy}%</span></p>
          <p className="text-slate-400">Confidence: <span className="text-emerald-400 font-bold">{data.confidence}%</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 relative z-10 max-w-[1700px] w-full mx-auto"
    >
      {/* SECTION TITLE & METRICS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
        <div className="text-left">
          <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-widest uppercase font-bold flex items-center gap-1.5">
            <Cpu size={10} className="animate-spin animate-duration-3000" /> Machine Learning Forecast • Next 24 Hours
          </span>
          <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight uppercase mt-1">
            AI Occupancy Prediction
          </h1>
        </div>

        <div className="bg-[#111827]/50 border border-white/10 rounded-2xl px-5 py-3 text-right shrink-0">
          <p className="text-[9px] text-slate-500 font-nav-text tracking-wider uppercase">Active Neural Model</p>
          <p className="text-xs font-stat-mono text-[#00D9FF] font-bold flex items-center gap-2 mt-1">
            <Activity size={12} className="text-[#00D9FF] animate-pulse" /> LSTM NETWORK v4.8
          </p>
        </div>
      </div>

      {/* 2-COLUMN MAIN PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Animated Line Chart (7/12 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 flex flex-col justify-between shadow-2xl relative"
        >
          <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-[#00D9FF] tracking-wider">
            📡 LIVE TELEMETRY STREAM
          </div>

          <div className="text-left space-y-1">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">NETWORK OCCUPANCY YIELD</span>
            <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider">Occupancy Load Projection</h3>
          </div>

          {/* Line chart wrapper */}
          <div className="h-[280px] w-full mt-6 text-[10px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="cyberCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={9} />
                <YAxis stroke="#64748B" fontSize={9} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="occupancy" 
                  stroke="#00D9FF" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#cyberCyan)" 
                  name="Occupancy %"
                  activeDot={{ r: 5, stroke: '#00D9FF', strokeWidth: 1.5, fill: '#090B14' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: AI Prediction Summary Card (5/12 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 flex flex-col justify-between shadow-2xl relative"
        >
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-[#00D9FF] animate-pulse" />
                <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">AI Prediction Summary</h3>
              </div>
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider">ACTIVE</span>
            </div>

            {/* Metrics List */}
            <div className="divide-y divide-white/5 font-mono text-[10px] space-y-2.5">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-500 uppercase tracking-wide">High Demand Peak Time</span>
                <span className="text-white font-bold text-right">{summaryMetrics.peakTime}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500 uppercase tracking-wide">Expected Occupancy</span>
                <span className="text-[#00D9FF] font-extrabold text-right">{summaryMetrics.peakOccupancy}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500 uppercase tracking-wide">Recommended Arrival</span>
                <span className="text-white font-bold text-right">Before 5:15 PM</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500 uppercase tracking-wide">AI Model Confidence</span>
                <span className="text-emerald-400 font-bold text-right">{summaryMetrics.peakConfidence}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-slate-500 uppercase tracking-wide">Prediction Model</span>
                <span className="text-slate-300 text-right">LSTM Neural Network</span>
              </div>
            </div>
          </div>

          {/* Forecast Timer indicator */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest">
            <span>MODEL SYNC: COMPLETE</span>
            <span className="flex items-center gap-1">
              <Clock size={9} /> Forecast Updated {lastUpdated}s ago
            </span>
          </div>
        </motion.div>

      </div>

      {/* THREE PREDICTION CARDS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* CARD 1: Morning */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg text-left"
        >
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
          <span className="text-[9px] text-[#00D9FF] font-bold font-mono tracking-wider block uppercase">MORNING PHASE</span>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">
            {summaryMetrics.morningOcc}%
          </div>
          <p className="text-[8.5px] text-emerald-400 font-mono mt-1 uppercase flex items-center gap-1">
            <CheckCircle size={10} /> Low Traffic
          </p>
        </motion.div>

        {/* CARD 2: Afternoon */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg text-left"
        >
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
          <span className="text-[9px] text-slate-500 font-bold font-mono tracking-wider block uppercase">AFTERNOON PHASE</span>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">
            {summaryMetrics.afternoonOcc}%
          </div>
          <p className="text-[8.5px] text-amber-500 font-mono mt-1 uppercase flex items-center gap-1">
            <AlertTriangle size={10} /> Heavy Demand
          </p>
        </motion.div>

        {/* CARD 3: Evening */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg text-left"
        >
          <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]" />
          <span className="text-[9px] text-slate-500 font-bold font-mono tracking-wider block uppercase">EVENING PHASE</span>
          <div className="text-2xl font-extrabold text-white mt-1.5 font-mono">
            {summaryMetrics.eveningOcc}%
          </div>
          <p className="text-[8.5px] text-rose-500 font-mono mt-1 uppercase flex items-center gap-1">
            <AlertTriangle size={10} /> Parking Nearly Full
          </p>
        </motion.div>

      </section>

      {/* AI INSIGHTS PANEL */}
      <section className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/25 shadow-xl text-left">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3 mb-4">
          <CalendarCheck size={14} className="text-[#00D9FF]" />
          <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">AI Insights &amp; Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="wait">
            {aiInsightsList.map((insight, idx) => (
              <motion.div 
                key={`${insight.slice(0, 10)}-${insightsTrigger}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.12 }}
                className="flex items-start gap-2.5 font-mono text-[9px] md:text-[10px] text-slate-300 leading-relaxed py-1.5"
              >
                <span className="text-emerald-400 shrink-0">📡</span>
                <span>{insight}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

    </motion.div>
  );
}
