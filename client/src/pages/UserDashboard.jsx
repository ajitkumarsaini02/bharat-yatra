import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Compass, 
  Sparkles, 
  Heart, 
  Route as RouteIcon, 
  MapPin, 
  Calendar, 
  Trash2, 
  ChevronRight, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  DollarSign, 
  UtensilsCrossed, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  ArrowRight,
  Bookmark,
  Share2,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { destinationsData } from '../data/mockData';

export default function UserDashboard() {
  const { user, favorites, savedItineraries, removeItinerary, toggleFavorite, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'itineraries' | 'wishlist' | 'trips' | 'security'
  const [allDestinations, setAllDestinations] = useState(destinationsData);
  const [expandedItinId, setExpandedItinId] = useState(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Planned transit trips state
  const [plannedTrips, setPlannedTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat_yatra_planned_trips');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'trip-1',
        origin: 'New Delhi (NDLS)',
        destination: 'Agra Cantt (AGC)',
        date: 'Upcoming Weekend',
        mode: 'Vande Bharat Express',
        estimatedFare: '₹1,450',
        duration: '1h 40m',
        status: 'Scheduled'
      },
      {
        id: 'trip-2',
        origin: 'Mumbai Central (MMCT)',
        destination: 'Goa (Madgaon)',
        date: 'Next Month',
        mode: 'Tejas Express / Rail',
        estimatedFare: '₹2,100',
        duration: '8h 15m',
        status: 'Exploring'
      }
    ];
  });

  // Load all destination data for wishlist resolution
  useEffect(() => {
    let isMounted = true;
    const fetchDests = async () => {
      try {
        const res = await api.getDestinations();
        if (isMounted && res && res.data && res.data.length > 0) {
          setAllDestinations(res.data);
        }
      } catch {
        if (isMounted) setAllDestinations(destinationsData);
      }
    };
    fetchDests();
    return () => { isMounted = false; };
  }, []);

  // Filter bookmarked destinations
  const wishlistDestinations = allDestinations.filter(d => 
    favorites.some(fav => String(fav) === String(d.id) || (d._id && String(fav) === String(d._id)))
  );

  // Calculate traveler explorer level
  const totalActivity = favorites.length + savedItineraries.length + plannedTrips.length;
  let travelerTier = 'Beginner Explorer';
  let tierColor = 'bg-blue-100 text-blue-800';
  if (totalActivity >= 8) {
    travelerTier = 'Heritage Connoisseur';
    tierColor = 'bg-amber-100 text-amber-800';
  } else if (totalActivity >= 4) {
    travelerTier = 'Avid Voyager';
    tierColor = 'bg-orange-100 text-[#F28C45]';
  }

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPassword || !newPassword) {
      setPassError('Please fill in both current and new passwords.');
      return;
    }

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match. Please verify.');
      return;
    }

    setPassLoading(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      setPassSuccess(res?.message || 'Password successfully updated!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassError(err.response?.data?.message || err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleSignOut = () => {
    logoutUser();
    navigate('/login');
  };

  const handleDeleteTrip = (tripId) => {
    const updated = plannedTrips.filter(t => t.id !== tripId);
    setPlannedTrips(updated);
    localStorage.setItem('bharat_yatra_planned_trips', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* ================= HERO PROFILE BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-6 sm:p-10 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user?.name || 'Traveler'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 p-1 bg-[#F28C45] rounded-lg text-white shadow-xs">
                <Compass className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user?.name || 'Traveler'}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wide ${tierColor}`}>
                  {travelerTier}
                </span>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-[#F28C45] text-white">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-white/80 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#FFB36B]" />
                <span>{user?.email || 'traveler@bharatyatra.com'}</span>
              </p>
              <p className="text-white/60 text-[11px]">
                Traveler ID: <span className="font-mono">{user?._id || user?.id || 'BY-EXPLORER'}</span>
              </p>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              to="/ai-planner"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F28C45] hover:bg-[#e0752f] text-white transition shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan with AI</span>
            </Link>
            <Link
              to="/map"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition backdrop-blur-md flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-[#FFB36B]" />
              <span>GIS Map</span>
            </Link>
            <Link
              to="/budget-calculator"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition backdrop-blur-md flex items-center gap-1.5"
            >
              <DollarSign className="w-4 h-4 text-emerald-300" />
              <span>Budget Planner</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4 METRICS CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`text-left p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'wishlist'
              ? 'bg-white border-[#F28C45] shadow-md ring-2 ring-[#F28C45]/20'
              : 'bg-white border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FFF5EE] flex items-center justify-center text-[#F28C45]">
              <Heart className="w-5 h-5 fill-[#F28C45]/20" />
            </div>
            <span className="text-[11px] font-bold text-[#F28C45] bg-[#FFF5EE] px-2 py-0.5 rounded-full">
              Wishlist
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D]">
            {wishlistDestinations.length}
          </div>
          <div className="text-xs font-semibold text-[#718096] mt-0.5">
            Saved Destinations
          </div>
        </button>

        <button
          onClick={() => setActiveTab('itineraries')}
          className={`text-left p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'itineraries'
              ? 'bg-white border-[#F28C45] shadow-md ring-2 ring-[#F28C45]/20'
              : 'bg-white border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D]">
              <Sparkles className="w-5 h-5 text-[#F28C45]" />
            </div>
            <span className="text-[11px] font-bold text-[#123B5D] bg-[#EAF4FA] px-2 py-0.5 rounded-full">
              AI Schedules
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D]">
            {savedItineraries.length}
          </div>
          <div className="text-xs font-semibold text-[#718096] mt-0.5">
            Saved AI Itineraries
          </div>
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`text-left p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'trips'
              ? 'bg-white border-[#F28C45] shadow-md ring-2 ring-[#F28C45]/20'
              : 'bg-white border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D]">
              <RouteIcon className="w-5 h-5 text-[#1D5D85]" />
            </div>
            <span className="text-[11px] font-bold text-[#1D5D85] bg-[#EAF4FA] px-2 py-0.5 rounded-full">
              Transit
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D]">
            {plannedTrips.length}
          </div>
          <div className="text-xs font-semibold text-[#718096] mt-0.5">
            Planned Journeys
          </div>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`text-left p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-white border-[#F28C45] shadow-md ring-2 ring-[#F28C45]/20'
              : 'bg-white border-[#E5EAF0] shadow-xs hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D]">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Protected
            </span>
          </div>
          <div className="text-base sm:text-lg font-black text-[#123B5D] truncate">
            {isAdmin ? 'Admin Root' : 'Standard'}
          </div>
          <div className="text-xs font-semibold text-[#718096] mt-0.5">
            Account & Security
          </div>
        </button>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5EAF0]">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Compass },
          { id: 'itineraries', label: `AI Itineraries (${savedItineraries.length})`, icon: Sparkles },
          { id: 'wishlist', label: `Saved Wishlist (${wishlistDestinations.length})`, icon: Heart },
          { id: 'trips', label: `Planned Journeys (${plannedTrips.length})`, icon: RouteIcon },
          { id: 'security', label: 'Account & Security', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#123B5D] text-white shadow-sm'
                  : 'bg-white text-[#718096] hover:text-[#123B5D] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFB36B]' : 'text-[#718096]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Quick Hub Grid */}
          <div>
            <h2 className="text-lg font-black text-[#123B5D] mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#F28C45]" />
              <span>Smart Tourism Toolkit</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/ai-planner"
                className="p-5 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#F28C45] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5EE] flex items-center justify-center text-[#F28C45] mb-3 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                  AI Day-by-Day Planner
                </h3>
                <p className="text-xs text-[#718096] mt-1 font-medium leading-relaxed">
                  Generate customized itineraries for any Indian city with smart activity scheduling and budgets.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#F28C45] gap-1">
                  <span>Launch Generator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                to="/destinations"
                className="p-5 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#F28C45] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] mb-3 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-[#123B5D]" />
                </div>
                <h3 className="text-base font-bold text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                  Explore 114+ Destinations
                </h3>
                <p className="text-xs text-[#718096] mt-1 font-medium leading-relaxed">
                  Discover verified historic monuments, spiritual temples, hill stations, and coastal retreats.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#123B5D] gap-1">
                  <span>Browse Directory</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                to="/budget-calculator"
                className="p-5 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#F28C45] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 mb-3 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#123B5D] group-hover:text-emerald-700 transition-colors">
                  Travel Budget Estimator
                </h3>
                <p className="text-xs text-[#718096] mt-1 font-medium leading-relaxed">
                  Calculate realistic stay, food, transport, and local sight expense breakdowns in seconds.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-emerald-700 gap-1">
                  <span>Estimate Expenses</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                to="/travel-planner"
                className="p-5 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#F28C45] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#1D5D85] mb-3 group-hover:scale-110 transition-transform">
                  <RouteIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#123B5D] group-hover:text-[#1D5D85] transition-colors">
                  Multi-Modal Transit Planner
                </h3>
                <p className="text-xs text-[#718096] mt-1 font-medium leading-relaxed">
                  Compare rail, flight, bus, and cab options across major Indian route networks.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#1D5D85] gap-1">
                  <span>Plan Route</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                to="/cuisine"
                className="p-5 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#F28C45] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FFF5EE] flex items-center justify-center text-[#F28C45] mb-3 group-hover:scale-110 transition-transform">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                  Regional Cuisine Explorer
                </h3>
                <p className="text-xs text-[#718096] mt-1 font-medium leading-relaxed">
                  Savor authentic culinary traditions, signature thalis, sweets, and dishes across Indian states.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#F28C45] gap-1">
                  <span>Explore Dishes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                to="/map"
                className="p-5 rounded-3xl bg-white border border-[#E5EAF0] hover:border-[#F28C45] hover:shadow-md transition group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] mb-3 group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6 text-[#123B5D]" />
                </div>
                <h3 className="text-base font-bold text-[#123B5D] group-hover:text-[#123B5D] transition-colors">
                  Interactive GIS Map
                </h3>
                <p className="text-xs text-[#718096] mt-1 font-medium leading-relaxed">
                  Locate monuments, beach spots, and sacred sites spatially on an interactive all-India map.
                </p>
                <div className="mt-3 flex items-center text-xs font-bold text-[#123B5D] gap-1">
                  <span>Open GIS Map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Wishlist Preview */}
          {wishlistDestinations.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#123B5D]">Recent Wishlist Bookmarks</h3>
                  <p className="text-xs text-[#718096] font-medium">Quick access to destinations you want to visit.</p>
                </div>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className="text-xs font-bold text-[#F28C45] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({wishlistDestinations.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishlistDestinations.slice(0, 3).map(dest => (
                  <Link
                    key={dest.id || dest._id}
                    to={`/destination/${dest.id || dest._id}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] hover:border-[#F28C45] transition group"
                  >
                    <img
                      src={dest.heroImage || dest.image}
                      alt={dest.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-[#123B5D] group-hover:text-[#F28C45] transition truncate">
                        {dest.name}
                      </h4>
                      <p className="text-[11px] text-[#718096] flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#F28C45] shrink-0" />
                        <span>{dest.state}</span>
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-[#123B5D] bg-[#EAF4FA] px-2 py-0.5 rounded-md">
                        {dest.budgetLevel || 'Moderate'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Official Helplines & Traveler Safety Info */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#EAF4FA] to-[#FFF5EE] border border-[#E5EAF0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#F28C45] bg-white px-2.5 py-0.5 rounded-full border border-[#E5EAF0]">
                Official Indian Travel Helpline
              </span>
              <h4 className="text-sm font-black text-[#123B5D]">
                Ministry of Tourism 24x7 Multi-Lingual Toll-Free Helpline: <span className="text-[#F28C45]">1363</span>
              </h4>
              <p className="text-xs text-[#718096] font-medium">
                Railway Inquiries: <strong>139</strong> • National Emergency Number: <strong>112</strong>
              </p>
            </div>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#123B5D] text-white hover:bg-[#1D5D85] transition shrink-0"
            >
              Contact Support
            </Link>
          </div>
        </div>
      )}

      {/* ================= TAB 2: AI ITINERARIES ================= */}
      {activeTab === 'itineraries' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#123B5D]">My Generated AI Itineraries</h2>
              <p className="text-xs text-[#718096] font-medium">
                Day-by-day travel schedules created with our AI intelligence engine.
              </p>
            </div>
            <Link
              to="/ai-planner"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#F28C45] text-white hover:bg-[#e0752f] transition shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Plan</span>
            </Link>
          </div>

          {savedItineraries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E5EAF0] p-8 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF5EE] text-[#F28C45] flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#123B5D]">No Itineraries Saved Yet</h3>
                <p className="text-xs text-[#718096] max-w-md mx-auto font-medium">
                  Use our AI Travel Planner to build personalized day-wise sightseeing, route maps, and budget breakdowns.
                </p>
              </div>
              <Link
                to="/ai-planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] transition shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Your First AI Itinerary</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedItineraries.map((itin, index) => {
                const itinId = itin.id || itin._id || `itin-${index}`;
                const isExpanded = expandedItinId === itinId;
                const days = itin.days || itin.itinerary || [];

                return (
                  <div
                    key={itinId}
                    className="bg-white rounded-3xl border border-[#E5EAF0] shadow-xs overflow-hidden transition-all hover:border-slate-300"
                  >
                    {/* Header Bar */}
                    <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-white via-[#F7F9FC] to-white">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FFF5EE] text-[#F28C45] border border-[#F28C45]/20">
                            {itin.duration || `${days.length || 3} Days`}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EAF4FA] text-[#123B5D]">
                            {itin.travelers || 'Traveler Plan'}
                          </span>
                          <span className="text-xs text-[#718096] font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Saved on {itin.savedAt ? new Date(itin.savedAt).toLocaleDateString() : 'Recent'}</span>
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-[#123B5D]">
                          {itin.destination || itin.title || 'Incredible Bharat Tour'}
                        </h3>
                        <p className="text-xs text-[#718096] font-medium">
                          {itin.summary || `Personalized travel itinerary covering top monuments, culinary spots, and transit.`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setExpandedItinId(isExpanded ? null : itinId)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#123B5D] bg-[#EAF4FA] hover:bg-[#dbeaf5] transition cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide Details' : 'View Schedule'}</span>
                        </button>
                        <button
                          onClick={() => removeItinerary(itinId)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition border border-rose-200 cursor-pointer"
                          title="Delete Itinerary"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Daily Schedule */}
                    {isExpanded && (
                      <div className="p-5 sm:p-6 border-t border-[#E5EAF0] bg-[#F7F9FC] space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#123B5D]">
                          Day-by-Day Travel Schedule
                        </h4>
                        
                        {Array.isArray(days) && days.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {days.map((dayItem, dIdx) => (
                              <div
                                key={dIdx}
                                className="p-4 rounded-2xl bg-white border border-[#E5EAF0] shadow-2xs space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black text-[#F28C45]">
                                    Day {dayItem.day || dIdx + 1}
                                  </span>
                                  <span className="text-[11px] font-semibold text-[#718096]">
                                    {dayItem.theme || dayItem.title || 'Exploration'}
                                  </span>
                                </div>
                                <p className="text-xs text-[#29445A] font-medium leading-relaxed">
                                  {dayItem.description || dayItem.activity || dayItem.morning || 'Sightseeing & heritage exploration.'}
                                </p>
                                {dayItem.highlights && Array.isArray(dayItem.highlights) && (
                                  <div className="flex flex-wrap gap-1 pt-1">
                                    {dayItem.highlights.map((h, hIdx) => (
                                      <span key={hIdx} className="text-[10px] font-semibold bg-[#EAF4FA] text-[#123B5D] px-2 py-0.5 rounded-md">
                                        {h}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white border border-[#E5EAF0] text-xs text-[#718096]">
                            Complete AI itinerary data is stored in your profile session.
                          </div>
                        )}

                        <div className="pt-2 flex justify-end">
                          <Link
                            to="/ai-planner"
                            className="text-xs font-bold text-[#F28C45] hover:underline flex items-center gap-1"
                          >
                            <span>Regenerate or customize in AI Planner</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: SAVED WISHLIST ================= */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#123B5D]">Bookmarked Bucket List</h2>
              <p className="text-xs text-[#718096] font-medium">
                Monuments, hill stations, and destinations you have saved for future exploration.
              </p>
            </div>
            <Link
              to="/destinations"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#123B5D] text-white hover:bg-[#1D5D85] transition shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-[#FFB36B]" />
              <span>Browse All ({allDestinations.length})</span>
            </Link>
          </div>

          {wishlistDestinations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E5EAF0] p-8 space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF5EE] text-[#F28C45] flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-[#123B5D]">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#718096] max-w-md mx-auto font-medium">
                  Browse our directory of 114+ destinations across 28 states and tap the heart icon on any card to save it here.
                </p>
              </div>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#F28C45] hover:bg-[#e0752f] transition shadow-md"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Indian Destinations</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistDestinations.map(dest => {
                const destId = dest.id || dest._id;
                return (
                  <div
                    key={destId}
                    className="bg-white rounded-3xl border border-[#E5EAF0] shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dest.heroImage || dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => toggleFavorite(destId)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-rose-500 hover:bg-white shadow-md transition cursor-pointer"
                        title="Remove from favorites"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                      </button>
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                        {dest.category || 'Historic Monument'}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#718096] mb-1">
                          <span className="flex items-center gap-1 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-[#F28C45]" />
                            <span>{dest.state}</span>
                          </span>
                          <span className="font-bold text-[#123B5D]">
                            {dest.budgetLevel || 'Moderate'}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-xs text-[#718096] line-clamp-2 mt-1 font-medium">
                          {dest.tagline || dest.description || 'Verified Indian heritage location with rich architecture.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between">
                        <span className="text-[11px] text-[#718096] font-medium">
                          Best: <strong>{dest.bestTimeToVisit || 'Oct - Mar'}</strong>
                        </span>
                        <Link
                          to={`/destination/${destId}`}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#123B5D] hover:bg-[#1D5D85] transition"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: PLANNED JOURNEYS ================= */}
      {activeTab === 'trips' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#123B5D]">Planned Journeys & Transit</h2>
              <p className="text-xs text-[#718096] font-medium">
                Multi-modal routes, rail bookings, and flight connections calculated for your trips.
              </p>
            </div>
            <Link
              to="/travel-planner"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#123B5D] text-white hover:bg-[#1D5D85] transition shadow-md flex items-center gap-1.5"
            >
              <RouteIcon className="w-4 h-4 text-[#FFB36B]" />
              <span>Plan New Transit</span>
            </Link>
          </div>

          <div className="space-y-3">
            {plannedTrips.map(trip => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] shrink-0">
                    <RouteIcon className="w-6 h-6 text-[#123B5D]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-[#123B5D]">
                        {trip.origin} <span className="text-[#F28C45]">→</span> {trip.destination}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF5EE] text-[#F28C45]">
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#718096] font-medium flex flex-wrap items-center gap-3">
                      <span>🚆 {trip.mode}</span>
                      <span>⏱️ {trip.duration}</span>
                      <span>📅 {trip.date}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-[#E5EAF0]">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-[#718096] font-medium">Estimated Fare</div>
                    <div className="text-base font-black text-[#123B5D]">{trip.estimatedFare}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-200 cursor-pointer"
                    title="Remove Trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: SECURITY & ACCOUNT ================= */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          
          {/* User Account Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#123B5D] flex items-center gap-2">
                <User className="w-5 h-5 text-[#F28C45]" />
                <span>Traveler Profile Details</span>
              </h2>
              <p className="text-xs text-[#718096] font-medium mt-1">
                Your authenticated Bharat Yatra user credentials.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                  Full Name
                </label>
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-bold text-[#29445A]">
                  {user?.name || 'Explorer'}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                  Email Address
                </label>
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-bold text-[#29445A]">
                  {user?.email || 'user@bharatyatra.com'}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                  Account Role & Permissions
                </label>
                <div className="p-3.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-bold text-[#29445A] flex items-center justify-between">
                  <span>{isAdmin ? 'Administrator (Full Content & User Access)' : 'Verified Traveler (User)'}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Bharat Yatra</span>
                </button>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#123B5D] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#F28C45]" />
                <span>Security & Password Update</span>
              </h2>
              <p className="text-xs text-[#718096] font-medium mt-1">
                Update your account password securely.
              </p>
            </div>

            {passError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#123B5D] uppercase block mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#F28C45] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-semibold outline-hidden focus:border-[#F28C45] text-[#29445A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full py-3 rounded-xl text-xs font-bold bg-[#123B5D] hover:bg-[#1D5D85] text-white transition shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FFB36B]" />
                <span>{passLoading ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
