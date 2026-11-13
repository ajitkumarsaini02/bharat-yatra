import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, RotateCcw, MapPin, Tag, Wallet, ArrowUpDown, Compass, Layers, Sparkles, Globe, Landmark, ArrowRight } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import { api } from '../services/api';

export default function ExploreDestinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States (initialised from URL so filtered views are shareable)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedZone, setSelectedZone] = useState(searchParams.get('zone') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get('budget') || 'All');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');

  // Debounce the free-text search so we fetch only after the user pauses typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      const res = await api.getDestinations({
        search: debouncedSearch,
        state: selectedState,
        zone: selectedZone,
        category: selectedCategory,
        budget: selectedBudget,
        sort: sortBy
      });
      if (res.data) {
        setDestinations(res.data);
      }
      setLoading(false);
    };

    fetchDestinations();
  }, [debouncedSearch, selectedState, selectedZone, selectedCategory, selectedBudget, sortBy]);

  // Keep the URL query string in sync with active filters (shareable + back-button friendly)
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedState !== 'All') params.state = selectedState;
    if (selectedZone !== 'All') params.zone = selectedZone;
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedBudget !== 'All') params.budget = selectedBudget;
    if (sortBy !== 'rating') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedState, selectedZone, selectedCategory, selectedBudget, sortBy, setSearchParams]);

  const handleReset = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedState('All');
    setSelectedZone('All');
    setSelectedCategory('All');
    setSelectedBudget('All');
    setSortBy('rating');
    setSearchParams({});
  };

  const zones = [
    { value: 'All', label: 'All Zones' },
    { value: 'North', label: 'North India' },
    { value: 'South', label: 'South India' },
    { value: 'East', label: 'East India' },
    { value: 'West', label: 'West India' },
    { value: 'North-East', label: 'North-East India' },
    { value: 'Central', label: 'Central India' }
  ];


  const states = [
    'All',
    'Andaman & Nicobar',
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Delhi',
    'Goa',
    'Gujarat',
    'Himachal Pradesh',
    'Karnataka',
    'Kerala',
    'Ladakh (UT)',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  const categories = [
    'All',
    'UNESCO World Heritage & Iconic Monuments',
    'Historic Forts & Citadels',
    'Temples & Spiritual Sites',
    'Royal Palaces, Museums & Historical Sites',
    'Ancient Caves & Rock-Cut Sites',
    'Beaches & Coastal Escapes',
    'Hill Stations & Tea Estates',
    'Wildlife & Tiger Reserves',
    'Adventure & Himalayan Circuits',
    'Natural Wonders'
  ];

  const budgetTiers = [
    { value: 'All', label: 'All Budgets' },
    { value: 'Budget', label: 'Budget Friendly (₹1k-₹2k)' },
    { value: 'Moderate', label: 'Moderate (₹2k-₹4k)' },
    { value: 'Luxury', label: 'Luxury (₹4k+)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
            <Compass className="w-4 h-4 text-[#FFB36B]" />
            <span>Complete Tourism Directory & Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Explore Incredible <span className="text-[#FFB36B]">Destinations</span> of India
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
            Discover 114+ hand-curated Indian monuments, sacred spiritual centers, hill stations, and sun-kissed coastlines with verified travel intelligence, live coordinates, and seasonal timings.
          </p>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Curated</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">114+</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Handpicked Sites</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Pan India</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">28+8</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">States & Union Terr.</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Heritage</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">5 Zones</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">North to North-East</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Themes</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">10 Themes</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Beaches to Forts</div>
        </div>
      </div>

      {/* Modern Search & Dropdown Filter Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#E5EAF0] space-y-4">
        
        {/* Top Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1D5D85]" />
          <input
            type="text"
            placeholder="Search by city, monument name, heritage site or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] focus:bg-white focus:border-[#123B5D] outline-hidden text-sm font-semibold transition text-[#29445A] placeholder-[#718096]"
          />
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { value: 'All', label: 'All Destinations' },
            { value: 'UNESCO World Heritage & Iconic Monuments', label: '🏛️ World Heritage' },
            { value: 'Historic Forts & Citadels', label: '🏰 Forts & Citadels' },
            { value: 'Temples & Spiritual Sites', label: '🛕 Temples & Sacred' },
            { value: 'Beaches & Coastal Escapes', label: '🏖️ Beaches & Coastal' },
            { value: 'Hill Stations & Tea Estates', label: '🏔️ Hill Stations' },
            { value: 'Wildlife & Tiger Reserves', label: '🐅 Wildlife & Tigers' }
          ].map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-[#123B5D] text-white shadow-sm'
                  : 'bg-[#EAF4FA] text-[#123B5D] hover:bg-[#d6e9f5]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 5 Clean Dropdown Selects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2 border-t border-[#E5EAF0]">
          
          {/* 1. State / UT Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#123B5D] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#F28C45]" />
              <span>State / UT</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#123B5D] cursor-pointer"
            >
              <option value="All">All States & UTs (22)</option>
              {states.filter(s => s !== 'All').map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Zone / Region Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#123B5D] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#F28C45]" />
              <span>Region / Zone</span>
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#123B5D] cursor-pointer"
            >
              {zones.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Type / Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#123B5D] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#F28C45]" />
              <span>Destination Type</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#123B5D] cursor-pointer truncate"
            >
              <option value="All">All Categories (10 Types)</option>
              {categories.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Budget Level Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#123B5D] flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-[#F28C45]" />
              <span>Budget Tier</span>
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#123B5D] cursor-pointer"
            >
              {budgetTiers.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Sort Order Dropdown & Reset */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#123B5D] flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#F28C45]" />
                <span>Sort Order</span>
              </span>
              {(searchTerm || selectedState !== 'All' || selectedZone !== 'All' || selectedCategory !== 'All' || selectedBudget !== 'All' || sortBy !== 'rating') && (
                <button
                  onClick={handleReset}
                  className="text-[10px] text-[#F28C45] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#123B5D] cursor-pointer"
            >
              <option value="rating">Top Rated First ⭐</option>
              <option value="budget-low">Budget: Low to High ₹</option>
              <option value="budget-high">Budget: High to Low ₹₹₹</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results Header Meta */}
      <div className="flex items-center justify-between px-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#123B5D] flex-wrap">
          <span>Explore Verified Destinations</span>
          {selectedState !== 'All' && (
            <span className="px-2 py-0.5 bg-[#EAF4FA] text-[#123B5D] rounded-md text-xs font-semibold">
              in {selectedState}
            </span>
          )}
          {selectedZone !== 'All' && (
            <span className="px-2 py-0.5 bg-[#EAF4FA] text-[#123B5D] rounded-md text-xs font-semibold">
              {selectedZone} Zone
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="px-2 py-0.5 bg-[#EAF4FA] text-[#123B5D] rounded-md text-xs font-semibold truncate max-w-[200px]">
              {selectedCategory}
            </span>
          )}
        </div>
        {!loading && (
          <span className="text-xs font-bold text-[#1D5D85]">
            {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'} found
          </span>
        )}
      </div>

      {/* Grid of Destination Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#EAF4FA]/40 rounded-3xl h-96 animate-pulse border border-[#E5EAF0]"></div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0] space-y-4 max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#EAF4FA] flex items-center justify-center mx-auto text-[#123B5D]">
            <Compass className="w-8 h-8 text-[#F28C45]" />
          </div>
          <h3 className="text-xl font-bold text-[#123B5D]">No destinations found</h3>
          <p className="text-sm text-[#718096]">
            Try adjusting your search query, State filter, or Category dropdown to find matching destinations.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      )}

      {/* Bottom Call to Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Can't Decide Where to Go? Let AI Plan Your Journey.
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Get an instant custom day-by-day itinerary with exact timings, budget calculations, and hotel recommendations tailored for you.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/ai-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/budget-calculator"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Calculate Travel Budget</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
