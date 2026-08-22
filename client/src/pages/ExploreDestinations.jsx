import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, MapPin, Tag, Wallet, ArrowUpDown, Filter } from 'lucide-react';
import DestinationCard from '../components/DestinationCard';
import { api } from '../services/api';

export default function ExploreDestinations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      const res = await api.getDestinations({
        search: searchTerm,
        state: selectedState,
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
  }, [searchTerm, selectedState, selectedCategory, selectedBudget, sortBy]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedState('All');
    setSelectedCategory('All');
    setSelectedBudget('All');
    setSortBy('rating');
    setSearchParams({});
  };

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
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Explore Incredible Destinations
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Discover India's heritage monuments, sacred temples, historic forts, royal palaces, coastal beaches, and Himalayan mountain passes.
        </p>
      </div>

      {/* Modern Search & Dropdown Filter Panel */}
      <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-900/10 dark:border-amber-500/20 space-y-4">
        
        {/* Top Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700/60 dark:text-amber-400" />
          <input
            type="text"
            placeholder="Search by city, monument name, heritage site or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-500/30 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-500 outline-hidden text-sm font-medium transition text-[#0A192F] dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* 4 Clean Dropdown Selects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-amber-100 dark:border-slate-800">
          
          {/* 1. State / UT Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>State / UT</span>
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-500/30 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-500 cursor-pointer"
            >
              <option value="All">All States & UTs (22)</option>
              {states.filter(s => s !== 'All').map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Type / Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Destination Type</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-500/30 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-500 cursor-pointer truncate"
            >
              <option value="All">All Categories (10 Types)</option>
              {categories.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Budget Level Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Budget Tier</span>
            </label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-500/30 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-500 cursor-pointer"
            >
              {budgetTiers.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Sort By Dropdown & Reset */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Sort Order</span>
              </span>
              {(searchTerm || selectedState !== 'All' || selectedCategory !== 'All' || selectedBudget !== 'All' || sortBy !== 'rating') && (
                <button
                  onClick={handleReset}
                  className="text-[10px] text-amber-600 hover:text-amber-800 dark:text-amber-400 font-bold flex items-center gap-0.5 cursor-pointer underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-amber-50/50 dark:bg-slate-800/80 border border-amber-200 dark:border-amber-500/30 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-500 cursor-pointer"
            >
              <option value="rating">Top Rated First ⭐</option>
              <option value="budget-low">Budget: Low to High ₹</option>
              <option value="budget-high">Budget: High to Low ₹₹₹</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results Header Meta */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-200">
          <span>Explore Verified Destinations</span>
          {selectedState !== 'All' && (
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-md text-xs font-semibold">
              in {selectedState}
            </span>
          )}
          {selectedCategory !== 'All' && (
            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 rounded-md text-xs font-semibold truncate max-w-[200px]">
              {selectedCategory}
            </span>
          )}
        </div>
      </div>

      {/* Grid of Destination Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-amber-50/50 dark:bg-slate-800/50 rounded-3xl h-96 animate-pulse border border-amber-100 dark:border-slate-800"></div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-amber-200 dark:border-slate-800 space-y-4 max-w-xl mx-auto shadow-md">
          <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-slate-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#0A192F] dark:text-white">No destinations found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search query, State filter, or Category dropdown to find matching destinations.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl gradient-saffron text-slate-950 font-bold text-xs shadow-md cursor-pointer"
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

    </div>
  );
}
