import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Building2, 
  Train, 
  Bus, 
  Car, 
  Sparkles, 
  ArrowLeftRight, 
  Calendar, 
  Users, 
  Search, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  Flame, 
  AlertCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { destinationsData } from '../data/mockData';
import { api } from '../services/api';

const POPULAR_HUBS = [
  { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi Int Airport / NDLS' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Int / CSMT' },
  { city: 'Agra', code: 'AGC', name: 'Agra Cantt Railway / Kheria' },
  { city: 'Jaipur', code: 'JAI', name: 'Jaipur Int Airport / JP Junction' },
  { city: 'Goa', code: 'GOI', name: 'Dabolim / Mopa Airport / Madgaon' },
  { city: 'Bengaluru', code: 'BLR', name: 'Kempegowda Int / SBC Station' },
  { city: 'Varanasi', code: 'VNS', name: 'Lal Bahadur Shastri / Varanasi Jn' },
  { city: 'Kolkata', code: 'CCU', name: 'Netaji Subhash Chandra Bose / HWH' },
  { city: 'Kochi', code: 'COK', name: 'Cochin Int Airport / Ernakulam' },
  { city: 'Amritsar', code: 'ATQ', name: 'Sri Guru Ram Dass Jee / ASR' },
  { city: 'Shimla', code: 'SLV', name: 'Jubarhati Airport / Shimla Rail' },
  { city: 'Udaipur', code: 'UDR', name: 'Maharana Pratap Airport / UDZ' }
];

export default function MMTSearchWidget() {
  const navigate = useNavigate();

  // Active Category: 'flights' | 'hotels' | 'trains' | 'buses' | 'cabs' | 'holidays'
  const [activeCategory, setActiveCategory] = useState('flights');

  // Sub-types per category
  const [flightTripType, setFlightTripType] = useState('oneway'); // 'oneway' | 'roundtrip'
  const [trainSubTab, setTrainSubTab] = useState('book'); // 'book' | 'pnr' | 'live'
  const [cabTripType, setCabTripType] = useState('outstation_oneway'); // 'outstation_oneway' | 'outstation_round' | 'airport'
  const [specialFare, setSpecialFare] = useState('regular'); // 'regular' | 'student' | 'senior' | 'armed_forces'

  // Location inputs
  const [fromCity, setFromCity] = useState('Delhi');
  const [fromCode, setFromCode] = useState('DEL');
  const [toCity, setToCity] = useState('Agra');
  const [toCode, setToCode] = useState('AGC');

  // Autocomplete dropdown state
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');

  // Dates
  const [departDate, setDepartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toISOString().split('T')[0];
  });

  // Travellers & Class Popover
  const [showTravellerPopover, setShowTravellerPopover] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelClass, setTravelClass] = useState('Economy'); // 'Economy' | 'Premium Economy' | 'Business' | 'All Classes' | '3A' | '2A' | '1A' | 'Sleeper'
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelNights, setHotelNights] = useState(2);

  // Train PNR / Status quick lookups
  const [trainNumberInput, setTrainNumberInput] = useState('12002');
  const [trainStatusLoading, setTrainStatusLoading] = useState(false);
  const [trainStatusResult, setTrainStatusResult] = useState(null);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const travellerRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setShowFromDropdown(false);
      if (toRef.current && !toRef.current.contains(e.target)) setShowToDropdown(false);
      if (travellerRef.current && !travellerRef.current.contains(e.target)) setShowTravellerPopover(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Swap From and To
  const handleSwap = () => {
    const tempCity = fromCity;
    const tempCode = fromCode;
    setFromCity(toCity);
    setFromCode(toCode);
    setToCity(tempCity);
    setToCode(tempCode);
  };

  // Format Date for MakeMyTrip style display (e.g. "18 Nov'26, Wednesday")
  const formatDateDisplay = (dateString) => {
    if (!dateString) return { day: '--', monthYear: 'Select Date', weekday: '' };
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = String(dateObj.getFullYear()).slice(-2);
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' });
    return {
      day: day < 10 ? `0${day}` : `${day}`,
      monthYear: `${month}'${year}`,
      weekday
    };
  };

  const departFormatted = formatDateDisplay(departDate);
  const returnFormatted = formatDateDisplay(returnDate);

  // Filtered Hubs for Autocomplete
  const filterHubs = (q) => {
    if (!q || !q.trim()) return POPULAR_HUBS;
    const lower = q.toLowerCase();
    return POPULAR_HUBS.filter(h => 
      h.city.toLowerCase().includes(lower) || 
      h.code.toLowerCase().includes(lower) || 
      h.name.toLowerCase().includes(lower)
    );
  };

  // Train status check handler
  const handleCheckTrainStatus = async (e) => {
    e.preventDefault();
    if (!trainNumberInput.trim()) return;
    setTrainStatusLoading(true);
    setTrainStatusResult(null);
    try {
      const res = await api.getTrainStatus(trainNumberInput.trim());
      setTrainStatusResult(res);
    } catch (err) {
      setTrainStatusResult({ success: false, message: 'Status service currently responding with timetable estimates.' });
    } finally {
      setTrainStatusLoading(false);
    }
  };

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const totalTravellers = adults + children;

    if (activeCategory === 'holidays') {
      navigate(`/ai-planner?destination=${encodeURIComponent(toCity)}&days=${hotelNights}&travelers=${totalTravellers}&travelStyle=Moderate`);
      return;
    }

    // Map MMT active category to TravelPlanner mode
    const modeMap = {
      flights: 'flight',
      hotels: 'hotel',
      trains: 'train',
      buses: 'bus',
      cabs: 'cab'
    };

    const targetMode = modeMap[activeCategory] || 'all';

    navigate(
      `/travel-planner?from=${encodeURIComponent(fromCity)}&destination=${encodeURIComponent(toCity)}&mode=${targetMode}&travelDate=${departDate}&travelersCount=${totalTravellers}&hotelNights=${hotelNights}`
    );
  };

  const categories = [
    { id: 'flights', label: 'Flights', icon: Plane, badge: 'Cheapest' },
    { id: 'hotels', label: 'Hotels', icon: Building2, badge: 'Up to 40% Off' },
    { id: 'trains', label: 'Trains', icon: Train, badge: 'IRCTC Authorized' },
    { id: 'buses', label: 'Buses', icon: Bus, badge: 'AC Sleeper' },
    { id: 'cabs', label: 'Outstation Cabs', icon: Car, badge: 'Doorstep Pickup' },
    { id: 'holidays', label: 'AI Holiday Trips', icon: Sparkles, badge: 'AI Smart' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Category Icon Tabs Bar (The trademark MakeMyTrip floating bar) */}
      <div className="bg-white rounded-t-3xl shadow-xl border-x border-t border-[#E5EAF0] px-4 sm:px-8 py-3 flex items-center justify-between overflow-x-auto gap-2 sm:gap-6 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-2xl transition-all duration-200 cursor-pointer whitespace-nowrap group shrink-0 ${
                isActive 
                  ? 'text-[#123B5D] font-extrabold border-b-4 border-[#F28C45] bg-[#EAF4FA]' 
                  : 'text-[#718096] hover:text-[#123B5D] hover:bg-[#EAF4FA]/50'
              }`}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive ? 'bg-[#F28C45] text-white shadow-md shadow-[#F28C45]/30' : 'bg-[#F7F9FC] text-[#1D5D85] group-hover:scale-105'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm mt-1.5 font-bold tracking-tight">{cat.label}</span>
              {cat.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold mt-0.5 tracking-tighter ${
                  isActive 
                    ? 'bg-[#F28C45] text-white' 
                    : 'bg-[#EAF4FA] text-[#1D5D85]'
                }`}>
                  {cat.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Search Panel Box */}
      <div className="bg-white rounded-b-3xl shadow-2xl border border-[#E5EAF0] p-5 sm:p-7 relative z-20 space-y-5">
        
        {/* Sub-bar options: Trip Type radio buttons & Live Status tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#E5EAF0] pb-3">
          
          {/* Flights Sub-Options */}
          {activeCategory === 'flights' && (
            <div className="flex items-center gap-4 font-bold text-[#29445A]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="flightType" 
                  checked={flightTripType === 'oneway'} 
                  onChange={() => setFlightTripType('oneway')}
                  className="accent-[#F28C45] w-3.5 h-3.5 cursor-pointer"
                />
                <span>One Way</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="flightType" 
                  checked={flightTripType === 'roundtrip'} 
                  onChange={() => setFlightTripType('roundtrip')}
                  className="accent-[#F28C45] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Round Trip</span>
              </label>
            </div>
          )}

          {/* Trains Sub-Options */}
          {activeCategory === 'trains' && (
            <div className="flex items-center gap-2 font-bold text-[#29445A]">
              <button
                type="button"
                onClick={() => setTrainSubTab('book')}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-all ${
                  trainSubTab === 'book' ? 'bg-[#123B5D] text-white shadow-sm' : 'bg-[#EAF4FA] text-[#123B5D] hover:bg-[#d6e9f5]'
                }`}
              >
                Book Train Tickets
              </button>
              <button
                type="button"
                onClick={() => setTrainSubTab('live')}
                className={`px-3 py-1 rounded-full text-xs cursor-pointer transition-all ${
                  trainSubTab === 'live' ? 'bg-[#123B5D] text-white shadow-sm' : 'bg-[#EAF4FA] text-[#123B5D] hover:bg-[#d6e9f5]'
                }`}
              >
                Live Train Running Status
              </button>
            </div>
          )}

          {/* Cabs Sub-Options */}
          {activeCategory === 'cabs' && (
            <div className="flex items-center gap-4 font-bold text-[#29445A]">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="cabType" 
                  checked={cabTripType === 'outstation_oneway'} 
                  onChange={() => setCabTripType('outstation_oneway')}
                  className="accent-[#F28C45] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Outstation One-Way</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="cabType" 
                  checked={cabTripType === 'outstation_round'} 
                  onChange={() => setCabTripType('outstation_round')}
                  className="accent-[#F28C45] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Outstation Round-Trip</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="cabType" 
                  checked={cabTripType === 'airport'} 
                  onChange={() => setCabTripType('airport')}
                  className="accent-[#F28C45] w-3.5 h-3.5 cursor-pointer"
                />
                <span>Airport Transfers</span>
              </label>
            </div>
          )}

          {/* Hotels Sub-Options */}
          {activeCategory === 'hotels' && (
            <div className="text-xs font-semibold text-[#718096]">
              Book Verified Heritage Hotels, Luxury Resorts & Homestays across India
            </div>
          )}

          {/* Holidays Sub-Options */}
          {activeCategory === 'holidays' && (
            <div className="text-xs font-semibold text-[#123B5D] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C45]" />
              <span>AI Curated Day-wise Itinerary with Distance & Cost Breakdown</span>
            </div>
          )}

          <div className="text-[11px] text-[#718096] font-medium hidden sm:block">
            Verified Indian Tourism & Transport Tariffs
          </div>
        </div>

        {/* TRAIN LIVE RUNNING STATUS SUB-PANEL */}
        {activeCategory === 'trains' && trainSubTab === 'live' ? (
          <div className="p-6 rounded-2xl bg-[#EAF4FA]/60 border border-[#E5EAF0] space-y-4">
            <h4 className="text-sm font-bold text-[#123B5D] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F28C45]" />
              <span>Check Live Train Running Status (IRCTC / RailRadar)</span>
            </h4>
            <form onSubmit={handleCheckTrainStatus} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trainNumberInput}
                onChange={(e) => setTrainNumberInput(e.target.value)}
                placeholder="Enter 5-digit Train Number (e.g. 12002)"
                className="flex-1 px-4 py-3 rounded-xl border border-[#E5EAF0] bg-white text-sm font-bold text-[#29445A] focus:outline-none focus:ring-2 focus:ring-[#F28C45]"
              />
              <button
                type="submit"
                disabled={trainStatusLoading}
                className="px-6 py-3 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
              >
                {trainStatusLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Check Status</span>
              </button>
            </form>

            {trainStatusResult && (
              <div className="mt-3 p-4 rounded-xl bg-white border border-[#E5EAF0] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#123B5D]">Train: {trainNumberInput}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    {trainStatusResult.status || 'Active On Track'}
                  </span>
                </div>
                <p className="text-[#718096]">
                  {trainStatusResult.message || `Train running on scheduled timetable between ${fromCity} and ${toCity}.`}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* STANDARD MMT INPUTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-12 rounded-2xl border border-[#E5EAF0] overflow-visible bg-white divide-y md:divide-y-0 md:divide-x divide-[#E5EAF0]">
            
            {/* FROM BLOCK */}
            <div ref={fromRef} className="md:col-span-3 p-4 hover:bg-[#EAF4FA]/50 transition-colors relative cursor-pointer" onClick={() => setShowFromDropdown(true)}>
              <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">From</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-[#123B5D] tracking-tight">{fromCity}</span>
                <span className="text-xs font-bold text-[#F28C45]">{fromCode}</span>
              </div>
              <p className="text-[11px] text-[#718096] truncate mt-0.5">
                {POPULAR_HUBS.find(h => h.city.toLowerCase() === fromCity.toLowerCase())?.name || `${fromCity} Junction / Airport`}
              </p>

              {/* From Dropdown Autocomplete */}
              {showFromDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F9FC] rounded-xl mb-2 border border-[#E5EAF0]">
                    <Search className="w-3.5 h-3.5 text-[#718096]" />
                    <input
                      type="text"
                      value={fromSearchQuery}
                      onChange={(e) => setFromSearchQuery(e.target.value)}
                      placeholder="Type city or airport name..."
                      className="bg-transparent border-none text-xs font-bold w-full focus:outline-none text-[#29445A]"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {filterHubs(fromSearchQuery).map((hub) => (
                      <div
                        key={hub.city}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFromCity(hub.city);
                          setFromCode(hub.code);
                          setShowFromDropdown(false);
                          setFromSearchQuery('');
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-[#EAF4FA] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#123B5D]">{hub.city}</p>
                          <p className="text-[10px] text-[#718096] truncate max-w-[180px]">{hub.name}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#F28C45]">{hub.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SWAP BUTTON (Floats on the border) */}
            <div className="relative md:w-0 flex items-center justify-center">
              <button
                type="button"
                onClick={handleSwap}
                aria-label="Swap Locations"
                className="w-8 h-8 rounded-full bg-white border border-[#E5EAF0] shadow-md flex items-center justify-center text-[#F28C45] hover:text-[#123B5D] hover:scale-110 active:rotate-180 transition-all cursor-pointer z-30 -my-4 md:my-0 md:-ml-4"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* TO BLOCK */}
            <div ref={toRef} className="md:col-span-3 p-4 hover:bg-[#EAF4FA]/50 transition-colors relative cursor-pointer" onClick={() => setShowToDropdown(true)}>
              <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">To</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-[#123B5D] tracking-tight">{toCity}</span>
                <span className="text-xs font-bold text-[#F28C45]">{toCode}</span>
              </div>
              <p className="text-[11px] text-[#718096] truncate mt-0.5">
                {POPULAR_HUBS.find(h => h.city.toLowerCase() === toCity.toLowerCase())?.name || `${toCity} Cantt / Destination`}
              </p>

              {/* To Dropdown Autocomplete */}
              {showToDropdown && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-[#F7F9FC] rounded-xl mb-2 border border-[#E5EAF0]">
                    <Search className="w-3.5 h-3.5 text-[#718096]" />
                    <input
                      type="text"
                      value={toSearchQuery}
                      onChange={(e) => setToSearchQuery(e.target.value)}
                      placeholder="Type destination..."
                      className="bg-transparent border-none text-xs font-bold w-full focus:outline-none text-[#29445A]"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-1">
                    {filterHubs(toSearchQuery).map((hub) => (
                      <div
                        key={hub.city}
                        onClick={(e) => {
                          e.stopPropagation();
                          setToCity(hub.city);
                          setToCode(hub.code);
                          setShowToDropdown(false);
                          setToSearchQuery('');
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-[#EAF4FA] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-[#123B5D]">{hub.city}</p>
                          <p className="text-[10px] text-[#718096] truncate max-w-[180px]">{hub.name}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#F28C45]">{hub.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DEPARTURE DATE BLOCK */}
            <div className="md:col-span-3 p-4 hover:bg-[#EAF4FA]/50 transition-colors relative cursor-pointer">
              <label htmlFor="mmt-depart-date" className="block cursor-pointer">
                <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">Departure</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-[#123B5D] tracking-tight">{departFormatted.day}</span>
                  <span className="text-sm font-bold text-[#123B5D]">{departFormatted.monthYear}</span>
                </div>
                <p className="text-[11px] text-[#718096] mt-0.5">{departFormatted.weekday}</p>
              </label>
              <input
                id="mmt-depart-date"
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
            </div>

            {/* TRAVELLERS & CLASS / NIGHTS BLOCK */}
            <div ref={travellerRef} className="md:col-span-3 p-4 hover:bg-[#EAF4FA]/50 transition-colors relative cursor-pointer" onClick={() => setShowTravellerPopover(!showTravellerPopover)}>
              <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
                {activeCategory === 'hotels' ? 'Rooms & Guests' : 'Travellers & Class'}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl sm:text-2xl font-black text-[#123B5D] tracking-tight">
                  {activeCategory === 'hotels' ? `${adults} Guests` : `${adults + children}`}
                </span>
                <span className="text-xs font-bold text-[#718096]">
                  {activeCategory === 'hotels' ? `in ${hotelRooms} Room` : (adults + children === 1 ? 'Traveller' : 'Travellers')}
                </span>
              </div>
              <p className="text-[11px] text-[#718096] truncate mt-0.5">
                {activeCategory === 'hotels' ? `${hotelNights} Nights Stay` : travelClass}
              </p>

              {/* Travellers & Class Popover */}
              {showTravellerPopover && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E5EAF0] p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2">
                    <span className="text-xs font-bold text-[#123B5D]">Adults (12+ yrs)</span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-7 h-7 rounded-lg bg-[#EAF4FA] flex items-center justify-center font-bold text-[#123B5D] hover:bg-[#F28C45] hover:text-white transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-[#29445A]">{adults}</span>
                      <button 
                        type="button" 
                        onClick={() => setAdults(Math.min(9, adults + 1))}
                        className="w-7 h-7 rounded-lg bg-[#EAF4FA] flex items-center justify-center font-bold text-[#123B5D] hover:bg-[#F28C45] hover:text-white transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2">
                    <span className="text-xs font-bold text-[#123B5D]">Children (2-12 yrs)</span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-7 h-7 rounded-lg bg-[#EAF4FA] flex items-center justify-center font-bold text-[#123B5D] hover:bg-[#F28C45] hover:text-white transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold w-4 text-center text-[#29445A]">{children}</span>
                      <button 
                        type="button" 
                        onClick={() => setChildren(Math.min(6, children + 1))}
                        className="w-7 h-7 rounded-lg bg-[#EAF4FA] flex items-center justify-center font-bold text-[#123B5D] hover:bg-[#F28C45] hover:text-white transition-colors cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {activeCategory === 'hotels' ? (
                    <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-2">
                      <span className="text-xs font-bold text-[#123B5D]">Stay Duration</span>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button" 
                          onClick={() => setHotelNights(Math.max(1, hotelNights - 1))}
                          className="w-7 h-7 rounded-lg bg-[#EAF4FA] flex items-center justify-center font-bold text-[#123B5D] hover:bg-[#F28C45] hover:text-white transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-12 text-center text-[#29445A]">{hotelNights} Nights</span>
                        <button 
                          type="button" 
                          onClick={() => setHotelNights(Math.min(14, hotelNights + 1))}
                          className="w-7 h-7 rounded-lg bg-[#EAF4FA] flex items-center justify-center font-bold text-[#123B5D] hover:bg-[#F28C45] hover:text-white transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[11px] font-bold text-[#718096] uppercase tracking-wider block mb-1.5">Travel Class</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Economy', 'Premium Economy', 'Business', '3A AC Tier', '2A AC Tier', 'Sleeper'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setTravelClass(c)}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold text-left transition-all cursor-pointer ${
                              travelClass === c ? 'bg-[#123B5D] text-white' : 'bg-[#F7F9FC] text-[#29445A] hover:bg-[#EAF4FA]'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowTravellerPopover(false)}
                    className="w-full py-2 bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* SPECIAL FARES STRIP (The MakeMyTrip trademark) */}
        {activeCategory === 'flights' && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-[11px] font-bold text-[#718096]">Select A Special Fare:</span>
            {[
              { id: 'regular', label: 'Regular Fares' },
              { id: 'student', label: 'Student Fares', badge: 'Extra 10kg Baggage' },
              { id: 'senior', label: 'Senior Citizen', badge: 'Up to ₹600 off' },
              { id: 'armed_forces', label: 'Armed Forces', badge: 'Special Tariff' }
            ].map((fare) => (
              <label 
                key={fare.id}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  specialFare === fare.id 
                    ? 'bg-[#EAF4FA] border-[#F28C45] text-[#123B5D] shadow-xs' 
                    : 'border-[#E5EAF0] text-[#718096] hover:bg-[#F7F9FC]'
                }`}
              >
                <input
                  type="radio"
                  name="specialFare"
                  checked={specialFare === fare.id}
                  onChange={() => setSpecialFare(fare.id)}
                  className="accent-[#F28C45] w-3 h-3"
                />
                <span>{fare.label}</span>
                {fare.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FFB36B]/30 text-[#123B5D]">
                    {fare.badge}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}

        {/* TRAINS QUOTA & SPECIAL FARES */}
        {activeCategory === 'trains' && trainSubTab === 'book' && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-[11px] font-bold text-[#718096]">IRCTC Quota:</span>
            {[
              { id: 'gn', label: 'General Quota' },
              { id: 'tq', label: 'Tatkal Quota', badge: 'Fast Booking' },
              { id: 'ld', label: 'Ladies Quota' },
              { id: 'sr', label: 'Senior Citizen / Lower Berth' }
            ].map((q) => (
              <label 
                key={q.id}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  specialFare === q.id || (specialFare === 'regular' && q.id === 'gn')
                    ? 'bg-[#EAF4FA] border-[#F28C45] text-[#123B5D] shadow-xs' 
                    : 'border-[#E5EAF0] text-[#718096] hover:bg-[#F7F9FC]'
                }`}
              >
                <input
                  type="radio"
                  name="trainQuota"
                  checked={specialFare === q.id || (specialFare === 'regular' && q.id === 'gn')}
                  onChange={() => setSpecialFare(q.id)}
                  className="accent-[#F28C45] w-3 h-3"
                />
                <span>{q.label}</span>
                {q.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FFB36B]/30 text-[#123B5D]">
                    {q.badge}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}

        {/* HOTELS POPULAR FILTERS */}
        {activeCategory === 'hotels' && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-[11px] font-bold text-[#718096]">Popular Hotel Amenities:</span>
            {[
              { label: 'Free Cancellation', badge: 'Risk-Free' },
              { label: 'Free Breakfast Included' },
              { label: 'Couple Friendly Stays' },
              { label: 'Heritage Palace / 5-Star Resort' }
            ].map((h, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-xl border border-[#E5EAF0] text-[#29445A] hover:border-[#F28C45] hover:bg-[#EAF4FA] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>{h.label}</span>
                {h.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    {h.badge}
                  </span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* CABS VEHICLE OPTIONS */}
        {activeCategory === 'cabs' && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-[11px] font-bold text-[#718096]">Vehicle Categories:</span>
            {[
              { label: 'Sedan (Dzire / Etios)', badge: 'Economical' },
              { label: 'SUV (Innova / Ertiga)', badge: 'Spacious 6-7 Seater' },
              { label: 'Prime Luxury Cab', badge: 'Chauffeur Driven' }
            ].map((cab, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl border border-[#E5EAF0] text-[#29445A] hover:border-[#F28C45] hover:bg-[#EAF4FA] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>{cab.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#FFB36B]/30 text-[#123B5D]">
                  {cab.badge}
                </span>
              </span>
            ))}
          </div>
        )}

        {/* POPULAR ROUTE QUICK-CLICK PILLS */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E5EAF0]">
          <span className="text-[10px] font-extrabold uppercase text-[#123B5D] tracking-wider">
            Popular Yatra Routes:
          </span>
          {[
            { from: 'Delhi', to: 'Agra', label: 'Delhi ➔ Agra', price: '₹180' },
            { from: 'Mumbai', to: 'Goa', label: 'Mumbai ➔ Goa', price: '₹650' },
            { from: 'Bengaluru', to: 'Kochi', label: 'Bengaluru ➔ Kochi', price: '₹750' },
            { from: 'Delhi', to: 'Jaipur', label: 'Delhi ➔ Jaipur', price: '₹350' },
            { from: 'Varanasi', to: 'Agra', label: 'Varanasi ➔ Agra', price: '₹420' }
          ].map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFromCity(r.from);
                setToCity(r.to);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#F7F9FC] hover:bg-[#EAF4FA] border border-[#E5EAF0] text-[#29445A] text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{r.label}</span>
              <span className="text-[10px] text-[#F28C45] font-bold">({r.price})</span>
            </button>
          ))}
        </div>

      </div>

      {/* BIG FLOATING CENTERED SEARCH BUTTON (MakeMyTrip Style) */}
      <div className="flex justify-center -mt-6 relative z-30">
        <button
          type="button"
          onClick={handleSearchSubmit}
          className="px-12 sm:px-16 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f28c45] text-white font-black text-base sm:text-lg tracking-wider uppercase shadow-xl shadow-[#F28C45]/30 hover:shadow-[#F28C45]/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 cursor-pointer border-2 border-white"
        >
          <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
          <span>Search {activeCategory === 'holidays' ? 'AI Itineraries' : activeCategory.toUpperCase()}</span>
        </button>
      </div>

    </div>
  );
}

