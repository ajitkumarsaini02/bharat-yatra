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
      <div className="bg-white dark:bg-slate-900 border border-amber-300/40 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
                {option.mode.toUpperCase()} TRANSPORT DETAILS
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                {option.operator} • {option.number}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Details Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>{option.source?.name || query?.from}</span>
            <ArrowRight className="w-4 h-4 text-amber-500" />
            <span>{option.destination?.name || query?.destination}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-200/50 dark:border-slate-700/60 text-center text-xs">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Departure</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{option.departure}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Duration</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{option.duration}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Arrival</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{option.arrival}</span>
            </div>
          </div>
        </div>

        {/* Distance & Provider Badges */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Distance Type</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{option.distanceKm} km</span>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 block capitalize">{option.distanceType || 'Route'} Distance</span>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Data Source Provider</span>
            <span className="font-extrabold text-slate-900 dark:text-slate-100">{option.provider}</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block">Server Provider Service</span>
          </div>
        </div>

        {/* Boarding & Dropping Points (for bus/flight/train) */}
        {option.boardingPoints && option.boardingPoints.length > 0 && (
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Boarding Points:</span>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 text-[11px] space-y-0.5">
              {option.boardingPoints.map((bp, i) => (
                <li key={i}>{bp}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Fare Breakdown */}
        <div className="p-4 rounded-2xl bg-[#0A192F] text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Fare per person:</span>
            <FareDisplay fare={option.fare} label={option.fareLabel} />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-slate-300">Travellers ({numTravelers}):</span>
            <span className="font-mono font-black text-amber-300 text-base">
              ₹{totalFare.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
          {onSavePlan && (
            <button
              onClick={() => {
                onSavePlan(option);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl gradient-saffron text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:opacity-95 transition cursor-pointer"
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
