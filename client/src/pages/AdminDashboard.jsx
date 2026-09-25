import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  Database, 
  Layers,
  Sparkles,
  MapPin,
  CheckCircle,
  Hotel,
  Lock,
  UserPlus,
  Users,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations' | 'admins'
  
  // Destination Management State
  const [destinations, setDestinations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Admin Accounts Management State
  const [admins, setAdmins] = useState([]);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminInput, setNewAdminInput] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Tourism Operations & Content'
  });

  const [newDest, setNewDest] = useState({
    name: '',
    state: '',
    zone: 'North',
    category: 'UNESCO World Heritage & Iconic Monuments',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    tagline: '',
    description: '',
    bestTimeToVisit: 'October to March',
    idealDuration: '2-3 Days',
    budgetLevel: 'Moderate',
    avgDailyExpense: 2400,
    highlights: 'Sunrise photography, Historic complex exploration, Local food tasting',
    lat: 26.9124,
    lng: 75.7873,
    attractions: [],
    famousFood: [],
    shoppingSpecialties: [],
    transportation: {},
    hotels: []
  });

  const [newHotelInput, setNewHotelInput] = useState({
    name: '',
    type: 'Heritage / Boutique Hotel',
    priceRange: '₹3,000 - ₹5,500 / night',
    rating: 4.8,
    address: '',
    amenities: 'Free Wi-Fi, Breakfast, Swimming Pool, AC',
    bookingUrl: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, adminRes] = await Promise.allSettled([
          api.getDestinations(),
          api.getAdmins()
        ]);
        if (destRes.status === 'fulfilled' && destRes.value?.data) {
          setDestinations(destRes.value.data);
        }
        if (adminRes.status === 'fulfilled' && adminRes.value?.data) {
          setAdmins(adminRes.value.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddHotelToDestination = () => {
    if (!newHotelInput.name.trim()) return;
    const hotelObj = {
      ...newHotelInput,
      amenities: typeof newHotelInput.amenities === 'string'
        ? newHotelInput.amenities.split(',').map(a => a.trim()).filter(Boolean)
        : newHotelInput.amenities
    };
    setNewDest(prev => ({
      ...prev,
      hotels: [...(prev.hotels || []), hotelObj]
    }));
    setNewHotelInput({
      name: '',
      type: 'Heritage / Boutique Hotel',
      priceRange: '₹3,000 - ₹5,500 / night',
      rating: 4.8,
      address: '',
      amenities: 'Free Wi-Fi, Breakfast, Swimming Pool, AC',
      bookingUrl: ''
    });
  };

  const handleRemoveHotel = (index) => {
    setNewDest(prev => ({
      ...prev,
      hotels: prev.hotels.filter((_, i) => i !== index)
    }));
  };

  const handleAIGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.generateAIDestination(aiPrompt.trim());
      if (res.data) {
        const d = res.data;
        setNewDest({
          name: d.name || aiPrompt,
          state: d.state || '',
          zone: d.zone || 'North',
          category: d.category || 'UNESCO World Heritage & Iconic Monuments',
          heroImage: d.heroImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
          tagline: d.tagline || '',
          description: d.description || '',
          bestTimeToVisit: d.bestTimeToVisit || 'October to March',
          idealDuration: d.idealDuration || '2-3 Days',
          budgetLevel: d.budgetLevel || 'Moderate',
          avgDailyExpense: d.avgDailyExpense || 2400,
          highlights: Array.isArray(d.highlights) ? d.highlights.join(', ') : (d.highlights || ''),
          lat: d.lat || d.coordinates?.lat || 26.9124,
          lng: d.lng || d.coordinates?.lng || 75.7873,
          attractions: d.attractions || [],
          famousFood: d.famousFood || [],
          shoppingSpecialties: d.shoppingSpecialties || [],
          transportation: d.transportation || {},
          hotels: d.hotels || []
        });
        setSuccessMsg(`✨ AI generated complete metadata & recommended ${d.hotels?.length || 3} verified hotels for "${d.name}"!`);
        setTimeout(() => setSuccessMsg(''), 7000);
      }
    } catch (err) {
      alert('AI Generation Notice: ' + (err.message || 'Could not fetch AI information'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const highlightsArr = typeof newDest.highlights === 'string'
      ? newDest.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : newDest.highlights;

    const payload = {
      ...newDest,
      createdBy: user?.id || 'admin-root',
      createdByName: user?.name || 'Administrator',
      createdByEmail: user?.email || 'admin@bharatyatra.com',
      avgDailyExpense: Number(newDest.avgDailyExpense) || 2400,
      coordinates: { 
        lat: Number(newDest.lat) || 26.9124, 
        lng: Number(newDest.lng) || 75.7873 
      },
      highlights: highlightsArr.length > 0 ? highlightsArr : [
        `Explore the historic grounds and architecture of ${newDest.name}`,
        `Cultural heritage photography and local experiences in ${newDest.state}`
      ],
      attractions: newDest.attractions?.length > 0 ? newDest.attractions : [
        { name: `${newDest.name} Main Complex`, type: newDest.category, entryFee: 40, timeNeeded: '2.5 hours' }
      ],
      famousFood: newDest.famousFood?.length > 0 ? newDest.famousFood : [
        { name: `Authentic ${newDest.state} Specialty Thali`, place: 'Local Heritage Restaurant', desc: 'Traditional regional delicacies and sweets' }
      ],
      shoppingSpecialties: newDest.shoppingSpecialties?.length > 0 ? newDest.shoppingSpecialties : [
        `Traditional ${newDest.state} Handloom`,
        'Authentic Handicrafts & Souvenirs'
      ],
      transportation: newDest.transportation?.nearestAirport ? newDest.transportation : {
        nearestAirport: `Regional Airport in ${newDest.state}`,
        nearestRailway: `Major City Railway Junction`,
        localCommute: 'E-rickshaws, Autos, and App Cabs'
      },
      hotels: newDest.hotels?.length > 0 ? newDest.hotels : [
        {
          name: `${newDest.name} Heritage Residency`,
          type: 'Comfort / Heritage Stay',
          priceRange: '₹3,000 - ₹5,500 / night',
          pricePerNight: 3500,
          rating: 4.8,
          address: `Near ${newDest.name}, ${newDest.state}`,
          amenities: ['Free Wi-Fi', 'Breakfast', 'Air Conditioning'],
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          bookingUrl: 'https://www.booking.com'
        }
      ]
    };

    const res = await api.createDestination(payload);
    if (res.data) {
      setDestinations([res.data, ...destinations]);
      setIsAdding(false);
      setSuccessMsg(`"${res.data.name}" successfully added by ${user?.name || 'You'} to directory & database!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleDelete = async (dest) => {
    // Ownership check: Only the admin who created it can remove it
    const isOwner = !dest.createdByEmail || 
                    (user?.email && dest.createdByEmail.toLowerCase() === user.email.toLowerCase()) ||
                    (user?.id && dest.createdBy && String(dest.createdBy) === String(user.id)) ||
                    (user?.email === 'admin@bharatyatra.com');

    if (!isOwner) {
      alert(`⚠️ Permission Denied:\nAap sirf wahi destination remove kar sakte hain jo aapne create kiya tha.\n(Created by: ${dest.createdByName || dest.createdByEmail})`);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove "${dest.name}" from directory & database?`)) return;
    try {
      const res = await api.deleteDestination(dest.id || dest._id);
      if (res && res.success === false) {
        alert(res.message);
        return;
      }
      setDestinations(destinations.filter(d => (d.id || d._id) !== (dest.id || dest._id)));
      setSuccessMsg(`"${dest.name}" removed successfully from directory & database.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setSuccessMsg('Deleted locally from active view.');
    }
  };

  // --- Admin Accounts Handlers ---
  const handleAddAdminSubmit = async (e) => {
    e.preventDefault();
    if (!newAdminInput.name || !newAdminInput.email || !newAdminInput.password) {
      alert('Please fill out all required fields for the new admin.');
      return;
    }

    try {
      const payload = {
        name: newAdminInput.name,
        email: newAdminInput.email,
        password: newAdminInput.password,
        department: newAdminInput.department,
        createdBy: user?.id || 'admin-root',
        createdByName: user?.name || 'Administrator',
        createdByEmail: user?.email || 'admin@bharatyatra.com'
      };

      const res = await api.createAdmin(payload);
      if (res.data || res.success) {
        const addedAdmin = res.data || payload;
        setAdmins(prev => [addedAdmin, ...prev]);
        setIsAddingAdmin(false);
        setNewAdminInput({ name: '', email: '', password: '', department: 'Tourism Operations & Content' });
        setSuccessMsg(`✨ Admin account "${addedAdmin.name}" (${addedAdmin.email}) added successfully by ${user?.name || 'You'}!`);
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add admin account.');
    }
  };

  const handleDeleteAdmin = async (adminAccount) => {
    const adminId = adminAccount.id || adminAccount._id;
    // Ownership check: ONLY the admin who added this admin account can delete it!
    const isCreator = (user?.email && adminAccount.createdByEmail && adminAccount.createdByEmail.toLowerCase() === user.email.toLowerCase()) ||
                      (user?.id && adminAccount.createdBy && String(adminAccount.createdBy) === String(user.id)) ||
                      (user?.email === 'admin@bharatyatra.com');

    if (!isCreator) {
      alert(`⚠️ Permission Denied:\nAap sirf wahi admin delete kar sakte hain jisko aapne add kiya hai.\n(Added by: ${adminAccount.createdByName || adminAccount.createdByEmail || 'System Seed'})`);
      return;
    }

    if (!window.confirm(`Are you sure you want to remove admin account "${adminAccount.name}" (${adminAccount.email})?`)) return;

    try {
      const res = await api.deleteAdmin(adminId, user?.email, user?.id);
      if (res.success === false) {
        alert(res.message);
        return;
      }
      setAdmins(prev => prev.filter(a => (a.id || a._id) !== adminId));
      setSuccessMsg(`Admin account "${adminAccount.name}" removed successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to delete admin.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#0A192F] dark:text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            This dashboard controls all Indian monuments, admin accounts, and tourism management. Only registered Administrator accounts can access this page.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <a
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#0A192F] dark:bg-amber-500 text-amber-300 dark:text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition"
          >
            Sign in as Admin
          </a>
        </div>
      </div>
    );
  }

  const getAdminInitial = (name) => {
    if (!name || typeof name !== 'string') return 'A';
    const trimmed = name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'A';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 dark:border-amber-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A192F] dark:text-white tracking-tight">
            Bharat Yatra Content & Team Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage destinations, curate travel records, and oversee admin team members with strict creator-deletion policies.
          </p>
        </div>

        {/* Tab Switcher & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-amber-100/70 dark:bg-slate-800/90 p-1 rounded-2xl flex items-center border border-amber-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('destinations')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'destinations'
                  ? 'bg-[#0A192F] text-amber-300 dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Destinations ({destinations.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-[#0A192F] text-amber-300 dark:bg-amber-500 dark:text-slate-950 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Admin Team ({admins.length})</span>
            </button>
          </div>

          {activeTab === 'destinations' ? (
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isAdding ? 'Close Form' : 'Add Destination'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddingAdmin(!isAddingAdmin)}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isAddingAdmin ? 'Close Form' : 'Add New Admin'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Security Policy Reminder Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/15 dark:bg-amber-500/10 border border-amber-400/60 dark:border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs flex items-center gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <div>
          <span className="font-bold text-amber-900 dark:text-amber-300">Strict Ownership Deletion Rule Active:</span>{' '}
          <span className="text-amber-900/90 dark:text-amber-200/90">
            Aap Admin Dashboard me wahi record ya Admin account delete kar sakte hain jo aapne add/create kiya tha. Dusre Admin ke add kiye admin accounts deletion permissions locked zone me rahenge.
          </span>
        </div>
      </div>

      {/* TAB 1: DESTINATIONS MANAGEMENT */}
      {activeTab === 'destinations' && (
        <>
          {/* Analytics Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400">Total Destinations</span>
                <Database className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-2xl font-black text-[#0A192F] dark:text-white">{destinations.length}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Across All Zones</span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400">Geographic Zones</span>
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-2xl font-black text-[#0A192F] dark:text-white">5 Regions</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 block mt-0.5">North, South, West, East, NE</span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400">AI Planner Engine</span>
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-2xl font-black text-[#0A192F] dark:text-white">Active</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Day-Wise Generator</span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-blue-800 dark:text-blue-400">Platform System</span>
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-lg font-black text-[#0A192F] dark:text-white">Operational</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">REST API & Leaflet GIS</span>
            </div>
          </div>

          {/* Add New Destination Form Panel */}
          {isAdding && (
            <form onSubmit={handleAddSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-500/30 shadow-xl space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Create New Destination Record</span>
                </h3>
                <span className="text-[11px] text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/30">
                  ⚡ Powered by Wikipedia & Tourism Knowledge Engine
                </span>
              </div>

              {/* AI Auto-Fill Research Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/40 dark:border-amber-500/30 space-y-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                    <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-[#0A192F] dark:text-white">
                      AI Auto-Fill & Heritage Research Assistant
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Type any Indian monument or place name. AI will automatically research and fill Wikipedia details, photos, GPS coordinates, food, budget & transit!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Enter monument name (e.g. Statue of Unity, Somnath Temple, Hampi, Dhanushkodi, Chanderi Fort)..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-xs font-semibold outline-hidden focus:border-amber-600 dark:focus:border-amber-400 text-[#0A192F] dark:text-white shadow-xs"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAIGenerate(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white dark:text-slate-950 text-xs font-black transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {aiLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>AI Researching Info...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>✨ Generate with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={newDest.name}
                    onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                    placeholder="e.g. Rishikesh (Yoga Capital)"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">State / UT</label>
                  <input
                    type="text"
                    required
                    value={newDest.state}
                    onChange={(e) => setNewDest({ ...newDest, state: e.target.value })}
                    placeholder="e.g. Uttarakhand"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Geographic Zone</label>
                  <select
                    value={newDest.zone}
                    onChange={(e) => setNewDest({ ...newDest, zone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  >
                    <option value="North">North India</option>
                    <option value="South">South India</option>
                    <option value="West">West India</option>
                    <option value="East">East India</option>
                    <option value="North-East">North-East India</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Category</label>
                  <select
                    value={newDest.category}
                    onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  >
                    <option value="UNESCO World Heritage & Iconic Monuments">UNESCO World Heritage & Iconic Monuments</option>
                    <option value="Historic Forts & Citadels">Historic Forts & Citadels</option>
                    <option value="Temples & Spiritual Sites">Temples & Spiritual Sites</option>
                    <option value="Royal Palaces, Museums & Historical Sites">Royal Palaces, Museums & Historical Sites</option>
                    <option value="Ancient Caves & Rock-Cut Sites">Ancient Caves & Rock-Cut Sites</option>
                    <option value="Beaches & Coastal Escapes">Beaches & Coastal Escapes</option>
                    <option value="Hill Stations & Tea Estates">Hill Stations & Tea Estates</option>
                    <option value="Wildlife & Tiger Reserves">Wildlife & Tiger Reserves</option>
                    <option value="Adventure & Himalayan Circuits">Adventure & Himalayan Circuits</option>
                    <option value="Natural Wonders">Natural Wonders</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Avg Daily Cost (₹)</label>
                  <input
                    type="number"
                    value={newDest.avgDailyExpense}
                    onChange={(e) => setNewDest({ ...newDest, avgDailyExpense: e.target.value })}
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Hero Image URL</label>
                  <input
                    type="url"
                    value={newDest.heroImage}
                    onChange={(e) => setNewDest({ ...newDest, heroImage: e.target.value })}
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={newDest.tagline}
                    onChange={(e) => setNewDest({ ...newDest, tagline: e.target.value })}
                    placeholder="e.g. UNESCO World Heritage Fort"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Best Time to Visit</label>
                  <input
                    type="text"
                    value={newDest.bestTimeToVisit}
                    onChange={(e) => setNewDest({ ...newDest, bestTimeToVisit: e.target.value })}
                    placeholder="e.g. October to March"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Ideal Duration</label>
                  <input
                    type="text"
                    value={newDest.idealDuration}
                    onChange={(e) => setNewDest({ ...newDest, idealDuration: e.target.value })}
                    placeholder="e.g. 2-3 Days"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Latitude (GPS Lat)</label>
                  <input
                    type="number"
                    step="any"
                    value={newDest.lat}
                    onChange={(e) => setNewDest({ ...newDest, lat: e.target.value })}
                    placeholder="e.g. 26.9124"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Longitude (GPS Lng)</label>
                  <input
                    type="number"
                    step="any"
                    value={newDest.lng}
                    onChange={(e) => setNewDest({ ...newDest, lng: e.target.value })}
                    placeholder="e.g. 75.7873"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>
              </div>

              {/* Hotels & Stays Management Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Hotel className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Recommended Hotels & Stays ({newDest.hotels?.length || 0})</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Auto-filled by AI or add manually</span>
                </div>

                {/* List of currently added hotels */}
                {newDest.hotels && newDest.hotels.length > 0 ? (
                  <div className="space-y-2">
                    {newDest.hotels.map((hotel, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{hotel.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-[10px] font-bold text-amber-900 dark:text-amber-300">
                              {hotel.type}
                            </span>
                            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400 font-bold">
                              {hotel.priceRange}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">📍 {hotel.address || 'Central Corridor'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveHotel(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                          title="Remove hotel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No hotels added yet. Use the inputs below or trigger AI generation above.</p>
                )}

                {/* Quick Add Hotel Form */}
                <div className="pt-2 border-t border-amber-200/60 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">+ Add Custom Hotel:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newHotelInput.name}
                      onChange={(e) => setNewHotelInput({ ...newHotelInput, name: e.target.value })}
                      placeholder="Hotel / Resort Name"
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      value={newHotelInput.type}
                      onChange={(e) => setNewHotelInput({ ...newHotelInput, type: e.target.value })}
                      placeholder="Type (e.g. Luxury Resort / Homestay)"
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      value={newHotelInput.priceRange}
                      onChange={(e) => setNewHotelInput({ ...newHotelInput, priceRange: e.target.value })}
                      placeholder="Price (e.g. ₹3,500/night)"
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newHotelInput.address}
                      onChange={(e) => setNewHotelInput({ ...newHotelInput, address: e.target.value })}
                      placeholder="Hotel Address / Landmark"
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newHotelInput.amenities}
                        onChange={(e) => setNewHotelInput({ ...newHotelInput, amenities: e.target.value })}
                        placeholder="Amenities (comma-separated)"
                        className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        onClick={handleAddHotelToDestination}
                        className="px-4 py-2 rounded-xl gradient-saffron text-slate-950 text-xs font-bold whitespace-nowrap cursor-pointer"
                      >
                        + Add Hotel
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Highlights (Comma separated)</label>
                <input
                  type="text"
                  value={newDest.highlights}
                  onChange={(e) => setNewDest({ ...newDest, highlights: e.target.value })}
                  placeholder="e.g. Sunrise view, Ancient architecture, Local food tasting"
                  className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-medium outline-hidden text-[#0A192F] dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={newDest.description}
                  onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                  placeholder="Detailed description of destination, cultural significance, and travel appeal..."
                  className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-medium outline-hidden text-[#0A192F] dark:text-white"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0A192F] dark:bg-amber-500 hover:bg-[#020C1B] dark:hover:bg-amber-600 text-amber-300 dark:text-slate-950 text-xs font-black shadow-md cursor-pointer"
                >
                  Save Destination to Database
                </button>
              </div>
            </form>
          )}

          {/* Active Destinations Table */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0A192F] dark:text-white">Manage Active Destinations ({destinations.length})</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">⚠️ Only the Admin who created a destination can remove it.</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-amber-50/80 dark:bg-slate-800/90 text-[#0A192F] dark:text-amber-300 font-bold border-b border-amber-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Destination</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">State & Zone</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Category</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Hotels</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Added By</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Daily Cost</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/60 dark:divide-slate-800">
                  {destinations.map((d) => {
                    const isMine = !d.createdByEmail || 
                                   (user?.email && d.createdByEmail.toLowerCase() === user.email.toLowerCase()) ||
                                   (user?.id && d.createdBy && String(d.createdBy) === String(user.id)) ||
                                   (user?.email === 'admin@bharatyatra.com');

                    return (
                      <tr key={d.id || d._id} className="hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-bold text-[#0A192F] dark:text-white flex items-center gap-2.5">
                          <img src={d.heroImage} alt={d.name} className="w-9 h-9 rounded-xl object-cover border border-amber-300 dark:border-amber-500/30" />
                          <span className="font-bold text-xs sm:text-sm text-[#0A192F] dark:text-slate-100">{d.name}</span>
                        </td>
                        <td className="p-3.5 text-slate-700 dark:text-slate-300">{d.state} ({d.zone})</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-500/30">
                            {d.category}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold">
                            {d.hotels?.length || 0} Stays
                          </span>
                        </td>
                        <td className="p-3.5">
                          {isMine ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-300 dark:border-emerald-500/40">
                              Added by You
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-300 dark:border-slate-700">
                              {d.createdByName || d.createdByEmail || 'System Seed'}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-[#0A192F] dark:text-white">₹{d.avgDailyExpense}</td>
                        <td className="p-3.5 text-right">
                          {isMine ? (
                            <button
                              onClick={() => handleDelete(d)}
                              className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                              title="Delete destination"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              onClick={() => handleDelete(d)}
                              className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40"
                              title={`Only ${d.createdByName || d.createdByEmail || 'creator admin'} can remove this`}
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: ADMIN TEAM MANAGEMENT */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          
          {/* Admin Team Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400">Total Admin Accounts</span>
                <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-2xl font-black text-[#0A192F] dark:text-white">{admins.length}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Active Admin Privileges</span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400">Created By You</span>
                <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {admins.filter(a => 
                  (user?.email && a.createdByEmail && a.createdByEmail.toLowerCase() === user.email.toLowerCase()) ||
                  (user?.id && a.createdBy && String(a.createdBy) === String(user.id)) ||
                  (user?.email === 'admin@bharatyatra.com')
                ).length}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Deletable by your account</span>
            </div>

            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-amber-900/10 dark:border-amber-500/20 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase text-amber-800 dark:text-amber-400">Deletion Policy</span>
                <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-lg font-black text-[#0A192F] dark:text-white">Creator-Only</span>
              <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold block mt-0.5">Strict Permission Guard</span>
            </div>
          </div>

          {/* Add New Admin Form Panel */}
          {isAddingAdmin && (
            <form onSubmit={handleAddAdminSubmit} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-500/30 shadow-xl space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span>Register New Administrator Account</span>
                </h3>
                <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-500/30">
                  🔒 You will be recorded as Creator ({user?.name || user?.email})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Admin Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAdminInput.name}
                    onChange={(e) => setNewAdminInput({ ...newAdminInput, name: e.target.value })}
                    placeholder="e.g. Vikramaditya Sharma"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Admin Email Address</label>
                  <input
                    type="email"
                    required
                    value={newAdminInput.email}
                    onChange={(e) => setNewAdminInput({ ...newAdminInput, email: e.target.value })}
                    placeholder="e.g. vikram.admin@bharatyatra.com"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminInput.password}
                    onChange={(e) => setNewAdminInput({ ...newAdminInput, password: e.target.value })}
                    placeholder="Set secure password..."
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase block mb-1">Department / Role</label>
                  <input
                    type="text"
                    required
                    value={newAdminInput.department}
                    onChange={(e) => setNewAdminInput({ ...newAdminInput, department: e.target.value })}
                    placeholder="e.g. Tourism Content & Regional Curator"
                    className="w-full p-3 rounded-xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-semibold outline-hidden text-[#0A192F] dark:text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 text-amber-900 dark:text-amber-300 text-xs">
                💡 <strong>Important Note:</strong> App me wahi Admin is naye Admin account ko delete kar sakega jiske dwara ye account add/create hua hai (`{user?.email}`).
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAdmin(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-950 dark:text-slate-200 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0A192F] dark:bg-amber-500 hover:bg-[#020C1B] dark:hover:bg-amber-600 text-amber-300 dark:text-slate-950 text-xs font-black shadow-md cursor-pointer"
                >
                  Create & Register Admin
                </button>
              </div>
            </form>
          )}

          {/* Admins Accounts Table */}
          <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0A192F] dark:text-white">Active Admin Accounts ({admins.length})</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                🛡️ Jo Admin add karega, wahi Admin delete kar sakega.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-amber-50/80 dark:bg-slate-800/90 text-[#0A192F] dark:text-amber-300 font-bold border-b border-amber-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Administrator</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Email Address</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Department</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300">Added By (Creator Admin)</th>
                    <th className="p-3.5 uppercase tracking-wider font-extrabold text-amber-950 dark:text-amber-300 text-right">Action (Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/60 dark:divide-slate-800">
                  {admins.map((adm) => {
                    const admId = adm.id || adm._id;
                    const isCreator = (user?.email && adm.createdByEmail && adm.createdByEmail.toLowerCase() === user.email.toLowerCase()) ||
                                      (user?.id && adm.createdBy && String(adm.createdBy) === String(user.id)) ||
                                      (user?.email === 'admin@bharatyatra.com');

                    return (
                      <tr key={admId} className="hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 font-bold text-[#0A192F] dark:text-white flex items-center gap-3">
                          <div className="relative group shrink-0">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-slate-950 font-black text-base flex items-center justify-center shadow-md shadow-amber-500/25 border-2 border-amber-300 dark:border-amber-400 uppercase tracking-wider">
                              {getAdminInitial(adm.name)}
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" title="Active Admin Account"></span>
                          </div>
                          <div>
                            <span className="block font-bold text-xs sm:text-sm text-[#0A192F] dark:text-slate-100">{adm.name}</span>
                            <span className="inline-block text-[10px] text-amber-800 dark:text-amber-400 font-mono font-bold uppercase tracking-wider">{adm.role || 'Admin'}</span>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono font-semibold text-xs text-slate-700 dark:text-slate-300">{adm.email}</td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-semibold text-xs border border-amber-200 dark:border-amber-500/30">
                            {adm.department || 'Tourism Operations'}
                          </span>
                        </td>

                        <td className="p-3.5">
                          {isCreator ? (
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[10px] border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1.5 w-fit shadow-2xs">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              Added by You
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px] border border-slate-300 dark:border-slate-700 block w-fit">
                              Added by: {adm.createdByName || adm.createdByEmail || 'System Seed'}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          {isCreator ? (
                            <button
                              onClick={() => handleDeleteAdmin(adm)}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 font-bold text-xs transition flex items-center gap-1.5 ml-auto cursor-pointer shadow-2xs"
                              title="Delete this admin account (Allowed because you created it)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteAdmin(adm)}
                              className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 font-medium text-xs cursor-not-allowed opacity-70 flex items-center gap-1.5 ml-auto"
                              title={`Permission Locked: Only ${adm.createdByName || adm.createdByEmail || 'creator admin'} can delete this account`}
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                              <span>Locked</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
