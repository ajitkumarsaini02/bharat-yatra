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
    <div className="bg-[#123B5D] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-white/10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs text-[#FFB36B] uppercase font-semibold tracking-wider block">
            Integrated Smart Trip Cost Summary
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#FFB36B] font-mono tracking-tight mt-1">
            ₹{estimatedTotal.toLocaleString('en-IN')}
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Estimated Total Trip Cost for <strong>{from} → {destination}</strong> ({travelers} Traveler{travelers > 1 ? 's' : ''}, {nights} Hotel Night{nights !== 1 ? 's' : ''})
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-right">
          <span className="text-[11px] text-white/70 block uppercase font-semibold">Per Person Cost</span>
          <span className="text-xl font-black text-[#FFB36B] font-mono block mt-0.5">
            ₹{Math.round(estimatedTotal / (travelers || 1)).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Itemized Cost Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            Itemized Trip Cost Allocation
          </span>
          <span className="text-[10px] text-[#FFB36B] font-medium">
            💡 Click any row to auto-fill details into Planner/Calculator
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <Link
            to={`/budget-calculator?${queryParams}&mode=Train`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB36B]/40 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-white/90 group-hover:text-[#FFB36B] font-semibold flex items-center gap-1.5">
              <span>Intercity Travel Cost (Air/Rail/Bus)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#FFB36B]" />
            </span>
            <span className="font-mono font-bold text-[#FFB36B]">₹{travelCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}&tier=Moderate`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB36B]/40 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-white/90 group-hover:text-[#FFB36B] font-semibold flex items-center gap-1.5">
              <span>Hotel Accommodation ({nights} Nights)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#FFB36B]" />
            </span>
            <span className="font-mono font-bold text-[#FFB36B]">₹{hotelCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}&mode=Cab`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB36B]/40 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-white/90 group-hover:text-[#FFB36B] font-semibold flex items-center gap-1.5">
              <span>Local Transport (Commute & Cab)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#FFB36B]" />
            </span>
            <span className="font-mono font-bold text-[#FFB36B]">₹{localTransportCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/ai-planner?${queryParams}&interest=Food`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB36B]/40 transition group cursor-pointer"
            title="Auto-fill into AI Itinerary Planner"
          >
            <span className="text-white/90 group-hover:text-[#FFB36B] font-semibold flex items-center gap-1.5">
              <span>Food & Regional Dining</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#FFB36B]" />
            </span>
            <span className="font-mono font-bold text-[#FFB36B]">₹{foodCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/ai-planner?${queryParams}&interest=Heritage`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB36B]/40 transition group cursor-pointer"
            title="Auto-fill into AI Itinerary Planner"
          >
            <span className="text-white/90 group-hover:text-[#FFB36B] font-semibold flex items-center gap-1.5">
              <span>Attraction & Monument Entry Tickets</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#FFB36B]" />
            </span>
            <span className="font-mono font-bold text-[#FFB36B]">₹{attractionTicketsCost.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}`}
            className="flex justify-between items-center p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB36B]/40 transition group cursor-pointer"
            title="Auto-fill into Budget Calculator"
          >
            <span className="text-white/90 group-hover:text-[#FFB36B] font-semibold flex items-center gap-1.5">
              <span>Emergency & Shopping Buffer (10%)</span>
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#FFB36B]" />
            </span>
            <span className="font-mono font-bold text-[#FFB36B]">₹{emergencyBuffer.toLocaleString('en-IN')}</span>
          </Link>

          <Link
            to={`/budget-calculator?${queryParams}`}
            className="flex justify-between items-center p-3.5 rounded-xl bg-[#F28C45]/20 hover:bg-[#F28C45]/30 border border-[#F28C45]/40 text-sm font-bold pt-3 mt-1 transition group cursor-pointer"
            title="Auto-fill total cost into Smart Budget Calculator"
          >
            <span className="text-white uppercase tracking-wider font-extrabold flex items-center gap-2">
              <span>Estimated Total Trip Cost</span>
              <ArrowRight className="w-4 h-4 text-[#FFB36B] group-hover:translate-x-1 transition" />
            </span>
            <span className="font-mono text-[#FFB36B] text-base font-black">₹{estimatedTotal.toLocaleString('en-IN')}</span>
          </Link>
        </div>
      </div>

      {/* Cross-Module Integration Actions */}
      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to={`/ai-planner?${queryParams}`}
          className="py-3.5 px-4 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#F28C45]/25 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>Plan Itinerary with AI</span>
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </Link>

        <Link
          to={`/budget-calculator?${queryParams}`}
          className="py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-[#FFB36B] border border-white/20 font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-[#FFB36B]" />
          <span>Open Smart Budget Calculator</span>
        </Link>
      </div>

    </div>
  );
}
