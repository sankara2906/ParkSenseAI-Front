import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSettings, FiCpu, FiTv, FiGrid, FiBell, FiMoon, FiLock, 
  FiGlobe, FiDatabase, FiCloud, FiFileText, FiInfo, FiSave, FiCheckCircle 
} from 'react-icons/fi';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('General');
  const [saveLoading, setSaveLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Configuration States
  const [settings, setSettings] = useState({
    systemName: 'ParkSense AI',
    facilityName: 'Central Parking Tower',
    timezone: 'UTC+05:30 (IST)',
    language: 'English (US)',
    autoSave: true,
    yoloVersion: 'YOLOv8-Nano (V8.4.89)',
    confidenceThreshold: 85,
    objectDetection: true,
    lpr: true,
    classification: true,
    prediction: true,
    camera1: 'ONLINE',
    camera2: 'ONLINE',
    camera3: 'ONLINE',
    camera4: 'OFFLINE',
    refreshRate: '30 FPS',
    resolution: '1080P',
    detectionInterval: 100,
    maxDuration: '4 Hours',
    timeout: '15 Minutes',
    smartNavigation: true,
    autoAssignment: true,
    reservedRatio: 10,
    emergencySlots: 2,
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    securityAlerts: true,
    fullWarning: true,
    twoFA: true,
    faceAuth: true,
    theme: 'Cyberpunk Dark'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaveLoading(true);
    setTimeout(() => {
      setSaveLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const menuItems = [
    { id: 'General', label: 'General', icon: <FiSettings /> },
    { id: 'AI Detection', label: 'AI Detection', icon: <FiCpu /> },
    { id: 'CCTV Settings', label: 'CCTV Settings', icon: <FiTv /> },
    { id: 'Parking Rules', label: 'Parking Rules', icon: <FiGrid /> },
    { id: 'Notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'Appearance', label: 'Appearance', icon: <FiMoon /> },
    { id: 'Security', label: 'Security', icon: <FiLock /> },
    { id: 'API Integrations', label: 'API Integrations', icon: <FiGlobe /> },
    { id: 'Database', label: 'Database', icon: <FiDatabase /> },
    { id: 'Backup & Restore', label: 'Backup & Restore', icon: <FiCloud /> },
    { id: 'System Logs', label: 'System Logs', icon: <FiFileText /> },
    { id: 'About', label: 'About ParkSense AI', icon: <FiInfo /> }
  ];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 items-start text-left font-sans relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-8 left-1/2 z-50 glass-panel border border-emerald-500/30 bg-emerald-950/40 px-6 py-3.5 rounded-full flex items-center gap-3 text-emerald-400 font-stat-mono text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <FiCheckCircle className="text-base animate-bounce" />
            <span>CONFIGURATION APPLIED SUCCESSFULLY</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: SETTINGS MENU (30% width) */}
      <div className="w-full lg:w-[28%] glass-panel rounded-[24px] border border-white/10 p-5 space-y-2.5 shadow-xl bg-[#111827]/40">
        <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block px-3">NODE SETTINGS GROUPS</span>
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 lg:gap-1">
          {menuItems.map(item => {
            const isTabActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4.5 py-3.5 rounded-xl text-xs font-heading font-medium tracking-wide transition-all border shrink-0 lg:shrink-0 ${
                  isTabActive
                    ? 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.1)]'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: CONFIGURATION EDITORS (72% width) */}
      <div className="w-full lg:w-[72%] glass-panel rounded-[28px] border border-white/10 p-8 shadow-2xl space-y-8 bg-[#111827]/40 min-h-[480px] flex flex-col justify-between">
        
        {/* Editor Content Area */}
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h4 className="font-heading font-extrabold text-base text-white uppercase tracking-wider">
              {activeTab} Config Panel
            </h4>
            <span className="font-stat-mono text-[9px] text-[#00D9FF] uppercase font-bold bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20">
              Active Session
            </span>
          </div>

          {/* GENERAL SETTINGS */}
          {activeTab === 'General' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">System Name</label>
                <input 
                  type="text" 
                  value={settings.systemName}
                  onChange={(e) => handleInputChange('systemName', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Facility Name</label>
                <input 
                  type="text" 
                  value={settings.facilityName}
                  onChange={(e) => handleInputChange('facilityName', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Timezone</label>
                <input 
                  type="text" 
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Language</label>
                <input 
                  type="text" 
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                />
              </div>
              
              <div className="flex items-center justify-between col-span-1 md:col-span-2 pt-4">
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-semibold text-white">Auto Save Configuration</p>
                  <p className="text-[9px] text-slate-500">Enable automatic background synchronization to cluster nodes</p>
                </div>
                <button 
                  onClick={() => handleToggle('autoSave')}
                  className={`w-11 h-6 rounded-full relative transition-all ${
                    settings.autoSave ? 'bg-[#00D9FF]' : 'bg-slate-800'
                  }`}
                >
                  <span className={`w-4.5 h-4.5 rounded-full bg-[#090B14] absolute top-0.75 transition-all ${
                    settings.autoSave ? 'left-5.75' : 'left-0.75'
                  }`}></span>
                </button>
              </div>
            </div>
          )}

          {/* AI DETECTION */}
          {activeTab === 'AI Detection' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">YOLO Model Version</label>
                  <input 
                    type="text" 
                    value={settings.yoloVersion}
                    disabled
                    className="w-full bg-[#090B14]/40 border border-white/5 rounded-xl p-3 font-stat-mono text-xs text-slate-400 cursor-not-allowed"
                  />
                </div>
                
                {/* Confidence threshold slider */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Confidence Threshold</label>
                    <span className="text-[#00D9FF] font-stat-mono text-xs font-bold">{settings.confidenceThreshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="99" 
                    value={settings.confidenceThreshold}
                    onChange={(e) => handleInputChange('confidenceThreshold', parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
                  />
                </div>
              </div>

              <div className="divide-y divide-white/5 pt-4">
                {[
                  { key: 'objectDetection', label: 'Object Detection Engine', desc: 'Runs core YOLO model to frame vehicles and pedestrians' },
                  { key: 'lpr', label: 'License Plate Recognition (LPR)', desc: 'Extracts alpha-numeric character segments from detected plates' },
                  { key: 'classification', label: 'Vehicle Type Classification', desc: 'Identifies car/SUV/truck models for customized tolling rules' },
                  { key: 'prediction', label: 'AI Parking Slot Occupancy Prediction', desc: 'Utilises historic traffic indices to pre-calculate available zones' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4.5">
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[9px] text-slate-500">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleToggle(item.key)}
                      className={`w-11 h-6 rounded-full relative transition-all ${
                        settings[item.key] ? 'bg-[#00D9FF]' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`w-4.5 h-4.5 rounded-full bg-[#090B14] absolute top-0.75 transition-all ${
                        settings[item.key] ? 'left-5.75' : 'left-0.75'
                      }`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CCTV CONFIGURATION */}
          {activeTab === 'CCTV Settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { cam: 'Camera 1', status: settings.camera1, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                  { cam: 'Camera 2', status: settings.camera2, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                  { cam: 'Camera 3', status: settings.camera3, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
                  { cam: 'Camera 4', status: settings.camera4, color: 'text-red-500 border-red-500/20 bg-red-500/5' },
                ].map((c) => (
                  <div key={c.cam} className={`p-4 rounded-xl border text-center font-stat-mono text-xs ${c.color}`}>
                    <p className="text-slate-400 font-sans text-[10px]">{c.cam}</p>
                    <p className="font-bold mt-1 uppercase flex items-center justify-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${c.status === 'ONLINE' ? 'animate-ping' : ''}`}></span>
                      {c.status}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Refresh Frame Rate</label>
                  <select 
                    value={settings.refreshRate}
                    onChange={(e) => handleInputChange('refreshRate', e.target.value)}
                    className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                  >
                    <option value="15 FPS">15 FPS</option>
                    <option value="30 FPS">30 FPS (Standard)</option>
                    <option value="60 FPS">60 FPS (HQ)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Video Resolution</label>
                  <select 
                    value={settings.resolution}
                    onChange={(e) => handleInputChange('resolution', e.target.value)}
                    className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                  >
                    <option value="720P">720P (SD)</option>
                    <option value="1080P">1080P (FHD)</option>
                    <option value="4K">4K (UHD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Inference Interval</label>
                  <input 
                    type="number" 
                    value={settings.detectionInterval}
                    onChange={(e) => handleInputChange('detectionInterval', parseInt(e.target.value))}
                    className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 text-center">
                <button 
                  type="button"
                  className="px-6 py-3 border border-white/10 rounded-xl font-heading text-xs text-white hover:bg-white/5 transition-all"
                >
                  TEST VIDEO STREAMS PATTERN
                </button>
              </div>
            </div>
          )}

          {/* PARKING RULES */}
          {activeTab === 'Parking Rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Maximum Parking Duration</label>
                <select 
                  value={settings.maxDuration}
                  onChange={(e) => handleInputChange('maxDuration', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                >
                  <option value="2 Hours">2 Hours</option>
                  <option value="4 Hours">4 Hours</option>
                  <option value="8 Hours">8 Hours</option>
                  <option value="Unlimited">Unlimited</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Reservation Timeout</label>
                <select 
                  value={settings.timeout}
                  onChange={(e) => handleInputChange('timeout', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                >
                  <option value="5 Minutes">5 Minutes</option>
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="30 Minutes">30 Minutes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Reserved Slots Proportion</label>
                <input 
                  type="number" 
                  value={settings.reservedRatio}
                  onChange={(e) => handleInputChange('reservedRatio', parseInt(e.target.value))}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Emergency Access Slots</label>
                <input 
                  type="number" 
                  value={settings.emergencySlots}
                  onChange={(e) => handleInputChange('emergencySlots', parseInt(e.target.value))}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                />
              </div>

              <div className="col-span-1 md:col-span-2 divide-y divide-white/5 pt-4">
                {[
                  { key: 'smartNavigation', label: 'Enable Smart AR Navigation', desc: 'Projects routing arrows and vehicle footprints dynamically' },
                  { key: 'autoAssignment', label: 'Enable Auto Slot Allocation', desc: 'Allows the AI to reserve slots based on proximity calculations' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-4">
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-semibold text-white">{item.label}</p>
                      <p className="text-[9px] text-slate-500">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => handleToggle(item.key)}
                      className={`w-11 h-6 rounded-full relative transition-all ${
                        settings[item.key] ? 'bg-[#00D9FF]' : 'bg-slate-800'
                      }`}
                    >
                      <span className={`w-4.5 h-4.5 rounded-full bg-[#090B14] absolute top-0.75 transition-all ${
                        settings[item.key] ? 'left-5.75' : 'left-0.75'
                      }`}></span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'Notifications' && (
            <div className="divide-y divide-white/5">
              {[
                { key: 'emailAlerts', label: 'Email Security Alerts', desc: 'Receive detailed PDF summaries of vehicle violations' },
                { key: 'smsAlerts', label: 'SMS Reservation Alerts', desc: 'Send slot reservation details via SMS gateway API' },
                { key: 'pushNotifications', label: 'Web Push Notifications', desc: 'Display slot occupancy transitions inside browser banners' },
                { key: 'securityAlerts', label: 'Critical Intruder Warnings', desc: 'Alert admins instantly if unrecognized license plate detected' },
                { key: 'fullWarning', label: 'Capacity Overload Warnings', desc: 'Broadcast notifications if parking occupancy rates exceed 95%' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-4.5">
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[9px] text-slate-500">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(item.key)}
                    className={`w-11 h-6 rounded-full relative transition-all ${
                      settings[item.key] ? 'bg-[#00D9FF]' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-[#090B14] absolute top-0.75 transition-all ${
                      settings[item.key] ? 'left-5.75' : 'left-0.75'
                    }`}></span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'Appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Active Color Theme</label>
                <select 
                  value={settings.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl p-3 font-sans text-xs text-white focus:outline-none"
                >
                  <option value="Cyberpunk Dark">Cyberpunk Dark (Default)</option>
                  <option value="Sleek Slate">Sleek Slate</option>
                  <option value="Enterprise Light">Enterprise Light</option>
                </select>
              </div>
              <div className="bg-[#090B14]/40 p-5 rounded-xl border border-white/5 text-xs text-slate-400 text-left flex flex-col justify-center">
                <p className="font-bold text-white mb-1">Visual Aesthetic Specs:</p>
                <p>Background: #050816 (Dark Navy)</p>
                <p>Accent Accent: #00D9FF (Neon Blue)</p>
                <p>Interface Glassmorphism Ratio: 15% opacity blur</p>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'Security' && (
            <div className="divide-y divide-white/5">
              {[
                { key: 'twoFA', label: 'Multi-Factor Verification (2FA)', desc: 'Require authentication tokens when changing database nodes' },
                { key: 'faceAuth', label: 'Face Recognition Login', desc: 'Permit secure facial biometrics for physical entry gates' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-4.5">
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-semibold text-white">{item.label}</p>
                    <p className="text-[9px] text-slate-500">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(item.key)}
                    className={`w-11 h-6 rounded-full relative transition-all ${
                      settings[item.key] ? 'bg-[#00D9FF]' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-4.5 h-4.5 rounded-full bg-[#090B14] absolute top-0.75 transition-all ${
                      settings[item.key] ? 'left-5.75' : 'left-0.75'
                    }`}></span>
                  </button>
                </div>
              ))}
              <div className="flex justify-between items-center py-5">
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-semibold text-white">System API Authorization Token</p>
                  <p className="text-[9px] text-slate-500">Confidential admin access key for third-party integrations</p>
                </div>
                <button className="px-4.5 py-2.5 bg-slate-800 border border-white/5 hover:bg-slate-700 rounded-xl font-heading text-xs text-white">
                  GENERATE TOKEN
                </button>
              </div>
            </div>
          )}

          {/* API INTEGRATIONS */}
          {activeTab === 'API Integrations' && (
            <div className="space-y-4 text-xs font-sans text-slate-400">
              <p>ParkSense AI supports standard REST API integrations with external smart-city municipal transit networks.</p>
              <div className="bg-[#090B14] p-5 rounded-xl border border-white/5 text-left space-y-2">
                <p className="font-bold text-white">Registered API Endpoints:</p>
                <div className="font-stat-mono text-[10px]">
                  <p className="text-[#00D9FF]">GET /api/slots/status</p>
                  <p className="text-[#22C55E]">POST /api/reservations/create</p>
                  <p className="text-slate-500">GET /api/cctv/telemetry</p>
                </div>
              </div>
            </div>
          )}

          {/* DATABASE */}
          {activeTab === 'Database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-[#090B14] p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-500 font-sans uppercase">Status</p>
                  <p className="text-emerald-400 font-stat-mono text-base font-bold mt-1">ONLINE</p>
                </div>
                <div className="bg-[#090B14] p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-500 font-sans uppercase">Response</p>
                  <p className="text-white font-stat-mono text-base font-bold mt-1">18 ms</p>
                </div>
                <div className="bg-[#090B14] p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-500 font-sans uppercase">Devices</p>
                  <p className="text-white font-stat-mono text-base font-bold mt-1">16 Active</p>
                </div>
                <div className="bg-[#090B14] p-4 rounded-xl border border-white/5">
                  <p className="text-[9px] text-slate-500 font-sans uppercase">Usage</p>
                  <p className="text-orange-400 font-stat-mono text-base font-bold mt-1">67% Capacity</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl font-stat-mono text-xs text-emerald-400">
                <span>SQLITE CORE METADATA ENGINE SYNC:</span>
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> LIVE SYNC ACTIVE
                </span>
              </div>
            </div>
          )}

          {/* BACKUP & RESTORE */}
          {activeTab === 'Backup & Restore' && (
            <div className="space-y-6">
              <div className="bg-[#090B14] p-5 rounded-xl border border-white/5 space-y-2 text-xs font-sans">
                <div className="flex justify-between">
                  <span className="text-slate-400">Last System Backup:</span>
                  <span className="text-white font-bold font-stat-mono">Today 21:45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Automatic Backup:</span>
                  <span className="text-[#00D9FF] font-bold">ENABLED (DAILY)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-[#00D9FF] text-[#090B14] rounded-xl font-heading text-xs font-bold shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                  CREATE BACKUP ARCHIVE
                </button>
                <button className="flex-1 py-3 border border-white/10 text-white hover:bg-white/5 rounded-xl font-heading text-xs">
                  RESTORE PREVIOUS POINT
                </button>
              </div>
            </div>
          )}

          {/* SYSTEM LOGS */}
          {activeTab === 'System Logs' && (
            <div className="glass-panel p-5 rounded-xl border border-white/5 bg-[#090B14] max-h-[220px] overflow-y-auto space-y-2.5 font-stat-mono text-[10px] text-slate-400">
              <div className="flex gap-4"><span className="text-slate-600">[22:15:30]</span> <span className="text-white">API request: GET /api/slots from 127.0.0.1</span></div>
              <div className="flex gap-4"><span className="text-slate-600">[22:16:02]</span> <span className="text-[#00D9FF]">YOLOv8 Inference loop executed in 3.4ms</span></div>
              <div className="flex gap-4"><span className="text-slate-600">[22:17:45]</span> <span className="text-emerald-400">Database synchronization packet verified successfully</span></div>
              <div className="flex gap-4"><span className="text-slate-600">[22:20:12]</span> <span className="text-orange-400">Warning: Slot P05 reservation timer expired</span></div>
              <div className="flex gap-4"><span className="text-slate-600">[22:21:05]</span> <span className="text-slate-500">Garbage collection resolved, cleared 40 MB memory</span></div>
            </div>
          )}

          {/* ABOUT PARKSENSE */}
          {activeTab === 'About' && (
            <div className="space-y-6 text-xs text-slate-300">
              <div className="flex items-center gap-4 bg-[#090B14] p-5 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00D9FF] to-[#3b82f6] flex items-center justify-center text-[#090B14] font-heading font-extrabold text-base">
                  PS
                </div>
                <div>
                  <h5 className="font-heading font-bold text-sm text-white">ParkSense AI Platform</h5>
                  <p className="font-stat-mono text-[9px] text-[#00D9FF] mt-0.5">VERSION 2.0 (ENTERPRISE OPERATING SYSTEM)</p>
                </div>
              </div>

              <div className="space-y-3 font-sans">
                <p>A futuristic AI Smart Parking management platform designed to automate and orchestrate municipal transit lots utilizing computer vision pipelines and digital twins.</p>
                <div className="border-t border-white/10 pt-4 flex flex-wrap gap-2 text-[9px] font-stat-mono text-slate-400">
                  <span className="bg-slate-800 px-3 py-1 rounded">REACT</span>
                  <span className="bg-slate-800 px-3 py-1 rounded">VITE</span>
                  <span className="bg-slate-800 px-3 py-1 rounded">TAILWIND CSS</span>
                  <span className="bg-slate-800 px-3 py-1 rounded">FASTAPI (PYTHON)</span>
                  <span className="bg-slate-800 px-3 py-1 rounded">YOLOV8 (ULTRALYTICS)</span>
                  <span className="bg-slate-800 px-3 py-1 rounded">OPENCV</span>
                  <span className="bg-slate-800 px-3 py-1 rounded">SQLITE</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Save Configuration Footer Bar */}
        <div className="pt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#00D9FF] hover:bg-[#33D6FF] disabled:bg-slate-800 text-[#090B14] disabled:text-slate-600 font-heading text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(0,217,255,0.2)]"
          >
            {saveLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#090B14]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>APPLYING NODE SYNC...</span>
              </>
            ) : (
              <>
                <FiSave className="text-sm" />
                <span>SAVE CONFIGURATION</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
