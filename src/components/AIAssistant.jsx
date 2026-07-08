import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff,
  Cpu, 
  X, 
  MessageSquare, 
  CornerDownLeft,
  Sparkles,
  Zap,
  Car,
  Brain,
  Navigation,
  CreditCard,
  BarChart,
  ShieldAlert,
  MapPin,
  Clock,
  AlertTriangle,
  Award,
  Phone,
  Shield
} from 'lucide-react';

const QUICK_COMMANDS = [
  { label: 'Find Slot', cmd: 'Reserve nearest slot.' },
  { label: 'Find EV Charger', cmd: 'Find EV parking.' },
  { label: 'Locate My Vehicle', cmd: 'Where is my vehicle?' },
  { label: 'Predict Parking', cmd: 'Predict evening parking.' },
  { label: 'Navigate to Slot', cmd: 'Navigate to slot B4.' },
  { label: 'Parking Payment', cmd: 'I parked for 2 hours 45 minutes.' },
  { label: 'Parking Statistics', cmd: 'Open Analytics' },
  { label: 'Emergency Help', cmd: 'Emergency' }
];

export default function AIAssistant({ setActiveMenu, triggerToast, navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, []);
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'ai', type: 'text', text: 'Hello Sankara Narayanan 👋. I am your AI Parking Copilot. How can I guide you today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [thinking, setThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  // Handle Speech Recognition Web API
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      triggerToast('Voice recognition is not supported in this browser.', 'error');
      return;
    }

    // Request microphone access dynamically
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // Permission granted, stop permission probe tracks
        stream.getTracks().forEach(track => track.stop());

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Recognition timeout fallback (10s)
        let timeoutId = setTimeout(() => {
          recognition.stop();
          setIsListening(false);
          triggerToast('Listening timed out.', 'info');
        }, 10000);

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          clearTimeout(timeoutId);
          const speechToText = event.results[0][0].transcript;
          setInputText(speechToText);
          
          // Display the transcribed text briefly before executing command
          setTimeout(() => {
            handleCommand(speechToText);
            setInputText('');
          }, 1200);
        };

        recognition.onerror = (event) => {
          clearTimeout(timeoutId);
          setIsListening(false);
          console.error('Speech recognition runtime error:', event.error, event);
          
          if (event.error === 'not-allowed' || event.error === 'permission-denied') {
            triggerToast('Microphone access is required.', 'error');
          } else if (event.error === 'no-speech') {
            triggerToast('No speech detected. Please speak again.', 'info');
          } else if (event.error === 'network') {
            triggerToast('Network error. Please check your connection.', 'error');
          } else if (event.error === 'audio-capture') {
            triggerToast('Unable to access your microphone.', 'error');
          } else if (event.error === 'aborted') {
            console.log('Speech recognition session cancelled/aborted silently.');
          } else {
            triggerToast('Voice recognition failed. Try again.', 'info');
          }
        };

        recognition.onend = () => {
          clearTimeout(timeoutId);
          setIsListening(false);
        };

        recognition.start();
      })
      .catch(err => {
        console.error('Microphone hardware access denied:', err);
        triggerToast('Microphone access is required.', 'error');
        setIsListening(false);
      });
  };

  // Process selected or spoken command
  const handleCommand = (cmdText) => {
    if (thinking) return;

    // Append User message
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', type: 'text', text: cmdText };
    setMessages(prev => [...prev, userMsg]);

    // Start AI Thinking Sequence
    setThinking(true);
    const steps = [
      '🧠 Analyzing parking data...',
      '🛰️ Checking CCTV feeds...',
      '🧠 Running prediction model...',
      '⚡ Calculating optimal route...',
      '✓ Finalizing result...'
    ];
    
    let i = 0;
    setThinkingText(steps[0]);
    const thinkingInterval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setThinkingText(steps[i]);
      } else {
        clearInterval(thinkingInterval);
        setThinking(false);
        revealAIResponse(cmdText);
      }
    }, 350);
  };

  const revealAIResponse = (cmdText) => {
    const lowerCmd = cmdText.toLowerCase().trim();
    let responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: '' };
    let targetMenu = '';

    // Command Logic Handlers
    if (lowerCmd.includes('emergency')) {
      responseMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        type: 'emergency',
        text: '🚨 CRITICAL STATE DETECTED: Evacuation and emergency guidelines active.'
      };
      targetMenu = 'Emergency';
      triggerToast('EMERGENCY SOS SIGNAL BROADCASTED', 'error');
    } else if (lowerCmd.includes('hours') || lowerCmd.includes('minutes') || lowerCmd.includes('parked for')) {
      // Calculator Card Response
      responseMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        type: 'calculator',
        text: 'Calculated fee for 2 hours 45 minutes.'
      };
    } else if (lowerCmd.includes('crowded') || lowerCmd.includes('most parking') || lowerCmd.includes('availability')) {
      // Live Parking Analysis
      responseMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        type: 'availability',
        text: 'Here is the current localized parking distribution.'
      };
    } else if (lowerCmd.includes('reserve nearest slot') || lowerCmd.includes('reserve slots')) {
      responseText = 'Opening Smart Reserve dashboard... nearest slot selected.';
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Smart Reserve console loaded. Recommend Ground Floor A3 for quickest entry.' };
      targetMenu = 'Smart Reserve';
    } else if (lowerCmd.includes('reserve b4')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'reservation_confirm', text: 'Smart Reserve opened at B4. Confirm Reservation?' };
      targetMenu = 'Smart Reserve';
    } else if (lowerCmd.includes('navigate to slot a5')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Navigating to Slot A5. Autopilot route locked on Ground Floor layout.' };
      targetMenu = 'AI Navigation';
    } else if (lowerCmd.includes('navigate to slot b4') || lowerCmd.includes('navigate to')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'AI Navigation center active. Slot B4 coordinates loaded.' };
      targetMenu = 'AI Navigation';
    } else if (lowerCmd.includes('where is my vehicle') || lowerCmd.includes('find my vehicle') || lowerCmd.includes('find vehicle')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Opening AI Vehicle Finder... MH12 AB 1234 located in Slot B4 on the Ground Floor.' };
      targetMenu = 'AI Vehicle Finder';
    } else if (lowerCmd.includes('predict evening') || lowerCmd.includes('predict parking') || lowerCmd.includes('predict')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'AI Occupancy Prediction v4.8 loaded. Peak congestion expected at 6:00 PM (96% load).' };
      targetMenu = 'AI Occupancy Prediction';
    } else if (lowerCmd.includes('open analytics')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Opening AI Analytics Dashboard center.' };
      targetMenu = 'Analytics';
    } else if (lowerCmd.includes('open profile')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Opening secure user member profile console.' };
      if (navigate) navigate('/profile');
    } else if (lowerCmd.includes('find cctv') || lowerCmd.includes('open cctv')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Opening live CCTV streams... system status online.' };
      targetMenu = 'CCTV Streams';
    } else if (lowerCmd.includes('reward') || lowerCmd.includes('points')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'You currently have 1,250 reward points available to redeem towards parking credit.' };
    } else if (lowerCmd.includes('how long have i parked') || lowerCmd.includes('parked time')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'Your active session duration is 2 Hours 18 Minutes inside Slot B4.' };
    } else if (lowerCmd.includes('what slot is reserved')) {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: 'You currently have Slot A3 reserved on the Ground Floor.' };
    } else {
      responseMsg = { id: `ai-${Date.now()}`, sender: 'ai', type: 'text', text: `Telemetry command understood. Redirecting logic to operations console. How else can I assist?` };
    }

    setMessages(prev => [...prev, responseMsg]);

    if (targetMenu) {
      setActiveMenu(targetMenu);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleCommand(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Floating Copilot holographic panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-[350px] sm:w-[400px] h-[550px] rounded-[28px] border border-[#00D9FF]/20 bg-[#090B14]/90 shadow-[0_10px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden mb-4 backdrop-blur-xl relative"
          >
            {/* Holographic background stripe */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-70" />

            {/* Header */}
            <div className="px-6 py-4.5 bg-[#111827]/40 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center text-[#00D9FF] border border-[#00D9FF]/30 relative">
                  <Cpu size={16} className="animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-[#090B14] animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-xs font-heading font-extrabold text-white uppercase">AI COPILOT</span>
                    <span className="text-[7.5px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider leading-none">Online</span>
                  </div>
                  <span className="text-[7.5px] font-mono text-slate-500 tracking-wide block uppercase mt-1">Powered by ParkSense Intelligence Engine</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
              >
                <X size={14} />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs font-mono text-left scrollbar-thin">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] px-4 py-3 rounded-2xl border text-left leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[#00D9FF]/5 border-[#00D9FF]/35 text-white rounded-tr-sm shadow-[0_0_12px_rgba(0,217,255,0.08)]'
                        : 'bg-[#111827]/70 border-white/10 text-slate-300 rounded-tl-sm shadow-[0_0_12px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    
                    {/* Render standard text response */}
                    {m.type === 'text' && m.text}

                    {/* Render localized availability card */}
                    {m.type === 'availability' && (
                      <div className="space-y-3 font-mono text-[9px] w-full min-w-[220px]">
                        <span className="text-white font-bold uppercase block tracking-wider">Current Availability</span>
                        <div className="divide-y divide-white/5 space-y-2">
                          <div className="flex justify-between pt-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">Ground Floor</span>
                            <span className="text-[#00D9FF] font-bold">35 Slots</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">First Floor</span>
                            <span className="text-white font-bold">12 Slots</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">Second Floor</span>
                            <span className="text-white font-bold">8 Slots</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-emerald-400 font-bold uppercase">Recommended Area</span>
                            <span className="text-emerald-400 font-bold">Ground Floor</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500 uppercase">Accuracy Rate</span>
                            <span className="text-slate-300 font-bold">98.9% CONF</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Render emergency instructions */}
                    {m.type === 'emergency' && (
                      <div className="space-y-3 font-mono text-[9px] w-full min-w-[220px]">
                        <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                          <ShieldAlert className="text-rose-500 animate-pulse" size={12} />
                          <span className="text-rose-500 font-bold uppercase block tracking-wider">Emergency Deck Active</span>
                        </div>
                        <div className="divide-y divide-white/5 space-y-2">
                          <div className="flex justify-between pt-1 border-b border-white/5">
                            <span className="text-slate-400">Nearest Evac Exit</span>
                            <span className="text-white font-bold">North Main Gate</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-400">Security Office</span>
                            <span className="text-white font-bold">Block C Lobby</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-400">Incident Line</span>
                            <span className="text-rose-400 font-bold">+91 99999 12345</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerToast('🚨 SOS ALERT TRIGGERED: Personnel deployed.')}
                          className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white font-bold rounded-xl transition-all shadow-[0_0_12px_rgba(244,63,94,0.15)] flex items-center justify-center gap-1.5 uppercase"
                        >
                          <ShieldAlert size={11} /> Confirm SOS Broadcast
                        </button>
                      </div>
                    )}

                    {/* Render booking confirmation */}
                    {m.type === 'reservation_confirm' && (
                      <div className="space-y-3 font-mono text-[9px] w-full min-w-[220px]">
                        <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                          <Car className="text-[#00D9FF]" size={12} />
                          <span className="text-white font-bold uppercase tracking-wider">Confirm Reservation?</span>
                        </div>
                        <p className="text-slate-400">Slot B4 reserved for 2 Hours on Ground Floor.</p>
                        <button 
                          onClick={() => triggerToast('✓ Slot B4 reserved successfully.')}
                          className="w-full py-2 bg-[#00D9FF]/10 hover:bg-[#00D9FF] hover:text-[#090B14] border border-[#00D9FF]/30 text-[#00D9FF] font-bold rounded-xl transition-all"
                        >
                          Confirm
                        </button>
                      </div>
                    )}

                    {/* Render parking billing receipt */}
                    {m.type === 'calculator' && (
                      <div className="space-y-3 font-mono text-[9px] w-full min-w-[220px]">
                        <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                          <CreditCard className="text-[#00D9FF]" size={12} />
                          <span className="text-white font-bold uppercase block tracking-wider">Parking Fee Receipt</span>
                        </div>
                        <div className="divide-y divide-white/5 space-y-2">
                          <div className="flex justify-between pt-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">Parking Fee</span>
                            <span className="text-white font-bold">₹90</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-white/5">
                            <span className="text-slate-500 uppercase">GST Charges</span>
                            <span className="text-white font-bold">₹16</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-emerald-400 font-bold uppercase">Total Charges</span>
                            <span className="text-emerald-400 font-bold">₹106</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => triggerToast('✓ Billing payment processed successfully.')}
                          className="w-full py-2.5 bg-[#00D9FF]/15 border border-[#00D9FF]/35 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-bold rounded-xl transition-all"
                        >
                          Pay Now
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              ))}

              {/* Holographic Thinking Indicator */}
              {thinking && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] px-4 py-3 rounded-2xl border border-white/10 bg-[#111827]/70 text-slate-400 rounded-tl-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF] animate-ping shrink-0" />
                    <span className="text-[10px] font-mono uppercase tracking-wider animate-pulse">{thinkingText}</span>
                  </div>
                </div>
              )}

              {/* Holographic Voice Recording Overlay */}
              {isListening && (
                <div className="absolute inset-x-6 bottom-[130px] z-30">
                  <div 
                    className="p-4 rounded-2xl border border-red-500/30 flex items-center justify-between text-left font-mono"
                    style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.15)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      </span>
                      <div>
                        <span className="text-[10px] text-red-400 font-bold uppercase block tracking-wider">Listening...</span>
                        <span className="text-[8px] text-slate-400 block mt-0.5">Please speak now. AI is tracking mic feed.</span>
                      </div>
                    </div>
                    
                    {/* Pulsing visual sound wave */}
                    <div className="flex items-end gap-1 h-6">
                      <div className="w-1 bg-red-500 rounded-full animate-[pulse_0.8s_infinite] h-4" />
                      <div className="w-1 bg-red-500 rounded-full animate-[pulse_0.5s_infinite] h-6" />
                      <div className="w-1 bg-red-500 rounded-full animate-[pulse_0.9s_infinite] h-3" />
                      <div className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_infinite] h-5" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* suggestion chips */}
            <div className="px-6 pb-2.5 pt-3.5 flex flex-wrap gap-2 max-h-[90px] overflow-y-auto shrink-0 border-t border-white/5 bg-[#111827]/10">
              {QUICK_COMMANDS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleCommand(chip.cmd)}
                  className="px-3 py-1.5 bg-[#090B14]/80 hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/5 hover:border-[#00D9FF] text-[8.5px] font-mono text-slate-400 uppercase rounded-full transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(0,217,255,0.2)]"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input form */}
            <form onSubmit={handleFormSubmit} className="p-5 border-t border-white/10 bg-[#090B14] flex gap-3 shrink-0">
              <input
                type="text"
                placeholder="Type or click command..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all font-mono"
              />
              
              {/* Voice Trigger Mic button */}
              <button
                type="button"
                onClick={startListening}
                disabled={!isSpeechSupported}
                title={!isSpeechSupported ? "Voice recognition is not supported in this browser." : "Click to start voice command recognition"}
                className={`w-11.5 h-11.5 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                  !isSpeechSupported
                    ? 'bg-white/5 text-slate-600 border-white/5 cursor-not-allowed'
                    : isListening 
                      ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.4)] border-rose-500'
                      : 'bg-[#00D9FF]/10 hover:bg-[#00D9FF] border border-[#00D9FF]/30 text-[#00D9FF] hover:text-[#090B14] hover:border-[#00D9FF]'
                }`}
              >
                {isSpeechSupported ? <Mic size={16} /> : <MicOff size={16} />}
              </button>

              <button
                type="submit"
                className="w-11.5 h-11.5 bg-white/5 hover:bg-[#00D9FF] hover:text-[#090B14] border border-white/10 hover:border-[#00D9FF] rounded-xl flex items-center justify-center transition-all text-slate-400 cursor-pointer"
              >
                <CornerDownLeft size={16} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 rounded-full bg-[#00D9FF] text-[#090B14] flex items-center justify-center text-xl shadow-[0_0_30px_rgba(0,217,255,0.45)] border border-[#00D9FF] hover:scale-110 active:scale-95 transition-all duration-300 relative group z-50 cursor-pointer outline-none"
      >
        <span className="absolute inset-0 rounded-full bg-[#00D9FF]/20 animate-ping pointer-events-none" />
        <MessageSquare className="group-hover:rotate-12 transition-transform duration-300" size={20} strokeWidth={2.4} />
      </button>

    </div>
  );
}
