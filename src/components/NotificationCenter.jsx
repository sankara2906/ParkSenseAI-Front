import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  Tv, 
  CheckCircle, 
  Loader, 
  ChevronRight, 
  Clock, 
  Radio, 
  Cpu, 
  User, 
  Sparkles, 
  Star, 
  Maximize2, 
  Volume2, 
  Bell, 
  Send,
  X,
  Trash2,
  Info
} from 'lucide-react';

/* ─────────────────────────────────────────────
   USER-CENTRIC NOTIFICATION POOL
───────────────────────────────────────────── */
const USER_NOTIFICATIONS_POOL = [
  { type: 'info', title: 'Reservation Confirmed', desc: 'Your parking slot P5 reservation is confirmed.', severity: 'success', icon: '✅' },
  { type: 'info', title: 'Reservation Cancelled', desc: 'Your slot P5 reservation was cancelled successfully.', severity: 'info', icon: '❌' },
  { type: 'info', title: 'Reservation Reminder', desc: 'Reminder: Your booking starts in 10 minutes.', severity: 'info', icon: '📅' },
  { type: 'info', title: 'Parking Started', desc: 'Your parking session has started at slot P5.', severity: 'info', icon: '⏱️' },
  { type: 'info', title: 'Parking Ended', desc: 'Your parking session has ended successfully.', severity: 'info', icon: '🏁' },
  { type: 'info', title: 'Payment Successful', desc: 'Payment completed successfully for Invoice #PS-9921.', severity: 'success', icon: '💳' },
  { type: 'security_alert', title: '🚨 Unauthorized Vehicle', desc: 'Another vehicle has entered your reserved slot P5.', severity: 'critical', icon: '🚨' },
  { type: 'info', title: 'Security Responding', desc: 'Patrol officer Rajesh is responding to your ticket report.', severity: 'info', icon: '👮' },
  { type: 'info', title: '🚨 Emergency Near Location', desc: 'Emergency response active near your parking location.', severity: 'critical', icon: '⚠️' }
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 'u-init-critical',
      type: 'security_alert',
      title: '🚨 Unauthorized Vehicle',
      desc: 'Another vehicle has entered your reserved slot P5.',
      severity: 'critical',
      icon: '🚨',
      time: '10:45 AM',
      group: 'Today',
      read: false,
      reported: false
    },
    { id: 'u-init-1', type: 'info', title: 'Reservation Confirmed', desc: 'Your parking slot P5 reservation is confirmed.', time: '10:30 AM', group: 'Today', severity: 'success', read: false, icon: '✅' },
    { id: 'u-init-2', type: 'info', title: 'Welcome Back', desc: 'Thank you for using ParkSense AI.', time: '09:15 AM', group: 'Today', severity: 'success', read: true, icon: '✨' },
    { id: 'u-init-3', type: 'info', title: 'Loyalty Points Earned', desc: 'Earned 50 reward points for monthly renewal pass.', time: 'Yesterday', group: 'Yesterday', severity: 'success', read: true, icon: '🏆' }
  ]);
  
  const [toasts, setToasts] = useState([
    {
      id: 'u-init-critical',
      type: 'security_alert',
      title: '🚨 Unauthorized Vehicle',
      desc: 'Another vehicle has entered your reserved slot P5.',
      severity: 'critical',
      icon: '🚨',
      reported: false
    }
  ]);
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Center modal views and controls
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [modalView, setModalView] = useState('main'); // 'main' | 'confirm_report' | 'reporting_loading' | 'report_success' | 'calling' | 'chat' | 'location_shared' | 'emergency_sos'
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello Sankara. How can Parking Security assist you today?' }
  ]);

  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Body scroll lock when modal is active
  useEffect(() => {
    if (isSecurityModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSecurityModalOpen]);

  // Sync coords below bell button
  const updateCoords = () => {
    if (bellRef.current) {
      const rect = bellRef.current.getBoundingClientRect();
      const dropdownWidth = window.innerWidth < 640 ? 320 : 384;
      const calculatedLeft = rect.right - dropdownWidth;
      
      setCoords({
        top: rect.bottom + 12,
        left: Math.max(16, calculatedLeft)
      });
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords, true);
      return () => {
        window.removeEventListener('resize', updateCoords);
        window.removeEventListener('scroll', updateCoords, true);
      };
    }
  }, [dropdownOpen]);

  // Click outside and ESC close dropdown or centered modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setIsSecurityModalOpen(false);
      }
    };
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) return;
      if (bellRef.current && bellRef.current.contains(e.target)) return;
      setDropdownOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  // Periodic user notifications generator (10 seconds, filters duplicates, custom timeouts)
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * USER_NOTIFICATIONS_POOL.length);
      const template = USER_NOTIFICATIONS_POOL[idx];
      const newId = `u-${Date.now()}`;

      const newNotification = {
        id: newId,
        type: template.type,
        title: template.title,
        desc: template.desc,
        severity: template.severity,
        icon: template.icon,
        time: 'Just now',
        group: 'Today',
        read: false,
        reported: false
      };

      setNotifications(prev => {
        if (prev.some(n => n.desc === newNotification.desc)) {
          return prev;
        }
        return [newNotification, ...prev];
      });

      setToasts(prev => {
        if (prev.some(t => t.desc === newNotification.desc)) {
          return prev;
        }
        return [...prev, newNotification];
      });

      // Dismiss timers: success = 4s, warning = 6s, critical = persistent
      let dismissTime = 0;
      if (newNotification.severity === 'success') dismissTime = 4000;
      else if (newNotification.severity === 'warning') dismissTime = 6000;
      else if (newNotification.severity === 'info') dismissTime = 5000;

      if (dismissTime > 0) {
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== newId));
        }, dismissTime);
      }

    }, 10000); // Trigger check loop

    return () => clearInterval(interval);
  }, []);

  // 1. REPORT INCIDENT FUNCTIONALITY
  const handleReportIncident = (id, e) => {
    if (e) e.stopPropagation();

    const rawUser = localStorage.getItem('parksense_user');
    let userName = 'Sankara Narayanan';
    let userId = 'USR-9821';
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        userName = parsed.fullName || userName;
        userId = parsed.userId || userId;
      } catch (e) {}
    }

    const newIncidentReport = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      userName,
      userId,
      slotNumber: 'P5',
      vehicleNumber: 'MH12 AB 1234',
      location: 'Ground Floor, Section B',
      time: new Date().toLocaleTimeString(),
      type: 'Unauthorized Occupation',
      confidence: '99.8%',
      priority: 'HIGH',
      status: 'Pending'
    };

    const existingRaw = localStorage.getItem('parksense_incidents');
    let currentList = [];
    if (existingRaw) {
      try { currentList = JSON.parse(existingRaw); } catch(err) {}
    }
    localStorage.setItem('parksense_incidents', JSON.stringify([newIncidentReport, ...currentList]));

    setNotifications(prev => prev.map(n => n.id === id ? { ...n, reported: true } : n));
    setToasts(prev => prev.map(t => t.id === id ? { ...t, reported: true } : t));

    triggerToast('Incident reported successfully. Our support team has been notified.');

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      setToasts(prev => prev.filter(t => t.id !== id));

      const successId = `u-${Date.now()}`;
      const successNotification = {
        id: successId,
        type: 'info',
        title: 'Incident Submitted',
        desc: 'Your incident has been submitted successfully.',
        severity: 'success',
        icon: '✓',
        time: 'Just now',
        group: 'Today',
        read: false
      };

      setNotifications(prev => [successNotification, ...prev]);
      setToasts(prev => [...prev, successNotification]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== successId));
      }, 4000);
    }, 1500);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleNotificationClick = (n) => {
    handleMarkAsRead(n.id);
    setDropdownOpen(false);
    if (n.title.toLowerCase().includes('reserve') || n.title.toLowerCase().includes('book')) {
      triggerToast('Navigating to Smart Reserve dashboard...');
      window.dispatchEvent(new CustomEvent('parksense_navigate', { detail: 'Smart Reserve' }));
    } else if (n.title.toLowerCase().includes('payment') || n.title.toLowerCase().includes('charge')) {
      triggerToast('Navigating to Payments Center...');
      window.dispatchEvent(new CustomEvent('parksense_navigate', { detail: 'Analytics' }));
    } else if (n.type === 'security_alert' || n.title.toLowerCase().includes('security')) {
      triggerToast('Opening Security Control panel...');
      setIsSecurityModalOpen(true);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const groupedNotifications = useMemo(() => {
    return {
      today: notifications.filter(n => n.group === 'Today'),
      yesterday: notifications.filter(n => n.group === 'Yesterday'),
      earlier: notifications.filter(n => n.group === 'Earlier')
    };
  }, [notifications]);

  // Modal handlers
  const handleOpenSecurityModal = (e) => {
    if (e) e.stopPropagation();
    setModalView('main');
    setIsSecurityModalOpen(true);
  };

  const handleConfirmViolationsReport = () => {
    setModalView('reporting_loading');
    setTimeout(() => {
      setModalView('report_success');
      
      const rawUser = localStorage.getItem('parksense_user');
      let userName = 'Sankara Narayanan';
      let userId = 'USR-9821';
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          userName = parsed.fullName || userName;
          userId = parsed.userId || userId;
        } catch (e) {}
      }
      const newInc = {
        id: `INC-2026-00428`,
        userName,
        userId,
        slotNumber: 'P5',
        vehicleNumber: 'MH12 AB 1234',
        location: 'Ground Floor, Section B',
        time: new Date().toLocaleTimeString(),
        type: 'Unauthorized Occupation',
        confidence: '99.8%',
        priority: 'HIGH',
        status: 'Pending'
      };
      const prev = JSON.parse(localStorage.getItem('parksense_incidents') || '[]');
      localStorage.setItem('parksense_incidents', JSON.stringify([newInc, ...prev]));
    }, 2000);
  };

  const handleStartCall = () => {
    setModalView('calling');
    setTimeout(() => {
      triggerToast('Officer Rajesh Kumar connected. Voice active.');
    }, 1500);
  };

  const handleChatOptionClick = (optionText, replyText) => {
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: optionText },
      { sender: 'ai', text: replyText }
    ]);
  };

  const handleShareLocationData = () => {
    setModalView('location_shared');
    triggerToast('✓ Location shared with Patrol supervisor.');
  };

  const handleTriggerSOS = () => {
    setModalView('emergency_sos');
    
    const prev = JSON.parse(localStorage.getItem('parksense_incidents') || '[]');
    const sosInc = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: 'Sankara Narayanan',
      userId: 'USR-9821',
      slotNumber: 'P5',
      vehicleNumber: 'MH12 AB 1234',
      location: 'Section B Parking',
      time: new Date().toLocaleTimeString(),
      type: '🚨 SOS PANIC SIGNAL',
      confidence: '100% TELEMETRY',
      priority: 'CRITICAL',
      status: 'Escalated'
    };
    localStorage.setItem('parksense_incidents', JSON.stringify([sosInc, ...prev]));
  };

  return (
    <div className="relative">

      {/* Styles for dynamic Sweep scanning effect inside CCTV panel */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweepLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .cctv-scanner-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(0, 217, 255, 0.7);
          box-shadow: 0 0 10px rgba(0, 217, 255, 0.8);
          animation: sweepLine 3.5s linear infinite;
        }
      `}} />

      {/* Toast popup */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200000] bg-[#0d1117]/95 border border-[#00D9FF]/40 text-[#00D9FF] px-6 py-3 rounded-2xl text-[10px] font-mono shadow-[0_0_20px_rgba(0,217,255,0.25)] backdrop-blur font-bold">
            {toastMessage}
          </div>
        )}
      </AnimatePresence>

      {/* CENTERED FUTURISTIC EMERGENCY SUPPORT MODAL & BLACKENED OVERLAY PORTAL */}
      {isSecurityModalOpen && createPortal(
        <>
          {/* Darken page overlay */}
          <div 
            onClick={() => setIsSecurityModalOpen(false)}
            className="fixed inset-0 z-[99998] bg-black/55 backdrop-blur-[8px]"
          />

          {/* Modal Container */}
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] w-[1000px] max-w-[90vw] max-h-[85vh] overflow-y-auto rounded-[22px] text-left font-mono"
            style={{
              background: 'rgba(10, 16, 28, 0.96)',
              border: '1px solid rgba(0, 221, 255, 0.15)',
              boxShadow: '0 20px 80px rgba(0, 221, 255, 0.12)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)'
            }}
          >
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-white/5 sticky top-0 z-20 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#00D9FF]">
                  <Shield size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider flex items-center gap-2">
                    Parking Security Center
                  </h3>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block mt-0.5">24x7 AI Assisted Security Operations</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[9px] text-slate-400">
                <span className="hidden sm:inline">14:58 SECURE</span>
                <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> AI Online
                </span>
                <button 
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/5"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Modal Body views */}
            <div className="p-8">
              {modalView === 'main' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-[fadeIn_0.2s_ease-out]">
                  {/* LEFT COLUMN */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/20 text-center flex flex-col items-center gap-4">
                      <div className="relative">
                        <span className="absolute -inset-1 rounded-full ring-2 ring-[#00D9FF] animate-pulse opacity-60" />
                        <div className="w-20 h-20 rounded-full border-2 border-[#00D9FF] bg-[#00D9FF]/10 flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_20px_rgba(0,217,255,0.35)]">
                          RK
                        </div>
                      </div>
                      <div className="text-center space-y-1">
                        <span className="text-sm font-extrabold text-white block">Rajesh Kumar</span>
                        <span className="text-[9px] text-[#00D9FF] uppercase tracking-wider block font-bold">Security Supervisor</span>
                        <span className="text-[8px] text-slate-500 uppercase block">Patrol Scope: Sector B</span>
                      </div>
                      <div className="flex gap-1.5 text-yellow-400 justify-center">
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                        <Star size={10} fill="currentColor" />
                      </div>
                      <div className="divide-y divide-white/5 font-mono text-[9px] space-y-2 text-left w-full mt-2">
                        <div className="flex justify-between pb-1.5"><span className="text-slate-500">Badge ID</span><span className="text-white font-bold">SEC-2048</span></div>
                        <div className="flex justify-between py-1.5"><span className="text-slate-500">Response ETA</span><span className="text-[#00D9FF] font-bold">2 Minutes</span></div>
                        <div className="flex justify-between pt-1.5"><span className="text-slate-500">System Status</span><span className="text-emerald-400 font-bold uppercase tracking-wider">🟢 In Patrol</span></div>
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/10 space-y-3">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold font-heading">AI Diagnostics Engine</span>
                      <div className="flex flex-col gap-2 font-mono text-[8px]">
                        <span className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 px-2.5 py-1 rounded-lg font-bold">● Plate Recognition Active</span>
                        <span className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 px-2.5 py-1 rounded-lg font-bold font-heading">● CCTV Network Online</span>
                        <span className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 px-2.5 py-1 rounded-lg font-bold">● Patrol Nearby</span>
                        <span className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/25 text-emerald-400 px-2.5 py-1 rounded-lg font-bold">● Emergency Ready</span>
                        <span className="flex items-center gap-1.5 bg-[#00D9FF]/5 border border-[#00D9FF]/20 text-[#00D9FF] px-2.5 py-1 rounded-lg font-bold">● AI Monitoring Enabled</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/10 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-3 text-[9px] text-white font-bold leading-none">
                        <span className="flex items-center gap-1.5 uppercase"><Tv size={12} className="text-red-500" /> Live Cam 08</span>
                        <button onClick={() => triggerToast('📡 Loading fullscreen display layout...')} className="w-5 h-5 rounded hover:bg-white/5 text-slate-400 hover:text-white flex items-center justify-center transition-all"><Maximize2 size={10} /></button>
                      </div>

                      <div className="relative aspect-[21/8] w-full rounded-xl overflow-hidden border border-white/5 bg-[#050816] flex flex-col justify-between p-3.5">
                        <div className="absolute inset-0 bg-[radial-gradient(transparent_60%,rgba(0,0,0,0.85))] z-10" />
                        <div className="cctv-scanner-line z-10" />
                        <div className="flex justify-between items-start z-10 font-mono text-[7.5px] uppercase">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">Live Tracking</span>
                          <span className="text-slate-500">Node CAM-08</span>
                        </div>
                        <div className="bg-black/90 border border-white/10 rounded-lg p-2 z-10 font-mono text-[8px] space-y-1 w-52 text-left self-end">
                          <div className="flex justify-between"><span className="text-slate-500 uppercase">Detection</span><span className="text-[#00D9FF] font-bold">Vehicle Detected</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 uppercase">AI Confidence</span><span className="text-white font-bold">99.8%</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/10 text-left grid grid-cols-2 md:grid-cols-4 gap-4 text-[9.5px]">
                      <div className="bg-[#090B14]/40 border border-white/5 p-3 rounded-xl"><span className="text-slate-500 block uppercase text-[7.5px]">Emergency Hotline</span><span className="text-white font-bold block mt-1">+91 99999 12345</span></div>
                      <div className="bg-[#090B14]/40 border border-white/5 p-3 rounded-xl"><span className="text-slate-500 block uppercase text-[7.5px]">Security Office</span><span className="text-white font-bold block mt-1 font-heading">GF Control Room A</span></div>
                      <div className="bg-[#090B14]/40 border border-white/5 p-3 rounded-xl"><span className="text-slate-500 block uppercase text-[7.5px]">Support Email</span><span className="text-white block mt-1">security@parksense.ai</span></div>
                      <div className="bg-[#090B14]/40 border border-white/5 p-3 rounded-xl"><span className="text-slate-500 block uppercase text-[7.5px]">Current Incident</span><span className="text-emerald-400 font-bold block mt-1 uppercase">None Active</span></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button onClick={handleStartCall} className="p-3 bg-[#111827]/30 border border-white/5 hover:border-[#00D9FF]/40 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400"><Phone size={14} /></div>
                        <div className="min-w-0 flex-1"><span className="text-[10px] font-bold text-white block uppercase leading-none">Call Security</span><span className="text-[7.5px] text-slate-500 block mt-1 uppercase">Pickup &lt; 5s</span></div>
                      </button>

                      <button onClick={() => setModalView('chat')} className="p-3 bg-[#111827]/30 border border-white/5 hover:border-[#00D9FF]/40 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/25 flex items-center justify-center text-[#00D9FF]"><MessageSquare size={14} /></div>
                        <div className="min-w-0 flex-1"><span className="text-[10px] font-bold text-white block uppercase leading-none">AI Security Chat</span><span className="text-[7.5px] text-slate-500 block mt-1 uppercase font-heading">ParkSense Engine</span></div>
                      </button>

                      <button onClick={handleShareLocationData} className="p-3 bg-[#111827]/30 border border-white/5 hover:border-[#00D9FF]/40 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400"><MapPin size={14} /></div>
                        <div className="min-w-0 flex-1"><span className="text-[10px] font-bold text-white block uppercase leading-none">Share Location</span><span className="text-[7.5px] text-slate-500 block mt-1 uppercase">GF Slot P5</span></div>
                      </button>

                      <button onClick={() => setModalView('confirm_report')} className="p-3 bg-[#111827]/30 border border-white/5 hover:border-red-500/40 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-400"><AlertTriangle size={14} /></div>
                        <div className="min-w-0 flex-1"><span className="text-[10px] font-bold text-white block uppercase leading-none font-heading">Report Violation</span><span className="text-[7.5px] text-slate-500 block mt-1 uppercase">Ticket report</span></div>
                      </button>

                      <button onClick={handleTriggerSOS} className="p-3 bg-red-950/20 border border-red-500/30 hover:border-red-500 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer col-span-1 sm:col-span-2 lg:col-span-1">
                        <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center text-white"><Radio size={14} className="animate-pulse" /></div>
                        <div className="min-w-0 flex-1"><span className="text-[10px] font-bold text-red-400 block uppercase leading-none">Emergency SOS</span><span className="text-[7.5px] text-red-500 block mt-1 uppercase font-bold">High Priority</span></div>
                      </button>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-[#111827]/10 text-left">
                      <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block font-bold mb-3">Live Activity Timeline</span>
                      <div className="space-y-2.5 pl-2 border-l border-white/5 text-[9px] font-mono text-slate-400">
                        <div className="relative pl-3">
                          <div className="absolute -left-[12.5px] top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-white font-bold block text-[7.5px]">14:52 PM</span>
                          <span>Vehicle MH12 AB 1234 entered building layout.</span>
                        </div>
                        <div className="relative pl-3 mt-1.5">
                          <div className="absolute -left-[12px] top-1.5 w-1 h-1 rounded-full bg-slate-600" />
                          <span className="text-white block text-[7.5px]">14:53 PM</span>
                          <span>AI verified vehicle license plate successfully.</span>
                        </div>
                        <div className="relative pl-3 mt-1.5">
                          <div className="absolute -left-[12px] top-1.5 w-1 h-1 rounded-full bg-slate-600" />
                          <span className="text-white block text-[7.5px]">14:54 PM</span>
                          <span>Reservation matches slot P5 coordinates.</span>
                        </div>
                        <div className="relative pl-3 mt-1.5">
                          <div className="absolute -left-[12px] top-1.5 w-1 h-1 rounded-full bg-slate-600" />
                          <span className="text-white block text-[7.5px]">14:55 PM</span>
                          <span>Parking session confirmed and active.</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-[#00D9FF]/20 bg-[#111827]/30 text-left space-y-4">
                      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                        <Sparkles size={12} className="text-[#00D9FF]" />
                        <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">AI Security Assistant</span>
                      </div>
                      <div className="space-y-3 font-mono text-[9.5px]">
                        <p className="text-slate-300">Hello Sankara 👋. How can I help you today?</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button onClick={() => handleChatOptionClick('Someone parked in my reserved slot', 'Officer Rajesh Kumar has been dispatched directly to slot P5.')} className="px-2.5 py-1.5 bg-[#090B14] hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 text-[8.5px] rounded-lg transition-all">Someone parked in my slot</button>
                          <button onClick={() => handleChatOptionClick('My vehicle was damaged', 'Alerting guard supervisor. CCTV records for slot P5 are queued.')} className="px-2.5 py-1.5 bg-[#090B14] hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 text-[8.5px] rounded-lg transition-all">My vehicle was damaged</button>
                          <button onClick={() => handleChatOptionClick("I can't locate my vehicle", 'Opening AI Path routing tool... slot B4 GPS tracer is active.')} className="px-2.5 py-1.5 bg-[#090B14] hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 text-[8.5px] rounded-lg transition-all">I can't locate my vehicle</button>
                          <button onClick={() => handleChatOptionClick('Emergency assistance', '⚠️ Emergency override dispatch active.')} className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-600 hover:text-white border border-red-500/20 text-[8.5px] text-red-400 font-bold rounded-lg transition-all">Emergency assistance</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* OTHER MODAL VIEWS */}
              {modalView === 'confirm_report' && (
                <div className="space-y-5 py-4 text-center animate-[fadeIn_0.2s_ease-out]">
                  <AlertTriangle className="text-yellow-500 text-4xl mx-auto animate-bounce" />
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white uppercase font-heading">Report Unauthorized Parking?</h4>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed font-sans">This will notify Parking Security Control Room.</p>
                  </div>
                  <div className="flex gap-4 pt-4 max-w-xs mx-auto">
                    <button onClick={() => setModalView('main')} className="flex-1 py-2.5 border border-white/10 text-slate-400 hover:text-white rounded-xl uppercase tracking-wider transition-all cursor-pointer text-[9.5px]">Cancel</button>
                    <button onClick={handleConfirmViolationsReport} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase transition-all cursor-pointer text-[9.5px]">Confirm Report</button>
                  </div>
                </div>
              )}

              {modalView === 'reporting_loading' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <Loader className="text-3xl text-[#00D9FF] animate-spin" />
                  <span className="text-[10px] text-[#00D9FF] font-bold uppercase block tracking-wider">Sending Incident...</span>
                </div>
              )}

              {modalView === 'report_success' && (
                <div className="space-y-5 py-2 animate-[fadeIn_0.2s_ease-out] text-center">
                  <CheckCircle className="text-emerald-400 text-4xl mx-auto" />
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white uppercase font-heading">✓ Incident Successfully Reported</h4>
                    <p className="text-[9.5px] text-slate-400 leading-normal max-w-xs mx-auto">Security dispatcher Rajesh Kumar has accepted the case ticket file.</p>
                  </div>
                  <div className="bg-[#090B14]/60 border border-white/5 p-4 rounded-xl text-[9.5px] divide-y divide-white/5 space-y-2 text-left w-full max-w-xs mx-auto">
                    <div className="flex justify-between pb-1.5"><span className="text-slate-500">Ticket ID</span><span className="text-white font-bold">#PS-2026-00428</span></div>
                    <div className="flex justify-between py-1.5"><span className="text-slate-500 font-heading">Officer Assigned</span><span className="text-white font-bold">Rajesh Kumar</span></div>
                    <div className="flex justify-between pt-1.5"><span className="text-slate-500">ETA Response</span><span className="text-[#00D9FF] font-bold">2 minutes</span></div>
                  </div>
                  <div className="flex gap-4 pt-4 max-w-xs mx-auto">
                    <button onClick={() => { setIsSecurityModalOpen(false); triggerToast('Opening Active Incidents center logs...'); }} className="flex-1 py-2.5 bg-[#00D9FF]/10 hover:bg-[#00D9FF] hover:text-[#090B14] border border-[#00D9FF]/30 text-[#00D9FF] rounded-xl font-bold uppercase transition-all cursor-pointer text-[9.5px]">View Incident</button>
                    <button onClick={() => setIsSecurityModalOpen(false)} className="flex-1 py-2.5 border border-white/10 text-slate-400 hover:text-white rounded-xl uppercase transition-all cursor-pointer text-[9.5px]">Close</button>
                  </div>
                </div>
              )}

              {modalView === 'calling' && (
                <div className="py-8 flex flex-col items-center justify-center space-y-6 animate-[fadeIn_0.2s_ease-out]">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-[#00D9FF]/20 animate-ping" />
                    <div className="w-16 h-16 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF]"><Phone className="text-2xl animate-pulse" /></div>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-xs text-white font-bold uppercase block tracking-wider animate-pulse">Calling Security...</span>
                    <span className="text-[8.5px] text-[#00D9FF] uppercase block">Officer Connected • Voice Assistance Active</span>
                  </div>
                  <button onClick={() => setModalView('main')} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase transition-all cursor-pointer text-[9px]">End Call</button>
                </div>
              )}

              {modalView === 'chat' && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  <div className="h-[200px] overflow-y-auto bg-[#090B14]/80 border border-white/5 p-4 rounded-2xl flex flex-col gap-2.5 text-[9.5px]">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className={`px-3 py-1.5 rounded-xl max-w-[80%] ${msg.sender === 'user' ? 'bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-white text-right font-heading' : 'bg-white/5 border border-white/10 text-slate-300'}`}>{msg.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[7.5px] text-slate-500 uppercase tracking-widest block font-bold">Select Inquiry Option</span>
                    <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto scrollbar-thin">
                      <button onClick={() => handleChatOptionClick('Someone parked in my reserved slot', 'Officer Rajesh is heading to slot P5.')} className="w-full p-2 bg-[#090B14] hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 text-[8.5px] text-left text-slate-400 rounded-lg transition-all">Someone parked in my slot</button>
                      <button onClick={() => handleChatOptionClick('My vehicle was damaged', 'Logging damage ticket.')} className="w-full p-2 bg-[#090B14] hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 text-[8.5px] text-left text-slate-400 rounded-lg transition-all">My vehicle was damaged</button>
                      <button onClick={() => handleChatOptionClick("I can't locate my vehicle", 'Opening AI Path routing tool... slot B4 GPS tracer is active.')} className="w-full p-2 bg-[#090B14] hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 text-[8.5px] text-left text-slate-400 rounded-lg transition-all font-sans">I can't locate my vehicle</button>
                      <button onClick={() => handleChatOptionClick('Emergency assistance', '⚠️ Emergency override active.')} className="w-full p-2 bg-red-950/20 hover:bg-red-600 hover:text-white border border-red-500/20 text-[8.5px] text-left text-red-400 rounded-lg transition-all font-bold">Emergency assistance</button>
                    </div>
                  </div>
                  <button onClick={() => setModalView('main')} className="w-full py-2 border border-white/10 text-slate-400 hover:text-white rounded-xl uppercase transition-all cursor-pointer text-[9px] text-center">Back</button>
                </div>
              )}

              {modalView === 'location_shared' && (
                <div className="space-y-5 py-2 text-center animate-[fadeIn_0.2s_ease-out]">
                  <CheckCircle className="text-[#00D9FF] text-4xl mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase font-heading">✓ Location Shared</h4>
                    <p className="text-[9.5px] text-slate-400 max-w-xs mx-auto leading-normal">Telemetries shared with Security dispatcher.</p>
                  </div>
                  <button onClick={() => setModalView('main')} className="w-full max-w-xs py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold uppercase transition-all cursor-pointer text-[9.5px]">Return</button>
                </div>
              )}

              {modalView === 'emergency_sos' && (
                <div className="py-6 flex flex-col items-center justify-center space-y-6 animate-[fadeIn_0.2s_ease-out] text-center">
                  <div className="relative">
                    <span className="absolute -inset-4 rounded-full bg-red-500/20 animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center text-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]"><Activity className="text-4xl" /></div>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <span className="text-sm text-red-500 font-extrabold uppercase block tracking-wider">🚨 SOS PANIC SIGNAL EN ROUTE</span>
                  </div>
                  <button onClick={() => { setIsSecurityModalOpen(false); triggerToast('✓ SOS Broadcast cancelled.'); }} className="px-6 py-3 bg-[#0d1117]/90 hover:bg-red-600 hover:text-white border border-red-500/40 text-red-400 rounded-xl font-bold uppercase transition-all cursor-pointer text-[9px]">Cancel SOS Broadcast</button>
                </div>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Bell Button */}
      <button 
        ref={bellRef}
        onClick={() => {
          setDropdownOpen(prev => !prev);
          handleMarkAllRead();
        }}
        className={`relative w-14 h-14 rounded-2xl bg-[#111827]/50 border flex items-center justify-center text-xl transition-all cursor-pointer ${
          dropdownOpen 
            ? 'border-[#00D9FF] text-[#00D9FF]' 
            : 'border-white/10 text-slate-400 hover:text-[#00D9FF] hover:border-[#00D9FF]/30'
        }`}
      >
        <Bell size={20} strokeWidth={2.4} />
        {unreadCount > 0 && (
          <span className="absolute top-4 right-4 w-4 h-4 rounded-full bg-red-500 text-[8px] font-mono font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Floating Active User Notification Toast Stack (Sequenced Queue: Slice 0-1) */}
      <div 
        className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 pointer-events-none w-[320px]"
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999 }}
      >
        <AnimatePresence>
          {toasts.slice(0, 1).map(toast => {
            const isCritical = toast.severity === 'critical';
            let severityStyle = 'border-white/10 bg-[#090B14]/95 text-white';
            if (toast.severity === 'success') severityStyle = 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100';
            else if (toast.severity === 'warning') severityStyle = 'border-amber-500/30 bg-amber-950/90 text-amber-100';
            else if (isCritical) severityStyle = 'border-red-500/40 bg-[#0c1220]/96 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.25)]';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 50, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                onClick={() => handleNotificationClick(toast)}
                className={`p-4.5 rounded-2xl border shadow-2xl flex items-start gap-3 backdrop-blur-md pointer-events-auto cursor-pointer transition-all w-full ${severityStyle}`}
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderColor: isCritical ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 217, 255, 0.15)'
                }}
              >
                <span className="text-base select-none shrink-0">{toast.icon}</span>
                
                <div className="flex-1 min-w-0 text-left font-mono">
                  <div className="flex justify-between items-center leading-none">
                    <span className="font-heading font-extrabold text-[10px] block text-white uppercase tracking-wider">{toast.title}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDismissToast(toast.id); }}
                      className="w-4 h-4 rounded text-slate-500 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </div>
                  <span className="text-slate-300 text-[9.5px] mt-1.5 block leading-normal">{toast.desc}</span>
                  
                  {isCritical && toast.type === 'security_alert' && (
                    <div className="mt-3 flex gap-2 pt-2 border-t border-red-500/20">
                      <button 
                        disabled={toast.reported}
                        onClick={(e) => handleReportIncident(toast.id, e)}
                        className={`flex-1 h-8 rounded-lg text-[8px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer ${
                          toast.reported
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white'
                        }`}
                      >
                        {toast.reported ? 'Reported ✓' : 'Report'}
                      </button>
                      <button 
                        onClick={handleOpenSecurityModal}
                        className="flex-1 h-8 px-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-[8px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer"
                      >
                        Security
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Portal Dropdown for User Activities */}
      {dropdownOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed z-[99999]"
          style={{
            top: coords.top,
            left: coords.left,
            pointerEvents: 'auto'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="w-80 sm:w-[384px] max-h-[500px] rounded-2xl flex flex-col justify-between overflow-hidden text-left"
              style={{
                backgroundColor: 'rgba(12, 18, 32, 0.96)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(0, 217, 255, 0.15)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)'
              }}
            >
              {/* Dropdown Header */}
              <div className="px-5 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-extrabold text-xs text-white uppercase tracking-wider">Activity Center</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#00D9FF]/20 text-[#00D9FF] font-mono text-[8px] font-bold animate-pulse">
                      {unreadCount} NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[9px] font-stat-mono text-[#00D9FF] hover:underline uppercase font-bold cursor-pointer"
                  >
                    Mark All Read
                  </button>
                  <button 
                    onClick={handleClearAll}
                    className="text-[9px] font-stat-mono text-slate-500 hover:text-red-400 flex items-center gap-1 uppercase font-bold cursor-pointer"
                  >
                    <Trash2 size={10} /> Clear All
                  </button>
                </div>
              </div>

              {/* Grouped Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin max-h-[370px]">
                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 space-y-2">
                    <Info className="text-3xl mx-auto text-slate-700 animate-pulse" />
                    <p className="font-sans text-xs">No active activities</p>
                  </div>
                ) : (
                  <>
                    {/* TODAY SECTION */}
                    {groupedNotifications.today.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-[#00D9FF] uppercase tracking-widest block font-bold">Today</span>
                        {groupedNotifications.today.map((n) => {
                          const isCritical = n.type === 'security_alert';
                          let cardBorder = isCritical ? 'border-red-500/40 bg-red-950/20' : n.read ? 'border-white/5 bg-transparent opacity-60' : 'bg-white/5 border-white/10';

                          return (
                            <div 
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3 rounded-xl border flex gap-3 transition-all relative group cursor-pointer ${cardBorder}`}
                            >
                              <span className="text-base select-none shrink-0">{n.icon}</span>
                              <div className="flex-1 min-w-0 font-mono">
                                <div className="flex justify-between items-start">
                                  <span className="font-heading font-extrabold text-white text-[10px] leading-tight flex items-center gap-1.5">
                                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] shrink-0 animate-pulse" />}
                                    {n.title}
                                  </span>
                                  <span className="text-[7px] text-slate-600 font-stat-mono">{n.time}</span>
                                </div>
                                <p className="text-slate-400 mt-1 leading-relaxed text-[9.5px]">{n.desc}</p>
                                
                                {isCritical && (
                                  <div className="mt-3 flex gap-2 pt-2 border-t border-red-500/20">
                                    <button 
                                      disabled={n.reported}
                                      onClick={(e) => handleReportIncident(n.id, e)}
                                      className={`flex-1 h-8 rounded-lg text-[8px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer ${
                                        n.reported
                                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                          : 'bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white'
                                      }`}
                                    >
                                      {n.reported ? 'Reported ✓' : 'Report'}
                                    </button>
                                    <button 
                                      onClick={handleOpenSecurityModal}
                                      className="flex-1 h-8 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-[8px] font-bold uppercase transition-all flex items-center justify-center cursor-pointer"
                                    >
                                      Security
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              <button 
                                onClick={(e) => handleDelete(n.id, e)}
                                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-lg bg-black/40 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* YESTERDAY SECTION */}
                    {groupedNotifications.yesterday.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Yesterday</span>
                        {groupedNotifications.yesterday.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 rounded-xl border flex gap-3 transition-all relative group cursor-pointer ${
                              n.read 
                                ? 'bg-transparent border-white/5 opacity-60' 
                                : 'bg-white/5 border-white/10 shadow-sm'
                            }`}
                          >
                            <span className="text-base select-none shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0 font-mono">
                              <div className="flex justify-between items-start">
                                <span className="font-heading font-extrabold text-white text-[10px] leading-tight flex items-center gap-1.5">
                                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] shrink-0 animate-pulse" />}
                                  {n.title}
                                </span>
                                <span className="text-[7px] text-slate-600 font-stat-mono">{n.time}</span>
                              </div>
                              <p className="text-slate-400 mt-1 leading-relaxed text-[9.5px]">{n.desc}</p>
                            </div>
                            
                            <button 
                              onClick={(e) => handleDelete(n.id, e)}
                              className="absolute top-2.5 right-2.5 w-5 h-5 rounded-lg bg-black/40 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* EARLIER SECTION */}
                    {groupedNotifications.earlier.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Earlier</span>
                        {groupedNotifications.earlier.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-3 rounded-xl border flex gap-3 transition-all relative group cursor-pointer ${
                              n.read 
                                ? 'bg-transparent border-white/5 opacity-60' 
                                : 'bg-white/5 border-white/10 shadow-sm'
                            }`}
                          >
                            <span className="text-base select-none shrink-0">{n.icon}</span>
                            <div className="flex-1 min-w-0 font-mono">
                              <div className="flex justify-between items-start">
                                <span className="font-heading font-extrabold text-white text-[10px] leading-tight flex items-center gap-1.5">
                                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] shrink-0 animate-pulse" />}
                                  {n.title}
                                </span>
                                <span className="text-[7px] text-slate-600 font-stat-mono">{n.time}</span>
                              </div>
                              <p className="text-slate-400 mt-1 leading-relaxed text-[9.5px]">{n.desc}</p>
                            </div>
                            
                            <button 
                              onClick={(e) => handleDelete(n.id, e)}
                              className="absolute top-2.5 right-2.5 w-5 h-5 rounded-lg bg-black/40 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-white/10 bg-white/5 text-center">
                <span className="text-[8px] font-stat-mono text-slate-600 uppercase tracking-widest block">
                  PARKSENSE ACTIVITY LOG v2.5.0
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>,
        document.body
      )}

    </div>
  );
}
