import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calculator, 
  Train, 
  Plane, 
  Car, 
  Lightbulb,
  Sparkles,
  ArrowRight,
  Hotel,
  Utensils,
  Wallet
} from 'lucide-react';
import { api } from '../services/api';
import { destinationsData } from '../data/mockData';

// Helper function for matching destination string to destinationsData
const matchDestination = (param) => {
  if (!param) return 'Jaipur (The Pink City)';
  const p = param.trim().toLowerCase();
  const found = destinationsData.find(d => 
    d.name.toLowerCase() === p ||
    d.name.toLowerCase().includes(p) ||
    p.includes(d.name.toLowerCase()) ||
    (d.state && d.state.toLowerCase() === p)
  );
  return found ? found.name : param;
};

export default function BudgetPlannerPage() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('destination');
  const daysParam = searchParams.get('days') || searchParams.get('duration');
  const travelersParam = searchParams.get('travelers') || searchParams.get('travelersCount');
  const modeParam = searchParams.get('mode');
  const tierParam = searchParams.get('tier');

  const [destination, setDestination] = useState(() => matchDestination(destParam));
  const [travelersCount, setTravelersCount] = useState(() => travelersParam ? Math.min(Math.max(Number(travelersParam), 1), 8) : 2);
  const [durationDays, setDurationDays] = useState(() => daysParam ? Math.min(Math.max(Number(daysParam), 1), 14) : 4);
  const [travelTier, setTravelTier] = useState(() => tierParam || 'Moderate');
  const [transitMode, setTransitMode] = useState(() => {
    if (modeParam) {
      const lower = modeParam.toLowerCase();
      if (lower.includes('cab')) return 'Cab';
      if (lower.includes('flight') || lower.includes('air')) return 'Flight';
      if (lower.includes('bus')) return 'Bus';
      return 'Train';
    }
    return 'Train';
  });

  // Keep state in sync if URL query params change
  useEffect(() => {
    if (destParam) setDestination(matchDestination(destParam));
    if (daysParam) setDurationDays(Math.min(Math.max(Number(daysParam), 1), 14));
    if (travelersParam) setTravelersCount(Math.min(Math.max(Number(travelersParam), 1), 8));
    if (tierParam) setTravelTier(tierParam);
    if (modeParam) {
      const lower = modeParam.toLowerCase();
      if (lower.includes('cab')) setTransitMode('Cab');
      else if (lower.includes('flight')) setTransitMode('Flight');
      else setTransitMode('Train');
    }
  }, [destParam, daysParam, travelersParam, modeParam, tierParam]);

  const [budgetResult, setBudgetResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    const res = await api.calculateBudget({
      destination,
      travelersCount,
      durationDays,
      travelTier,
      transitMode
    });
    if (res.data) {
      setBudgetResult(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    calculate();
  }, [destination, travelersCount, durationDays, travelTier, transitMode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
            <Calculator className="w-4 h-4 text-[#FFB36B]" />
            <span>Smart Tariff & Expense Forecaster</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Plan Your Travel Budget With <span className="text-[#FFB36B]">Zero Hidden Costs</span>
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
            Accurately estimate accommodation, IRCTC rail & domestic flight fares, regional dining, and emergency buffers for 114+ Indian destinations.
          </p>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Hotel className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Stays</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Hotels</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Budget to Luxury</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Train className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Transit</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">IRCTC & Flights</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Real-time Rates</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Food</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Local Dining</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Thalis & Street Eats</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Savings</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Hacks</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Money-Saving Tips</div>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#F28C45]" />
            <span>Trip Parameters</span>
          </h3>

          {/* Destination */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Select Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#F28C45]"
            >
              {!destinationsData.some(d => d.name === destination) && (
                <option value={destination}>{destination}</option>
              )}
              {destinationsData.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Number of Travelers */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider">
                Number of Travelers
              </label>
              <span className="text-sm font-extrabold text-[#123B5D] font-mono">{travelersCount} Person{travelersCount > 1 ? 's' : ''}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="w-full h-2 bg-[#EAF4FA] rounded-lg appearance-none cursor-pointer accent-[#F28C45]"
            />
            <div className="flex justify-between text-[10px] text-[#718096] font-semibold mt-1">
              <span>1 (Solo)</span>
              <span>2 (Couple)</span>
              <span>4 (Family)</span>
              <span>8 (Group)</span>
            </div>
          </div>

          {/* Duration in Days */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider">
                Trip Duration (Days)
              </label>
              <span className="text-sm font-extrabold text-[#123B5D] font-mono">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full h-2 bg-[#EAF4FA] rounded-lg appearance-none cursor-pointer accent-[#F28C45]"
            />
            <div className="flex justify-between text-[10px] text-[#718096] font-semibold mt-1">
              <span>1 Day</span>
              <span>7 Days (1 Wk)</span>
              <span>14 Days (2 Wks)</span>
            </div>
          </div>

          {/* Travel Tier */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Comfort & Accommodation Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'Budget', label: 'Budget Backpacker', sub: 'Hostels / Dharamshala' },
                { id: 'Moderate', label: 'Balanced Standard', sub: '3-Star / Boutique Homestay' },
                { id: 'Luxury', label: 'Premium Luxury', sub: '4-5 Star Luxury Resort' },
                { id: 'Heritage Royal', label: 'Heritage Royal', sub: 'Palace Stays & VIP Cabs' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setTravelTier(tier.id)}
                  className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
                    travelTier === tier.id
                      ? 'bg-[#EAF4FA] border-[#F28C45] text-[#123B5D] shadow-xs'
                      : 'bg-[#F7F9FC] border border-[#E5EAF0] hover:bg-[#EAF4FA] text-[#29445A]'
                  }`}
                >
                  <span className="text-xs font-bold block">{tier.label}</span>
                  <span className="text-[10px] text-[#718096] block mt-0.5">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transit Mode */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Intercity Transit Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Train', icon: Train, label: 'Rail (IRCTC)' },
                { id: 'Flight', icon: Plane, label: 'Flight' },
                { id: 'Cab', icon: Car, label: 'Private Cab' }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setTransitMode(mode.id)}
                    className={`py-2.5 px-3 rounded-xl flex flex-col items-center gap-1 text-xs font-bold transition border cursor-pointer ${
                      transitMode === mode.id
                        ? 'bg-[#123B5D] text-white border-[#123B5D] shadow-xs'
                        : 'bg-[#F7F9FC] text-[#718096] border border-[#E5EAF0] hover:bg-[#EAF4FA]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Output Results (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {budgetResult && (
            <div className="bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-white/10">
              
              {/* Grand Total Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs text-[#FFB36B] uppercase font-semibold">Total Estimated Trip Cost</span>
                  <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-1">
                    ₹{budgetResult.grandTotal?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-[#EAF4FA]/80">
                    For <strong>{travelersCount} Person{travelersCount > 1 ? 's' : ''}</strong> • {durationDays} Days ({travelTier} Tier)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-right">
                  <span className="text-[11px] text-[#EAF4FA]/80 block uppercase font-semibold">Cost Per Person</span>
                  <span className="text-2xl font-black text-[#FFB36B] font-mono block mt-0.5">
                    ₹{budgetResult.perPersonCost?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Graphical Visual Distribution Bars */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#EAF4FA] uppercase tracking-wider block">
                  Category Expense Distribution
                </span>

                <div className="space-y-3">
                  {budgetResult.breakdown?.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-white">{item.category}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-[#EAF4FA]/75">{item.percentage}%</span>
                          <span className="font-bold text-[#FFB36B]">₹{item.amount?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color || '#F28C45'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Link to AI Planner */}
              <div className="pt-2">
                <Link
                  to={`/ai-planner?destination=${encodeURIComponent(destination)}`}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] text-white font-black text-xs sm:text-sm text-center block transition shadow-lg shadow-[#F28C45]/25"
                >
                  Generate AI Itinerary within this Budget
                </Link>
              </div>

            </div>
          )}

          {/* Money Saving Hacks */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#123B5D] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#F28C45]" />
              <span>Smart Budget Saving Tips for India</span>
            </h3>
            <ul className="space-y-2.5">
              {budgetResult?.moneySavingTips?.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#718096]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Bottom Call to Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Generate Your Day-by-Day Plan?
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Turn this estimated budget into an hour-by-hour interactive itinerary with verified monument opening hours and restaurant stops.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to={`/ai-planner?destination=${encodeURIComponent(destination)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Itinerary for {destination.split('(')[0].trim()}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/travel-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Compare Transport Modes</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
