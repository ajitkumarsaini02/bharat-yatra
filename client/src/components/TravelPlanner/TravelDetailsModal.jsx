import React from 'react';
import { X, Train, Bus, Plane, Calendar, Clock, MapPin, Tag, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import FareDisplay from './FareDisplay';
import AvailabilityBadge from './AvailabilityBadge';

export default function TravelDetailsModal({ option, query, onClose, onSavePlan }) {
  if (!option) return null;

  const modeIcon = option.mode === 'train' ? Train : option.mode === 'bus' ? Bus : Plane;
  const Icon = modeIcon;

  const numTravelers = query?.travelersCount || 1;
  const farePerPerson = option.fare?.amount || 0;
  const totalFare = farePerPerson * numTravelers;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5EAF0] rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] text-[#123B5D] flex items-center justify-center font-bold">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider block">
                {option.mode.toUpperCase()} TRANSPORT DETAILS
              </span>
              <h3 className="text-lg font-black text-[#123B5D]">
                {option.operator} • {option.number}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#F7F9FC] text-[#718096] hover:text-[#123B5D] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Details Banner */}
        <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#123B5D]">
            <span>{option.source?.name || query?.from}</span>
            <ArrowRight className="w-4 h-4 text-[#F28C45]" />
            <span>{option.destination?.name || query?.destination}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E5EAF0] text-center text-xs">
            <div>
              <span className="text-[10px] text-[#718096] block font-medium">Departure</span>
              <span className="font-mono font-bold text-[#123B5D]">{option.departure}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#718096] block font-medium">Duration</span>
              <span className="font-mono font-bold text-[#1D5D85]">{option.duration}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#718096] block font-medium">Arrival</span>
              <span className="font-mono font-bold text-[#123B5D]">{option.arrival}</span>
            </div>
          </div>
        </div>

        {/* Distance & Provider Badges */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#E5EAF0] space-y-1">
            <span className="text-[10px] font-bold text-[#718096] block uppercase">Distance Type</span>
            <span className="font-extrabold text-[#123B5D]">{option.distanceKm} km</span>
            <span className="text-[9px] text-[#F28C45] block capitalize">{option.distanceType || 'Route'} Distance</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E5EAF0] space-y-1">
            <span className="text-[10px] font-bold text-[#718096] block uppercase">Data Source Provider</span>
            <span className="font-extrabold text-[#123B5D]">{option.provider}</span>
            <span className="text-[9px] text-emerald-600 block">Server Provider Service</span>
          </div>
        </div>

        {/* Boarding & Dropping Points (for bus/flight/train) */}
        {option.boardingPoints && option.boardingPoints.length > 0 && (
          <div className="space-y-1 text-xs">
            <span className="font-bold text-[#123B5D] block">Boarding Points:</span>
            <ul className="list-disc list-inside text-[#718096] text-[11px] space-y-0.5">
              {option.boardingPoints.map((bp, i) => (
                <li key={i}>{bp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Fare Breakdown */}
        <div className="p-4 rounded-2xl bg-[#123B5D] text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/80">Fare per person:</span>
            <FareDisplay fare={option.fare} label={option.fareLabel} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-white/80">Travellers ({numTravelers}):</span>
            <span className="font-mono font-black text-[#FFB36B] text-base">
              ₹{totalFare.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#E5EAF0] text-xs font-bold text-[#29445A] hover:bg-[#F7F9FC] transition cursor-pointer"
          >
            Close
          </button>
          {onSavePlan && (
            <button
              onClick={() => {
                onSavePlan(option);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Select Option & Save</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
