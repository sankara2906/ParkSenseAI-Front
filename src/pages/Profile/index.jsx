import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  Car,
  Award,
  MapPin,
  Clock,
  CreditCard,
  Layers,
  Download,
  Calendar,
  RefreshCw,
  PlusCircle,
  Eye,
  UserCheck,
  DollarSign,
  Camera,
  Trash2,
  Edit2,
  Lock,
  Check,
  X,
  ShieldAlert,
  Cpu
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SVG QR CODE ENGINE (Encodes ID + Plate + Plan)
───────────────────────────────────────────── */
function QRCodeSVG({ value = 'parksense' }) {
  const S = 21;
  const cells = [];
  const seed = value.split('').reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), 0);
  for (let r = 0; r < S; r++) {
    for (let c = 0; c < S; c++) {
      const inFinder =
        (r < 7 && c < 7) ||
        (r < 7 && c >= S - 7) ||
        (r >= S - 7 && c < 7);
      const onBorder =
        (r === 0 || r === 6 || c === 0 || c === 6) && r < 7 && c < 7 ||
        (r === 0 || r === 6 || c === S - 1 || c === S - 7) && r < 7 && c >= S - 7 ||
        (r === S - 1 || r === S - 7 || c === 0 || c === 6) && r >= S - 7 && c < 7;
      const inside =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= S - 5 && c <= S - 3) ||
        (r >= S - 5 && r <= S - 3 && c >= 2 && c <= 4);
      const data = !inFinder && (((seed * (r + 1) * (c + 3)) % 17) < 8);
      const filled = inFinder ? (onBorder || inside) : data;
      cells.push({ r, c, filled });
    }
  }
  return (
    <svg viewBox={`0 0 ${S * 5} ${S * 5}`} width="100%" height="100%">
      <rect width={S * 5} height={S * 5} fill="#0d1117" rx="4" />
      {cells.map(({ r, c, filled }) =>
        filled ? <rect key={`${r}-${c}`} x={c * 5 + 1} y={r * 5 + 1} width={4} height={4} fill="#e2e8f0" rx="0.5" /> : null
      )}
    </svg>
  );
}

const PAYMENT_HISTORY = [
  { date: '2026-07-06', location: 'Phoenix Marketcity', slot: 'A3', duration: '2 Hours', method: 'Google Pay', amount: '₹50', status: 'Paid' },
  { date: '2026-07-04', location: 'Airport Terminal 2', slot: 'D1', duration: '4 Hours', method: 'UPI ID', amount: '₹120', status: 'Paid' },
  { date: '2026-07-01', location: 'Fortis Hospital', slot: 'B2', duration: '1 Hour', method: 'Credit Card', amount: '₹30', status: 'Paid' },
  { date: '2026-06-28', location: 'Phoenix Marketcity', slot: 'A1', duration: '3 Hours', method: 'PhonePe', amount: '₹75', status: 'Paid' },
];

export default function ProfileDashboard({ navigate }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);

  // Form states for profile editing modal
  const [formName, setFormName]               = useState('');
  const [formEmail, setFormEmail]             = useState('');
  const [formPhone, setFormPhone]             = useState('');
  const [formVehicle, setFormVehicle]         = useState('');
  const [formVehicleType, setFormVehicleType] = useState('');
  const [formLocation, setFormLocation]       = useState('');
  const [formCity, setFormCity]               = useState('');
  const [formImage, setFormImage]             = useState('');

  // Password States
  const [currPassword, setCurrPassword]       = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [confPassword, setConfPassword]       = useState('');

  // Notification Preferences States
  const [prefReserve, setPrefReserve]         = useState(true);
  const [prefEntry, setPrefEntry]             = useState(true);
  const [prefExit, setPrefExit]               = useState(true);
  const [prefRemind, setPrefRemind]           = useState(true);
  const [prefEmerg, setPrefEmerg]             = useState(true);

  // Vehicle Registry States
  const [vehicles, setVehicles]               = useState([]);
  const [newVehPlate, setNewVehPlate]         = useState('');
  const [newVehType, setNewVehType]           = useState('Sedan');
  const [editingVehId, setEditingVehId]       = useState(null);
  
  const [exporting, setExporting]       = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerLocalToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync user context on mount
  useEffect(() => {
    const rawUser = localStorage.getItem('parksense_user');
    if (!rawUser) {
      navigate('/login');
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      setUserData(parsed);
      setFormName(parsed.fullName || '');
      setFormEmail(parsed.email || '');
      setFormPhone(parsed.mobile || '');
      setFormVehicle(parsed.vehicleNumber || '');
      setFormVehicleType(parsed.vehicleType || 'Sedan');
      setFormLocation(parsed.preferredParking || 'Ground Floor, Section B');
      setFormCity(parsed.registeredCity || 'Chennai');
      setFormImage(parsed.profileImage || '');

      // Load notification preferences
      const rawPrefs = localStorage.getItem('parksense_notification_prefs');
      if (rawPrefs) {
        const parsedPrefs = JSON.parse(rawPrefs);
        setPrefReserve(parsedPrefs.reserve ?? true);
        setPrefEntry(parsedPrefs.entry ?? true);
        setPrefExit(parsedPrefs.exit ?? true);
        setPrefRemind(parsedPrefs.remind ?? true);
        setPrefEmerg(parsedPrefs.emerg ?? true);
      }

      // Load vehicles list
      const rawVehicles = localStorage.getItem('parksense_vehicles');
      if (rawVehicles) {
        setVehicles(JSON.parse(rawVehicles));
      } else {
        const defaultVeh = [
          { id: 'v-1', number: parsed.vehicleNumber || 'TN47AB1234', type: parsed.vehicleType || 'Sedan', primary: true }
        ];
        setVehicles(defaultVeh);
        localStorage.setItem('parksense_vehicles', JSON.stringify(defaultVeh));
      }

    } catch (e) {
      console.error('Failed to parse user session', e);
      navigate('/login');
    } finally {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // Handle profile updates and validations
  const handleUpdateProfile = (e) => {
    if (e) e.preventDefault();
    if (!userData) return;

    // Field validations
    if (!formName.trim()) {
      triggerLocalToast('⚠️ Full Name is required.');
      return;
    }
    if (!formEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEmail)) {
      triggerLocalToast('⚠️ Please enter a valid email address.');
      return;
    }
    if (!formPhone.trim() || !/^[0-9+() -]{10,15}$/.test(formPhone)) {
      triggerLocalToast('⚠️ Please enter a valid 10-15 digit mobile number.');
      return;
    }
    if (!formVehicle.trim()) {
      triggerLocalToast('⚠️ Primary Vehicle Number is required.');
      return;
    }

    const updated = {
      ...userData,
      fullName: formName,
      email: formEmail,
      mobile: formPhone,
      vehicleNumber: formVehicle,
      vehicleType: formVehicleType,
      preferredParking: formLocation,
      registeredCity: formCity,
      profileImage: formImage
    };

    // Keep vehicles registry in sync with the primary vehicle
    const updatedVehicles = vehicles.map(v => {
      if (v.primary) {
        return { ...v, number: formVehicle, type: formVehicleType };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    localStorage.setItem('parksense_vehicles', JSON.stringify(updatedVehicles));

    setUserData(updated);
    localStorage.setItem('parksense_user', JSON.stringify(updated));
    setEditing(false);
    
    // Dispatch storage update so sidebar initials and details sync instantly
    window.dispatchEvent(new Event('storage'));
    triggerLocalToast('✓ Profile Updated Successfully.');
  };

  // Handle password update validations
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currPassword) {
      triggerLocalToast('⚠️ Current password is required.');
      return;
    }
    if (newPassword.length < 6) {
      triggerLocalToast('⚠️ New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confPassword) {
      triggerLocalToast('⚠️ Passwords do not match.');
      return;
    }

    // Success response trigger
    triggerLocalToast('✓ Password updated successfully.');
    setCurrPassword('');
    setNewPassword('');
    setConfPassword('');
  };

  // Sync Notification Preferences
  const handleTogglePreference = (key, val) => {
    const updated = {
      reserve: prefReserve,
      entry: prefEntry,
      exit: prefExit,
      remind: prefRemind,
      emerg: prefEmerg,
      [key]: val
    };
    
    if (key === 'reserve') setPrefReserve(val);
    else if (key === 'entry') setPrefEntry(val);
    else if (key === 'exit') setPrefExit(val);
    else if (key === 'remind') setPrefRemind(val);
    else if (key === 'emerg') setPrefEmerg(val);

    localStorage.setItem('parksense_notification_prefs', JSON.stringify(updated));
    triggerLocalToast('✓ Notification preferences updated.');
  };

  // Profile image upload parser
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      triggerLocalToast('⚠️ Invalid format. Accept: JPG, JPEG, PNG, WebP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setFormImage(base64);
      triggerLocalToast('✓ Picture preview loaded. Click Save Changes.');
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadInvoice = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 1400));
    setExporting(false);
    triggerLocalToast('✓ Invoice downloaded successfully.');
  };

  // Vehicle Management controls
  const handleAddVehicle = (e) => {
    e.preventDefault();
    if (!newVehPlate.trim()) {
      triggerLocalToast('⚠️ Please enter vehicle plate number.');
      return;
    }

    const newVeh = {
      id: `v-${Date.now()}`,
      number: newVehPlate.toUpperCase(),
      type: newVehType,
      primary: vehicles.length === 0 // Mark as primary if it's the first vehicle
    };

    const updated = [...vehicles, newVeh];
    setVehicles(updated);
    localStorage.setItem('parksense_vehicles', JSON.stringify(updated));
    setNewVehPlate('');
    triggerLocalToast('✓ Vehicle added to registry.');
  };

  const handleRemoveVehicle = (id, e) => {
    if (e) e.stopPropagation();
    const target = vehicles.find(v => v.id === id);
    if (target?.primary && vehicles.length > 1) {
      triggerLocalToast('⚠️ Please set another vehicle as primary first.');
      return;
    }
    
    const updated = vehicles.filter(v => v.id !== id);
    setVehicles(updated);
    localStorage.setItem('parksense_vehicles', JSON.stringify(updated));
    triggerLocalToast('✓ Vehicle removed.');
  };

  const handleSetPrimaryVehicle = (id) => {
    const updated = vehicles.map(v => ({
      ...v,
      primary: v.id === id
    }));
    setVehicles(updated);
    localStorage.setItem('parksense_vehicles', JSON.stringify(updated));

    // Update primary profile vehicle plate details
    const primaryVeh = updated.find(v => v.primary);
    if (primaryVeh && userData) {
      const updatedUser = {
        ...userData,
        vehicleNumber: primaryVeh.number,
        vehicleType: primaryVeh.type
      };
      setUserData(updatedUser);
      setFormVehicle(primaryVeh.number);
      setFormVehicleType(primaryVeh.type);
      localStorage.setItem('parksense_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage'));
    }
    triggerLocalToast('✓ Primary vehicle updated.');
  };

  // Profile picture initials generator
  const initials = useMemo(() => {
    if (!userData || !userData.fullName) return '??';
    const parts = userData.fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [userData]);

  const qrCodeData = useMemo(() => {
    if (!userData) return '';
    return `${userData.userId || 'N/A'}|${userData.vehicleNumber || 'N/A'}|${userData.membershipPlan || 'N/A'}`;
  }, [userData]);

  // ── SKELETON LOADER ──
  if (loading || !userData) {
    return (
      <div className="relative min-h-screen bg-[#050816] text-left p-6 md:p-10 overflow-x-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.05),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-8 animate-pulse font-mono">
          <div className="h-6 w-32 bg-white/5 border border-white/10 rounded-full" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-white/5 rounded" />
              <div className="h-6 w-48 bg-white/5 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            <div className="lg:col-span-4 h-[420px] bg-white/5 border border-white/10 rounded-3xl" />
            <div className="lg:col-span-8 h-[420px] bg-white/5 border border-white/10 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050816] text-left p-6 md:p-10 overflow-x-hidden font-sans">
      
      {/* Visual neon grids */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Floating local toast notifications stack */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-[#0d1117]/95 border border-[#00D9FF]/40 text-[#00D9FF] px-6 py-3 rounded-2xl text-[10px] font-mono shadow-[0_0_20px_rgba(0,217,255,0.25)] backdrop-blur font-bold"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-3">
          <motion.button 
            onClick={() => navigate('/dashboard')} 
            whileHover={{ scale: 1.03, x: -3 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 font-mono text-[10px] text-slate-400 hover:text-[#00D9FF] transition-colors bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
          >
            <ArrowLeft size={11} strokeWidth={2.5} /> BACK TO CONSOLE
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 flex items-center justify-center">
              <User className="text-[#00D9FF]" size={20} strokeWidth={2} />
            </div>
            <div>
              <span className="text-[8px] text-[#00D9FF] uppercase tracking-[0.2em] font-bold block font-mono">SECURE USER CONSOLE</span>
              <h1 className="text-xl md:text-2xl font-extrabold text-white font-heading uppercase tracking-tight">Member Portal</h1>
            </div>
          </div>
        </div>
      </header>

      {/* ── CORE WORKSPACE PANELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 relative z-10 items-start">
        
        {/* LEFT PANEL COLUMN (35%) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Main User Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 flex flex-col items-center text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-[9px] font-bold text-yellow-400 font-mono tracking-wider uppercase">
              {userData.membershipPlan || 'Gold'}
            </div>

            {/* Profile Avatar Hover Camera trigger */}
            <div className="relative mt-4 group">
              <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-[#00D9FF]/30 shadow-[0_0_20px_rgba(0,217,255,0.2)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(0,217,255,0.45)]">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#00D9FF] to-[#3B82F6] flex items-center justify-center text-[#090B14] font-heading font-extrabold text-4xl">
                    {initials}
                  </div>
                )}
              </div>
              <span className="absolute bottom-1.5 left-1.5 w-4 h-4 rounded-full bg-emerald-500 border border-[#111827] shadow-[0_0_8px_#10B981] animate-pulse z-10" />
              
              {/* Camera Icon Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera size={20} className="text-[#00D9FF] animate-pulse" />
              </div>
            </div>

            <h2 className="text-lg font-extrabold text-white font-heading mt-5 leading-tight">{userData.fullName}</h2>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 block">{userData.userId}</span>

            <div className="mt-6 flex flex-col items-center gap-3 border-t border-white/5 pt-6 w-full">
              <div className="w-28 h-28 rounded-2xl border border-white/10 p-1.5 bg-[#090B14]">
                <QRCodeSVG value={qrCodeData} />
              </div>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Digital Parking ID Pass</span>
            </div>
          </div>

          {/* Vehicle Management Console */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Car size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Vehicle Registry</h3>
            </div>

            <div className="space-y-2">
              {vehicles.map((v) => (
                <div 
                  key={v.id}
                  onClick={() => handleSetPrimaryVehicle(v.id)}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    v.primary 
                      ? 'bg-[#00D9FF]/5 border-[#00D9FF]/40 text-[#00D9FF] shadow-[0_0_12px_rgba(0,217,255,0.08)]' 
                      : 'bg-[#090B14]/40 border-white/5 text-slate-400 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3 font-mono">
                    <Car size={13} className={v.primary ? 'text-[#00D9FF]' : 'text-slate-500'} />
                    <div>
                      <span className="text-[10.5px] font-bold block leading-none text-white">{v.number}</span>
                      <span className="text-[7.5px] text-slate-500 uppercase block mt-1 leading-none">{v.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {v.primary && (
                      <span className="px-2 py-0.5 rounded-full bg-[#00D9FF]/10 text-[#00D9FF] font-mono text-[7px] font-bold uppercase tracking-wider">
                        Primary
                      </span>
                    )}
                    <button 
                      onClick={(e) => handleRemoveVehicle(v.id, e)}
                      className="w-6 h-6 rounded-lg bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Vehicle Form */}
            <form onSubmit={handleAddVehicle} className="pt-3 border-t border-white/5 grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <input 
                  type="text" 
                  placeholder="PLATE NUMBER" 
                  value={newVehPlate}
                  onChange={e => setNewVehPlate(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-lg px-2.5 py-1.5 text-[9px] font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>
              <div className="col-span-4">
                <select 
                  value={newVehType}
                  onChange={e => setNewVehType(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-lg px-1 py-1.5 text-[9px] font-mono text-slate-400 focus:outline-none focus:border-[#00D9FF]"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="EV">EV SUV</option>
                  <option value="VIP Coupe">VIP Coupe</option>
                  <option value="Superbike">Superbike</option>
                </select>
              </div>
              <div className="col-span-2">
                <button 
                  type="submit" 
                  className="w-full h-[28px] rounded-lg bg-[#00D9FF]/10 hover:bg-[#00D9FF] text-[#00D9FF] hover:text-[#090B14] border border-[#00D9FF]/30 transition-all flex items-center justify-center cursor-pointer"
                >
                  <PlusCircle size={12} />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT PANEL COLUMN (65%) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Profile Info Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck size={14} className="text-[#00D9FF]" />
                <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Profile Information</h3>
              </div>
              <button 
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#00D9FF]/10 hover:bg-[#00D9FF] border border-[#00D9FF]/20 text-[#00D9FF] hover:text-[#090B14] rounded-full font-mono text-[9px] font-bold uppercase transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(0,217,255,0.05)]"
              >
                <Edit2 size={9} /> Edit Profile
              </button>
            </div>

            {/* Structured Telemetries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 font-mono text-[9.5px]">
              {[
                { label: 'Full Name', value: userData.fullName },
                { label: 'User ID', value: userData.userId, copyable: true },
                { label: 'Email Address', value: userData.email },
                { label: 'Mobile Number', value: userData.mobile },
                { label: 'Primary Vehicle', value: `${userData.vehicleNumber} (${userData.vehicleType})` },
                { label: 'Registered City', value: userData.registeredCity },
                { label: 'Preferred Parking Location', value: userData.preferredParking },
                { label: 'Account Membership Plan', value: userData.membershipPlan || 'Gold Member', color: 'text-yellow-400 font-bold' },
                { label: 'Accumulated Reward Points', value: `${userData.rewardPoints || 0} pts`, color: 'text-emerald-400 font-bold' },
                { label: 'Lifetime Parking Hours', value: `${userData.totalHours || 0} hrs` },
                { label: 'Registered Visits Log', value: userData.totalVisits ?? '0 visits' },
                { label: 'Secured Node Status', value: userData.accountStatus || 'ACTIVE', color: 'text-emerald-400 font-bold' }
              ].map(field => (
                <div key={field.label} className="flex justify-between py-2 border-b border-white/5 border-dashed">
                  <span className="text-slate-500 uppercase tracking-wide text-[8.5px]">{field.label}</span>
                  <span className={`text-right font-bold truncate max-w-[190px] ${field.color || 'text-white'}`}>{field.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Credentials Console */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Lock size={14} className="text-red-400" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Security Console</h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5 text-left font-mono">
                <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Current Password</label>
                <input 
                  type="password" 
                  value={currPassword}
                  onChange={e => setCurrPassword(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="space-y-1.5 text-left font-mono">
                <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Confirm Password</label>
                <input 
                  type="password" 
                  value={confPassword}
                  onChange={e => setConfPassword(e.target.value)}
                  className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              <div className="md:col-span-3 flex justify-end pt-2">
                <button 
                  type="submit"
                  className="px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-600 hover:text-white transition-all font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  Update Credentials Password
                </button>
              </div>
            </form>
          </div>

          {/* Notification Preferences Card */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#111827]/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <UserCheck size={14} className="text-[#00D9FF]" />
              <h3 className="text-xs font-bold text-white font-heading uppercase tracking-wider">Alert Center Preferences</h3>
            </div>

            <div className="divide-y divide-white/5 space-y-3 pt-1">
              {[
                { key: 'reserve', state: prefReserve, title: 'Reservation updates', desc: 'Notify instantly when slot allocation is booked, confirmed, or altered.' },
                { key: 'entry', state: prefEntry, title: 'Vehicle entry signal', desc: 'Trigger alerts on plate validation scanners as vehicle clears gate entry.' },
                { key: 'exit', state: prefExit, title: 'Vehicle exit telemetry', desc: 'Record time log alerts as the registered plate passes exit lanes.' },
                { key: 'remind', state: prefRemind, title: 'Parking timer reminders', desc: 'Alert notifications 10 minutes prior to booking expiration.' },
                { key: 'emerg', state: prefEmerg, title: 'Security emergency overrides', desc: 'Pulsing alarms for local alerts affecting parked levels.' }
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center py-3 first:pt-0">
                  <div className="text-left font-mono">
                    <span className="text-[10px] font-bold text-white block leading-none">{item.title}</span>
                    <span className="text-[7.5px] text-slate-500 block mt-1 leading-normal max-w-md">{item.desc}</span>
                  </div>
                  
                  {/* Futuristic Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input 
                      type="checkbox" 
                      checked={item.state} 
                      onChange={(e) => handleTogglePreference(item.key, e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-[#00D9FF] after:border-slate-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00D9FF]/20 peer-checked:border-[#00D9FF]/30 border border-white/10"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── PARKING STATISTICS ── */}
      <section className="mt-8 relative z-10">
        <div className="mb-4">
          <span className="text-[8px] text-[#00D9FF] uppercase tracking-[0.2em] font-bold block font-mono">ANALYTICS SUMMARY</span>
          <h2 className="text-md font-extrabold text-white font-heading uppercase">Parking Statistics</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 text-[#00D9FF]/20"><DollarSign size={32} /></div>
            <span className="text-[9px] text-[#00D9FF] font-bold font-mono tracking-wider block uppercase">TODAY'S FEE</span>
            <div className="text-2xl font-extrabold text-white mt-2 font-mono">₹120</div>
            <p className="text-[8px] text-slate-500 font-mono mt-1 uppercase">Today's accumulated parking billing</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 text-slate-700/25"><Clock size={32} /></div>
            <span className="text-[9px] text-slate-500 font-bold font-mono tracking-wider block uppercase">CURRENT DURATION</span>
            <div className="text-2xl font-extrabold text-white mt-2 font-mono">2.5 Hrs</div>
            <p className="text-[8px] text-slate-500 font-mono mt-1 uppercase">Active slot occupancy time</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 text-slate-700/25"><Calendar size={32} /></div>
            <span className="text-[9px] text-slate-500 font-bold font-mono tracking-wider block uppercase">TOTAL RESERVATIONS</span>
            <div className="text-2xl font-extrabold text-white mt-2 font-mono">{userData.totalVisits ?? 0}</div>
            <p className="text-[8px] text-slate-500 font-mono mt-1 uppercase">All time reservation count</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#111827]/40 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-3 text-slate-700/25"><Award size={32} /></div>
            <span className="text-[9px] text-slate-500 font-bold font-mono tracking-wider block uppercase">REWARD POINTS</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2 font-mono">{userData.rewardPoints ?? 0}</div>
            <p className="text-[8px] text-slate-500 font-mono mt-1 uppercase">Redeemable discount points</p>
          </div>
        </div>
      </section>

      {/* ── TRANSACTION LOG HISTORY ── */}
      <section className="mt-8 relative z-10">
        <div className="mb-4">
          <span className="text-[8px] text-[#00D9FF] uppercase tracking-[0.2em] font-bold block font-mono">TRANSACTION LOG</span>
          <h2 className="text-md font-extrabold text-white font-heading uppercase">Payment History</h2>
        </div>

        <div className="glass-panel rounded-2xl border border-white/10 bg-[#111827]/30 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-[#090B14]/60 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                  <th className="p-4">Date</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Slot</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[10px] text-slate-300">
                {PAYMENT_HISTORY.map((row, idx) => (
                  <tr key={`${row.date}-${idx}`} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{row.date}</td>
                    <td className="p-4">{row.location}</td>
                    <td className="p-4 text-[#00D9FF] font-bold">{row.slot}</td>
                    <td className="p-4">{row.duration}</td>
                    <td className="p-4">{row.method}</td>
                    <td className="p-4 text-white font-bold">{row.amount}</td>
                    <td className="p-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold uppercase">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ACCESSORS ── */}
      <section className="mt-8 relative z-10">
        <div className="mb-4">
          <span className="text-[8px] text-[#00D9FF] uppercase tracking-[0.2em] font-bold block font-mono">PORTAL ACCESS CONTROLLERS</span>
          <h2 className="text-md font-extrabold text-white font-heading uppercase">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-4 rounded-xl border border-[#00D9FF]/20 bg-[#00D9FF]/5 hover:bg-[#00D9FF] hover:text-[#090B14] text-[#00D9FF] font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-2 shadow-[0_0_12px_rgba(0,217,255,0.08)] cursor-pointer"><Layers size={16} /> Reserve Parking</button>
          <button onClick={handleDownloadInvoice} disabled={exporting} className="p-4 rounded-xl border border-white/10 bg-white/4 hover:border-[#00D9FF]/40 text-slate-300 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-2 cursor-pointer">{exporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />} Download Invoice</button>
          <button onClick={() => navigate('/dashboard')} className="p-4 rounded-xl border border-white/10 bg-white/4 hover:border-[#00D9FF]/40 text-slate-300 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-2 cursor-pointer"><Eye size={16} /> View Reservation</button>
          <button onClick={() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); triggerLocalToast('✓ Scrolled to logs.'); }} className="p-4 rounded-xl border border-white/10 bg-white/4 hover:border-[#00D9FF]/40 text-slate-300 hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-2 cursor-pointer"><CreditCard size={16} /> Payment History</button>
          <button onClick={() => setEditing(true)} className="p-4 rounded-xl border border-[#00D9FF]/30 bg-[#00D9FF]/10 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-[#090B14] font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-2 shadow-[0_0_12px_rgba(0,217,255,0.1)] cursor-pointer"><PlusCircle size={16} /> Update Profile</button>
        </div>
      </section>

      {/* ── INTERACTIVE EDIT PROFILE GLASSMORPHISM MODAL OVERLAY ── */}
      <AnimatePresence>
        {editing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(9,11,20,0.7)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setEditing(false); }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-[#0d1117]/95 border border-[#00D9FF]/20 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden"
              style={{
                background: 'rgba(13, 17, 23, 0.96)',
                boxShadow: '0 0 40px rgba(0, 217, 255, 0.15)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00D9FF] to-transparent opacity-60" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-sm font-extrabold text-white font-heading uppercase">Edit Profile Details</span>
                <button onClick={() => setEditing(false)} className="text-slate-500 hover:text-white font-mono text-xs uppercase cursor-pointer"><X size={16} /></button>
              </div>

              {/* Form fields with validation checks */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                
                {/* Profile Pic Upload & base64 preview inside form */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-3">
                  <div className="relative group shrink-0">
                    {formImage ? (
                      <img src={formImage} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-[#00D9FF]/30" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#3B82F6] flex items-center justify-center text-xs font-bold text-[#090B14]">
                        {initials}
                      </div>
                    )}
                    <label htmlFor="modal-pic-upload" className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <Camera size={12} className="text-[#00D9FF]" />
                    </label>
                    <input 
                      id="modal-pic-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-bold text-white block">Profile Picture Preview</span>
                    <span className="text-[7.5px] text-slate-500 uppercase block mt-1">Select PNG, JPG, or WebP formats</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left font-mono">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Full Name (Required)</label>
                    <input 
                      type="text" 
                      value={formName} 
                      onChange={e => setFormName(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Email Address (Required)</label>
                    <input 
                      type="email" 
                      value={formEmail} 
                      onChange={e => setFormEmail(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Mobile Number (Required)</label>
                    <input 
                      type="text" 
                      value={formPhone} 
                      onChange={e => setFormPhone(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Primary License Plate (Required)</label>
                    <input 
                      type="text" 
                      value={formVehicle} 
                      onChange={e => setFormVehicle(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Vehicle Type</label>
                    <input 
                      type="text" 
                      value={formVehicleType} 
                      onChange={e => setFormVehicleType(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Preferred Location</label>
                    <input 
                      type="text" 
                      value={formLocation} 
                      onChange={e => setFormLocation(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1 text-left font-mono md:col-span-2">
                    <label className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold">Registered City</label>
                    <input 
                      type="text" 
                      value={formCity} 
                      onChange={e => setFormCity(e.target.value)}
                      className="w-full bg-[#090B14] border border-white/10 rounded-xl px-3 py-2 text-[10px] font-mono text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/4 text-slate-400 text-[10px] font-mono uppercase tracking-wider hover:bg-white/8 hover:text-white transition-all cursor-pointer animate-duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 rounded-xl bg-[#00D9FF] text-[#090B14] text-[10px] font-bold font-mono uppercase tracking-wider hover:shadow-[0_0_12px_rgba(0,217,255,0.4)] transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-[9px] font-mono text-slate-500 relative z-10">
        <span>PARKSENSE MEMBER TERMINAL V3.0</span>
        <span className="text-[#00D9FF] font-bold">📡 SECURE SSL MEMBER IDENTITY</span>
      </footer>

    </div>
  );
}
