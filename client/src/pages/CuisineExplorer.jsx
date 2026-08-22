import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, MapPin, Sparkles } from 'lucide-react';
import { api } from '../services/api';

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
    if (t.includes('non-veg')) return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
    if (t.includes('veg')) return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    if (t.includes('sweet') || t.includes('dessert')) return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
    return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Regional Food & Signature Delicacies
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Discover time-honored recipes, royal Awadhi biryanis, Rajasthani thalis, coastal seafood curries, and iconic centuries-old sweetshops across India.
        </p>
      </div>

      {/* State Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {states.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedState === st
                ? 'gradient-saffron text-slate-950 shadow-md font-bold'
                : 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-900/10 dark:border-amber-500/20'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Cuisine Cards Grid */}
      <div className="space-y-12">
        {filtered.map((region) => (
          <div key={region.state} className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest block">
                  {region.region} Heritage
                </span>
                <h2 className="text-2xl font-black text-[#0A192F] dark:text-white tracking-tight mt-0.5">
                  {region.state} Culinary Showcase
                </h2>
              </div>
              <span className="px-3.5 py-1 bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold border border-amber-200 dark:border-amber-500/30 w-fit shadow-xs">
                {region.specialties.length} Signature Delicacies
              </span>
            </div>

            {/* Specialties Grid with Food Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {region.specialties.map((dish, i) => (
                <div 
                  key={i} 
                  className="group bg-amber-50/40 dark:bg-slate-800/80 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                >
                  {/* Food Image Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={dish.image || "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"}
                      alt={dish.name}
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80";
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
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {dish.desc}
                    </p>

                    <div className="pt-2 border-t border-amber-100 dark:border-slate-700/60 text-xs">
                      <span className="text-amber-800/70 dark:text-amber-400 font-bold block text-[10px] uppercase">
                        Must-Try Outlets:
                      </span>
                      <p className="text-slate-800 dark:text-slate-100 font-semibold text-xs mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
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

    </div>
  );
}
