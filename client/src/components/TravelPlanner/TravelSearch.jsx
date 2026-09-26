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

      {/* Error Alert Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Inputs Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Source & Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* From Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>From (Origin Location)</span>
            </label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="e.g. Delhi, Mumbai, Jaipur"
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 transition"
              required
            />
          </div>

          {/* To Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>To (Destination)</span>
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 transition"
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
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 transition"
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
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 transition"
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
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-[#0A192F] dark:text-slate-100 outline-hidden focus:border-amber-600 transition"
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
