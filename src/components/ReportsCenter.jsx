import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip,
  BarChart, Bar,
  LineChart, Line
} from 'recharts';
import { 
  FiFileText, 
  FiDownload, 
  FiTrendingUp, 
  FiActivity, 
  FiDatabase, 
  FiCpu, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle 
} from 'react-icons/fi';

// Simulated Report Datasets
const reportData = {
  daily: {
    revenue: [
      { label: '06:00', value: 1200 },
      { label: '09:00', value: 4500 },
      { label: '12:00', value: 8900 },
      { label: '15:00', value: 6500 },
      { label: '18:00', value: 9200 },
      { label: '21:00', value: 4100 }
    ],
    occupancy: [
      { label: '06:00', value: 35 },
      { label: '09:00', value: 68 },
      { label: '12:00', value: 85 },
      { label: '15:00', value: 72 },
      { label: '18:00', value: 94 },
      { label: '21:00', value: 50 }
    ],
    peak_hours: [
      { label: '06:00', value: 45 },
      { label: '09:00', value: 180 },
      { label: '12:00', value: 240 },
      { label: '15:00', value: 130 },
      { label: '18:00', value: 290 },
      { label: '21:00', value: 85 }
    ],
    vehicle_count: [
      { label: 'EV', value: 140 },
      { label: 'SUV', value: 380 },
      { label: 'Sedan', value: 420 },
      { label: 'Hatchback', value: 190 }
    ],
    camera_health: [
      { label: 'Cam 01', value: 100 },
      { label: 'Cam 02', value: 100 },
      { label: 'Cam 03', value: 98 },
      { label: 'Cam 04', value: 100 },
      { label: 'Cam 05', value: 95 }
    ]
  },
  weekly: {
    revenue: [
      { label: 'Mon', value: 32000 },
      { label: 'Tue', value: 38000 },
      { label: 'Wed', value: 44000 },
      { label: 'Thu', value: 41000 },
      { label: 'Fri', value: 58000 },
      { label: 'Sat', value: 65000 },
      { label: 'Sun', value: 48000 }
    ],
    occupancy: [
      { label: 'Mon', value: 74 },
      { label: 'Tue', value: 78 },
      { label: 'Wed', value: 82 },
      { label: 'Thu', value: 80 },
      { label: 'Fri', value: 88 },
      { label: 'Sat', value: 96 },
      { label: 'Sun', value: 79 }
    ],
    peak_hours: [
      { label: 'Mon', value: 120 },
      { label: 'Tue', value: 140 },
      { label: 'Wed', value: 190 },
      { label: 'Thu', value: 150 },
      { label: 'Fri', value: 280 },
      { label: 'Sat', value: 310 },
      { label: 'Sun', value: 180 }
    ],
    vehicle_count: [
      { label: 'EV', value: 890 },
      { label: 'SUV', value: 2450 },
      { label: 'Sedan', value: 2890 },
      { label: 'Hatchback', value: 1120 }
    ],
    camera_health: [
      { label: 'Cam 01', value: 99.8 },
      { label: 'Cam 02', value: 100 },
      { label: 'Cam 03', value: 99.2 },
      { label: 'Cam 04', value: 100 },
      { label: 'Cam 05', value: 98.5 }
    ]
  },
  monthly: {
    revenue: [
      { label: 'Wk 1', value: 180000 },
      { label: 'Wk 2', value: 240000 },
      { label: 'Wk 3', value: 210000 },
      { label: 'Wk 4', value: 295000 }
    ],
    occupancy: [
      { label: 'Wk 1', value: 72 },
      { label: 'Wk 2', value: 84 },
      { label: 'Wk 3', value: 79 },
      { label: 'Wk 4', value: 91 }
    ],
    peak_hours: [
      { label: 'Wk 1', value: 180 },
      { label: 'Wk 2', value: 220 },
      { label: 'Wk 3', value: 195 },
      { label: 'Wk 4', value: 310 }
    ],
    vehicle_count: [
      { label: 'EV', value: 3800 },
      { label: 'SUV', value: 10200 },
      { label: 'Sedan', value: 11900 },
      { label: 'Hatchback', value: 4500 }
    ],
    camera_health: [
      { label: 'Cam 01', value: 99.5 },
      { label: 'Cam 02', value: 99.9 },
      { label: 'Cam 03', value: 99.0 },
      { label: 'Cam 04', value: 100 },
      { label: 'Cam 05', value: 99.2 }
    ]
  }
};

export default function ReportsCenter() {
  const [reportType, setReportType] = useState('daily'); // daily, weekly, monthly
  const [metric, setMetric] = useState('revenue'); // revenue, occupancy, peak_hours, vehicle_count, camera_health
  const [format, setFormat] = useState('pdf'); // pdf, excel, csv
  const [isExporting, setIsExporting] = useState(false);

  // Active chart preview data
  const chartData = useMemo(() => {
    return reportData[reportType]?.[metric] || [];
  }, [reportType, metric]);

  // Labels config
  const metricLabel = useMemo(() => {
    if (metric === 'revenue') return 'Revenue (₹)';
    if (metric === 'occupancy') return 'Occupancy Rate (%)';
    if (metric === 'peak_hours') return 'Peak Vehicles/Hour';
    if (metric === 'vehicle_count') return 'Total Classified Count';
    if (metric === 'camera_health') return 'Uptime Percentage (%)';
    return '';
  }, [metric]);

  // Exporters
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      if (format === 'csv' || format === 'excel') {
        exportSpreadsheet();
      } else if (format === 'pdf') {
        exportPDF();
      }
    }, 1500);
  };

  // CSV/Excel Exporter using client Data URIs
  const exportSpreadsheet = () => {
    const csvRows = [
      ['Report Category', reportType.toUpperCase()],
      ['Telemetry Metric', metric.toUpperCase()],
      ['Timestamp', new Date().toLocaleString()],
      [],
      ['Timeline/Category', metricLabel]
    ];

    chartData.forEach(row => {
      csvRows.push([row.label, row.value]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ParkSense_${reportType}_${metric}.${format === 'excel' ? 'xls' : 'csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Styled PDF Printing window helper
  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printHtml = `
      <html>
        <head>
          <title>ParkSense AI - Enterprise Report</title>
          <style>
            body { font-family: monospace; padding: 50px; color: #111; line-height: 1.6; }
            .header { border-bottom: 3px double #000; padding-bottom: 25px; margin-bottom: 40px; }
            .title { font-size: 1.8em; font-weight: bold; text-transform: uppercase; margin: 0; }
            .subtitle { font-size: 1em; color: #666; margin-top: 5px; }
            .metadata { display: grid; grid-cols-2; margin-bottom: 30px; font-size: 0.9em; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
            .footer { margin-top: 80px; text-align: center; border-top: 1px dashed #ccc; padding-top: 20px; font-size: 0.8em; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1 class="title">ParkSense AI Reports Console</h1>
            <p class="subtitle">Enterprise Level Analytical Summary Logs</p>
          </div>
          
          <div class="metadata">
            <div><strong>REPORT MODE:</strong> ${reportType.toUpperCase()} SUMMARY</div>
            <div><strong>METRIC DOMAIN:</strong> ${metric.toUpperCase()}</div>
            <div><strong>EXPORT FORMAT:</strong> PDF ARCHIVE</div>
            <div><strong>TIMESTAMP:</strong> ${new Date().toLocaleString()}</div>
          </div>

          <h3>TABULAR QUANTITATIVE ANALYSIS</h3>
          <table>
            <thead>
              <tr>
                <th>Timeline / Segment</th>
                <th>Calculated Output Value (${metricLabel})</th>
              </tr>
            </thead>
            <tbody>
              ${chartData.map(d => `
                <tr>
                  <td>${d.label}</td>
                  <td>${metric === 'revenue' ? `₹${d.value.toLocaleString()}` : d.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>CONFIDENTIAL ARCHIVE - INTENDED FOR PARKSENSE SYSTEM ADMINISTRATORS ONLY</p>
            <p>Powered by Google DeepMind Advanced Agentic Systems</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printHtml);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start w-full text-left">
      
      {/* LEFT COLUMN: REPORTS CONFIGURE WINDOW (40%) */}
      <div className="w-full lg:w-[40%] space-y-8">
        <div className="glass-panel p-8 rounded-[24px] border border-white/10 space-y-6 shadow-2xl bg-[#111827]/30">
          <div>
            <span className="text-[10px] text-[#00D9FF] tracking-widest font-bold uppercase">Enterprise Console</span>
            <h3 className="text-xl font-heading font-extrabold text-white mt-1">Reports Suite</h3>
          </div>

          <div className="space-y-5 font-sans text-xs">
            
            {/* Report type (daily weekly monthly) */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold block uppercase">Select Schedule Range</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'daily', label: 'Daily', icon: <FiClock /> },
                  { id: 'weekly', label: 'Weekly', icon: <FiCalendar /> },
                  { id: 'monthly', label: 'Monthly', icon: <FiFileText /> }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 text-[10px] font-stat-mono font-bold uppercase transition-all ${
                      reportType === type.id
                        ? 'border-[#00D9FF] bg-[#00D9FF]/5 text-white'
                        : 'border-white/5 bg-[#090B14]/40 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Metric selection list */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold block uppercase">Focus Metrics Telemetry</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'revenue', label: 'Financial Revenue' },
                  { id: 'occupancy', label: 'Occupancy Ratios' },
                  { id: 'peak_hours', label: 'Peak Hour Peaks' },
                  { id: 'vehicle_count', label: 'Vehicle Counts' },
                  { id: 'camera_health', label: 'Camera Uptime' }
                ].map((met) => (
                  <button
                    key={met.id}
                    onClick={() => setMetric(met.id)}
                    className={`p-3.5 rounded-xl border text-left text-[9px] font-stat-mono font-bold uppercase transition-all ${
                      metric === met.id
                        ? 'border-[#00D9FF] bg-[#00D9FF]/5 text-white'
                        : 'border-white/5 bg-[#090B14]/40 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    • {met.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exporter Formats */}
            <div className="space-y-2">
              <span className="text-slate-300 font-bold block uppercase">Select Export Format</span>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'pdf', label: 'PDF Archive' },
                  { id: 'excel', label: 'Excel XLS' },
                  { id: 'csv', label: 'CSV Sheet' }
                ].map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setFormat(form.id)}
                    className={`p-3 rounded-xl border text-[9px] font-stat-mono font-bold uppercase transition-all ${
                      format === form.id
                        ? 'border-[#00D9FF] bg-[#00D9FF]/5 text-white'
                        : 'border-white/5 bg-[#090B14]/40 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    {form.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-4 bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-[#090B14] font-heading font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,217,255,0.2)] disabled:opacity-50 mt-4 uppercase flex items-center justify-center gap-2"
            >
              <FiDownload />
              {isExporting ? 'GENERATING ARCHIVE...' : 'EXPORT SYSTEM REPORT'}
            </button>

          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INTERACTIVE CHART PREVIEW HUD (60%) */}
      <div className="w-full lg:w-[60%] space-y-8 flex flex-col">
        <div className="glass-panel p-8 rounded-[28px] border border-white/10 space-y-6 shadow-2xl bg-[#111827]/40 text-left flex-1 flex flex-col justify-between">
          
          <div className="flex border-b border-white/5 pb-4 justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-500 tracking-widest font-bold uppercase">Dynamic Preview</span>
              <h3 className="text-sm font-heading font-extrabold text-white mt-1 uppercase">
                {reportType} Summary: {metric.replace('_', ' ')}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 bg-[#090B14] border border-white/5 px-4 py-2 rounded-xl text-[9px] font-stat-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE INTEGRATED TELEMETRY</span>
            </div>
          </div>

          {/* Recharts preview viewport */}
          <div className="w-full h-72 relative">
            <ResponsiveContainer width="100%" height="100%">
              {metric === 'revenue' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090B14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '9px', fontFamily: 'monospace' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              ) : metric === 'occupancy' || metric === 'camera_health' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090B14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '9px', fontFamily: 'monospace' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                </LineChart>
              ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090B14', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontSize: '9px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Details Table view */}
          <div className="border-t border-white/5 pt-4 space-y-3 font-stat-mono text-[10px] text-slate-500 uppercase">
            <div className="grid grid-cols-3 text-[#00D9FF] font-bold">
              <span>Segment Range</span>
              <span>Metric Type</span>
              <span className="text-right">Aggregate value</span>
            </div>
            {chartData.map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 border-b border-white/5 pb-2">
                <span className="text-slate-300">{row.label}</span>
                <span>{metric.replace('_', ' ')}</span>
                <span className="text-right text-white">
                  {metric === 'revenue' ? `₹${row.value.toLocaleString()}` : row.value}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
