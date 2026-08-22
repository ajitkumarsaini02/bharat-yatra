import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Calculator, 
  Train, 
  Plane, 
  Car, 
  Lightbulb
} from 'lucide-react';
import { api } from '../services/api';
import { destinationsData } from '../data/mockData';

export default function BudgetPlannerPage() {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || 'Jaipur (The Pink City)';

  const [destination, setDestination] = useState(initialDest);
  const [travelersCount, setTravelersCount] = useState(2);
  const [durationDays, setDurationDays] = useState(4);
  const [travelTier, setTravelTier] = useState('Moderate');
  const [transitMode, setTransitMode] = useState('Train');

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
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Interactive Travel Budget Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Accurately forecast stay, rail/air travel, culinary spending, and emergency buffer costs for any Indian circuit.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-700" />
            <span>Trip Parameters</span>
          </h3>

          {/* Destination */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Select Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs sm:text-sm font-bold text-[#0A192F] outline-hidden focus:border-amber-600"
            >
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
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Number of Travelers
              </label>
              <span className="text-sm font-extrabold text-[#0A192F] font-mono">{travelersCount} Person{travelersCount > 1 ? 's' : ''}</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={travelersCount}
              onChange={(e) => setTravelersCount(Number(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>1 (Solo)</span>
              <span>2 (Couple)</span>
              <span>4 (Family)</span>
              <span>8 (Group)</span>
            </div>
          </div>

          {/* Duration in Days */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Trip Duration (Days)
              </label>
              <span className="text-sm font-extrabold text-[#0A192F] font-mono">{durationDays} Days</span>
            </div>
            <input
              type="range"
              min="1"
              max="14"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1">
              <span>1 Day</span>
              <span>7 Days (1 Wk)</span>
              <span>14 Days (2 Wks)</span>
            </div>
          </div>

          {/* Travel Tier */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
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
                  className={`p-3 rounded-2xl text-left transition border ${
                    travelTier === tier.id
                      ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                      : 'bg-amber-50/40 border-amber-100 hover:bg-amber-50'
                  }`}
                >
                  <span className="text-xs font-bold text-[#0A192F] block">{tier.label}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{tier.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transit Mode */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
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
                    className={`py-2.5 px-3 rounded-xl flex flex-col items-center gap-1 text-xs font-bold transition border ${
                      transitMode === mode.id
                        ? 'bg-[#0A192F] text-amber-300 border-[#0A192F] shadow-xs'
                        : 'bg-amber-50/50 text-slate-700 border-amber-100 hover:bg-amber-100/60'
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
            <div className="bg-gradient-to-br from-[#020C1B] to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-amber-400/20">
              
              {/* Grand Total Overview */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <span className="text-xs text-amber-300 uppercase font-semibold">Total Estimated Trip Cost</span>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono mt-1">
                    ₹{budgetResult.grandTotal?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-slate-400">
                    For <strong>{travelersCount} Person{travelersCount > 1 ? 's' : ''}</strong> • {durationDays} Days ({travelTier} Tier)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 text-right">
                  <span className="text-[11px] text-slate-400 block uppercase font-semibold">Cost Per Person</span>
                  <span className="text-2xl font-black text-amber-400 font-mono block mt-0.5">
                    ₹{budgetResult.perPersonCost?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Graphical Visual Distribution Bars */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Category Expense Distribution
                </span>

                <div className="space-y-3">
                  {budgetResult.breakdown?.map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-200">{item.category}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400">{item.percentage}%</span>
                          <span className="font-bold text-amber-300">₹{item.amount?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color || '#F59E0B'
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
                  className="w-full py-3.5 rounded-xl gradient-saffron text-slate-950 font-black text-xs sm:text-sm text-center block hover:opacity-95 transition shadow-lg shadow-amber-500/25"
                >
                  Generate AI Itinerary within this Budget
                </Link>
              </div>

            </div>
          )}

          {/* Money Saving Hacks */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#0A192F] flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Smart Budget Saving Tips for India</span>
            </h3>
            <ul className="space-y-2.5">
              {budgetResult?.moneySavingTips?.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
