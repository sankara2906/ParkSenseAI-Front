import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FiSearch, FiFilter, FiTrendingUp, FiActivity, FiUser, FiZap, 
  FiAlertTriangle, FiSliders, FiClock, FiCheck, FiInfo, FiChevronRight 
} from 'react-icons/fi';

// 12 Realistic Users Demo Data
const initialUsers = [
  { id: 1, name: 'Siddharth Sharma', plate: 'DL-03-CV-8899', model: 'Tesla Model 3', slot: 'P03', entry: '09:12', duration: '2h 15m', membership: 'Premium', status: 'Active', payment: 'Completed', phone: '+91 98765 43210', email: 'siddharth@gmail.com', zone: 'Zone A', visits: 18, initials: 'SS' },
  { id: 2, name: 'Aanya Patel', plate: 'MH-12-EV-7766', model: 'Tata Nexon EV', slot: 'P08', entry: '10:45', duration: '1h 05m', membership: 'Standard', status: 'Active', payment: 'Completed', phone: '+91 98123 45678', email: 'aanya@patel.com', zone: 'Zone B', visits: 12, initials: 'AP' },
  { id: 3, name: 'Vikram Malhotra', plate: 'KA-51-MJ-4002', model: 'BMW i4', slot: 'P01', entry: '11:15', duration: '0h 45m', membership: 'Premium', status: 'Reserved', payment: 'Completed', phone: '+91 99001 12233', email: 'vikram@malhotra.in', zone: 'Zone A', visits: 24, initials: 'VM' },
  { id: 4, name: 'Rohan Gupta', plate: 'HR-26-Z-1002', model: 'MG ZS EV', slot: 'P12', entry: '08:30', duration: '3h 30m', membership: 'Standard', status: 'Active', payment: 'Pending', phone: '+91 95432 10987', email: 'rohan.gupta@outlook.com', zone: 'Zone C', visits: 8, initials: 'RG' },
  { id: 5, name: 'Priya Iyer', plate: 'TN-07-CS-5544', model: 'Hyundai Ioniq 5', slot: 'P05', entry: '12:02', duration: '0h 15m', membership: 'Premium', status: 'Active', payment: 'Completed', phone: '+91 94440 12345', email: 'priya.iyer@yahoo.com', zone: 'Zone B', visits: 15, initials: 'PI' },
  { id: 6, name: 'Amit Verma', plate: 'UP-16-AV-3030', model: 'Audi e-tron', slot: 'P09', entry: '14:20', duration: '1h 50m', membership: 'Premium', status: 'Exited', payment: 'Completed', phone: '+91 91234 56789', email: 'amit@verma.net', zone: 'Zone A', visits: 20, initials: 'AV' },
  { id: 7, name: 'Ananya Rao', plate: 'KA-03-EV-1122', model: 'BYD Atto 3', slot: 'P10', entry: '15:10', duration: '0h 40m', membership: 'Standard', status: 'Active', payment: 'Completed', phone: '+91 98888 77777', email: 'ananya@rao.org', zone: 'Zone D', visits: 6, initials: 'AR' },
  { id: 8, name: 'Rahul Sen', plate: 'WB-02-RS-9988', model: 'Kia EV6', slot: 'P06', entry: '09:50', duration: '4h 10m', membership: 'Premium', status: 'Active', payment: 'Completed', phone: '+91 97777 66666', email: 'rahul.sen@wb.gov.in', zone: 'Zone C', visits: 30, initials: 'RS' },
  { id: 9, name: 'Divya Nair', plate: 'KL-01-DN-4567', model: 'Mahindra XUV400', slot: 'P02', entry: '13:00', duration: '2h 00m', membership: 'Standard', status: 'Exited', payment: 'Completed', phone: '+91 96666 55555', email: 'divya@nair.co.in', zone: 'Zone D', visits: 10, initials: 'DN' },
  { id: 10, name: 'Karan Singh', plate: 'PB-11-KS-0077', model: 'Tesla Model S', slot: 'P04', entry: '16:05', duration: '0h 25m', membership: 'Premium', status: 'Reserved', payment: 'Completed', phone: '+91 95555 44444', email: 'karan.singh@pb.nic.in', zone: 'Zone A', visits: 42, initials: 'KS' },
  { id: 11, name: 'Meera Deshmukh', plate: 'MH-02-MD-2200', model: 'Mercedes EQB', slot: 'P07', entry: '07:45', duration: '6h 15m', membership: 'Premium', status: 'Active', payment: 'Pending', phone: '+91 94444 33333', email: 'meera@deshmukh.com', zone: 'Zone B', visits: 25, initials: 'MD' },
  { id: 12, name: 'Arjun Reddy', plate: 'AP-09-AR-9999', model: 'Porsche Taycan', slot: 'P11', entry: '17:00', duration: '0h 05m', membership: 'Premium', status: 'Active', payment: 'Completed', phone: '+91 93333 22222', email: 'arjun@reddy.co', zone: 'Zone A', visits: 35, initials: 'AR' }
];

const userGrowthData = [
  { month: 'Jan', count: 800 },
  { month: 'Feb', count: 920 },
  { month: 'Mar', count: 1050 },
  { month: 'Apr', count: 1120 },
  { month: 'May', count: 1190 },
  { month: 'Jun', count: 1254 }
];

const vehicleTypeData = [
  { name: 'SUV / Hatchback', value: 450 },
  { name: 'Sedan', value: 580 },
  { name: 'Two-Wheeler', value: 224 }
];

const membershipData = [
  { name: 'Premium Tier', value: 52 },
  { name: 'Standard Tier', value: 948 }
];

const peakUsageData = [
  { hour: '08:00', load: 65 },
  { hour: '10:00', load: 88 },
  { hour: '12:00', load: 74 },
  { hour: '14:00', load: 60 },
  { hour: '16:00', load: 82 },
  { hour: '18:00', load: 95 }
];

const PIE_COLORS = ['#00D9FF', '#3b82f6', '#1E293B'];
const DOUGHNUT_COLORS = ['#22C55E', '#111827'];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(initialUsers[0]);
  const [search, setSearch] = useState('');
  const [filterMembership, setFilterMembership] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Real-time auto-scrolling log logs
  const [activityEvents, setActivityEvents] = useState([
    { id: 'user-activity-1', time: '17:42', text: 'Vehicle DL-03-CV-8899 Entered Gate 1.' },
    { id: 'user-activity-2', time: '17:40', text: 'Reservation Confirmed: Slot P04.' },
    { id: 'user-activity-3', time: '17:35', text: 'Payment Received: ₹120 from HR-26-Z-1002.' },
    { id: 'user-activity-4', time: '17:31', text: 'License Plate Recognized: MH-12-EV-7766.' },
    { id: 'user-activity-5', time: '17:28', text: 'AI Assigned New Slot: P08.' },
  ]);

  // Simulate stats ticker counting up
  const [totalUsersCount, setTotalUsersCount] = useState(1200);
  const [totalVehiclesCount, setTotalVehiclesCount] = useState(1900);
  const [activeSessionsCount, setActiveSessionsCount] = useState(300);

  useEffect(() => {
    const userInterval = setInterval(() => {
      setTotalUsersCount(prev => {
        if (prev >= 1254) {
          clearInterval(userInterval);
          return 1254;
        }
        return prev + 4;
      });
    }, 100);
    const vehicleInterval = setInterval(() => {
      setTotalVehiclesCount(prev => {
        if (prev >= 1987) {
          clearInterval(vehicleInterval);
          return 1987;
        }
        return prev + 6;
      });
    }, 80);
    const sessionInterval = setInterval(() => {
      setActiveSessionsCount(prev => {
        if (prev >= 328) {
          clearInterval(sessionInterval);
          return 328;
        }
        return prev + 2;
      });
    }, 120);

    return () => {
      clearInterval(userInterval);
      clearInterval(vehicleInterval);
      clearInterval(sessionInterval);
    };
  }, []);

  // Filter & Search Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.plate.toLowerCase().includes(search.toLowerCase()) ||
                          user.slot.toLowerCase().includes(search.toLowerCase());
    
    const matchesMembership = filterMembership === 'All' || user.membership === filterMembership;
    const matchesStatus = filterStatus === 'All' || user.status === filterStatus;

    return matchesSearch && matchesMembership && matchesStatus;
  });

  return (
    <div className="w-full space-y-8 text-left font-sans relative">
      
      {/* ======================================================== */}
      {/* TOP ROW: 4 KPI CARDS */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Users */}
        <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg hover:border-[#00D9FF]/30 transition-all duration-300">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Total Users</span>
            <p className="text-3xl font-stat-mono font-extrabold text-white">{totalUsersCount}</p>
            <p className="text-[9px] text-slate-400">Total registered system IDs</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] text-xl">
            <FiUser />
          </div>
        </div>

        {/* Card 2: Registered Vehicles */}
        <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg hover:border-[#00D9FF]/30 transition-all duration-300">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Registered Vehicles</span>
            <p className="text-3xl font-stat-mono font-extrabold text-[#00D9FF]">{totalVehiclesCount}</p>
            <p className="text-[9px] text-slate-400">Unique license plates active</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/20 flex items-center justify-center text-[#00D9FF] text-xl">
            <FiActivity />
          </div>
        </div>

        {/* Card 3: Active Sessions */}
        <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg hover:border-[#00D9FF]/30 transition-all duration-300">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Active Parking Sessions</span>
            <p className="text-3xl font-stat-mono font-extrabold text-white">{activeSessionsCount}</p>
            <p className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> live tracker
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
            <FiZap />
          </div>
        </div>

        {/* Card 4: Premium Members */}
        <div className="glass-panel p-6 rounded-[24px] border border-white/10 flex items-center justify-between shadow-lg hover:border-[#00D9FF]/30 transition-all duration-300">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-slate-500 font-nav-text tracking-wider uppercase font-semibold">Premium Members</span>
            <p className="text-3xl font-stat-mono font-extrabold text-white">52</p>
            <p className="text-[9px] text-slate-400">Monthly loyalty tier accounts</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
            ★
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SECOND ROW: SEARCHABLE TABLE & RIGHT ACTIVITY/PROFILE */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        
        {/* Left Column: table + charts (68% -> 7 columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Table Container */}
          <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-heading font-extrabold text-lg text-white">User Registry Management</h3>
              
              {/* Search and Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, slot, plate..."
                    className="bg-[#090B14] border border-white/10 rounded-xl py-2 px-10 font-sans text-xs text-white focus:outline-none focus:border-[#00D9FF] transition-all w-48"
                  />
                </div>
                
                <select 
                  value={filterMembership} 
                  onChange={(e) => setFilterMembership(e.target.value)}
                  className="bg-[#090B14] border border-white/10 rounded-xl py-2 px-4 font-sans text-xs text-slate-400 focus:outline-none focus:border-[#00D9FF] transition-all"
                >
                  <option value="All">All Tiers</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                </select>

                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#090B14] border border-white/10 rounded-xl py-2 px-4 font-sans text-xs text-slate-400 focus:outline-none focus:border-[#00D9FF] transition-all"
                >
                  <option value="All">All States</option>
                  <option value="Active">Active</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Exited">Exited</option>
                </select>
              </div>
            </div>

            {/* Table layout */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider text-[9px] font-nav-text text-left">
                    <th className="pb-4 font-semibold">Avatar</th>
                    <th className="pb-4 font-semibold">Full Name</th>
                    <th className="pb-4 font-semibold">Plate No.</th>
                    <th className="pb-4 font-semibold">Vehicle</th>
                    <th className="pb-4 font-semibold">Slot</th>
                    <th className="pb-4 font-semibold">Entry</th>
                    <th className="pb-4 font-semibold">Membership</th>
                    <th className="pb-4 font-semibold">Status</th>
                    <th className="pb-4 pr-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUser?.id === user.id;
                    
                    let statusColor = 'text-slate-400 bg-slate-800/10 border-slate-700/20';
                    if (user.status === 'Active') statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    else if (user.status === 'Reserved') statusColor = 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/20';
                    else if (user.status === 'Exited') statusColor = 'text-slate-500 bg-slate-800/20 border-white/5';
                    else if (user.status === 'Payment Pending') statusColor = 'text-orange-400 bg-orange-500/10 border-orange-500/20';

                    return (
                      <tr 
                        key={user.id} 
                        onClick={() => setSelectedUser(user)}
                        className={`hover:bg-[#111827]/30 transition-all cursor-pointer ${
                          isSelected ? 'bg-[#00D9FF]/5 text-white font-bold' : ''
                        }`}
                      >
                        <td className="py-4">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#3b82f6] flex items-center justify-center text-[#090B14] font-heading font-extrabold text-[10px] shadow-lg">
                            {user.initials}
                          </div>
                        </td>
                        <td className="py-4 font-medium">{user.name}</td>
                        <td className="py-4 font-stat-mono">{user.plate}</td>
                        <td className="py-4">{user.model}</td>
                        <td className="py-4 font-stat-mono text-[#00D9FF] font-bold">{user.slot}</td>
                        <td className="py-4 font-stat-mono">{user.entry}</td>
                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] ${
                            user.membership === 'Premium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {user.membership}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] border font-bold ${statusColor}`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                          <FiChevronRight className="inline-block text-[#00D9FF] text-base" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* User Growth Line Chart */}
            <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-xl text-left space-y-4">
              <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">MEMBERSHIP RETENTION</span>
              <h4 className="font-heading font-extrabold text-sm text-white">User Growth Trend (6 Months)</h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="count" stroke="#00D9FF" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Peak Usage Bar Chart */}
            <div className="glass-panel p-6 rounded-[24px] border border-white/10 shadow-xl text-left space-y-4">
              <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">CAPACITY LOADS</span>
              <h4 className="font-heading font-extrabold text-sm text-white">Peak Usage Loads Hourly</h4>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakUsageData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="hour" stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} fontFamily="monospace" />
                    <Tooltip contentStyle={{ backgroundColor: '#0b1325', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Bar dataKey="load" fill="#00D9FF" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* AI Insights & Recent Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Insights Recommendations */}
            <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-xl text-left flex flex-col justify-between">
              <div className="flex flex-col pb-3 border-b border-white/10 mb-4">
                <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">AI PREDICTIONS</span>
                <h4 className="font-heading font-extrabold text-sm text-white mt-0.5">AI Insights recommendations</h4>
              </div>
              <div className="space-y-3.5 text-xs text-slate-300 font-sans flex-1">
                <div className="flex gap-2">
                  <span className="text-[#00D9FF]">✦</span>
                  <p>Peak parking hour detected between 09:00–11:00.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#00D9FF]">✦</span>
                  <p>18% increase in premium tier users since last week.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-[#00D9FF]">✦</span>
                  <p>Average parking session duration resolves to 2.3 hrs.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-400">✦</span>
                  <p>Zone B nearing capacity thresholds. Recommend opening overflow lot P08.</p>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-xl text-left flex flex-col justify-between">
              <div className="flex flex-col pb-3 border-b border-white/10 mb-4">
                <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">ALERT MANAGER</span>
                <h4 className="font-heading font-extrabold text-sm text-white mt-0.5">Recent Security Alerts</h4>
              </div>
              <div className="space-y-3.5 text-xs text-slate-400 font-stat-mono">
                <div className="flex items-center justify-between border-l border-red-500 pl-3">
                  <span>Vehicle Overstayed (KA-03-EV)</span>
                  <span className="text-red-500 font-bold">CRITICAL</span>
                </div>
                <div className="flex items-center justify-between border-l border-orange-500 pl-3">
                  <span>Payment Pending (HR-26-Z)</span>
                  <span className="text-orange-400 font-bold">WARNING</span>
                </div>
                <div className="flex items-center justify-between border-l border-red-500 pl-3">
                  <span>Unauthorized Parking (Zone C)</span>
                  <span className="text-red-500 font-bold">CRITICAL</span>
                </div>
                <div className="flex items-center justify-between border-l border-[#00D9FF] pl-3">
                  <span>Reserved Slot Timeout (P10)</span>
                  <span className="text-[#00D9FF] font-bold">INFO</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Profile Side Panel & Live Activity Feed (32% -> 3 columns) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* User Profile sliding panel */}
          <div className="glass-panel p-8 rounded-[28px] border border-white/10 shadow-2xl text-left relative overflow-hidden bg-[#111827]/40">
            <div className="flex flex-col pb-4 border-b border-white/10 mb-6">
              <span className="font-nav-text text-[9px] text-slate-500 tracking-wider">USER PROFILE INSPECTOR</span>
              <h4 className="font-heading font-extrabold text-base text-white mt-0.5">Selected Profile Details</h4>
            </div>

            {selectedUser ? (
              <div className="space-y-6">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4.5 bg-[#090B14] p-5 rounded-2xl border border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00D9FF] to-[#3b82f6] flex items-center justify-center text-[#090B14] font-heading font-extrabold text-base shadow-[0_0_15px_rgba(0,217,255,0.3)]">
                    {selectedUser.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-heading font-bold text-sm text-white truncate">{selectedUser.name}</h5>
                    <p className="font-stat-mono text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{selectedUser.membership} MEMBER</p>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="space-y-3 font-stat-mono text-xs text-slate-400">
                  <div className="flex justify-between"><span>PLATE NO:</span><span className="text-white font-bold">{selectedUser.plate}</span></div>
                  <div className="flex justify-between"><span>VEHICLE:</span><span className="text-white">{selectedUser.model}</span></div>
                  <div className="flex justify-between"><span>PHONE:</span><span className="text-white">{selectedUser.phone}</span></div>
                  <div className="flex justify-between"><span>EMAIL:</span><span className="text-white truncate max-w-[140px]">{selectedUser.email}</span></div>
                  <div className="flex justify-between"><span>ASSIGNED SLOT:</span><span className="text-[#00D9FF] font-bold">{selectedUser.slot}</span></div>
                  <div className="flex justify-between"><span>VISITS:</span><span className="text-white font-bold">{selectedUser.visits}</span></div>
                  <div className="flex justify-between"><span>PREFERED ZONE:</span><span className="text-white">{selectedUser.zone}</span></div>
                </div>

                {/* Parking History Timeline */}
                <div className="space-y-4 pt-5 border-t border-white/10 text-left">
                  <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block">PARKING HISTORY TIMELINE</span>
                  <div className="space-y-3 text-[10px] font-stat-mono text-slate-400 relative border-l border-white/10 pl-4 ml-2">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <p className="text-white font-bold">09:12 Entered Gate A</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00D9FF]"></span>
                      <p>09:13 AI Assigned Slot {selectedUser.slot}</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00D9FF]"></span>
                      <p>09:14 Navigation Started</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p>09:17 Vehicle Parked</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <p className="text-white">11:35 Payment Completed</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-600"></span>
                      <p>11:36 Exit Recorded</p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 font-sans border border-dashed border-white/5 rounded-2xl">
                Select a user row from the registry table to inspect the profile details.
              </div>
            )}
          </div>

          {/* Live User Activity feed */}
          <div className="glass-panel p-6 rounded-[28px] border border-white/10 shadow-2xl flex flex-col max-h-[260px] overflow-hidden bg-[#111827]/40 text-left">
            <span className="font-nav-text text-[9px] text-slate-500 tracking-wider block mb-4 border-b border-white/10 pb-2">LIVE USER ACTIVITY</span>
            <div className="space-y-3.5 overflow-y-auto pr-1 flex-1 font-stat-mono text-[10px] text-slate-400">
              {activityEvents.map((e) => (
                <div key={e.id} className="flex gap-3 border-l-2 border-[#00D9FF]/20 pl-3.5 py-0.5">
                  <span className="text-[#00D9FF]">{e.time}</span>
                  <span className="text-white truncate">{e.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default React.memo(UserManagement);
