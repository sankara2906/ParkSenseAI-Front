import React, { useState, useEffect, lazy, Suspense, useCallback, useMemo } from 'react';
import { 
  LayoutGrid, 
  ParkingCircle, 
  CalendarCheck2, 
  Cctv, 
  Route, 
  ShieldAlert, 
  FileBarChart2, 
  ChartSpline, 
  Settings2,
  ChevronRight,
  Cpu,
  LogOut,
  Bell,
  CheckCircle,
  Zap,
  Navigation,
  Activity,
  Bookmark,
  Check,
  FileText,
  Database,
  User,
  Brain,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ParkingDigitalTwin = lazy(() => import('../../components/ParkingDigitalTwin'));
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const AnalyticsDashboard = lazy(() => import('../../components/AnalyticsDashboard'));
const UserManagement = lazy(() => import('../../components/UserManagement'));
const SystemSettings = lazy(() => import('../../components/SystemSettings'));
const LPRModule = lazy(() => import('../../components/LPRModule'));
const AINavigationCenter = lazy(() => import('../../components/AINavigationCenter'));
const EmergencyDashboard = lazy(() => import('../../components/EmergencyDashboard'));
const AIAssistant = lazy(() => import('../../components/AIAssistant'));
const NotificationCenter = lazy(() => import('../../components/NotificationCenter'));
const ReportsCenter = lazy(() => import('../../components/ReportsCenter'));
const SmartCityOverview = lazy(() => import('../../components/SmartCityOverview'));
const AdminConsole = lazy(() => import('../../components/AdminConsole'));
const SmartReserve = lazy(() => import('../../components/SmartReserve'));
const AIOccupancyPrediction = lazy(() => import('../../components/AIOccupancyPrediction'));
const AIVehicleFinder = lazy(() => import('../../components/AIVehicleFinder'));


// Master parking slots data per level (P1-P10)
const initialLevelsData = {
  'Ground Floor': [
    { id: 'P1', status: 'Occupied', type: 'standard' },
    { id: 'P2', status: 'Available', type: 'standard' },
    { id: 'P3', status: 'Available', type: 'ev' },
    { id: 'P4', status: 'Reserved', type: 'standard' },
    { id: 'P5', status: 'Occupied', type: 'ev' },
    { id: 'P6', status: 'Available', type: 'standard' },
    { id: 'P7', status: 'Occupied', type: 'standard' },
    { id: 'P8', status: 'Available', type: 'ev' },
    { id: 'P9', status: 'Reserved', type: 'standard' },
    { id: 'P10', status: 'Available', type: 'disabled' },
  ],
  'Level 1': [
    { id: 'P1', status: 'Occupied', type: 'standard' },
    { id: 'P2', status: 'Available', type: 'standard' },
    { id: 'P3', status: 'Available', type: 'ev' },
    { id: 'P4', status: 'Reserved', type: 'standard' },
    { id: 'P5', status: 'Occupied', type: 'ev' },
    { id: 'P6', status: 'Available', type: 'standard' },
    { id: 'P7', status: 'Occupied', type: 'standard' },
    { id: 'P8', status: 'Available', type: 'ev' },
    { id: 'P9', status: 'Reserved', type: 'standard' },
    { id: 'P10', status: 'Available', type: 'disabled' },
  ],
  'Level 2': [
    { id: 'P1', status: 'Available', type: 'standard' },
    { id: 'P2', status: 'Occupied', type: 'standard' },
    { id: 'P3', status: 'Occupied', type: 'ev' },
    { id: 'P4', status: 'Available', type: 'standard' },
    { id: 'P5', status: 'Available', type: 'ev' },
    { id: 'P6', status: 'Occupied', type: 'standard' },
    { id: 'P7', status: 'Available', type: 'standard' },
    { id: 'P8', status: 'Reserved', type: 'ev' },
    { id: 'P9', status: 'Occupied', type: 'standard' },
    { id: 'P10', status: 'Available', type: 'disabled' },
  ],
  'Level 3': [
    { id: 'P1', status: 'Reserved', type: 'standard' },
    { id: 'P2', status: 'Available', type: 'standard' },
    { id: 'P3', status: 'Available', type: 'ev' },
    { id: 'P4', status: 'Occupied', type: 'standard' },
    { id: 'P5', status: 'Occupied', type: 'ev' },
    { id: 'P6', status: 'Available', type: 'standard' },
    { id: 'P7', status: 'Occupied', type: 'standard' },
    { id: 'P8', status: 'Available', type: 'ev' },
    { id: 'P9', status: 'Available', type: 'standard' },
    { id: 'P10', status: 'Reserved', type: 'disabled' },
  ],
  'Basement': [
    { id: 'P1', status: 'Available', type: 'standard' },
    { id: 'P2', status: 'Available', type: 'standard' },
    { id: 'P3', status: 'Occupied', type: 'ev' },
    { id: 'P4', status: 'Reserved', type: 'standard' },
    { id: 'P5', status: 'Available', type: 'ev' },
    { id: 'P6', status: 'Occupied', type: 'standard' },
    { id: 'P7', status: 'Occupied', type: 'standard' },
    { id: 'P8', status: 'Available', type: 'ev' },
    { id: 'P9', status: 'Available', type: 'standard' },
    { id: 'P10', status: 'Available', type: 'disabled' },
  ]
};

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const SIDEBAR_ITEMS = [
  { label: 'City Overview', iconName: 'LayoutGrid' },
  { label: '3D Live Parking', iconName: 'ParkingCircle' },
  { label: 'Smart Reserve', iconName: 'CalendarCheck2' },
  { label: 'CCTV Streams', iconName: 'Cctv' },
  { label: 'AI Navigation', iconName: 'Route' },
  { label: 'AI Occupancy Prediction', iconName: 'Brain' },
  { label: 'AI Vehicle Finder', iconName: 'Search' },
  { label: 'Emergency', iconName: 'ShieldAlert' },
  { label: 'Reports', iconName: 'FileBarChart2' },
  { label: 'Analytics', iconName: 'ChartSpline' },
  { label: 'Admin Console', iconName: 'Settings2' }
];

export const generateSlots = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const id = `P${i + 1}`;
    let type = 'standard';
    if (i < 5) type = 'vip';
    else if (i >= 5 && i < 15) type = 'ev';
    else if (i >= count - 5) type = 'disabled';
    
    let status = 'Available';
    if (type === 'vip') {
      status = Math.random() < 0.6 ? 'VIP Reserved' : 'Available';
    } else {
      const rand = Math.random();
      if (rand < 0.4) status = 'Occupied';
      else if (rand < 0.55) status = 'Reserved';
      else status = 'Available';
    }
    
    return { id, status, type };
  });
};

export default function Dashboard({ navigate }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const raw = localStorage.getItem('parksense_user');
      if (raw) {
        try {
          setCurrentUser(JSON.parse(raw));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadUser();

    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  // Handle SPA navigation from user alerts
  useEffect(() => {
    const handleNav = (e) => {
      if (e.detail) {
        setActiveMenu(e.detail);
      }
    };
    window.addEventListener('parksense_navigate', handleNav);
    return () => window.removeEventListener('parksense_navigate', handleNav);
  }, []);

  const initials = useMemo(() => {
    if (!currentUser || !currentUser.fullName) return '??';
    const parts = currentUser.fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [currentUser]);

  // Filter sidebar items for role-based navigation (Admin Console visible only for admin role)
  const filteredSidebarItems = useMemo(() => {
    return SIDEBAR_ITEMS.filter(item => {
      if (item.label === 'Admin Console') {
        return currentUser?.role === 'admin';
      }
      return true;
    });
  }, [currentUser]);

  const [activeMenu, setActiveMenu] = useState('City Overview');
  const [selectedLevel, setSelectedLevel] = useState('Ground Floor');
  const [levelsData, setLevelsData] = useState(initialLevelsData);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const handleSelectBuilding = useCallback((sectorName, facilityName) => {
    setSelectedSector(sectorName);
    setSelectedFacility(facilityName);
    setActiveMenu('Smart Reserve');
  }, []);
  
  // Form Reservation state
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(2);
  const [vehicleNumber, setVehicleNumber] = useState('MH-12-EV-2026');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState(null);

  // AI Scheduler States
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00');
  const [countdown, setCountdown] = useState(900); // 15 mins in seconds
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStepText, setBookingStepText] = useState('');
  const [recentEvents, setRecentEvents] = useState([
    { id: 'ev-init-1', time: '23:45:10', message: 'AI Radar calibration check complete.', type: 'info' },
    { id: 'ev-init-2', time: '23:46:02', message: 'YOLO CCTV camera node #12 calibrated.', type: 'success' },
    { id: 'ev-init-3', time: '23:48:15', message: 'Entry gate sensor online.', type: 'info' },
    { id: 'ev-init-4', time: '23:50:01', message: 'Digital twin model synchronized.', type: 'info' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedSector === 'Concert Venues') {
      const generatedData = {
        'Ground Floor': generateSlots(60),
        'Level 1': generateSlots(60),
        'Level 2': generateSlots(60),
        'Level 3': generateSlots(60),
        'Basement': generateSlots(60),
      };
      setLevelsData(generatedData);
    } else {
      setLevelsData(initialLevelsData);
    }
  }, [selectedSector]);

  const formatCountdown = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBookSlot = (e) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setBookingLoading(true);
    setBookingStepText('Searching nearby parking...');

    setTimeout(() => {
      setBookingStepText('Finding optimal route...');
    }, 800);

    setTimeout(() => {
      setBookingStepText('Slot Reserved Successfully!');
    }, 1600);

    setTimeout(() => {
      setBookingLoading(false);
      setBookingSuccess(true);
      setBookingReceipt({
        code: `RECEIPT-${Math.floor(100000 + Math.random() * 900000)}`,
        slotId: selectedSlotId,
        vehicle: 'Electric Sedan',
        cost: duration * 60
      });
      triggerToast(`Slot ${selectedSlotId} reserved successfully.`, 'success');
    }, 2400);
  };

  // CCTV Streams state hooks
  const [cctvStats, setCctvStats] = useState({
    total_slots: 4,
    available_slots: 4,
    occupied_slots: 0,
    reserved_slots: 0,
    vehicles_detected: 0,
    ai_confidence: 0.0,
    fps: 30.0,
    camera_status: "ONLINE",
    logs: []
  });
  const [cctvSourceInput, setCctvSourceInput] = useState("0");
  const [configSuccess, setConfigSuccess] = useState(false);

  // LPR OCR States
  const [cctvSubTab, setCctvSubTab] = useState('surveillance');

  useEffect(() => {
    if (activeMenu !== 'CCTV Streams') return;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/cctv/stats`);
        if (res.ok) {
          const data = await res.json();
          if (data.logs) {
            data.logs = data.logs.map((log) => ({
              ...log,
              id: log.id || `cctv-log-${log.time}-${log.text.replace(/\s+/g, '-').toLowerCase()}`
            }));
          }
          setCctvStats(data);
        }
      } catch (err) {
        console.warn("Failed to fetch CCTV stats from backend: ", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [activeMenu]);

  const handleSourceChange = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/cctv/config?source=${encodeURIComponent(cctvSourceInput)}`, {
        method: 'POST'
      });
      if (res.ok) {
        setConfigSuccess(true);
        setTimeout(() => setConfigSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update CCTV source: ", err);
    }
  };

  // Live Notifications Toasts
  const [toasts, setToasts] = useState([]);
  const triggerToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [{ id, message, type }, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleSlotStatusChange = useCallback((slotId, nextStatus) => {
    setLevelsData(prev => {
      const updatedLevel = prev[selectedLevel].map(s => {
        if (s.id === slotId) {
          return { ...s, status: nextStatus };
        }
        return s;
      });
      return { ...prev, [selectedLevel]: updatedLevel };
    });
  }, [selectedLevel]);

  // Time clock display
  const [timeString, setTimeString] = useState('17:19:43');

  // Sync clock time
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTimeString(d.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulating random occupancy updates on the grid
  useEffect(() => {
    const timer = setInterval(() => {
      const activeSlots = levelsData[selectedLevel];
      const randomSlot = activeSlots[Math.floor(Math.random() * activeSlots.length)];
      if (randomSlot.id === selectedSlotId) return;

      const nextStatus = randomSlot.status === 'Available' 
        ? (Math.random() < 0.35 ? 'Reserved' : 'Occupied') 
        : 'Available';

      setLevelsData(prev => {
        const updatedLevel = prev[selectedLevel].map(s => {
          if (s.id === randomSlot.id) {
            return { ...s, status: nextStatus };
          }
          return s;
        });
        return { ...prev, [selectedLevel]: updatedLevel };
      });

      // Trigger realistic live notification toasts
      const messages = {
        'Occupied': [
          `Vehicle checked-in at slot ${randomSlot.id}.`,
          `License plate recognized: check-in slot ${randomSlot.id}.`,
          `AI detection sync: slot ${randomSlot.id} occupied.`
        ],
        'Reserved': [
          `Slot ${randomSlot.id} reserved successfully.`,
          `Reservation confirmed: slot ${randomSlot.id}.`,
          `User reservation: slot ${randomSlot.id} secured.`
        ],
        'Available': [
          `Vehicle exited slot ${randomSlot.id}.`,
          `Slot ${randomSlot.id} vacated and cleared.`,
          `Toll completed: slot ${randomSlot.id} available.`
        ]
      };
      const list = messages[nextStatus];
      const selectedMsg = list[Math.floor(Math.random() * list.length)];
      triggerToast(selectedMsg, nextStatus === 'Reserved' ? 'ai' : nextStatus === 'Occupied' ? 'info' : 'success');
      setRecentEvents(prev => [
        { id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, time: new Date().toTimeString().split(' ')[0], message: selectedMsg, type: nextStatus === 'Reserved' ? 'ai' : nextStatus === 'Occupied' ? 'info' : 'success' },
        ...prev
      ].slice(0, 10));

    }, 5000);

    return () => clearInterval(timer);
  }, [selectedLevel, selectedSlotId, levelsData]);

  const handleSlotSelect = (slot) => {
    if (slot.status === 'Occupied' || slot.status === 'Reserved') return;
    setSelectedSlotId(slot.id === selectedSlotId ? null : slot.id);
  };

  const handleBookReservation = (e) => {
    e.preventDefault();
    if (!selectedSlotId) return;

    setLevelsData(prev => {
      const updatedLevel = prev[selectedLevel].map(s => {
        if (s.id === selectedSlotId) {
          return { ...s, status: 'Reserved' };
        }
        return s;
      });
      return { ...prev, [selectedLevel]: updatedLevel };
    });

    const receipt = {
      slotId: selectedSlotId,
      level: selectedLevel,
      vehicle: vehicleNumber,
      time: startTime,
      hours: duration,
      cost: duration * 60,
      code: `PK-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setBookingReceipt(receipt);
    setBookingSuccess(true);
    setSelectedSlotId(null);
  };

  const currentLevelSlots = levelsData[selectedLevel];
  const occupiedCount = currentLevelSlots.filter(s => s.status === 'Occupied').length;
  const reservedCount = currentLevelSlots.filter(s => s.status === 'Reserved').length;
  const occupancyRate = Math.round(((occupiedCount + reservedCount) / currentLevelSlots.length) * 100);

  const sectorsList = [
    { id: 'malls', name: 'Shopping Malls', icon: '🛍️', locations: 15, slots: 14250, occupancy: 74, status: '99.8%', cctv: '320/320' },
    { id: 'hospitals', name: 'Hospitals', icon: '🏥', locations: 20, slots: 11050, occupancy: 88, status: '100%', cctv: '96/96' },
    { id: 'airports', name: 'Airports', icon: '✈️', locations: 10, slots: 8500, occupancy: 62, status: '99.4%', cctv: '240/240' },
    { id: 'railways', name: 'Railway Stations', icon: '🚉', locations: 20, slots: 21800, occupancy: 78, status: '99.1%', cctv: '80/80' },
    { id: 'universities', name: 'Colleges & Universities', icon: '🎓', locations: 30, slots: 40600, occupancy: 42, status: '100%', cctv: '48/48' },
    { id: 'it_parks', name: 'IT Parks', icon: '💻', locations: 16, slots: 42400, occupancy: 67, status: '99.7%', cctv: '180/180' },
    { id: 'stadiums', name: 'Cricket Stadiums', icon: '🏏', locations: 9, slots: 12200, occupancy: 15, status: '98.4%', cctv: '120/120' },
    { id: 'concerts', name: 'Concert Venues', icon: '🎵', locations: 10, slots: 6840, occupancy: 55, status: '99.5%', cctv: '128/128' }
  ];

  const mallsList = [
    { name: 'Phoenix Marketcity', location: 'Velachery, Chennai', total: 1250, avail: 324, occupied: 842, reserved: 84, ev: 42, vip: 20, floors: 5, cctv: 'ONLINE', ai: 'ACTIVE', dist: '2.4 km', image: '🛍️' },
    { name: 'Express Avenue', location: 'Royapettah, Chennai', total: 950, avail: 142, occupied: 720, reserved: 68, ev: 30, vip: 15, floors: 4, cctv: 'ONLINE', ai: 'ACTIVE', dist: '5.1 km', image: '🛒' },
    { name: 'VR Chennai', location: 'Anna Nagar, Chennai', total: 1100, avail: 280, occupied: 740, reserved: 55, ev: 38, vip: 12, floors: 4, cctv: 'ONLINE', ai: 'ACTIVE', dist: '6.8 km', image: '🏬' },
    { name: 'Nexus Vijaya Mall', location: 'Vadapalani, Chennai', total: 800, avail: 95, occupied: 650, reserved: 40, ev: 24, vip: 10, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '4.2 km', image: '🛍️' },
    { name: 'Spencer Plaza', location: 'Mount Road, Chennai', total: 450, avail: 210, occupied: 200, reserved: 30, ev: 10, vip: 5, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '4.9 km', image: '🏛️' },
    { name: 'Brookefields Mall', location: 'R.S. Puram, Coimbatore', total: 700, avail: 180, occupied: 480, reserved: 28, ev: 18, vip: 8, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '8.5 km', image: '🛍️' },
    { name: 'Prozone Mall', location: 'Sathy Road, Coimbatore', total: 1000, avail: 420, occupied: 510, reserved: 45, ev: 30, vip: 15, floors: 2, cctv: 'ONLINE', ai: 'ACTIVE', dist: '11.2 km', image: '🏬' },
    { name: 'Marina Mall', location: 'OMR, Egattur', total: 850, avail: 290, occupied: 500, reserved: 42, ev: 22, vip: 10, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '15.4 km', image: '🌊' },
    { name: 'Ampa Skywalk Mall', location: 'Aminjikarai, Chennai', total: 600, avail: 85, occupied: 480, reserved: 25, ev: 12, vip: 5, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '3.6 km', image: '🚶' },
    { name: 'Grand Square Mall', location: 'Velachery, Chennai', total: 500, avail: 195, occupied: 270, reserved: 22, ev: 16, vip: 6, floors: 2, cctv: 'ONLINE', ai: 'ACTIVE', dist: '2.8 km', image: '⏹️' },
    { name: 'Vivira Mall', location: 'Navalur, Chennai', total: 750, avail: 310, occupied: 400, reserved: 28, ev: 18, vip: 8, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '14.1 km', image: '🛍️' },
    { name: 'Chandra Metro Mall', location: 'Virugambakkam, Chennai', total: 400, avail: 120, occupied: 250, reserved: 20, ev: 10, vip: 4, floors: 2, cctv: 'ONLINE', ai: 'ACTIVE', dist: '6.0 km', image: '🚇' },
    { name: 'Fun Republic Mall', location: 'Peelamedu, Coimbatore', total: 650, avail: 145, occupied: 460, reserved: 30, ev: 18, vip: 8, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '9.3 km', image: '🎈' },
    { name: 'Milan\'em Mall', location: 'KK Nagar, Madurai', total: 350, avail: 110, occupied: 210, reserved: 18, ev: 8, vip: 4, floors: 2, cctv: 'ONLINE', ai: 'ACTIVE', dist: '12.4 km', image: '🛍️' },
    { name: 'Langval Mall', location: 'T Nagar, Chennai', total: 500, avail: 165, occupied: 300, reserved: 22, ev: 12, vip: 6, floors: 3, cctv: 'ONLINE', ai: 'ACTIVE', dist: '1.2 km', image: '🛍️' }
  ];

  const hospitalsList = [
    { name: 'Apollo Hospitals', location: 'Chennai', total: 850, avail: 214, occupied: 586, reserved: 50, emergency: 20, ev: 16, floors: 'Ground + 4 Levels', lastUpdated: '22:34:18', image: '🏥' },
    { name: 'MIOT Hospitals', location: 'Chennai', total: 600, avail: 120, occupied: 430, reserved: 40, emergency: 15, ev: 12, floors: 'Ground + 3 Levels', lastUpdated: '22:35:01', image: '🏥' },
    { name: 'Fortis Malar Hospital', location: 'Chennai', total: 400, avail: 85, occupied: 290, reserved: 25, emergency: 10, ev: 8, floors: 'Ground + 2 Levels', lastUpdated: '22:36:12', image: '🏥' },
    { name: 'Kauvery Hospital', location: 'Chennai', total: 500, avail: 130, occupied: 320, reserved: 35, emergency: 12, ev: 10, floors: 'Ground + 3 Levels', lastUpdated: '22:37:05', image: '🏥' },
    { name: 'Sri Ramachandra Medical Centre', location: 'Chennai', total: 1000, avail: 420, occupied: 510, reserved: 70, emergency: 30, ev: 20, floors: 'Ground + 5 Levels', lastUpdated: '22:38:22', image: '🏥' },
    { name: 'Christian Medical College (CMC)', location: 'Vellore', total: 1200, avail: 150, occupied: 980, reserved: 70, emergency: 40, ev: 24, floors: 'Ground + 6 Levels', lastUpdated: '22:39:10', image: '🏥' },
    { name: 'Kovai Medical Center and Hospital (KMCH)', location: 'Coimbatore', total: 900, avail: 280, occupied: 560, reserved: 60, emergency: 25, ev: 18, floors: 'Ground + 4 Levels', lastUpdated: '22:40:02', image: '🏥' },
    { name: 'Government Rajaji Hospital', location: 'Madurai', total: 700, avail: 80, occupied: 580, reserved: 40, emergency: 25, ev: 12, floors: 'Ground + 3 Levels', lastUpdated: '22:41:45', image: '🏥' },
    { name: 'PSG Hospitals', location: 'Coimbatore', total: 800, avail: 310, occupied: 430, reserved: 60, emergency: 20, ev: 16, floors: 'Ground + 4 Levels', lastUpdated: '22:42:15', image: '🏥' },
    { name: 'G. Kuppuswamy Naidu Memorial Hospital (GKNM)', location: 'Coimbatore', total: 500, avail: 165, occupied: 300, reserved: 35, emergency: 12, ev: 10, floors: 'Ground + 3 Levels', lastUpdated: '22:43:08', image: '🏥' },
    { name: 'SIMS Hospital', location: 'Chennai', total: 600, avail: 210, occupied: 350, reserved: 40, emergency: 15, ev: 12, floors: 'Ground + 4 Levels', lastUpdated: '22:44:11', image: '🏥' },
    { name: 'Dr. Mehta\'s Hospitals', location: 'Chennai', total: 300, avail: 65, occupied: 210, reserved: 25, emergency: 8, ev: 6, floors: 'Ground + 2 Levels', lastUpdated: '22:45:00', image: '🏥' },
    { name: 'MGM Healthcare', location: 'Chennai', total: 500, avail: 180, occupied: 290, reserved: 30, emergency: 12, ev: 10, floors: 'Ground + 3 Levels', lastUpdated: '22:45:50', image: '🏥' },
    { name: 'Gleneagles HealthCity', location: 'Chennai', total: 800, avail: 310, occupied: 440, reserved: 50, emergency: 22, ev: 16, floors: 'Ground + 4 Levels', lastUpdated: '22:46:18', image: '🏥' },
    { name: 'The Madras Medical Mission', location: 'Chennai', total: 400, avail: 95, occupied: 280, reserved: 25, emergency: 10, ev: 8, floors: 'Ground + 3 Levels', lastUpdated: '22:47:05', image: '🏥' },
    { name: 'Hindu Mission Hospital', location: 'Chennai', total: 300, avail: 110, occupied: 170, reserved: 20, ev: 6, floors: 'Ground + 2 Levels', lastUpdated: '22:47:40', image: '🏥' },
    { name: 'Billroth Hospitals', location: 'Chennai', total: 350, avail: 85, occupied: 245, reserved: 20, emergency: 10, ev: 8, floors: 'Ground + 2 Levels', lastUpdated: '22:48:10', image: '🏥' },
    { name: 'VS Hospitals', location: 'Chennai', total: 250, avail: 75, occupied: 155, reserved: 20, emergency: 6, ev: 4, floors: 'Ground + 2 Levels', lastUpdated: '22:48:55', image: '🏥' },
    { name: 'KG Hospital', location: 'Coimbatore', total: 400, avail: 120, occupied: 250, reserved: 30, emergency: 10, ev: 8, floors: 'Ground + 3 Levels', lastUpdated: '22:49:15', image: '🏥' },
    { name: 'Be Well Hospitals', location: 'Chennai', total: 200, avail: 90, occupied: 95, reserved: 15, emergency: 6, ev: 4, floors: 'Ground + 1 Levels', lastUpdated: '22:49:50', image: '🏥' }
  ];

  const airportsList = [
    { name: 'Chennai International Airport', code: 'MAA', location: 'Chennai', total: 2500, avail: 712, occupied: 1645, reserved: 143, vip: 85, ev: 40, taxi: 120, rental: 90, floors: 'Ground + 2 Levels + Basement', lastUpdated: '22:42:18', image: '✈️' },
    { name: 'Coimbatore International Airport', code: 'CJB', location: 'Coimbatore', total: 1200, avail: 310, occupied: 820, reserved: 70, vip: 30, ev: 18, taxi: 50, rental: 30, floors: 'Ground + 1 Level', lastUpdated: '22:43:02', image: '✈️' },
    { name: 'Tiruchirappalli International Airport', code: 'TRZ', location: 'Tiruchirappalli', total: 1000, avail: 280, occupied: 650, reserved: 70, vip: 25, ev: 16, taxi: 40, rental: 25, floors: 'Ground + 1 Level', lastUpdated: '22:44:12', image: '✈️' },
    { name: 'Madurai International Airport', code: 'IXM', location: 'Madurai', total: 800, avail: 195, occupied: 560, reserved: 45, vip: 20, ev: 12, taxi: 35, rental: 20, floors: 'Ground + 1 Level', lastUpdated: '22:45:05', image: '✈️' },
    { name: 'Thoothukudi Airport', code: 'TCR', location: 'Thoothukudi', total: 300, avail: 145, occupied: 130, reserved: 25, vip: 10, ev: 6, taxi: 15, rental: 10, floors: 'Ground Floor Only', lastUpdated: '22:46:18', image: '✈️' },
    { name: 'Salem Airport', code: 'SXV', location: 'Salem', total: 250, avail: 110, occupied: 120, reserved: 20, vip: 10, ev: 4, taxi: 15, rental: 10, floors: 'Ground Floor Only', lastUpdated: '22:47:02', image: '✈️' },
    { name: 'Hosur Aerodrome', code: 'HSR', location: 'Hosur', total: 400, avail: 210, occupied: 160, reserved: 30, vip: 15, ev: 8, taxi: 20, rental: 15, floors: 'Ground Floor Only', lastUpdated: '22:48:15', image: '✈️' },
    { name: 'Neyveli Airport', code: 'NYV', location: 'Neyveli', total: 150, avail: 95, occupied: 45, reserved: 10, vip: 5, ev: 2, taxi: 10, rental: 5, floors: 'Ground Floor Only', lastUpdated: '22:49:01', image: '✈️' },
    { name: 'Vellore Airport', code: 'VLR', location: 'Vellore', total: 200, avail: 125, occupied: 60, reserved: 15, vip: 5, ev: 4, taxi: 10, rental: 5, floors: 'Ground Floor Only', lastUpdated: '22:49:55', image: '✈️' },
    { name: 'Thanjavur Airport', code: 'TJV', location: 'Thanjavur', total: 300, avail: 180, occupied: 100, reserved: 20, vip: 10, ev: 6, taxi: 15, rental: 10, floors: 'Ground Floor Only', lastUpdated: '22:50:18', image: '✈️' }
  ];

  const itParksList = [
    { name: 'TIDEL Park', location: 'Taramani, Chennai', total: 3200, avail: 894, occupied: 2110, reserved: 196, employee: 1600, visitor: 800, vip: 60, ev: 90, bike: 450, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:45:18', image: '💻' },
    { name: 'SIPCOT IT Park', location: 'Siruseri, Chennai', total: 4000, avail: 1200, occupied: 2500, reserved: 300, employee: 2000, visitor: 1000, vip: 80, ev: 120, bike: 600, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:46:02', image: '💻' },
    { name: 'Chennai One IT SEZ', location: 'Thoraipakkam, OMR', total: 2800, avail: 790, occupied: 1850, reserved: 160, employee: 1400, visitor: 700, vip: 50, ev: 80, bike: 400, floors: 'Basement + Ground + Level 1 + Level 2', lastUpdated: '22:47:10', image: '💻' },
    { name: 'DLF Cybercity', location: 'Manapakkam, Chennai', total: 5000, avail: 1420, occupied: 3200, reserved: 380, employee: 2500, visitor: 1200, vip: 100, ev: 150, bike: 800, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:48:05', image: '💻' },
    { name: 'International Tech Park Chennai (ITPC)', location: 'Taramani, Chennai', total: 3500, avail: 920, occupied: 2350, reserved: 230, employee: 1800, visitor: 900, vip: 70, ev: 100, bike: 500, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:49:12', image: '💻' },
    { name: 'Olympia Technology Park', location: 'Guindy, Chennai', total: 2000, avail: 510, occupied: 1350, reserved: 140, employee: 1000, visitor: 500, vip: 40, ev: 60, bike: 300, floors: 'Basement + Ground + Level 1 + Level 2', lastUpdated: '22:50:01', image: '💻' },
    { name: 'Ascendas IT Park', location: 'Taramani, Chennai', total: 3000, avail: 810, occupied: 2010, reserved: 180, employee: 1500, visitor: 750, vip: 60, ev: 90, bike: 450, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:50:55', image: '💻' },
    { name: 'Ramanujan IT City', location: 'Taramani, Chennai', total: 4500, avail: 1320, occupied: 2850, reserved: 330, employee: 2200, visitor: 1100, vip: 90, ev: 130, bike: 650, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:51:22', image: '💻' },
    { name: 'ELCOT IT Park', location: 'Sholinganallur, Chennai', total: 1800, avail: 480, occupied: 1200, reserved: 120, employee: 900, visitor: 450, vip: 30, ev: 50, bike: 250, floors: 'Basement + Ground + Level 1', lastUpdated: '22:52:15', image: '💻' },
    { name: 'SRM Tech Park', location: 'Kattankulathur, Chennai', total: 1000, avail: 310, occupied: 620, reserved: 70, employee: 500, visitor: 250, vip: 20, ev: 30, bike: 150, floors: 'Ground + Level 1 + Level 2', lastUpdated: '22:53:08', image: '💻' },
    { name: 'IIT Madras Research Park', location: 'Taramani, Chennai', total: 1500, avail: 420, occupied: 980, reserved: 100, employee: 750, visitor: 350, vip: 30, ev: 45, bike: 200, floors: 'Basement + Ground + Level 1 + Level 2', lastUpdated: '22:54:11', image: '💻' },
    { name: 'RMZ Millenia Business Park', location: 'Perungudi, Chennai', total: 2500, avail: 710, occupied: 1650, reserved: 140, employee: 1200, visitor: 600, vip: 50, ev: 70, bike: 350, floors: 'Basement + Ground + Level 1 + Level 2', lastUpdated: '22:55:00', image: '💻' },
    { name: 'Embassy Splendid Tech Zone', location: 'Pallavaram, Chennai', total: 3000, avail: 850, occupied: 1950, reserved: 200, employee: 1500, visitor: 750, vip: 60, ev: 90, bike: 450, floors: 'Basement + Ground + Level 1 + Level 2', lastUpdated: '22:55:50', image: '💻' },
    { name: 'AMBIT IT Park', location: 'Ambattur, Chennai', total: 1200, avail: 395, occupied: 720, reserved: 85, employee: 600, visitor: 300, vip: 20, ev: 30, bike: 150, floors: 'Ground + Level 1 + Level 2', lastUpdated: '22:56:18', image: '💻' },
    { name: 'TECCI Park', location: 'Sholinganallur, Chennai', total: 800, avail: 245, occupied: 510, reserved: 45, employee: 400, visitor: 200, vip: 15, ev: 20, bike: 100, floors: 'Ground + Level 1', lastUpdated: '22:57:05', image: '💻' },
    { name: 'World Trade Center (WTC) Chennai', location: 'Perungudi, Chennai', total: 3500, avail: 980, occupied: 2280, reserved: 240, employee: 1800, visitor: 900, vip: 70, ev: 110, bike: 500, floors: 'Basement + Ground + Level 1 + Level 2 + Level 3', lastUpdated: '22:57:40', image: '💻' }
  ];

  const universitiesList = [
    { name: 'Anna University', location: 'Guindy, Chennai', type: 'State University', total: 1800, avail: 540, occupied: 1145, reserved: 115, faculty: 220, student: 1250, visitor: 180, ev: 35, bike: 500, floors: 'Ground + Basement + Level 1', lastUpdated: '22:58:12', image: '🎓' },
    { name: 'IIT Madras', location: 'Adyar, Chennai', type: 'National Institute', total: 2000, avail: 620, occupied: 1250, reserved: 130, faculty: 300, student: 1300, visitor: 200, ev: 45, bike: 600, floors: 'Ground + Basement + Level 1', lastUpdated: '22:59:01', image: '🎓' },
    { name: 'VIT Vellore', location: 'Vellore', type: 'Deemed University', total: 2500, avail: 780, occupied: 1540, reserved: 180, faculty: 400, student: 1600, visitor: 250, ev: 50, bike: 800, floors: 'Ground + Basement + Level 1', lastUpdated: '23:00:15', image: '🎓' },
    { name: 'SRM Institute of Science and Technology', location: 'Kattankulathur, Chennai', type: 'Deemed University', total: 2200, avail: 680, occupied: 1350, reserved: 170, faculty: 350, student: 1400, visitor: 220, ev: 40, bike: 700, floors: 'Ground + Basement + Level 1', lastUpdated: '23:01:22', image: '🎓' },
    { name: 'SASTRA Deemed University', location: 'Thanjavur', type: 'Deemed University', total: 1500, avail: 420, occupied: 980, reserved: 100, faculty: 250, student: 950, visitor: 150, ev: 25, bike: 400, floors: 'Ground + Basement', lastUpdated: '23:02:11', image: '🎓' },
    { name: 'PSG College of Technology', location: 'Coimbatore', type: 'Government Aided College', total: 1200, avail: 395, occupied: 720, reserved: 85, faculty: 200, student: 750, visitor: 120, ev: 20, bike: 300, floors: 'Ground + Level 1', lastUpdated: '23:03:08', image: '🎓' },
    { name: 'SSN College of Engineering', location: 'Kalavakkam, OMR', type: 'Autonomous College', total: 1000, avail: 310, occupied: 620, reserved: 70, faculty: 180, student: 650, visitor: 100, ev: 20, bike: 250, floors: 'Ground + Level 1', lastUpdated: '23:04:15', image: '🎓' },
    { name: 'Thiagarajar College of Engineering', location: 'Madurai', type: 'Government Aided College', total: 1100, avail: 340, occupied: 680, reserved: 80, faculty: 190, student: 700, visitor: 110, ev: 20, bike: 280, floors: 'Ground + Level 1', lastUpdated: '23:05:22', image: '🎓' },
    { name: 'Coimbatore Institute of Technology', location: 'Coimbatore', type: 'Government Aided College', total: 900, avail: 280, occupied: 560, reserved: 60, faculty: 150, student: 580, visitor: 90, ev: 15, bike: 220, floors: 'Ground + Level 1', lastUpdated: '23:06:11', image: '🎓' },
    { name: 'Government College of Technology', location: 'Coimbatore', type: 'Government College', total: 800, avail: 245, occupied: 510, reserved: 45, faculty: 120, student: 520, visitor: 80, ev: 10, bike: 200, floors: 'Ground + Level 1', lastUpdated: '23:07:05', image: '🎓' },
    { name: 'Kumaraguru College of Technology', location: 'Coimbatore', type: 'Autonomous College', total: 1300, avail: 410, occupied: 810, reserved: 80, faculty: 210, student: 850, visitor: 130, ev: 25, bike: 350, floors: 'Ground + Level 1 + Level 2', lastUpdated: '23:08:14', image: '🎓' },
    { name: 'Kongu Engineering College', location: 'Erode', type: 'Autonomous College', total: 1100, avail: 320, occupied: 710, reserved: 70, faculty: 180, student: 720, visitor: 110, ev: 20, bike: 300, floors: 'Ground + Level 1', lastUpdated: '23:09:05', image: '🎓' },
    { name: 'Sathyabama Institute of Science and Technology', location: 'Chennai', type: 'Deemed University', total: 1600, avail: 490, occupied: 1010, reserved: 100, faculty: 260, student: 1050, visitor: 160, ev: 30, bike: 450, floors: 'Ground + Level 1 + Level 2', lastUpdated: '23:10:00', image: '🎓' },
    { name: 'Hindustan Institute of Technology and Science', location: 'Padur, OMR', type: 'Deemed University', total: 1400, avail: 430, occupied: 890, reserved: 80, faculty: 230, student: 920, visitor: 140, ev: 25, bike: 380, floors: 'Ground + Level 1', lastUpdated: '23:10:55', image: '🎓' },
    { name: 'Velammal Engineering College', location: 'Chennai', total: 900, avail: 280, occupied: 560, reserved: 60, faculty: 150, student: 580, visitor: 90, ev: 15, bike: 220, floors: 'Ground + Level 1', lastUpdated: '23:11:15', image: '🎓' },
    { name: 'Rajalakshmi Engineering College', location: 'Thandalam, Chennai', type: 'Autonomous College', total: 1500, avail: 460, occupied: 940, reserved: 100, faculty: 250, student: 980, visitor: 150, ev: 25, bike: 420, floors: 'Ground + Level 1 + Level 2', lastUpdated: '23:12:02', image: '🎓' },
    { name: 'Easwari Engineering College', location: 'Ramapuram, Chennai', type: 'Autonomous College', total: 1000, avail: 310, occupied: 620, reserved: 70, faculty: 180, student: 650, visitor: 100, ev: 20, bike: 250, floors: 'Ground + Level 1', lastUpdated: '23:13:08', image: '🎓' },
    { name: 'St. Joseph\'s College of Engineering', location: 'OMR, Chennai', type: 'Autonomous College', total: 1200, avail: 395, occupied: 720, reserved: 85, faculty: 200, student: 750, visitor: 120, ev: 20, bike: 300, floors: 'Ground + Level 1', lastUpdated: '23:14:12', image: '🎓' },
    { name: 'Panimalar Engineering College', location: 'Poonamallee, Chennai', type: 'Autonomous College', total: 1300, avail: 410, occupied: 810, reserved: 80, faculty: 210, student: 850, visitor: 130, ev: 25, bike: 350, floors: 'Ground + Level 1', lastUpdated: '23:15:18', image: '🎓' },
    { name: 'Loyola College', location: 'Nungambakkam, Chennai', type: 'Arts & Science College', total: 1200, avail: 380, occupied: 740, reserved: 80, faculty: 200, student: 780, visitor: 120, ev: 20, bike: 350, floors: 'Ground + Basement', lastUpdated: '23:16:02', image: '🎓' },
    { name: 'Madras Christian College', location: 'Tambaram, Chennai', type: 'Arts & Science College', total: 1100, avail: 340, occupied: 680, reserved: 80, faculty: 190, student: 720, visitor: 110, ev: 20, bike: 300, floors: 'Ground Only', lastUpdated: '23:17:05', image: '🎓' },
    { name: 'Presidency College', location: 'Triplicane, Chennai', type: 'Arts & Science College', total: 800, avail: 245, occupied: 510, reserved: 45, faculty: 120, student: 520, visitor: 80, ev: 10, bike: 200, floors: 'Ground Only', lastUpdated: '23:18:11', image: '🎓' },
    { name: 'Stella Maris College', location: 'Cathedral Road, Chennai', type: 'Arts & Science College', total: 900, avail: 280, occupied: 560, reserved: 60, faculty: 150, student: 580, visitor: 90, ev: 15, bike: 220, floors: 'Ground Only', lastUpdated: '23:19:01', image: '🎓' },
    { name: 'Women\'s Christian College', location: 'Nungambakkam, Chennai', type: 'Arts & Science College', total: 700, avail: 210, occupied: 440, reserved: 50, faculty: 120, student: 460, visitor: 70, ev: 10, bike: 180, floors: 'Ground Only', lastUpdated: '23:20:12', image: '🎓' },
    { name: 'American College', location: 'Madurai', type: 'Arts & Science College', total: 1000, avail: 310, occupied: 620, reserved: 70, faculty: 180, student: 650, visitor: 100, ev: 20, bike: 250, floors: 'Ground Only', lastUpdated: '23:21:08', image: '🎓' },
    { name: 'Alagappa University', location: 'Karaikudi', type: 'State University', total: 1200, avail: 395, occupied: 720, reserved: 85, faculty: 200, student: 750, visitor: 120, ev: 20, bike: 300, floors: 'Ground + Level 1', lastUpdated: '23:22:15', image: '🎓' },
    { name: 'Bharathiar University', location: 'Coimbatore', type: 'State University', total: 1400, avail: 430, occupied: 890, reserved: 80, faculty: 230, student: 920, visitor: 140, ev: 25, bike: 380, floors: 'Ground + Level 1', lastUpdated: '23:23:01', image: '🎓' },
    { name: 'Bharathidasan University', location: 'Tiruchirappalli', type: 'State University', total: 1100, avail: 340, occupied: 680, reserved: 80, faculty: 190, student: 720, visitor: 110, ev: 20, bike: 300, floors: 'Ground + Level 1', lastUpdated: '23:24:12', image: '🎓' },
    { name: 'Annamalai University', location: 'Chidambaram', type: 'State University', total: 1600, avail: 490, occupied: 1010, reserved: 100, faculty: 260, student: 1050, visitor: 160, ev: 30, bike: 450, floors: 'Ground + Level 1 + Level 2', lastUpdated: '23:25:05', image: '🎓' },
    { name: 'Periyar University', location: 'Salem', type: 'State University', total: 1000, avail: 310, occupied: 620, reserved: 70, faculty: 180, student: 650, visitor: 100, ev: 20, bike: 250, floors: 'Ground + Level 1', lastUpdated: '23:26:18', image: '🎓' }
  ];

  const stationsList = [
    { name: 'Chennai Central', location: 'Chennai', zone: 'Southern Railway', total: 2200, avail: 645, occupied: 1410, reserved: 145, twoWheeler: 600, fourWheeler: 1200, taxi: 150, auto: 120, ev: 40, vip: 45, floors: 'Ground + Basement + Multi-Level', platforms: 'Platforms 1–12', lastUpdated: '22:58:12', image: '🚆' },
    { name: 'Chennai Egmore', location: 'Chennai', zone: 'Southern Railway', total: 1800, avail: 510, occupied: 1140, reserved: 150, twoWheeler: 500, fourWheeler: 1000, taxi: 120, auto: 100, ev: 30, vip: 40, floors: 'Ground + Basement', platforms: 'Platforms 1–11', lastUpdated: '22:59:01', image: '🚆' },
    { name: 'Tambaram', location: 'Tambaram, Chennai', zone: 'Southern Railway', total: 1500, avail: 420, occupied: 980, reserved: 100, twoWheeler: 400, fourWheeler: 850, taxi: 100, auto: 80, ev: 25, vip: 30, floors: 'Ground Only', platforms: 'Platforms 1–8', lastUpdated: '23:00:15', image: '🚆' },
    { name: 'Chengalpattu Junction', location: 'Chengalpattu', zone: 'Southern Railway', total: 1000, avail: 310, occupied: 620, reserved: 70, twoWheeler: 300, fourWheeler: 550, taxi: 60, auto: 50, ev: 20, vip: 20, floors: 'Ground Only', platforms: 'Platforms 1–8', lastUpdated: '23:01:22', image: '🚆' },
    { name: 'Arakkonam Junction', location: 'Arakkonam', zone: 'Southern Railway', total: 800, avail: 245, occupied: 510, reserved: 45, twoWheeler: 250, fourWheeler: 450, taxi: 50, auto: 40, ev: 10, vip: 15, floors: 'Ground Only', platforms: 'Platforms 1–8', lastUpdated: '23:02:11', image: '🚆' },
    { name: 'Katpadi Junction', location: 'Vellore', zone: 'Southern Railway', total: 1200, avail: 395, occupied: 720, reserved: 85, twoWheeler: 350, fourWheeler: 680, taxi: 80, auto: 60, ev: 20, vip: 30, floors: 'Ground Only', platforms: 'Platforms 1–5', lastUpdated: '23:03:08', image: '🚆' },
    { name: 'Salem Junction', location: 'Salem', zone: 'Southern Railway', total: 1100, avail: 340, occupied: 680, reserved: 80, twoWheeler: 300, fourWheeler: 650, taxi: 70, auto: 50, ev: 20, vip: 20, floors: 'Ground Only', platforms: 'Platforms 1–6', lastUpdated: '23:04:15', image: '🚆' },
    { name: 'Erode Junction', location: 'Erode', zone: 'Southern Railway', total: 1000, avail: 310, occupied: 620, reserved: 70, twoWheeler: 280, fourWheeler: 580, taxi: 60, auto: 50, ev: 15, vip: 20, floors: 'Ground Only', platforms: 'Platforms 1–4', lastUpdated: '23:05:22', image: '🚆' },
    { name: 'Coimbatore Junction', location: 'Coimbatore', zone: 'Southern Railway', total: 1600, avail: 490, occupied: 1010, reserved: 100, twoWheeler: 450, fourWheeler: 900, taxi: 110, auto: 80, ev: 30, vip: 40, floors: 'Ground + Basement', platforms: 'Platforms 1–6', lastUpdated: '23:06:11', image: '🚆' },
    { name: 'Tiruppur', location: 'Tiruppur', zone: 'Southern Railway', total: 800, avail: 245, occupied: 510, reserved: 45, twoWheeler: 250, fourWheeler: 450, taxi: 50, auto: 40, ev: 10, vip: 15, floors: 'Ground Only', platforms: 'Platforms 1–2', lastUpdated: '23:07:05', image: '🚆' },
    { name: 'Tiruchirappalli Junction', location: 'Tiruchirappalli', zone: 'Southern Railway', total: 1300, avail: 410, occupied: 810, reserved: 80, twoWheeler: 380, fourWheeler: 750, taxi: 90, auto: 60, ev: 25, vip: 25, floors: 'Ground Only', platforms: 'Platforms 1–8', lastUpdated: '23:08:14', image: '🚆' },
    { name: 'Madurai Junction', location: 'Madurai', zone: 'Southern Railway', total: 1500, avail: 460, occupied: 940, reserved: 100, twoWheeler: 420, fourWheeler: 850, taxi: 100, auto: 80, ev: 25, vip: 30, floors: 'Ground + Basement', platforms: 'Platforms 1–8', lastUpdated: '23:09:05', image: '🚆' },
    { name: 'Dindigul Junction', location: 'Dindigul', zone: 'Southern Railway', total: 700, avail: 210, occupied: 440, reserved: 50, twoWheeler: 200, fourWheeler: 400, taxi: 40, auto: 35, ev: 10, vip: 15, floors: 'Ground Only', platforms: 'Platforms 1–5', lastUpdated: '23:10:00', image: '🚆' },
    { name: 'Karur Junction', location: 'Karur', zone: 'Southern Railway', total: 600, avail: 180, occupied: 375, reserved: 45, twoWheeler: 180, fourWheeler: 350, taxi: 35, auto: 25, ev: 8, vip: 10, floors: 'Ground Only', platforms: 'Platforms 1–5', lastUpdated: '23:10:55', image: '🚆' },
    { name: 'Thanjavur Junction', location: 'Thanjavur', zone: 'Southern Railway', total: 800, avail: 250, occupied: 500, reserved: 50, twoWheeler: 250, fourWheeler: 450, taxi: 50, auto: 40, ev: 10, vip: 15, floors: 'Ground Only', platforms: 'Platforms 1–5', lastUpdated: '23:11:15', image: '🚆' },
    { name: 'Villupuram Junction', location: 'Villupuram', zone: 'Southern Railway', total: 1000, avail: 310, occupied: 620, reserved: 70, twoWheeler: 300, fourWheeler: 580, taxi: 60, auto: 50, ev: 15, vip: 20, floors: 'Ground Only', platforms: 'Platforms 1–6', lastUpdated: '23:12:02', image: '🚆' },
    { name: 'Tirunelveli Junction', location: 'Tirunelveli', zone: 'Southern Railway', total: 900, avail: 280, occupied: 560, reserved: 60, twoWheeler: 280, fourWheeler: 520, taxi: 50, auto: 40, ev: 15, vip: 15, floors: 'Ground Only', platforms: 'Platforms 1–5', lastUpdated: '23:13:08', image: '🚆' },
    { name: 'Nagercoil Junction', location: 'Nagercoil', zone: 'Southern Railway', total: 800, avail: 245, occupied: 510, reserved: 45, twoWheeler: 240, fourWheeler: 450, taxi: 45, auto: 35, ev: 10, vip: 15, floors: 'Ground Only', platforms: 'Platforms 1–4', lastUpdated: '23:14:12', image: '🚆' },
    { name: 'Thiruvarur Junction', location: 'Thiruvarur', zone: 'Southern Railway', total: 500, avail: 165, occupied: 300, reserved: 35, twoWheeler: 150, fourWheeler: 280, taxi: 30, auto: 20, ev: 6, vip: 10, floors: 'Ground Only', platforms: 'Platforms 1–5', lastUpdated: '23:15:18', image: '🚆' },
    { name: 'Kumbakonam', location: 'Kumbakonam', zone: 'Southern Railway', total: 600, avail: 195, occupied: 360, reserved: 45, twoWheeler: 180, fourWheeler: 330, taxi: 40, auto: 30, ev: 8, vip: 10, floors: 'Ground Only', platforms: 'Platforms 1–3', lastUpdated: '23:16:02', image: '🚆' }
  ];

  const stadiumsList = [
    { name: 'M. A. Chidambaram Stadium', location: 'Chepauk, Chennai', capacity: '38,000', total: 2500, avail: 780, occupied: 1560, reserved: 160, vip: 120, player: 50, media: 80, teamBus: 20, ev: 45, floors: 'Ground + Basement + Level 1', status: 'Ready', lastUpdated: '22:58:12', image: '🏟️' },
    { name: 'Indian Cement Company Ground', location: 'Tirunelveli', capacity: '25,000', total: 1500, avail: 420, occupied: 980, reserved: 100, vip: 80, player: 30, media: 50, teamBus: 10, ev: 25, floors: 'Ground Only', status: 'Ready', lastUpdated: '22:59:01', image: '🏟️' },
    { name: 'NPR College Ground', location: 'Natham, Dindigul', capacity: '20,000', total: 1200, avail: 395, occupied: 720, reserved: 85, vip: 60, player: 30, media: 40, teamBus: 10, ev: 20, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:00:15', image: '🏟️' },
    { name: 'Salem Cricket Foundation Ground', location: 'Salem', capacity: '25,000', total: 1800, avail: 510, occupied: 1140, reserved: 150, vip: 90, player: 40, media: 60, teamBus: 15, ev: 30, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:01:22', image: '🏟️' },
    { name: 'Sri Ramakrishna College Ground', location: 'Coimbatore', capacity: '15,000', total: 1000, avail: 310, occupied: 620, reserved: 70, vip: 50, player: 20, media: 30, teamBus: 10, ev: 15, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:02:11', image: '🏟️' },
    { name: 'SNR College Cricket Ground', location: 'Coimbatore', capacity: '15,000', total: 1000, avail: 310, occupied: 620, reserved: 70, vip: 50, player: 20, media: 30, teamBus: 10, ev: 15, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:03:08', image: '🏟️' },
    { name: 'Guru Nanak College Ground', location: 'Velachery, Chennai', capacity: '12,000', total: 800, avail: 245, occupied: 510, reserved: 45, vip: 40, player: 20, media: 30, teamBus: 10, ev: 10, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:04:15', image: '🏟️' },
    { name: 'Vivekananda College Ground', location: 'Mylapore, Chennai', capacity: '10,000', total: 600, avail: 180, occupied: 375, reserved: 45, vip: 30, player: 15, media: 20, teamBus: 5, ev: 8, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:05:22', image: '🏟️' },
    { name: 'TNAU Ground', location: 'Coimbatore', capacity: '12,000', total: 800, avail: 250, occupied: 500, reserved: 50, vip: 40, player: 20, media: 30, teamBus: 10, ev: 10, floors: 'Ground Only', status: 'Ready', lastUpdated: '23:06:11', image: '🏟️' }
  ];

  const concertsList = [
    { name: 'Jawaharlal Nehru Stadium', location: 'Sydenhams Road, Chennai', total: 850, avail: 312, occupied: 501, reserved: 37, ev: 40, vip: 20, floors: 'Ground + 1 Level', lastUpdated: '23:14:12', image: '🎵', cctvCount: 128, prediction: 'Heavy Traffic after 6 PM' },
    { name: 'YMCA Ground', location: 'Nandanam, Chennai', total: 600, avail: 240, occupied: 310, reserved: 50, ev: 30, vip: 15, floors: 'Ground Only', lastUpdated: '23:15:01', image: '🎤', cctvCount: 96, prediction: 'Crowds dispersing in 30 minutes' },
    { name: 'Island Grounds', location: 'The Island, Chennai', total: 1400, avail: 840, occupied: 510, reserved: 50, ev: 60, vip: 30, floors: 'Ground Only', lastUpdated: '23:16:12', image: '🎪', cctvCount: 180, prediction: 'Large Event Expected Tonight' },
    { name: 'VGP Golden Beach', location: 'ECR, Chennai', total: 500, avail: 180, occupied: 290, reserved: 30, ev: 20, vip: 10, floors: 'Ground Only', lastUpdated: '23:17:05', image: '🌊', cctvCount: 64, prediction: 'Beach Concert starting at 7 PM' },
    { name: 'VGP Valluvar Garden', location: 'ECR, Chennai', total: 450, avail: 210, occupied: 200, reserved: 40, ev: 18, vip: 8, floors: 'Ground Only', lastUpdated: '23:18:22', image: '🌳', cctvCount: 48, prediction: 'Moderate traffic expected' },
    { name: 'The Music Academy', location: 'Royapettah, Chennai', total: 320, avail: 112, occupied: 176, reserved: 32, ev: 15, vip: 10, floors: 'Ground + 1 Level', lastUpdated: '23:19:10', image: '🎹', cctvCount: 64, prediction: 'Concert Starting in 45 Minutes' },
    { name: 'Narada Gana Sabha', location: 'Alwarpet, Chennai', total: 300, avail: 95, occupied: 185, reserved: 20, ev: 12, vip: 8, floors: 'Ground Floor Only', lastUpdated: '23:20:02', image: '🎻', cctvCount: 48, prediction: 'Peak crowd at 6:30 PM' },
    { name: 'Sir Mutha Venkatasubba Rao Concert Hall', location: 'Chetpet, Chennai', total: 400, avail: 150, occupied: 220, reserved: 30, ev: 20, vip: 10, floors: 'Ground + Level 1', lastUpdated: '23:21:45', image: '🎼', cctvCount: 80, prediction: 'VIP arrivals expected at 5:30 PM' },
    { name: 'Vani Mahal', location: 'T. Nagar, Chennai', total: 350, avail: 120, occupied: 200, reserved: 30, ev: 15, vip: 8, floors: 'Ground Only', lastUpdated: '23:22:15', image: '🎺', cctvCount: 60, prediction: 'Local congestion expected around venue' },
    { name: 'Raja Annamalai Chettiar Hall', location: 'Esplanade, Chennai', total: 380, avail: 160, occupied: 190, reserved: 30, ev: 18, vip: 6, floors: 'Ground Only', lastUpdated: '23:23:08', image: '🎷', cctvCount: 72, prediction: 'Expected full capacity after 5 PM' }
  ];

  if (selectedSector === null) {
    return (
      <div className="min-h-screen bg-[#090B14] text-[#FFFFFF] flex flex-col font-sans antialiased overflow-y-auto p-12 select-none relative pb-24">
        {/* Toast Alerts Stack */}
        <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-4 rounded-2xl border font-sans text-[10px] font-bold shadow-lg pointer-events-auto flex items-center gap-3 backdrop-blur-md transition-all ${
                  t.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400' :
                  t.type === 'ai' ? 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]' :
                  'bg-[#111827]/85 border-white/10 text-slate-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                <span>{t.message.toUpperCase()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.03),transparent_60%)] pointer-events-none"></div>

        {/* City Network Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-white/10 max-w-[1700px] w-full mx-auto gap-6 z-10 relative">
          <div>
            <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-wider uppercase font-bold">Metropolitan Smart Transit Operating System</span>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight uppercase mt-1">
              Public Sector Dashboard
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-2">
              Select a metropolitan sector below to view localized smart parking networks.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-[#111827]/50 border border-white/10 rounded-2xl px-6 py-3.5 text-right hidden sm:block shadow-inner">
              <p className="text-[9px] text-slate-500 font-nav-text tracking-wider uppercase">Active Sectors</p>
              <p className="text-sm font-stat-mono text-[#00D9FF] font-bold mt-1">10 / 10 ONLINE</p>
            </div>
            
            <div className="bg-[#111827]/50 border border-white/10 rounded-2xl px-6 py-3.5 text-right hidden sm:block shadow-inner">
              <p className="text-[9px] text-slate-500 font-nav-text tracking-wider uppercase">System Time</p>
              <p className="text-sm font-stat-mono text-[#00D9FF] font-bold mt-1">{timeString}</p>
            </div>

            {/* Notification icon */}
            <Suspense fallback={
              <button className="w-14 h-14 rounded-2xl bg-[#111827]/50 border border-white/10 flex items-center justify-center text-slate-500">
                <Bell size={24} strokeWidth={2.4} />
              </button>
            }>
              <NotificationCenter />
            </Suspense>
          </div>
        </header>

        {/* Global Network Analytics Telemetry Banner */}
        <section className="max-w-[1700px] w-full mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 z-10 relative">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left bg-[#111827]/25">
            <span className="text-[9px] text-slate-500 font-nav-text tracking-wider block uppercase">Total Parking Locations</span>
            <span className="text-2xl font-stat-mono font-bold text-emerald-400 mt-1 block">93 Locations</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left bg-[#111827]/25">
            <span className="text-[9px] text-slate-500 font-nav-text tracking-wider block uppercase">Total Slots</span>
            <span className="text-2xl font-stat-mono font-bold text-emerald-400 mt-1 block">53,400 Slots</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left bg-[#111827]/25">
            <span className="text-[9px] text-slate-500 font-nav-text tracking-wider block uppercase">Live Net Occupancy</span>
            <span className="text-2xl font-stat-mono font-bold text-white mt-1 block">61.5% LOAD</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-[#00D9FF]/20 text-left bg-[#00D9FF]/5 animate-pulse">
            <span className="text-[9px] text-[#00D9FF] font-nav-text tracking-wider block uppercase">Network CCTV Status</span>
            <span className="text-2xl font-stat-mono font-bold text-white mt-1 block">1,248/1,248 ON</span>
          </div>
        </section>

        {/* Sectors Grid */}
        <main className="flex-1 max-w-[1700px] w-full mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 z-10 relative">
          {sectorsList.map((s) => (
            <div key={s.id} className="glass-panel p-8 rounded-[28px] border border-white/10 flex flex-col justify-between shadow-2xl hover:scale-[1.02] hover:border-[#00D9FF]/30 transition-all duration-300 relative bg-[#111827]/30 group min-h-[380px] text-left">
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:border-[#00D9FF]/30 transition-all">
                    {s.icon}
                  </div>
                  <span className="text-[9px] font-stat-mono px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-full">
                    ACTIVE
                  </span>
                </div>

                <div className="text-left space-y-1 pt-2">
                  <h4 className="font-heading font-extrabold text-lg text-white tracking-tight group-hover:text-[#00D9FF] transition-all uppercase">
                    {s.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-sans">{s.locations} Parking Facilities</p>
                </div>
              </div>

              {/* Stats */}
              <div className="border-t border-b border-white/5 py-4 my-4 font-stat-mono text-[11px] text-slate-400 space-y-2">
                <div className="flex justify-between">
                  <span>Total Slots:</span>
                  <span className="text-white font-bold">{s.slots}</span>
                </div>
                <div className="flex justify-between">
                  <span>Live Occupancy:</span>
                  <span className={s.occupancy > 80 ? 'text-red-400' : s.occupancy > 60 ? 'text-yellow-400' : 'text-emerald-400'}>{s.occupancy}%</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Core Engine:</span>
                  <span className="text-[#00D9FF]">ACTIVE ({s.status})</span>
                </div>
                <div className="flex justify-between">
                  <span>CCTV Nodes:</span>
                  <span className="text-white">{s.cctv} Nodes</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setSelectedSector(s.name)}
                  className="flex items-center gap-1.5 px-5 py-3 bg-[#00D9FF]/10 hover:bg-[#00D9FF] border border-[#00D9FF]/30 text-[#00D9FF] hover:text-[#090B14] hover:border-[#00D9FF] font-heading text-[10px] rounded-xl font-bold transition-all group shadow-[0_0_15px_rgba(0,217,255,0.1)] hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                >
                  OPEN SECTOR <span className="group-hover:translate-x-1.5 transition-all text-xs">→</span>
                </button>
              </div>

            </div>
          ))}
        </main>
      </div>
    );
  }

  if (selectedSector !== null && selectedFacility === null) {
    const isHospital = selectedSector === 'Hospitals';
    const isAirport = selectedSector === 'Airports';
    const isITPark = selectedSector === 'IT Parks';
    const isUniversity = selectedSector === 'Colleges & Universities';
    const isStation = selectedSector === 'Railway Stations';
    const isStadium = selectedSector === 'Cricket Stadiums';
    const isConcert = selectedSector === 'Concert Venues';
    const baseList = isHospital ? hospitalsList : isAirport ? airportsList : isITPark ? itParksList : isUniversity ? universitiesList : isStation ? stationsList : isStadium ? stadiumsList : isConcert ? concertsList : mallsList;
    const listToRender = baseList.map(item => ({
      ...item,
      id: item.id || `facility-${item.name.replace(/\s+/g, '-').toLowerCase()}-${item.location ? item.location.replace(/\s+/g, '-').toLowerCase() : ''}`
    }));

    return (
      <div className="min-h-screen bg-[#090B14] text-[#FFFFFF] flex flex-col font-sans antialiased overflow-y-auto p-12 select-none relative pb-24">
        {/* Toast Alerts Stack */}
        <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-4 rounded-2xl border font-sans text-[10px] font-bold shadow-lg pointer-events-auto flex items-center gap-3 backdrop-blur-md transition-all ${
                  t.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400' :
                  t.type === 'ai' ? 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]' :
                  'bg-[#111827]/85 border-white/10 text-slate-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                <span>{t.message.toUpperCase()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.03),transparent_60%)] pointer-events-none"></div>

        {/* Header with back button */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-white/10 max-w-[1700px] w-full mx-auto gap-6 z-10 relative">
          <div className="text-left">
            <button 
              onClick={() => setSelectedSector(null)}
              className="text-[9px] font-stat-mono text-[#00D9FF] hover:text-white transition-all flex items-center gap-1.5 uppercase font-bold mb-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full w-max"
            >
              ← Back to Sectors
            </button>
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight uppercase mt-1">
              {isAirport ? '✈ Airport Parking Network' : isHospital ? 'Hospital Parking Network' : isITPark ? '💻 IT Park Parking Network' : isUniversity ? '🎓 Campus Parking Network' : isStation ? '🚆 Railway Station Parking Network' : isStadium ? '🏏 Cricket Stadium Parking Network' : isConcert ? '🎵 Concert Venue Parking Network' : `${selectedSector} Parking Network`}
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-2">
              Showing active parking facilities registered inside the {selectedSector} sector.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-[#111827]/50 border border-white/10 rounded-2xl px-6 py-3.5 text-right hidden sm:block shadow-inner">
              <p className="text-[9px] text-slate-500 font-nav-text tracking-wider uppercase">Active Facilities</p>
              <p className="text-sm font-stat-mono text-[#00D9FF] font-bold mt-1">{listToRender.length} / {listToRender.length} ONLINE</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9FF] to-[#3B82F6] flex items-center justify-center text-[#090B14] font-heading font-bold text-base shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Cards Grid */}
        <main className="flex-1 max-w-[1700px] w-full mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
          {listToRender.map((m) => {
            const occRate = Math.round(((m.total - m.avail) / m.total) * 100);
            let occColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            let statusText = 'AVAILABLE';

            if (occRate > 80) {
              occColor = 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse';
              statusText = 'ALMOST FULL';
            } else if (occRate > 60) {
              occColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
              statusText = 'MEDIUM LOAD';
            }

            return (
              <div key={m.id} className="glass-panel p-8 rounded-[28px] border border-white/10 flex flex-col justify-between shadow-2xl hover:scale-[1.02] hover:border-[#00D9FF]/30 transition-all duration-300 relative bg-[#111827]/30 group min-h-[500px] text-left">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:border-[#00D9FF]/30 transition-all">
                      {m.image}
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`text-[9px] font-stat-mono px-3.5 py-1 rounded-full border font-bold ${occColor}`}>
                        {statusText}
                      </span>
                      <span className="text-[8px] font-stat-mono text-slate-500 uppercase font-semibold">
                        {(isHospital || isAirport || isITPark || isUniversity || isStation || isStadium || isConcert) ? `Floor: ${m.floors}` : `${m.dist} away`}
                      </span>
                    </div>
                  </div>

                  <div className="text-left space-y-1">
                    <h4 className="font-heading font-extrabold text-xl text-white tracking-tight group-hover:text-[#00D9FF] transition-all font-bold">
                      {m.name} {isAirport && <span className="text-xs text-[#00D9FF] ml-1 font-stat-mono font-bold">({m.code})</span>}
                    </h4>
                    <p className="text-xs text-slate-500 font-sans">
                      {m.location} 
                      {isUniversity && <span className="text-[10px] text-[#00D9FF]/80 ml-1 font-bold">({m.type})</span>}
                      {isStation && <span className="text-[10px] text-[#00D9FF]/80 ml-1 font-bold">({m.zone} | {m.platforms})</span>}
                      {isStadium && <span className="text-[10px] text-[#00D9FF]/80 ml-1 font-bold">(Cap: {m.capacity} | {m.status})</span>}
                    </p>
                  </div>
                </div>

                {/* Occupancy circular ring & stats */}
                <div className="flex items-center justify-between border-t border-b border-white/5 py-6 my-4 text-left">
                  <div className="space-y-2 font-stat-mono text-[11px] text-slate-400">
                    <div className="flex justify-between gap-6">
                      <span>Total Slots:</span>
                      <span className="text-white font-bold">{m.total}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Available:</span>
                      <span className="text-emerald-400 font-bold">{m.avail}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Occupied:</span>
                      <span className="text-red-400">{m.occupied}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Reserved:</span>
                      <span className="text-[#3B82F6]">{m.reserved}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span>Allocation:</span>
                      <span className="text-[#A855F7] font-semibold text-[10px]">
                        {isHospital ? `${m.emergency} EMG | ${m.ev} EV` :
                         isAirport ? `${m.taxi} TXI | ${m.rental} RTL | ${m.ev} EV` :
                         isITPark ? `${m.employee} EMP | ${m.visitor} VIS | ${m.ev} EV` :
                         isUniversity ? `${m.faculty} FAC | ${m.student} STU | ${m.ev} EV` :
                         isStation ? `${m.taxi} TXI | ${m.auto} AUT | ${m.ev} EV` :
                         isStadium ? `${m.vip} VIP | ${m.player} PLY | ${m.teamBus} BUS` :
                         isConcert ? `${m.vip} VIP | ${m.ev} EV` :
                         `${m.ev} EV | ${m.vip} VIP`}
                      </span>
                    </div>
                    {m.cctvCount && (
                      <div className="flex justify-between gap-6 font-stat-mono text-[11px] text-slate-400">
                        <span>CCTV Nodes:</span>
                        <span className="text-white font-bold">{m.cctvCount} Cameras</span>
                      </div>
                    )}
                    {m.prediction && (
                      <div className="flex justify-between gap-6 font-stat-mono text-[11px] text-slate-500">
                        <span>AI Prediction:</span>
                        <span className="text-[#00D9FF] font-bold">{m.prediction}</span>
                      </div>
                    )}
                    {(isHospital || isAirport || isITPark || isUniversity || isStation || isStadium || isConcert) && (
                      <div className="flex justify-between gap-6 text-[10px] text-slate-500">
                        <span>Last Update:</span>
                        <span>{m.lastUpdated}</span>
                      </div>
                    )}
                  </div>

                  {/* Circular occupancy ring */}
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="36" stroke="rgba(255,255,255,0.05)" strokeWidth="5.5" fill="none" />
                      <circle 
                        cx="48" cy="48" r="36" 
                        stroke={occRate > 80 ? '#EF4444' : occRate > 60 ? '#FACC15' : '#10B981'} 
                        strokeWidth="5.5" 
                        fill="none" 
                        strokeDasharray="226.2"
                        strokeDashoffset={226.2 - (226.2 * occRate) / 100}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-stat-mono text-sm font-extrabold text-white">{occRate}%</span>
                      <span className="text-[7px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">LOAD</span>
                    </div>
                  </div>
                </div>

                {/* Footer and button */}
                <div className="flex items-center justify-between text-[9px] font-stat-mono text-slate-500 border-t border-white/5 pt-4">
                  <div className="space-y-0.5">
                    <span className="block uppercase text-[7px] text-slate-600">AI DETECT / CCTV</span>
                    <span className="text-emerald-400 font-bold font-stat-mono">ACTIVE / ONLINE</span>
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedFacility(m.name);
                      setActiveMenu('3D Live Parking');
                    }}
                    className="flex items-center gap-1.5 px-5 py-3 bg-[#00D9FF]/10 hover:bg-[#00D9FF] border border-[#00D9FF]/30 text-[#00D9FF] hover:text-[#090B14] hover:border-[#00D9FF] font-heading text-[10px] rounded-xl font-bold transition-all group shadow-[0_0_15px_rgba(0,217,255,0.1)] hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                  >
                    OPEN PARKING <span className="group-hover:translate-x-1.5 transition-all text-xs">→</span>
                  </button>
                </div>

              </div>
            );
          })}
        </main>
      </div>
    );
  }

  const renderSlot = (slot) => {
    const isSelected = selectedSlotId === slot.id;
    let statusBorder = 'border-slate-800 text-slate-400 bg-slate-900/15';
    let indicator = 'bg-slate-700';

    if (slot.type === 'disabled') {
      statusBorder = 'border-slate-800/40 text-slate-500 bg-slate-900/5 cursor-not-allowed opacity-40';
      indicator = 'bg-slate-600';
    } else if (slot.status === 'Available') {
      if (slot.type === 'ev') {
        statusBorder = isSelected 
          ? 'border-[#A855F7] text-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.35)] scale-[1.05]'
          : 'border-[#A855F7]/30 text-[#A855F7] hover:border-[#A855F7] hover:shadow-[0_0_15px_rgba(168,85,247,0.25)] bg-[#A855F7]/5';
        indicator = 'bg-[#A855F7] animate-pulse';
      } else if (slot.type === 'vip') {
        statusBorder = isSelected 
          ? 'border-yellow-500 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.35)] scale-[1.05]'
          : 'border-yellow-500/30 text-yellow-500 hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.25)] bg-yellow-500/5';
        indicator = isSelected ? 'bg-yellow-500' : 'bg-yellow-500 animate-pulse';
      } else {
        statusBorder = isSelected 
          ? 'border-[#00D9FF] text-[#00D9FF] shadow-[0_0_20px_rgba(0,217,255,0.35)] scale-[1.05]'
          : 'border-emerald-500/20 text-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.25)]';
        indicator = isSelected ? 'bg-[#00D9FF]' : 'bg-emerald-500 animate-pulse';
      }
    } else if (slot.status === 'Occupied') {
      statusBorder = 'border-red-500/20 text-red-500/60 cursor-not-allowed bg-red-950/5';
      indicator = 'bg-red-500';
    } else if (slot.status === 'Reserved') {
      statusBorder = 'border-blue-500/20 text-blue-400 cursor-not-allowed bg-blue-950/5';
      indicator = 'bg-[#3B82F6]';
    } else if (slot.status === 'VIP Reserved') {
      statusBorder = 'border-yellow-500/20 text-yellow-500/60 cursor-not-allowed bg-yellow-950/5';
      indicator = 'bg-yellow-500';
    }

    return (
      <div
        key={slot.id}
        onClick={() => handleSlotSelect(slot)}
        style={{ width: '90px', height: '180px' }}
        className={`relative border-l border-r flex flex-col justify-between items-center py-4 px-3 cursor-pointer transition-all duration-300 transform rounded-lg ${statusBorder}`}
      >
        <span className="font-stat-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">{slot.status}</span>

        {slot.status === 'Occupied' ? (
          <div className="flex-1 flex items-center justify-center">
            <svg className="w-10 h-16 text-red-500/80 hover:text-red-400 transition-all drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" viewBox="0 0 40 80" fill="currentColor">
              <rect x="8" y="4" width="24" height="72" rx="6" fill="#1e293b" stroke="currentColor" strokeWidth="1.5" />
              <rect x="10" y="16" width="20" height="24" rx="4" fill="#EF4444" />
              <rect x="12" y="22" width="16" height="14" rx="2" fill="#090B14" />
              <path d="M 12 22 L 28 22 L 25 18 L 15 18 Z" fill="#475569" />
              <path d="M 12 36 L 28 36 L 26 40 L 14 40 Z" fill="#475569" />
              <circle cx="12" cy="8" r="2.5" fill="#FDE047" className="animate-pulse" />
              <circle cx="28" cy="8" r="2.5" fill="#FDE047" className="animate-pulse" />
              <rect x="10" y="72" width="4" height="2" fill="#EF4444" />
              <rect x="26" y="72" width="4" height="2" fill="#EF4444" />
            </svg>
          </div>
        ) : slot.status === 'Reserved' ? (
          <div className="flex-1 flex items-center justify-center text-[#00D9FF] text-xl drop-shadow-[0_0_8px_rgba(0,217,255,0.4)]">
            <CheckCircle size={14} strokeWidth={2.4} />
          </div>
        ) : slot.status === 'VIP Reserved' ? (
          <div className="flex-1 flex items-center justify-center text-yellow-500 text-xl drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
            <CheckCircle size={14} strokeWidth={2.4} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${indicator} shadow`}></span>
          </div>
        )}

        {slot.type === 'ev' && (
          <div className="absolute top-2 right-2 text-[#A855F7] flex items-center text-[8px] font-stat-mono gap-0.5 font-bold">
            <Zap className="animate-bounce" size={14} strokeWidth={2.4} /> EV
          </div>
        )}
        {slot.type === 'vip' && (
          <div className="absolute top-2 right-2 text-yellow-500 flex items-center text-[8px] font-stat-mono gap-0.5 font-bold">
            👑 VIP
          </div>
        )}

        {selectedSector === 'Hospitals' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Doctor
          </div>
        )}
        {selectedSector === 'Hospitals' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-red-400 flex items-center text-[7px] font-stat-mono font-bold bg-red-950/20 px-1 py-0.5 rounded-full border border-red-500/20 animate-pulse">
            Ambulance
          </div>
        )}
        {selectedSector === 'Airports' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            VIP
          </div>
        )}
        {selectedSector === 'Airports' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Taxi
          </div>
        )}
        {selectedSector === 'IT Parks' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Exec
          </div>
        )}
        {selectedSector === 'IT Parks' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Employee
          </div>
        )}
        {selectedSector === 'Colleges & Universities' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Faculty
          </div>
        )}
        {selectedSector === 'Colleges & Universities' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Student
          </div>
        )}
        {selectedSector === 'Railway Stations' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            VIP
          </div>
        )}
        {selectedSector === 'Railway Stations' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Taxi
          </div>
        )}
        {selectedSector === 'Cricket Stadiums' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Player
          </div>
        )}
        {selectedSector === 'Cricket Stadiums' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            VIP
          </div>
        )}

        {selectedSector === 'Hospitals' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Doctor
          </div>
        )}
        {selectedSector === 'Hospitals' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-red-400 flex items-center text-[7px] font-stat-mono font-bold bg-red-950/20 px-1 py-0.5 rounded-full border border-red-500/20 animate-pulse">
            Ambulance
          </div>
        )}
        {selectedSector === 'Airports' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            VIP
          </div>
        )}
        {selectedSector === 'Airports' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Taxi
          </div>
        )}
        {selectedSector === 'IT Parks' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Exec
          </div>
        )}
        {selectedSector === 'IT Parks' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Employee
          </div>
        )}
        {selectedSector === 'Colleges & Universities' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Faculty
          </div>
        )}
        {selectedSector === 'Colleges & Universities' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Student
          </div>
        )}
        {selectedSector === 'Railway Stations' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            VIP
          </div>
        )}
        {selectedSector === 'Railway Stations' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            Taxi
          </div>
        )}
        {selectedSector === 'Cricket Stadiums' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-[#3B82F6] flex items-center text-[7px] font-stat-mono font-bold bg-[#3B82F6]/10 px-1 py-0.5 rounded-full border border-blue-500/20">
            Player
          </div>
        )}
        {selectedSector === 'Cricket Stadiums' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-emerald-400 flex items-center text-[7px] font-stat-mono font-bold bg-emerald-950/20 px-1 py-0.5 rounded-full border border-emerald-500/20">
            VIP
          </div>
        )}
        {selectedSector === 'Concert Venues' && slot.id === 'P3' && (
          <div className="absolute top-2 right-2 text-yellow-500 flex items-center text-[7px] font-stat-mono font-bold bg-yellow-950/20 px-1 py-0.5 rounded-full border border-yellow-500/20">
            Artist
          </div>
        )}
        {selectedSector === 'Concert Venues' && slot.id === 'P5' && (
          <div className="absolute top-2 right-2 text-yellow-500 flex items-center text-[7px] font-stat-mono font-bold bg-yellow-950/20 px-1 py-0.5 rounded-full border border-yellow-500/20">
            VIP
          </div>
        )}
        {selectedSector === 'Concert Venues' && slot.id === 'P8' && (
          <div className="absolute bottom-2 right-2 text-yellow-500 flex items-center text-[7px] font-stat-mono font-bold bg-yellow-950/20 px-1 py-0.5 rounded-full border border-yellow-500/20">
            Artist
          </div>
        )}
        {selectedSector === 'Concert Venues' && slot.id === 'P10' && (
          <div className="absolute bottom-2 right-2 text-yellow-500 flex items-center text-[7px] font-stat-mono font-bold bg-yellow-950/20 px-1 py-0.5 rounded-full border border-yellow-500/20">
            VIP
          </div>
        )}

        <span className="font-stat-mono text-sm font-bold tracking-wider">{slot.id}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#090B14] text-[#FFFFFF] flex font-sans antialiased overflow-hidden h-screen select-none">
      
      {/* Toast Alerts Stack */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`p-4 rounded-2xl border font-sans text-[10px] font-bold shadow-lg pointer-events-auto flex items-center gap-3 backdrop-blur-md transition-all ${
                t.type === 'success' ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-400' :
                t.type === 'ai' ? 'bg-[#00D9FF]/10 border-[#00D9FF]/30 text-[#00D9FF]' :
                'bg-[#111827]/85 border-white/10 text-slate-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
              <span>{t.message.toUpperCase()}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* ======================================================== */}
      {/* LEFT SIDEBAR (SLIMMED TO 230PX) */}
      {/* ======================================================== */}
      <aside className="w-[230px] bg-[#111827]/25 border-r border-white/10 flex flex-col justify-between z-20 backdrop-blur-xl shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col gap-6 p-5 pb-0">
          {/* Logo Section — Clickable Home Button */}
          <motion.button
            title="Return to Public Sector Dashboard"
            aria-label="Return to Public Sector Dashboard — Home"
            onClick={() => {
              setActiveMenu('City Overview');
              setSelectedSector(null);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="relative flex items-center gap-2 px-1.5 py-1 rounded-lg cursor-pointer
              group w-full text-left
              hover:bg-[#00D9FF]/8
              hover:shadow-[0_0_12px_rgba(0,217,255,0.15)]
              transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]/60"
            style={{ background: 'transparent', border: 'none' }}
          >
            {/* Glow ring on hover */}
            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100
              transition-opacity duration-300 pointer-events-none
              ring-1 ring-[#00D9FF]/30 shadow-[0_0_10px_rgba(0,217,255,0.1)]" />

            {/* Icon with rotation hover */}
            <motion.span
              className="inline-flex shrink-0"
              style={{ transformOrigin: 'center' }}
              variants={{ rest: { rotate: 0 }, hover: { rotate: 5 } }}
              initial="rest"
              whileHover="hover"
              transition={{ duration: 0.25 }}
            >
              <svg viewBox="0 0 100 100" className="w-[18px] h-[18px] shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* The main P frame */}
                <path d="M40 25 H65 C78 25, 78 50, 65 50 H40 V25 Z" stroke="#00D9FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M40 25 V75 L48 65 H40" stroke="#00D9FF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Inner P detail */}
                <path d="M48 33 H60 C68 33, 68 42, 60 42 H48 V33 Z" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {/* Left circuit nodes */}
                <path d="M40 33 H22" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
                <circle cx="20" cy="33" r="4.5" fill="#00D9FF" />
                <path d="M40 45 H16" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
                <circle cx="14" cy="45" r="4.5" fill="#00D9FF" />
                <path d="M40 57 H22" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
                <circle cx="20" cy="57" r="4.5" fill="#00D9FF" />
                {/* Top circuit nodes */}
                <path d="M48 25 V12" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
                <circle cx="48" cy="10" r="4.5" fill="#00D9FF" />
                <path d="M60 25 V8" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
                <circle cx="60" cy="6" r="4.5" fill="#00D9FF" />
                <path d="M72 27 V14" stroke="#00D9FF" strokeWidth="4" strokeLinecap="round" />
                <circle cx="72" cy="12" r="4.5" fill="#00D9FF" />
              </svg>
            </motion.span>

            <span className="font-heading font-extrabold text-xs tracking-tight text-white uppercase select-none whitespace-nowrap">
              PARKSENSE <span className="text-[#00D9FF]">AI</span>
            </span>

            {/* Tooltip */}
            <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1
              bg-[#0d1117] border border-[#00D9FF]/30 text-[#00D9FF] text-[9px] font-bold
              rounded-lg whitespace-nowrap shadow-lg pointer-events-none
              opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0
              transition-all duration-200 z-50 backdrop-blur-md uppercase tracking-wider">
              ⌂ Return to Public Sector Dashboard
            </span>
          </motion.button>

          {/* Navigation Links with compact scales */}
          <nav className="flex flex-col gap-2 font-nav-text text-[13px] text-slate-400">
            {filteredSidebarItems.map((item) => {
              const IconComponent = {
                LayoutGrid,
                ParkingCircle,
                CalendarCheck2,
                Cctv,
                Route,
                ShieldAlert,
                FileBarChart2,
                ChartSpline,
                Settings2,
                Brain,
                Search
              }[item.iconName];

              const isActive = activeMenu === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveMenu(item.label)}
                  className={`flex items-center gap-3 px-4 rounded-xl transition-all duration-200 border whitespace-nowrap h-[46px] cursor-pointer ${
                    isActive
                      ? 'bg-[#00D9FF]/5 text-[#00D9FF] border-[#00D9FF]/20 shadow-[0_0_15px_rgba(0,217,255,0.12)] font-semibold'
                      : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white font-medium'
                  }`}
                >
                  {IconComponent && (
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <IconComponent 
                        size={20} 
                        strokeWidth={2.4} 
                        style={{
                          color: isActive ? '#00D9FF' : '#94A3B8',
                          filter: isActive ? 'drop-shadow(0 0 4px rgba(0, 217, 255, 0.35))' : 'none',
                          transform: isActive ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      />
                    </div>
                  )}
                  <span className="leading-none">{(item.label === 'AI Occupancy Prediction' ? 'AI Prediction' : item.label).toUpperCase()}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logged-In User Profile Card Section - Docked permanently without bottom gap */}
        {currentUser && (
          <div className="p-5 pt-3 border-t border-white/5 bg-[#090B14]/30 shrink-0">
            <div 
              onClick={() => {
                navigate('/profile');
              }}
              className="flex items-center gap-2 p-2 h-[42px] rounded-lg border border-white/5 bg-[#090B14]/40 hover:bg-[#00D9FF]/5 hover:border-[#00D9FF]/30 transition-all duration-300 cursor-pointer group shadow-[0_0_12px_rgba(0,0,0,0.2)] w-full"
            >
              <div className="relative shrink-0">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-[#00D9FF]/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#3B82F6] flex items-center justify-center text-[#090B14] font-heading font-extrabold text-[10px]">
                    {initials}
                  </div>
                )}
                {/* Online Indicator */}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#090B14] animate-pulse" />
              </div>

              <div className="min-w-0 flex-1 text-left font-mono">
                <span className="text-[10px] font-extrabold text-white block truncate leading-none font-heading">
                  {currentUser.fullName}
                </span>
                <span className="text-[7.5px] text-[#00D9FF] block mt-0.5 uppercase font-bold leading-none">
                  Gold Member
                </span>
              </div>

              <ChevronRight size={10} className="text-slate-500 group-hover:text-[#00D9FF] transition-all shrink-0" />
            </div>
          </div>
        )}
      </aside>

      {/* ======================================================== */}
      {/* MAIN VIEWPORT CONTAINER */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,255,0.03),transparent_60%)] pointer-events-none"></div>

        {selectedSector === 'Hospitals' && (
          <div className="px-12 py-3 bg-red-950/40 border-b border-red-500/25 flex items-center justify-between text-xs font-stat-mono text-red-400 z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>EMERGENCY DISPATCH PROTOCOL ACTIVE: AMBULANCE #AMB-911 IN TRANSIT (GATE 2)</span>
            </div>
            <div className="flex gap-4">
              <span>PRIORITY EMERGENCY SLOTS RESERVED: 8/20</span>
              <span className="text-[#00D9FF]">AI AMBULANCE ROUTE GUIDANCE: AUTO-CLEAR</span>
            </div>
          </div>
        )}

        {selectedSector === 'Airports' && (
          <div className="px-12 py-3 bg-[#00D9FF]/10 border-b border-[#00D9FF]/20 flex items-center justify-between text-xs font-stat-mono text-[#00D9FF] z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping"></span>
              <span>FLIGHT LINKED DEMAND METRICS: FLIGHT AI-303 LANDING IN 12 MINS (EXPECTED VOLUME: +140 CARS)</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span>TAXI QUEUE LOAD: NORMAL (18 mins wait)</span>
              <span className="text-emerald-400">VIP RESERVATIONS SYNCED</span>
            </div>
          </div>
        )}

        {selectedSector === 'IT Parks' && (
          <div className="px-12 py-3 bg-[#A855F7]/10 border-b border-[#A855F7]/20 flex items-center justify-between text-xs font-stat-mono text-[#A855F7] z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-ping"></span>
              <span>CORPORATE OCCUPANCY INSIGHTS: SHIFT CHANGE IN PROGRESS (EXPECTED INFLOW: +210 VEHICLES)</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span>VISITOR PASS SLOTS: 142/500 AVAILABLE</span>
              <span className="text-[#00D9FF]">AI EMPLOYEE COMPLIANCE: 99.1%</span>
            </div>
          </div>
        )}

        {selectedSector === 'Colleges & Universities' && (
          <div className="px-12 py-3 bg-[#EAB308]/10 border-b border-[#EAB308]/20 flex items-center justify-between text-xs font-stat-mono text-[#EAB308] z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping"></span>
              <span>CAMPUS SYNC PROTOCOL ACTIVE: SEMESTER EXAMS IN PROGRESS (FACULTY LANES RESERVED)</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span>STUDENT PERMITS: ACTIVE</span>
              <span className="text-[#00D9FF]">AI BIKE BAY COMPLIANCE: 98.4%</span>
            </div>
          </div>
        )}

        {selectedSector === 'Railway Stations' && (
          <div className="px-12 py-3 bg-[#00D9FF]/10 border-b border-[#00D9FF]/20 flex items-center justify-between text-xs font-stat-mono text-[#00D9FF] z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-ping"></span>
              <span>TRAIN TRANSIT TELEMETRY ACTIVE: SHATABDI EXPRESS (#12007) ARRIVING IN 8 MINS (EXPECTED TAXI DEMAND: +180)</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span>AUTO STAND CAPACITY: NORMAL</span>
              <span className="text-emerald-400">OVERFLOW PARKING PRE-CLEARED</span>
            </div>
          </div>
        )}

        {selectedSector === 'Cricket Stadiums' && (
          <div className="px-12 py-3 bg-[#EF4444]/10 border-b border-[#EF4444]/20 flex items-center justify-between text-xs font-stat-mono text-[#EF4444] z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping"></span>
              <span>MATCH DAY EVENT MODE ACTIVE: IPL T20 TONIGHT (EXPECTED SPECTATOR VEHICLES: +900)</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span>PLAYER BUS EN ROUTE: GATE 1 CLEAR</span>
              <span className="text-[#00D9FF]">AI SHUTTLE BUS FREQUENCY: 3 MINS</span>
            </div>
          </div>
        )}
        {selectedSector === 'Concert Venues' && (
          <div className="px-12 py-3 bg-[#EAB308]/10 border-b border-[#EAB308]/20 flex items-center justify-between text-xs font-stat-mono text-[#EAB308] z-10 backdrop-blur animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping"></span>
              <span>CONCERT EVENT SYNC ACTIVE: VENUE EXPECTED PEAK OCCUPANCY OVER 90% TONIGHT</span>
            </div>
            <div className="flex gap-4 text-slate-400">
              <span>ARTIST GATE: VIP CLEAR</span>
              <span className="text-[#00D9FF]">AI VALET PROTOCOL ENABLED</span>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* HEADER (UPSCALED HEIGHT & SPACIOUS PADDINGS) */}
        {/* ======================================================== */}
        <header className="px-8 py-5 bg-[#090B14]/90 border-b border-white/10 flex items-center justify-between z-10 backdrop-blur">
          <div className="text-left">
            {selectedFacility && (
              <button 
                onClick={() => setSelectedFacility(null)}
                className="text-[9px] font-mono text-[#00D9FF] hover:text-white transition-all flex items-center gap-1.5 font-bold mb-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full w-max"
              >
                ← Return to City Network
              </button>
            )}
            <h1 className="font-heading font-bold text-xl md:text-2xl lg:text-3xl text-white tracking-tight uppercase">
              {selectedFacility || 'Central Parking Tower'}
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1.5">
              AI Powered Smart Parking Management System
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#111827]/50 border border-white/10 rounded-xl px-5 py-2.5 text-right hidden sm:block shadow-inner">
              <p className="text-[8px] text-slate-500 font-mono tracking-wider font-bold">Current date</p>
              <p className="text-xs font-mono text-[#00D9FF] font-semibold mt-0.5">2026-07-06</p>
            </div>
            
            <div className="bg-[#111827]/50 border border-white/10 rounded-xl px-5 py-2.5 text-right hidden sm:block shadow-inner">
              <p className="text-[8px] text-slate-500 font-mono tracking-wider font-bold">System time</p>
              <p className="text-xs font-mono text-[#00D9FF] font-semibold mt-0.5">{timeString}</p>
            </div>

            <div className="bg-[#111827]/50 border border-white/10 rounded-xl px-5 py-2.5 text-right hidden sm:block shadow-inner">
              <p className="text-[8px] text-slate-500 font-mono tracking-wider font-bold">CCTV feed status</p>
              <p className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5 justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
              </p>
            </div>

            {/* Notification icon */}
            <Suspense fallback={
              <button className="w-14 h-14 rounded-2xl bg-[#111827]/50 border border-white/10 flex items-center justify-center text-slate-500">
                <Bell size={24} strokeWidth={2.4} />
              </button>
            }>
              <NotificationCenter />
            </Suspense>
          </div>
        </header>

        {/* ======================================================== */}
        {/* CORE WORKSPACE - UPSCALED WIDTH CONTAINER ~1780PX */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-8 z-10 max-w-[1780px] w-full mx-auto">
          <AnimatePresence mode="wait">
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full"
          >
          <Suspense fallback={
            <div className="flex-1 flex flex-col items-center justify-center min-h-[480px]">
              <div className="w-10 h-10 border-2 border-[#00D9FF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[10px] font-stat-mono text-slate-500 mt-4 uppercase tracking-widest animate-pulse">Synchronizing local node...</span>
            </div>
          }>


          {activeMenu === '3D Live Parking' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <ParkingDigitalTwin 
                slotsData={levelsData[selectedLevel]}
                onSlotStatusChange={handleSlotStatusChange}
              />
            </div>
          )}

          {activeMenu === 'Smart Reserve' && (
            <SmartReserve selectedSector={selectedSector} triggerToast={triggerToast} />
          )}

          {activeMenu === 'CCTV Streams' && (
            <div className="w-full space-y-8 text-left">
              
              {/* CCTV Sub-tab switcher */}
              <div className="flex justify-between items-center bg-[#111827]/40 p-4 rounded-[22px] border border-white/10 shadow-lg w-full">
                <div className="flex flex-col text-left">
                  <span className="font-nav-text text-[9px] text-[#00D9FF] tracking-wider uppercase font-bold">CCTV Operations</span>
                  <h3 className="font-heading font-extrabold text-base text-white mt-0.5">Surveillance & OCR Tectonic Center</h3>
                </div>

                <div className="flex bg-[#090B14] p-1.5 rounded-xl border border-white/15">
                  <button
                    onClick={() => setCctvSubTab('surveillance')}
                    className={`font-heading text-[10px] px-6 py-2.5 rounded-lg transition-all ${
                      cctvSubTab === 'surveillance'
                        ? 'bg-[#00D9FF] text-[#090B14] font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    📹 LIVE FEED
                  </button>
                  <button
                    onClick={() => setCctvSubTab('lpr')}
                    className={`font-heading text-[10px] px-6 py-2.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      cctvSubTab === 'lpr'
                        ? 'bg-[#00D9FF] text-[#090B14] font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="animate-pulse" size={18} strokeWidth={2.4} />
                    <span>🪪 LICENSE PLATE OCR</span>
                  </button>
                </div>
              </div>

              {/* Conditional sub-tab renders */}
              {cctvSubTab === 'surveillance' && (
                <div className="flex flex-col xl:flex-row gap-10 items-start text-left w-full animate-[fadeIn_0.4s_ease-out]">
                  
                  {/* LEFT COLUMN: LIVE STREAM VIDEO (68%) */}
                  <div className="w-full xl:w-[68%] space-y-8">
                    
                    {/* CCTV Header and live view */}
                    <div className="glass-panel p-8 rounded-[28px] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden bg-[#111827]/40">
                      
                      {/* CCTV Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-5">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                          <div>
                            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">CCTV FEED 01</span>
                            <h4 className="font-heading font-extrabold text-base text-white mt-0.5">CAMERA_01_FEED (LIVE)</h4>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs font-stat-mono text-slate-400">
                          <span className="bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-1 rounded-full uppercase tracking-wider font-bold animate-pulse text-[10px]">
                            RECORDING
                          </span>
                          <span className="bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] px-3 py-1 rounded-full uppercase tracking-wider font-bold text-[10px]">
                            YOLOv8 ACTIVE
                          </span>
                          <span className="text-white font-bold">{timeString}</span>
                        </div>
                      </div>

                      {/* Video stream rendering panel */}
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner">
                        <img 
                          src={`${API_BASE_URL}/api/cctv/stream`} 
                          className="w-full h-full object-cover opacity-90"
                          alt="ParkSense AI CCTV stream feed"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=640";
                          }}
                        />
                        
                        {/* Vision HUD lines */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.4))] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,217,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,217,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
                      </div>

                    </div>

                    {/* AI Indicators Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="glass-panel p-5 rounded-2xl border border-[#00D9FF]/20 flex items-center gap-3 bg-[#00D9FF]/5 animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF]"></span>
                        <span className="font-stat-mono text-[10px] text-[#00D9FF] font-bold uppercase tracking-wider">AI DETECTION ACTIVE</span>
                      </div>
                      
                      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-3">
                        <Cpu className="text-[#00D9FF] animate-spin" style={{ animationDuration: '4s' }} size={18} strokeWidth={2.4} />
                        <span className="font-stat-mono text-[10px] text-slate-300 font-bold uppercase tracking-wider">YOLOv8 RUNNING</span>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="font-stat-mono text-[10px] text-slate-300 font-bold uppercase tracking-wider">CAMERA ONLINE</span>
                      </div>

                      <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-3">
                        <Database className="text-slate-400 animate-pulse" size={18} strokeWidth={2.4} />
                        <span className="font-stat-mono text-[10px] text-slate-300 font-bold uppercase tracking-wider">STATUS SYNCED</span>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: AI STATS & CONFIG (32%) */}
                  <div className="w-full xl:w-[32%] space-y-8">
                    
                    {/* Live stats */}
                    <div className="glass-panel p-6 rounded-[28px] border border-white/10 space-y-6 shadow-2xl bg-[#111827]/40">
                      <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">AI ANALYTICS ENGINE</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#090B14] p-4 rounded-xl border border-white/5 text-center">
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Total Slots</p>
                          <p className="text-white font-stat-mono text-lg font-bold mt-1">{cctvStats.total_slots}</p>
                        </div>
                        <div className="bg-[#090B14] p-4 rounded-xl border border-white/5 text-center">
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Available</p>
                          <p className="text-[#00D9FF] font-stat-mono text-lg font-bold mt-1">{cctvStats.available_slots}</p>
                        </div>
                        <div className="bg-[#090B14] p-4 rounded-xl border border-white/5 text-center">
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Occupied</p>
                          <p className="text-red-500 font-stat-mono text-lg font-bold mt-1">{cctvStats.occupied_slots}</p>
                        </div>
                        <div className="bg-[#090B14] p-4 rounded-xl border border-white/5 text-center">
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider">Reserved</p>
                          <p className="text-[#FACC15] font-stat-mono text-lg font-bold mt-1">{cctvStats.reserved_slots}</p>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-4 space-y-3 font-stat-mono text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>FPS:</span>
                          <span className="text-white font-bold">{cctvStats.fps.toFixed(1)} FPS</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VEHICLES DETECTED:</span>
                          <span className="text-[#00D9FF] font-bold">{cctvStats.vehicles_detected}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AI CONFIDENCE:</span>
                          <span className="text-emerald-400 font-bold">{cctvStats.ai_confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CAMERA NODE STATUS:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> {cctvStats.camera_status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Configuration source */}
                    <div className="glass-panel p-6 rounded-[28px] border border-white/10 space-y-4 shadow-2xl bg-[#111827]/40">
                      <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">SOURCE CONFIGURATION</span>
                      <form onSubmit={handleSourceChange} className="space-y-3">
                        <div>
                          <label className="text-[9px] text-slate-500 uppercase block mb-1">CCTV Stream IP / Webcam ID</label>
                          <input 
                            type="text" 
                            value={cctvSourceInput}
                            onChange={(e) => setCctvSourceInput(e.target.value)}
                            placeholder="e.g. 0 or rtsp://..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-stat-mono text-xs text-white focus:outline-none focus:border-[#00D9FF] transition-all"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-3 bg-[#00D9FF] hover:bg-[#33D6FF] text-[#090B14] font-button-text text-xs rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(0,217,255,0.2)]"
                        >
                          APPLY STREAM SOURCE
                        </button>
                        {configSuccess && (
                          <p className="text-[9px] font-stat-mono text-emerald-400 text-center uppercase tracking-wider animate-pulse mt-2">Source update request sent.</p>
                        )}
                      </form>
                    </div>

                    {/* AI Log Timeline */}
                    <div className="glass-panel p-6 rounded-[28px] border border-white/10 space-y-4 shadow-2xl flex flex-col max-h-[220px] overflow-hidden bg-[#111827]/40">
                      <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">REAL-TIME SURVEILLANCE LOGS</span>
                      <div className="space-y-3 overflow-y-auto pr-1 flex-1 font-stat-mono text-[9px] text-slate-400">
                        {cctvStats.logs.length > 0 ? (
                          cctvStats.logs.map((log) => (
                            <div key={log.id} className="flex gap-2.5 border-l-2 border-[#00D9FF]/30 pl-3.5 py-0.5 text-left">
                              <span className="text-[#00D9FF]">{log.time}</span>
                              <span className="text-white truncate">{log.text}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-600 text-center py-4 font-sans text-xs">Waiting for telemetry logs...</p>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {cctvSubTab === 'lpr' && (
                <LPRModule />
              )}

            </div>
          )}

          {activeMenu === 'AI Navigation' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <AINavigationCenter />
            </div>
          )}

          {activeMenu === 'AI Occupancy Prediction' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <AIOccupancyPrediction />
            </div>
          )}

          {activeMenu === 'AI Vehicle Finder' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <AIVehicleFinder />
            </div>
          )}

          {activeMenu === 'Emergency' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <EmergencyDashboard />
            </div>
          )}



          {activeMenu === 'Reports' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <ReportsCenter />
            </div>
          )}

          {activeMenu === 'City Overview' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <SmartCityOverview onSelectBuilding={handleSelectBuilding} />
            </div>
          )}

          {activeMenu === 'Analytics' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <AnalyticsDashboard />
            </div>
          )}
 
          {activeMenu === 'Admin Console' && (
            <div className="w-full animate-[fadeIn_0.4s_ease-out]">
              <AdminConsole triggerToast={triggerToast} />
            </div>
          )}
 
          {/* MOCKED VIEW FOR OTHER TABS */}
          {activeMenu !== 'City Overview' && activeMenu !== '3D Live Parking' && activeMenu !== 'Smart Reserve' && activeMenu !== 'CCTV Streams' && activeMenu !== 'AI Navigation' && activeMenu !== 'AI Occupancy Prediction' && activeMenu !== 'AI Vehicle Finder' && activeMenu !== 'Emergency' && activeMenu !== 'Reports' && activeMenu !== 'Analytics' && activeMenu !== 'Admin Console' && (
            <div className="glass-panel p-16 rounded-[28px] border border-white/10 text-center flex flex-col items-center justify-center gap-5 h-[480px] animate-[fadeIn_0.3s_ease-out] shadow-2xl">
              <Cpu className="text-slate-600 animate-pulse" size={56} strokeWidth={2.4} />
              <h3 className="font-heading font-bold text-lg text-white">Console Tab Active</h3>
              <p className="text-xs text-slate-500 font-sans max-w-sm">
                The selected tab ({activeMenu.toUpperCase()}) is currently synchronizing local nodes. All planner services are active inside SMART RESERVE.
              </p>
              <button 
                onClick={() => setActiveMenu('Smart Reserve')}
                className="mt-4 px-8 py-3.5 bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] font-button-text text-xs rounded-full hover:bg-[#00D9FF] hover:text-[#090B14] transition-all font-bold"
              >
                RETURN TO RESERVATION PLANNER
              </button>
            </div>
          )}
          </Suspense>
          </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <Suspense fallback={null}>
        <AIAssistant setActiveMenu={setActiveMenu} triggerToast={triggerToast} navigate={navigate} />
      </Suspense>
 
    </div>
  );
}
