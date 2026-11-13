import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, MapPin, Sparkles, Flame, Award, Globe, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

const DEFAULT_FOOD_FALLBACK = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";

export default function CuisineExplorer() {
  const [cuisines, setCuisines] = useState([]);
  const [selectedState, setSelectedState] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuisine = async () => {
      setLoading(true);
      const res = await api.getCuisineData();
      if (res.data) {
        setCuisines(res.data);
      }
      setLoading(false);
    };
    fetchCuisine();
  }, []);

  const states = ['All', ...cuisines.map(c => c.state)];

  const filtered = selectedState === 'All'
    ? cuisines
    : cuisines.filter(c => c.state.toLowerCase() === selectedState.toLowerCase());

  const getDietBadgeColor = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('non-veg')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (t.includes('veg')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (t.includes('sweet') || t.includes('dessert')) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-[#EAF4FA] text-[#123B5D] border-[#123B5D]/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
            <UtensilsCrossed className="w-4 h-4 text-[#FFB36B]" />
            <span>Culinary Heritage of India</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover Authentic <span className="text-[#FFB36B]">Regional Cuisines</span> & Flavors
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
            Immerse yourself in royal Awadhi biryanis, fiery Chettinad spices, buttery Punjabi rotis, coastal Malabar seafood, and legendary century-old confectioneries across every Indian state.
          </p>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Flame className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Iconic</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">50+</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Signature Delicacies</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">States</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">28 States</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Diverse Regional Palettes</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Verified</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">100+ Outlets</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Historic Dhabas & Stalls</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Heritage</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Authentic</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Ancient Traditional Recipes</div>
        </div>
      </div>

      {/* State Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {states.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedState === st
                ? 'bg-[#123B5D] text-white shadow-md font-bold'
                : 'bg-white text-[#29445A] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Cuisine Cards Grid */}
      <div className="space-y-12">
        {filtered.map((region) => (
          <div key={region.state} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5EAF0] pb-4">
              <div>
                <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
                  {region.region} Heritage
                </span>
                <h2 className="text-2xl font-black text-[#123B5D] tracking-tight mt-0.5">
                  {region.state} Culinary Showcase
                </h2>
              </div>
              <span className="px-3.5 py-1 bg-[#EAF4FA] text-[#123B5D] rounded-full text-xs font-bold border border-[#123B5D]/20 w-fit shadow-xs">
                {region.specialties.length} Signature Delicacies
              </span>
            </div>

            {/* Specialties Grid with Food Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {region.specialties.map((dish, i) => (
                <div 
                  key={i} 
                  className="group bg-[#F7F9FC] rounded-2xl border border-[#E5EAF0] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                >
                  {/* Food Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dish.image || DEFAULT_FOOD_FALLBACK}
                      alt={dish.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_FOOD_FALLBACK;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Diet Tag */}
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-black border backdrop-blur-md shadow-md ${getDietBadgeColor(dish.type)}`}>
                      {dish.type}
                    </span>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h4 className="text-base font-black text-white leading-tight drop-shadow-md line-clamp-1">
                        {dish.name}
                      </h4>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <p className="text-xs text-[#718096] leading-relaxed line-clamp-3 font-medium">
                      {dish.desc}
                    </p>

                    <div className="pt-2 border-t border-[#E5EAF0] text-xs">
                      <span className="text-[#123B5D] font-bold block text-[10px] uppercase">
                        Must-Try Outlets:
                      </span>
                      <p className="text-[#29445A] font-semibold text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F28C45] flex-shrink-0" />
                        <span className="truncate">{dish.iconicSpot}</span>
                      </p>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Bottom Call to Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Taste India's Flavors on Your Next Trip?
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Let our AI integrate authentic local food stops, legendary sweet shops, and iconic dhabas directly into your personalized travel itinerary.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/ai-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Itinerary with Food Stops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
