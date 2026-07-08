import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShield, 
  FiSliders, 
  FiKey, 
  FiDatabase, 
  FiActivity, 
  FiUsers, 
  FiTv, 
  FiDollarSign, 
  FiDownload, 
  FiUploadCloud, 
  FiSettings, 
  FiCpu, 
  FiCheckCircle, 
  FiAlertTriangle 
} from 'react-icons/fi';

// Simulated Staff Data
const initialStaff = [
  { id: 's1', name: 'Rahul Kumar', role: 'System Admin', status: 'Online', permissions: 'Full Access' },
  { id: 's2', name: 'Anjali Sharma', role: 'Security Manager', status: 'Online', permissions: 'CCTV & Alarms' },
  { id: 's3', name: 'Vikram Singh', role: 'Billing Operator', status: 'Offline', permissions: 'Payments Only' }
];

// Simulated Cameras Assignment
const initialCameras = [
  { id: 'c1', name: 'Node Camera 01', zone: 'Entry Lane 1', status: 'Online' },
  { id: 'c2', name: 'Node Camera 04', zone: 'EV Charger Zone', status: 'Online' },
  { id: 'c3', name: 'Node Camera 08', zone: 'VIP Deck Row B', status: 'Online' }
];

// Simulated System Logs
const initialAuditLogs = [
  { time: '12:20:45', action: 'API KEY GENERATED', user: 'Admin (Rahul)', status: 'Success' },
  { time: '12:21:10', action: 'BACKUP CREATED', user: 'System Auto', status: 'Success' },
  { time: '12:24:32', action: 'ROLE ASSIGNED: Security', user: 'Admin (Rahul)', status: 'Success' }
];

export default function AdminConsole({ triggerToast }) {
  const [activeTab, setActiveTab] = useState('access'); // access, operations, security, system
  
  const [tickets, setTickets] = useState(() => {
    const raw = localStorage.getItem('parksense_incidents');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    return [
      {
        id: 'INC-1082',
        userName: 'Sankara Narayanan',
        userId: 'USR-9821',
        slotNumber: 'P5',
        vehicleNumber: 'MH12 AB 1234',
        location: 'Ground Floor, Section B',
        time: '12:08 PM',
        type: 'Unauthorized Occupation',
        confidence: '99.8%',
        priority: 'HIGH',
        status: 'Pending'
      }
    ];
  });

  // Polling to keep the tickets synchronized in real-time
  useEffect(() => {
    const syncTickets = () => {
      const raw = localStorage.getItem('parksense_incidents');
      if (raw) {
        try {
          setTickets(JSON.parse(raw));
        } catch (e) {}
      }
    };
    const interval = setInterval(syncTickets, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptCase = (id) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: 'Investigating' } : t);
    setTickets(updated);
    localStorage.setItem('parksense_incidents', JSON.stringify(updated));
    triggerToast(`Incident ${id} is now under active investigation.`);
  };

  const handleResolveIncident = (id) => {
    const updated = tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t);
    setTickets(updated);
    localStorage.setItem('parksense_incidents', JSON.stringify(updated));
    triggerToast(`Incident ${id} marked as resolved successfully.`);
  };
  
  // States
  const [staff, setStaff] = useState(initialStaff);
  const [cameras, setCameras] = useState(initialCameras);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [basePrice, setBasePrice] = useState(40);
  const [evSurcharge, setEvSurcharge] = useState(150);
  
  // Backup / Restore States
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // API Key Generator
  const [apiKeys, setApiKeys] = useState([
    { name: 'Mobile App Client', key: 'pk_live_89a7...82f2', created: '2026-06-12' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  const generateApiKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const randomHex = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newKey = {
      name: newKeyName,
      key: `pk_live_${randomHex.slice(0,4)}...${randomHex.slice(12)}`,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    triggerToast('New Client API Key generated successfully.', 'success');
  };

  // Trigger Backup File download
  const handleBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      triggerToast('Database backup SQL generated: park_sense_db_backup.sql', 'success');
    }, 2000);
  };

  // Trigger Restore Database
  const handleRestore = () => {
    setIsRestoring(true);
    setTimeout(() => {
      setIsRestoring(false);
      triggerToast('Database nodes restored to checkpoint status.', 'success');
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-8 w-full text-left">
      
      {/* Console Header */}
      <div className="glass-panel p-6 rounded-[22px] border border-white/10 flex justify-between items-center w-full bg-[#111827]/40 shadow-lg">
        <div>
          <span className="text-[10px] font-stat-mono text-[#00D9FF] tracking-widest font-extrabold uppercase">
            🛠️ Enterprise Control Console
          </span>
          <h3 className="text-xl font-heading font-extrabold text-white mt-1 uppercase">System Administration</h3>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'access', label: 'Access Control', icon: <FiShield /> },
            { id: 'operations', label: 'Operations Config', icon: <FiSliders /> },
            { id: 'security', label: 'Security & API', icon: <FiKey /> },
            { id: 'system', label: 'Diagnostics', icon: <FiActivity /> },
            { id: 'tickets', label: 'Support Center', icon: <FiAlertTriangle /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-stat-mono font-bold border transition-all uppercase flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-[#00D9FF] bg-[#00D9FF]/5 text-white'
                  : 'border-white/5 bg-[#090B14]/40 text-slate-400 hover:border-white/10'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ACCESS CONTROL */}
          {activeTab === 'access' && (
            <motion.div
              key="access"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Staff Management */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiUsers className="text-[#00D9FF]" /> Staff Roster Management
                  </span>
                  <span className="text-[9px] font-stat-mono text-slate-500 uppercase">3 Registered Personnel</span>
                </div>

                <div className="space-y-3 font-stat-mono text-[10px]">
                  {staff.map((s) => (
                    <div key={s.id} className="flex justify-between items-center bg-[#090B14]/50 border border-white/5 p-3.5 rounded-xl">
                      <div className="text-left">
                        <span className="text-white font-bold block">{s.name}</span>
                        <span className="text-slate-500 block mt-0.5">{s.role} | {s.permissions}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        s.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles & Permissions matrix */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiShield className="text-[#00D9FF]" /> Permission Matrices
                  </span>
                </div>

                <div className="space-y-3 font-stat-mono text-[10px] text-slate-400">
                  <div className="flex justify-between border-b border-white/5 pb-2 font-bold text-[#00D9FF]">
                    <span>User Role</span>
                    <span>Scopes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Admin Privileges</span>
                    <span>Full Global System Access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Security Officer</span>
                    <span>CCTV Node Feed Control & Alarm Operations</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-bold">Billing operator</span>
                    <span>Secure Invoicing & Payment Registers</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: OPERATIONS CONFIG */}
          {activeTab === 'operations' && (
            <motion.div
              key="operations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Camera assignments */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiTv className="text-[#00D9FF]" /> CCTV Nodes Mapping Assignment
                  </span>
                </div>

                <div className="space-y-3 font-stat-mono text-[10px]">
                  {cameras.map((c) => (
                    <div key={c.id} className="flex justify-between items-center bg-[#090B14]/50 border border-white/5 p-3.5 rounded-xl">
                      <div>
                        <span className="text-white font-bold block">{c.name}</span>
                        <span className="text-slate-500 block mt-0.5">MAPPED TO: {c.zone}</span>
                      </div>
                      <span className="text-emerald-400 font-bold uppercase">[ ONLINE ]</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Subscriptions configurations */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiDollarSign className="text-[#00D9FF]" /> Tariff Rates & Subscriptions
                  </span>
                </div>

                <div className="space-y-5 font-sans text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300 font-bold">
                      <span>BASE PARKING FEE RATE:</span>
                      <span className="text-[#00D9FF]">₹{basePrice}/HOUR</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="100" 
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300 font-bold">
                      <span>EV CHARGER SERVICE RATE:</span>
                      <span className="text-[#00D9FF]">₹{evSurcharge}/FLAT</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="300" 
                      value={evSurcharge}
                      onChange={(e) => setEvSurcharge(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
                    />
                  </div>

                  <div className="border-t border-white/5 pt-4 font-stat-mono text-[9px] text-slate-500 space-y-2">
                    <div className="flex justify-between">
                      <span>GOLD SUBSCRIBER REBATE:</span>
                      <span className="text-white font-bold">20% FLAT RATE OFF</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIP PLATINUM REBATE:</span>
                      <span className="text-white font-bold">30% FLAT RATE OFF</span>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 3: SECURITY & API */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* API Keys Generator */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-5">
                <div className="border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiKey className="text-[#00D9FF]" /> Client API Keys Access
                  </span>
                </div>

                <form onSubmit={generateApiKey} className="flex gap-3 font-sans text-xs">
                  <input
                    type="text"
                    placeholder="New client tag name..."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                  <button
                    type="submit"
                    className="px-5 bg-[#00D9FF]/10 border border-[#00D9FF]/30 hover:border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-bold rounded-xl transition-all uppercase"
                  >
                    Generate
                  </button>
                </form>

                <div className="space-y-3 font-stat-mono text-[9px] text-slate-400">
                  <div className="flex justify-between border-b border-white/5 pb-1 font-bold text-[#00D9FF]">
                    <span>Key Identifier</span>
                    <span>Value Token</span>
                  </div>
                  {apiKeys.map((k, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="text-white font-bold">{k.name}</span>
                      <span>{k.key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backup & Restore Console */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-6">
                <div className="border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiDatabase className="text-[#00D9FF]" /> System Backups Control
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 font-stat-mono text-[10px]">
                  <button
                    onClick={handleBackup}
                    disabled={isBackingUp}
                    className="p-5 border border-white/5 hover:border-[#00D9FF] bg-[#090B14]/40 rounded-xl flex flex-col items-center gap-3 justify-center text-slate-400 hover:text-white transition-all disabled:opacity-50"
                  >
                    <FiDownload className="text-xl text-[#00D9FF]" />
                    <span>{isBackingUp ? 'GENERATING...' : 'CREATE SQL BACKUP'}</span>
                  </button>

                  <button
                    onClick={handleRestore}
                    disabled={isRestoring}
                    className="p-5 border border-white/5 hover:border-[#00D9FF] bg-[#090B14]/40 rounded-xl flex flex-col items-center gap-3 justify-center text-slate-400 hover:text-white transition-all disabled:opacity-50"
                  >
                    <FiUploadCloud className="text-xl text-yellow-400" />
                    <span>{isRestoring ? 'RESTORING...' : 'RESTORE DATABASE'}</span>
                  </button>
                </div>

                <div className="border-t border-white/5 pt-4 text-[9px] font-sans text-slate-500 text-center uppercase tracking-wider">
                  ⚠️ WARNING: Restore operations will overwrite active slots planner telemetries.
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 4: DIAGNOSTICS & SYSTEM */}
          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Server Uptime & Node stats */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-5">
                <div className="border-b border-white/5 pb-3">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiCpu className="text-[#00D9FF]" /> Diagnostics & Live Server Status
                  </span>
                </div>

                <div className="space-y-3 font-stat-mono text-[9px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Node.js Backend Engine:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>YOLO Bounding Inference:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mapbox Path Router:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> ONLINE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPU Core Cluster load:</span>
                    <span className="text-white font-bold">12.4% Usage</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RAM Heap Usage:</span>
                    <span className="text-white font-bold">1.4 GB / 8.0 GB</span>
                  </div>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-4">
                <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                  <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                    <FiDatabase className="text-[#00D9FF]" /> Security Audit Logs
                  </span>
                </div>

                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar text-[9px] font-stat-mono text-slate-400">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                      <span>[{log.time}]</span>
                      <span className="text-white font-bold">{log.action}</span>
                      <span>BY: {log.user}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 5: SUPPORT CENTER (TICKETS) */}
          {activeTab === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-panel p-6.5 rounded-[24px] border border-white/10 bg-[#111827]/30 space-y-5 text-left"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                  <FiAlertTriangle className="text-[#00D9FF]" /> Customer Support / Security Dashboard
                </span>
                <span className="text-[9px] font-stat-mono text-slate-500 uppercase font-bold">
                  {tickets.length} Incidents Pending
                </span>
              </div>

              {tickets.length === 0 ? (
                <div className="py-12 text-center text-slate-600">
                  <FiCheckCircle className="text-3xl mx-auto text-slate-700 animate-pulse mb-2" />
                  <p className="font-sans text-xs">No active support tickets. All systems normal.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-stat-mono text-[10px]">
                  {tickets.map((t) => (
                    <div 
                      key={t.id} 
                      className={`p-4.5 rounded-xl border flex flex-col justify-between h-[230px] ${
                        t.priority === 'CRITICAL' || t.status === 'Escalated'
                          ? 'border-red-500/40 bg-red-950/15 shadow-[0_0_15px_rgba(239,68,68,0.12)]'
                          : 'border-white/5 bg-[#090B14]/50'
                      }`}
                    >
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between items-center leading-none">
                          <span className="text-white font-bold block">{t.id} - {t.type}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                            t.priority === 'CRITICAL' || t.status === 'Escalated' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        
                        <div className="divide-y divide-white/5 space-y-1.5 pt-2">
                          <div className="flex justify-between pb-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">User Name</span>
                            <span className="text-slate-300 font-bold">{t.userName}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">Slot Number</span>
                            <span className="text-[#00D9FF] font-bold">{t.slotNumber}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">Location</span>
                            <span className="text-slate-300">{t.location}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">Time</span>
                            <span className="text-slate-300">{t.time}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500 uppercase">Investigation Status</span>
                            <span className={`font-bold uppercase tracking-wider ${t.status === 'Resolved' ? 'text-emerald-400' : 'text-yellow-400'}`}>{t.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-white/5 pt-3.5 mt-2">
                        <button 
                          onClick={() => handleAcceptCase(t.id)}
                          disabled={t.status === 'Resolved' || t.status === 'Investigating'}
                          className="flex-1 h-8 px-2 bg-[#00D9FF]/10 hover:bg-[#00D9FF] text-[#00D9FF] hover:text-[#090B14] border border-[#00D9FF]/30 rounded-lg text-[8px] font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                        >
                          {t.status === 'Investigating' ? 'Investigating' : 'Accept'}
                        </button>
                        <button 
                          onClick={() => triggerToast(`📡 CCTV: Loaded feed for Camera Node at slot ${t.slotNumber}.`)}
                          className="h-8 px-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-lg text-[8px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer"
                        >
                          CCTV
                        </button>
                        <button 
                          onClick={() => handleResolveIncident(t.id)}
                          disabled={t.status === 'Resolved'}
                          className="h-8 px-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-lg text-[8px] font-bold uppercase transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer"
                        >
                          Resolve
                        </button>
                        <button 
                          onClick={() => triggerToast(`📞 Dialing contact number for user ${t.userName}...`)}
                          className="h-8 px-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-lg text-[8px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
