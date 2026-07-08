import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  Download, 
  Zap, 
  Lock, 
  Clock, 
  FileText, 
  Mail, 
  ArrowLeft,
  Loader2
} from 'lucide-react';

export default function PaymentCenter({ triggerToast }) {
  // Config state
  const [hours, setHours] = useState(4);
  const [membership, setMembership] = useState('gold'); // none, silver, gold, vip
  const [useEvCharging, setUseEvCharging] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); 

  // Payment UI state
  const [paymentMethod, setPaymentMethod] = useState('gpay'); // gpay, phonepe, paytm, upi, credit, debit, applepay
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, waiting, success
  const [timeLeft, setTimeLeft] = useState(300); // 5:00 in seconds

  // Auto-calculated rates
  const calculations = useMemo(() => {
    const baseParking = hours * 40;
    const chargingFee = useEvCharging ? 150 : 0;
    
    let memberDiscountPct = 0;
    if (membership === 'silver') memberDiscountPct = 0.10;
    else if (membership === 'gold') memberDiscountPct = 0.20;
    else if (membership === 'vip') memberDiscountPct = 0.30;
    
    const memberDiscountAmount = Math.round(baseParking * memberDiscountPct);
    const subtotal = Math.max(0, baseParking + chargingFee - memberDiscountAmount - appliedDiscount);
    const tax = Math.round(subtotal * 0.18);
    const platformFee = 10;
    const total = subtotal + tax + platformFee;

    return {
      baseParking,
      chargingFee,
      memberDiscountAmount,
      subtotal,
      tax,
      platformFee,
      total
    };
  }, [hours, membership, useEvCharging, appliedDiscount]);

  // Countdown timer for QR Code payment
  useEffect(() => {
    let timer;
    if (paymentStatus === 'waiting' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setPaymentStatus('idle');
      setQrGenerated(false);
      triggerToast('Payment session expired. Please regenerate QR code.', 'warning');
    }
    return () => clearInterval(timer);
  }, [paymentStatus, timeLeft]);

  // Auto-verify transaction mock loop
  useEffect(() => {
    let checkTimer;
    if (paymentStatus === 'waiting') {
      // Simulate real-time backend websocket check success in 6 seconds
      checkTimer = setTimeout(() => {
        setPaymentStatus('success');
        triggerToast(`Transaction Approved! Paid ₹${calculations.total} via Google Pay.`, 'success');
      }, 6000);
    }
    return () => clearTimeout(checkTimer);
  }, [paymentStatus]);

  // Formatter for countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate QR handler
  const handleGenerateQR = () => {
    setIsGeneratingQR(true);
    setTimeout(() => {
      setIsGeneratingQR(false);
      setQrGenerated(true);
      setPaymentStatus('waiting');
      setTimeLeft(300);
      triggerToast('Dynamic UPI QR code generated with AES-256 signing.', 'success');
    }, 1500);
  };

  // Apply discount coupon code
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'PARKSENSE30') {
      setAppliedDiscount(30);
      triggerToast('Coupon code PARKSENSE30 applied! FLAT ₹30 Off.', 'success');
    } else {
      triggerToast('Invalid coupon code.', 'warning');
    }
  };

  // Download transaction receipt
  const handleDownloadReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Popup blocker active. Please enable popups.', 'warning');
      return;
    }
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const upiRef = `UPI-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const receiptHtml = `
      <html>
        <head>
          <title>ParkSense AI - Receipt</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; color: #111; line-height: 1.5; background: #fff; }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
            .total-row { display: flex; justify-content: space-between; font-weight: bold; border-top: 2px dashed #333; padding-top: 15px; font-size: 16px; }
            .footer { margin-top: 50px; text-align: center; font-size: 11px; color: #666; }
            .stamp { border: 3px double #10B981; color: #10B981; display: inline-block; padding: 8px 15px; font-weight: bold; margin-top: 20px; transform: rotate(-5deg); text-transform: uppercase; font-size: 14px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h2>PARKSENSE AI NETWORKS</h2>
            <p>Smart City Parking Terminal Gateway</p>
            <p>TXN ID: ${txnId}</p>
            <p>UPI REF: ${upiRef}</p>
            <p>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
          </div>
          <div style="margin: 30px 0;">
            <div class="detail-row"><span>LOCATION:</span> <span>Phoenix Marketcity Deck</span></div>
            <div class="detail-row"><span>DURATION:</span> <span>${hours} Hours</span></div>
            <div class="detail-row"><span>BASE PARKING FEE:</span> <span>₹${calculations.baseParking}</span></div>
            <div class="detail-row"><span>EV CHARGING surcharge:</span> <span>₹${calculations.chargingFee}</span></div>
            <div class="detail-row"><span>MEMBERSHIP DISCOUNT (${membership.toUpperCase()}):</span> <span>-₹${calculations.memberDiscountAmount}</span></div>
            <div class="detail-row"><span>TAXES (GST @ 18%):</span> <span>₹${calculations.tax}</span></div>
            <div class="detail-row"><span>PLATFORM PORT CHARGE:</span> <span>₹${calculations.platformFee}</span></div>
            <div class="total-row"><span>GRAND TOTAL:</span> <span>₹${calculations.total}</span></div>
          </div>
          <div style="text-align: center;">
            <div class="stamp">PAID SECURELY VIA GPAY</div>
          </div>
          <div class="footer">
            <p>Thank you for using ParkSense AI Platform.</p>
            <p>Zero carbon emission initiative.</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const handleEmailReceipt = () => {
    triggerToast('Digital invoice sent to registered email address.', 'success');
  };

  return (
    <div className="w-full space-y-8 text-left relative min-h-[750px]">
      
      {/* Floating Status Indicator */}
      <div className="absolute top-0 right-0 z-30 flex items-center gap-3 bg-[#111827]/80 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-lg text-[10px] font-stat-mono">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        <div className="text-slate-400">
          GATEWAY: <span className="text-white font-bold">CONNECTED</span> | 
          ENC: <span className="text-white font-bold">AES-256</span> | 
          LATENCY: <span className="text-[#00D9FF] font-bold">12ms</span>
        </div>
      </div>

      {/* Top Details bar */}
      <div className="glass-panel p-6 rounded-[22px] border border-white/10 flex justify-between items-center w-full bg-[#111827]/40">
        <div>
          <span className="text-[10px] font-stat-mono text-[#00D9FF] tracking-widest font-extrabold uppercase">
            ⚡ TELEMETRY RECEIPT PORTAL
          </span>
          <h2 className="text-2xl font-heading font-extrabold text-white mt-1 uppercase">Phoenix Marketcity</h2>
          <p className="text-xs text-slate-500 font-stat-mono mt-0.5">RES ID: RES-89027418 | DATE: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-[#090B14] border border-white/5 px-5 py-3 rounded-2xl text-right font-stat-mono">
          <span className="text-[8px] text-slate-500 uppercase block">PAYMENT STATE</span>
          <span className={`font-extrabold text-xs block mt-0.5 uppercase ${
            paymentStatus === 'success' ? 'text-emerald-400' : paymentStatus === 'waiting' ? 'text-amber-400 animate-pulse' : 'text-slate-400'
          }`}>
            {paymentStatus === 'success' ? 'APPROVED' : paymentStatus === 'waiting' ? 'WAITING FOR COMPLETION' : 'DRAFT'}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {paymentStatus !== 'success' ? (
          <motion.div 
            key="payment-main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          >
            {/* LEFT COLUMN: RESERVATION DETAILS & INVOICING SUMMARY (65%) */}
            <div className="lg:col-span-2 space-y-8">
              <div className="glass-panel p-8 rounded-[24px] border border-white/8 bg-[#111827]/30 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9FF]/2 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <h3 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">Invoicing Telemetry</h3>
                  <span className="text-[9px] font-stat-mono px-3 py-1 bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] font-bold rounded-full flex items-center gap-1.5">
                    <ShieldCheck size={12} /> AI FRAUD PROTECTION LOCK
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans text-slate-400">
                  {/* Summary inputs parameters */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-300 font-bold font-stat-mono text-[10px]">
                        <span>PARKING DURATION:</span>
                        <span className="text-[#00D9FF]">{hours} HOURS</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="24" 
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
                      />
                    </div>

                    {/* EV switch */}
                    <div className="flex justify-between items-center bg-[#090B14]/40 p-4 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Zap className="text-[#00D9FF] animate-pulse" size={18} />
                        <div className="text-left">
                          <span className="font-bold text-white block">EV charging station</span>
                          <span className="text-[9px] text-slate-500 block">Surcharge flat billing rate</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setUseEvCharging(prev => !prev)}
                        className={`w-11 h-6 rounded-full flex items-center transition-all ${
                          useEvCharging ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                        } p-1`}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Membership selections */}
                    <div className="space-y-2 text-left">
                      <span className="text-slate-300 font-bold block uppercase tracking-wider text-[10px] font-stat-mono">Membership Rebates</span>
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-stat-mono">
                        {[
                          { id: 'none', label: 'NONE (0%)' },
                          { id: 'silver', label: 'SILVER (10%)' },
                          { id: 'gold', label: 'GOLD (20%)' },
                          { id: 'vip', label: 'VIP (30%)' }
                        ].map((tier) => (
                          <button
                            key={tier.id}
                            onClick={() => setMembership(tier.id)}
                            className={`p-2.5 rounded-xl border font-bold transition-all ${
                              membership === tier.id
                                ? 'border-[#00D9FF] bg-[#00D9FF]/5 text-white'
                                : 'border-white/5 bg-[#090B14]/40 text-slate-400 hover:border-white/10'
                            }`}
                          >
                            {tier.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Promo input */}
                    <div className="space-y-2 text-left">
                      <span className="text-slate-300 font-bold block uppercase tracking-wider text-[10px] font-stat-mono font-bold">Apply Coupon Code</span>
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="PARKSENSE30..."
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00D9FF]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-white/5 border border-white/10 hover:border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-bold rounded-xl transition-all uppercase text-[9px] font-stat-mono"
                        >
                          Apply
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Pricing summary */}
                <div className="border-t border-white/5 pt-6 mt-8 space-y-3 font-stat-mono text-[10px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Parking Fee ({hours}h * ₹40/h):</span>
                    <span className="text-white font-bold">₹{calculations.baseParking}</span>
                  </div>
                  {useEvCharging && (
                    <div className="flex justify-between">
                      <span>EV Charging Station Surcharge:</span>
                      <span className="text-white font-bold">₹{calculations.chargingFee}</span>
                    </div>
                  )}
                  {calculations.memberDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Membership discount ({membership.toUpperCase()}):</span>
                      <span>-₹{calculations.memberDiscountAmount}</span>
                    </div>
                  )}
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Coupon flat discount:</span>
                      <span>-₹{appliedDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST Tax (18%):</span>
                    <span className="text-white font-bold">₹{calculations.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Charge:</span>
                    <span className="text-white font-bold">₹{calculations.platformFee}</span>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-2 flex justify-between text-base font-heading font-extrabold text-white">
                    <span>GRAND TOTAL:</span>
                    <span className="text-[#00D9FF] drop-shadow-[0_0_10px_rgba(0,217,255,0.3)]">
                      ₹{calculations.total}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: MODERN PAYMENT METHODS SELECTOR & QR CORE (35%) */}
            <div className="space-y-8">
              <div className="glass-panel p-6.5 rounded-[24px] border border-white/8 bg-[#111827]/30 shadow-2xl relative min-h-[480px] flex flex-col justify-between">
                
                {/* Method content toggler switch */}
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="border-b border-white/5 pb-4">
                    <h3 className="font-heading font-extrabold text-sm text-white uppercase flex items-center gap-2">
                      <Lock size={14} className="text-[#00D9FF]" /> Secure Payment
                    </h3>
                  </div>

                  {!qrGenerated ? (
                    <div className="space-y-4 flex-1">
                      {/* Payment Methods Grid */}
                      <span className="text-[9px] font-stat-mono text-slate-500 uppercase tracking-wider block text-left">Select checkout client:</span>
                      <div className="grid grid-cols-1 gap-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                        {[
                          { id: 'gpay', name: 'Google Pay', logo: '🟢 GPay', isGoogle: true },
                          { id: 'phonepe', name: 'PhonePe', logo: '🟣 PhonePe' },
                          { id: 'paytm', name: 'Paytm', logo: '🔵 Paytm' },
                          { id: 'upi', name: 'UPI ID', logo: '🌐 UPI Direct' },
                          { id: 'card', name: 'Credit Card', logo: '💳 Visa/Mastercard' },
                          { id: 'debit', name: 'Debit Card', logo: '💳 Rupay Debit' },
                          { id: 'applepay', name: 'Apple Pay', logo: ' Pay (Safari)', disabled: true }
                        ].map((m) => (
                          <button
                            key={m.id}
                            onClick={() => !m.disabled && setPaymentMethod(m.id)}
                            disabled={m.disabled}
                            className={`flex justify-between items-center p-3.5 rounded-xl border text-[10px] font-stat-mono font-bold transition-all uppercase ${
                              paymentMethod === m.id
                                ? 'border-[#00D9FF] bg-[#00D9FF]/5 text-white shadow-[0_0_15px_rgba(0,217,255,0.15)]'
                                : 'border-white/5 bg-[#090B14]/40 text-slate-400 hover:border-white/10 disabled:opacity-40'
                            }`}
                          >
                            <span>{m.logo}</span>
                            {m.disabled && <span className="text-[7px] text-red-500 font-bold border border-red-500/20 px-1.5 py-0.5 rounded bg-red-500/5">UNSUPPORTED</span>}
                          </button>
                        ))}
                      </div>

                      {/* Google Pay details panel when GPay is selected */}
                      {paymentMethod === 'gpay' && (
                        <div className="bg-[#090B14]/60 border border-white/5 rounded-xl p-4.5 space-y-3 font-stat-mono text-[9px] text-slate-400 text-left animate-[fadeIn_0.3s_ease-out]">
                          <div className="flex justify-between">
                            <span>CONNECTED CLIENT:</span>
                            <span className="text-white font-bold">********@gmail.com</span>
                          </div>
                          <div className="flex justify-between">
                            <span>VERIFIED HOST:</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <ShieldCheck size={10} /> AUTHENTICATED
                            </span>
                          </div>
                          
                          <button
                            onClick={handleGenerateQR}
                            disabled={isGeneratingQR}
                            className="w-full py-3 bg-[#00D9FF]/10 border border-[#00D9FF]/30 hover:border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-bold rounded-xl transition-all uppercase mt-2 flex items-center justify-center gap-2"
                          >
                            {isGeneratingQR ? (
                              <>
                                <Loader2 size={12} className="animate-spin" />
                                <span>SIGNING DYNAMIC UPI...</span>
                              </>
                            ) : (
                              'Generate Dynamic UPI QR'
                            )}
                          </button>
                        </div>
                      )}

                      {paymentMethod !== 'gpay' && (
                        <div className="bg-[#090B14]/60 border border-white/5 rounded-xl p-4 text-[9px] font-sans text-slate-500 text-center uppercase tracking-wide py-6">
                          🔒 Secure transaction window locked to active terminal nodes.
                        </div>
                      )}
                    </div>
                  ) : (
                    /* QR Generated Waiting Screen */
                    <div className="flex flex-col items-center gap-5 py-2 flex-1 justify-center animate-[fadeIn_0.4s_ease-out]">
                      <div className="relative p-4.5 bg-white rounded-2xl border border-[#00D9FF]/40 shadow-[0_0_25px_rgba(0,217,255,0.2)] flex items-center justify-center overflow-hidden w-44 h-44">
                        <svg className="w-full h-full text-[#090B14]" viewBox="0 0 100 100">
                          <rect x="0" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                          <rect x="5" y="5" width="15" height="15" fill="currentColor" />
                          
                          <rect x="75" y="0" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                          <rect x="80" y="5" width="15" height="15" fill="currentColor" />
                          
                          <rect x="0" y="75" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                          <rect x="5" y="80" width="15" height="15" fill="currentColor" />

                          <rect x="35" y="5" width="8" height="8" fill="currentColor" />
                          <rect x="50" y="15" width="12" height="6" fill="currentColor" />
                          <rect x="35" y="45" width="30" height="10" fill="currentColor" />
                          <rect x="75" y="35" width="10" height="20" fill="currentColor" />
                          <rect x="40" y="75" width="20" height="15" fill="currentColor" />
                          <rect x="75" y="75" width="12" height="12" fill="currentColor" />
                          <circle cx="50" cy="50" r="10" fill="#00D9FF" stroke="#090B14" strokeWidth="3" />
                        </svg>
                        <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_red] style={{ animation: 'scanLaser 1.5s linear infinite' }}" />
                      </div>

                      <div className="w-full font-stat-mono text-[10px] text-slate-400 space-y-2 border-t border-white/5 pt-4">
                        <div className="flex justify-between">
                          <span>UPI ID:</span>
                          <span className="text-white font-bold">parksense@upi</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AMOUNT TETHERED:</span>
                          <span className="text-white font-bold">₹{calculations.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>TIME REMAINING:</span>
                          <span className="text-amber-400 font-bold">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span>STATUS:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> WAITING FOR COMPLETION...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </motion.div>
        ) : (
          /* SUCCESS SCREEN COMPONENT */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-10 rounded-[28px] border border-white/10 max-w-xl mx-auto text-center flex flex-col items-center justify-center gap-6 shadow-2xl relative overflow-hidden bg-[#111827]/40 py-12"
          >
            <div className="absolute inset-0 bg-emerald-500/2 pointer-events-none filter blur-3xl"></div>
            
            {/* Check Animation */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-4xl text-emerald-400 relative z-10">
                <CheckCircle2 size={40} />
              </div>
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping pointer-events-none" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-heading font-extrabold text-lg text-white uppercase tracking-wider">Payment Successful</h3>
              <p className="text-xs text-slate-500 font-sans max-w-sm mx-auto">
                Transaction authenticated. Automated billing networks updated. Access credentials loaded.
              </p>
            </div>

            {/* Receipt Summary ledger */}
            <div className="w-full font-stat-mono text-[10px] text-slate-400 text-left border-t border-b border-white/5 py-5 my-2 space-y-2.5">
              <div className="flex justify-between">
                <span>PAID VIA:</span>
                <span className="text-white font-bold">GOOGLE PAY</span>
              </div>
              <div className="flex justify-between">
                <span>GRAND TOTAL:</span>
                <span className="text-emerald-400 font-extrabold">₹{calculations.total}</span>
              </div>
              <div className="flex justify-between">
                <span>TRANSACTION ID:</span>
                <span className="text-white">TXN-89304728</span>
              </div>
              <div className="flex justify-between">
                <span>UPI REF NUMBER:</span>
                <span className="text-white">UPI-928047180291</span>
              </div>
              <div className="flex justify-between">
                <span>RECEIPT NUMBER:</span>
                <span className="text-white">REC-180274</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full font-sans text-xs">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 py-3 bg-[#00D9FF]/10 border border-[#00D9FF]/30 hover:border-[#00D9FF] text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-bold rounded-xl transition-all uppercase flex items-center justify-center gap-2"
              >
                <Download size={14} /> Download Receipt
              </button>
              
              <button
                onClick={handleEmailReceipt}
                className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-white text-slate-400 hover:text-white font-bold rounded-xl transition-all uppercase flex items-center justify-center gap-2"
              >
                <Mail size={14} /> Email Receipt
              </button>

              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setQrGenerated(false);
                  setHours(4);
                  setAppliedDiscount(0);
                  setCouponCode('');
                }}
                className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all uppercase"
              >
                New Payment
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
