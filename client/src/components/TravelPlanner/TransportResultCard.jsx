import React from 'react';
import { Train, Bus, Plane, Clock, ArrowRight, Info } from 'lucide-react';
import FareDisplay from './FareDisplay';
import AvailabilityBadge from './AvailabilityBadge';

/**
 * Unified Transport Result Card Component
 * Works seamlessly with normalized train, bus, and flight data models
 */
export default function TransportResultCard({ option, onViewDetails }) {
  if (!option) return null;

  const mode = option.mode || 'train';
  const Icon = mode === 'train' ? Train : mode === 'bus' ? Bus : Plane;

  const badgeColor = mode === 'train' ? 'bg-[#123B5D] text-white' : mode === 'bus' ? 'bg-[#1D5D85] text-white' : 'bg-[#F28C45] text-white';

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E5EAF0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group">
      
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2 border-b border-[#E5EAF0] pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2.5 rounded-2xl ${badgeColor} shadow-md shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider block">
              {option.operator || 'Transport Operator'}
            </span>
            <h4 className="text-base font-black text-[#123B5D] line-clamp-1">
              {option.number ? `${option.number} • ` : ''}{option.name}
            </h4>
          </div>
        </div>

        <AvailabilityBadge availability={option.availability} status={option.status} />
      </div>

      {/* Schedule & Duration Row */}
      <div className="grid grid-cols-3 gap-2 bg-[#F7F9FC] p-3 rounded-2xl border border-[#E5EAF0] text-center">
        <div>
          <span className="text-[10px] text-[#718096] block font-medium">Departure</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#123B5D] font-mono">{option.departure}</span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-[9px] font-bold text-[#1D5D85] font-mono">{option.duration}</span>
          <div className="w-full flex items-center justify-center gap-1 my-0.5">
            <span className="h-0.5 w-full bg-[#1D5D85]/30 rounded-full"></span>
            <ArrowRight className="w-3 h-3 text-[#1D5D85] shrink-0" />
          </div>
          <span className="text-[9px] text-[#718096] font-mono">{option.distanceKm} km</span>
        </div>

        <div>
          <span className="text-[10px] text-[#718096] block font-medium">Arrival</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#123B5D] font-mono">{option.arrival}</span>
        </div>
      </div>

      {/* Footer: Fare & Details Button */}
      <div className="pt-2 border-t border-[#E5EAF0] flex items-end justify-between gap-3">
        <FareDisplay fare={option.fare} label={option.fareLabel} />

        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(option)}
          className="px-4 py-2 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs transition flex items-center gap-1 shadow-sm hover:scale-102 cursor-pointer shrink-0"
        >
          <span>View Details</span>
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
