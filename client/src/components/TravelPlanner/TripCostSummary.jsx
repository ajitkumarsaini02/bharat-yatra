import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function TripCostSummary({ costData, from, destination, travelDate }) {
  if (!costData || !costData.breakdown) return null;

  const {
    travelCost = 0,
    hotelCost = 0,
    localTransportCost = 0,
    foodCost = 0,
    attractionTicketsCost = 0,
    emergencyBuffer = 0,
    estimatedTotal = 0
  } = costData.breakdown;

  const travelers = costData.travelersCount || 2;
  const nights = costData.hotelNights || 2;
  const tripDays = Math.max(1, (nights || 1) + 1);

  const queryParams = new URLSearchParams({
    destination: destination || '',
    from: from || '',
    days: tripDays,
    travelers: travelers,
    date: travelDate || ''
  }).toString();

  return (
    <div className="bg-gradient-to-br from-[#020C1B] to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-amber-400/20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs text-amber-300 uppercase font-semibold tracking-wider block">
            Integrated Smart Trip Cost Summary
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight mt-1">
            ₹{estimatedTotal.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Estimated Total Trip Cost for <strong>{from} → {destination}</strong> ({travelers} Traveler{travelers > 1 ? 's' : ''}, {nights} Hotel Night{nights !== 1 ? 's' : ''})
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 text-right">
          <span className="text-[11px] text-slate-400 block uppercase font-semibold">Per Person Cost</span>
          <span className="text-xl font-black text-amber-300 font-mono block mt-0.5">
            ₹{Math.round(estimatedTotal / (travelers || 1)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Itemized Cost Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Itemized Trip Cost Allocation
          </span>
          <span className="text-[10px] text-amber-300/80 font-medium">
            💡 Click any row to auto-fill details into Planner/Calculator
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <Link
            to={`/budget-calculator?${queryParams}&mode=Train`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-slate-300 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Intercity Travel Cost (Air/Rail/Bus)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-amber-300" />
            </span>
            <span className="font-mono font-bold text-amber-300">₹{travelCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}&tier=Moderate`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-slate-300 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Hotel Accommodation ({nights} Nights)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-amber-300" />
            </span>
            <span className="font-mono font-bold text-amber-300">₹{hotelCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}&mode=Cab`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-slate-300 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Local Transport (Commute & Cab)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-amber-300" />
            </span>
            <span className="font-mono font-bold text-amber-300">₹{localTransportCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/ai-planner?${queryParams}&interest=Food`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition group cursor-pointer"
            title="Auto-fill into AI Itinerary Planner"
          >
            <span className="text-slate-300 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Food & Regional Dining</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-amber-300" />
            </span>
            <span className="font-mono font-bold text-amber-300">₹{foodCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/ai-planner?${queryParams}&interest=Heritage`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition group cursor-pointer"
            title="Auto-fill into AI Itinerary Planner"
          >
            <span className="text-slate-300 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Attraction & Monument Entry Tickets</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-amber-300" />
            </span>
            <span className="font-mono font-bold text-amber-300">₹{attractionTicketsCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-slate-300 group-hover:text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Emergency & Shopping Buffer (10%)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-amber-300" />
            </span>
            <span className="font-mono font-bold text-amber-300">₹{emergencyBuffer.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}`}
            className="flex justify-between items-center p-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-sm font-bold pt-3 mt-1 transition group cursor-pointer"
            title="Auto-fill total cost into Smart Budget Calculator"
          >
            <span className="text-white uppercase tracking-wider font-extrabold flex items-center gap-2">
              <span>Estimated Total Trip Cost</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
            </span>
            <span className="font-mono text-amber-400 text-base font-black">₹{estimatedTotal.toLocaleString('en-IN')}</span>
          </Link>
        </div>
      </div>

      {/* Cross-Module Integration Actions */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to={`/ai-planner?${queryParams}`}
          className="py-3.5 px-4 rounded-xl gradient-saffron text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/25 hover:opacity-95 transition"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Plan Itinerary with AI</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </Link>

        <Link
          to={`/budget-calculator?${queryParams}`}
          className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 border border-amber-400/30 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition"
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Open Smart Budget Calculator</span>
        </Link>
      </div>

    </div>
  );
}
