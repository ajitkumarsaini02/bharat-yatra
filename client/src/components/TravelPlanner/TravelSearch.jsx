import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Moon, AlertCircle } from 'lucide-react';
import { destinationsData } from '../../data/mockData';

export default function TravelSearch({ onSearch, loading, error, setError }) {
  const [from, setFrom] = useState('Delhi');
  const [destination, setDestination] = useState('Agra');
  const [travelDate, setTravelDate] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  });
  const [travelersCount, setTravelersCount] = useState(2);
  const [hotelNights, setHotelNights] = useState(2);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (setError) setError(null);

    // Form validations
    if (!from || !from.trim()) {
      if (setError) setError('Please enter a valid starting location.');
      return;
    }
    if (!destination || !destination.trim()) {
      if (setError) setError('Please enter a valid destination.');
      return;
    }
    if (from.trim().toLowerCase() === destination.trim().toLowerCase()) {
      if (setError) setError('Source and destination cannot be the same location.');
      return;
    }
    if (!travelDate) {
      if (setError) setError('Please select a travel date.');
      return;
    }

    onSearch({
      from: from.trim(),
      destination: destination.trim(),
      travelDate,
      travelersCount,
      hotelNights
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/10 dark:border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0A192F] dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Search Travel & Distance Options</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare Rail, Bus, Flight, Hotel & Local Transport costs across India.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-500/30 self-start sm:self-auto">
          Information & Estimation System
        </span>
      </div>

      {/* Popular Route Quick Selection Pills */}
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-widest block">
          ⚡ POPULAR EXPRESS ROUTES (CLICK TO AUTO-FILL)
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { from: 'Delhi', to: 'Agra', label: 'Delhi ➔ Agra (Taj Express)' },
            { from: 'Mumbai', to: 'Goa', label: 'Mumbai ➔ Goa (Konkan Coast)' },
            { from: 'Bengaluru', to: 'Kochi', label: 'Bengaluru ➔ Kochi' },
            { from: 'Delhi', to: 'Jaipur', label: 'Delhi ➔ Jaipur (Pink City)' },
            { from: 'Varanasi', to: 'Agra', label: 'Varanasi ➔ Agra' },
            { from: 'Delhi', to: 'Shimla', label: 'Delhi ➔ Shimla (Himalayan)' }
          ].map((route, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFrom(route.from);
                setDestination(route.to);
                if (setError) setError(null);
                onSearch({
                  from: route.from,
                  destination: route.to,
                  travelDate,
                  travelersCount,
                  hotelNights
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-amber-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all hover:scale-102 cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>{route.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Source & Destination with Swap Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* From Location */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>From (Origin Location)</span>
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Delhi, Mumbai, Jaipur"
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-400/20 transition shadow-2xs"
              required
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center pt-2 md:pt-6">
            <button
              type="button"
              title="Swap From and To locations"
              onClick={() => {
                const temp = from;
                setFrom(destination);
                setDestination(temp);
              }}
              className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-amber-300 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 transition-all hover:rotate-180 hover:scale-110 cursor-pointer shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* To Destination */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>To (Destination)</span>
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-400/20 transition shadow-2xs"
            >
              {destinationsData.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Row 2: Travel Date, Travelers & Hotel Nights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Travel Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Travel Date</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-400/20 transition shadow-2xs"
              required
            />
          </div>

          {/* Travelers Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Travelers ({travelersCount})</span>
            </label>
            <select
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-400/20 transition shadow-2xs"
            >
              <option value={1}>1 Solo Traveler</option>
              <option value={2}>2 Travelers (Couple)</option>
              <option value={3}>3 Travelers</option>
              <option value={4}>4 Travelers (Family)</option>
              <option value={6}>6 Travelers (Group)</option>
              <option value={8}>8 Travelers</option>
            </select>
          </div>

          {/* Hotel Nights */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-amber-600" />
              <span>Hotel Stay Nights ({hotelNights})</span>
            </label>
            <select
              value={hotelNights}
              onChange={(e) => setHotelNights(Number(e.target.value))}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 focus:ring-2 focus:ring-amber-400/20 transition shadow-2xs"
            >
              <option value={0}>0 Nights (Day Trip)</option>
              <option value={1}>1 Night</option>
              <option value={2}>2 Nights</option>
              <option value={3}>3 Nights</option>
              <option value={4}>4 Nights</option>
              <option value={5}>5 Nights</option>
              <option value={7}>7 Nights (1 Week)</option>
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl gradient-saffron text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer disabled:opacity-50"
          >
            <Search className="w-4 h-4 text-slate-950" />
            <span>{loading ? 'Calculating Distances & Rates...' : 'Search Travel Options'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
