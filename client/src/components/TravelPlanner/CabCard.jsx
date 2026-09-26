import React from 'react';
import { Car, Clock, ShieldCheck, AlertCircle, Info, Navigation } from 'lucide-react';
import TransportResultCard from './TransportResultCard';

/**
 * CabCard component
 * Displays Ola/Uber/Cab ride options with Category, ETA, Min/Max or Upfront Fare, and Pricing source label
 */
export default function CabCard({ cabData, from, destination, roadDistanceKm, onViewDetails }) {
  const cabList = Array.isArray(cabData) 
    ? cabData 
    : (cabData?.details && Array.isArray(cabData.details) ? cabData.details : []);

  if (cabList.length > 0) {
    return (
      <div className="space-y-4">
        {cabList.map((item, idx) => {
          const normOption = item.mode ? item : {
            mode: 'cab',
            provider: item.provider || 'Ola',
            category: item.category || 'mini',
            name: item.name || `Ola ${item.display_name || 'Mini'}`,
            pickup: { lat: 0, lng: 0, name: from },
            drop: { lat: 0, lng: 0, name: destination },
            distanceKm: item.distanceKm || roadDistanceKm || 15,
            durationMinutes: item.durationMinutes || 30,
            etaMinutes: item.etaMinutes || item.eta || 8,
            fare: item.fare || { min: 180, max: 240, exact: null, currency: 'INR', type: 'provider_estimate' },
            fareLabel: item.fareLabel || (item.provider === 'Ola' ? 'Ola Provider Estimate' : 'ESTIMATED'),
            surge: !!item.surge,
            availability: true,
            details: item
          };

          const isUpfront = normOption.fare?.exact !== null && normOption.fare?.exact !== undefined;
          const minFare = normOption.fare?.min;
          const maxFare = normOption.fare?.max;
          const exactFare = normOption.fare?.exact;

          return (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-amber-200/70 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-amber-100/70 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 shadow-md shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider block">
                      {normOption.provider} RIDE ESTIMATE
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                      {normOption.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>ETA: {normOption.etaMinutes || 8} min</span>
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-amber-50/50 dark:bg-slate-800/40 p-3 rounded-2xl border border-amber-200/40 dark:border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Road Distance</span>
                  <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono">{normOption.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Est. Drive Time</span>
                  <span className="font-extrabold text-amber-700 dark:text-amber-400 font-mono">{normOption.durationMinutes} min</span>
                </div>
              </div>

              {/* Fare & Notice */}
              <div className="pt-2 border-t border-amber-100/70 dark:border-slate-800/80 flex items-end justify-between gap-3">
                <div>
                  {isUpfront ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Upfront Fare:</span>
                      <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
                        ₹{exactFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (minFare && maxFare) ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Estimated Fare Range:</span>
                      <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
                        ₹{minFare.toLocaleString('en-IN')} – ₹{maxFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Live Fare Unavailable</span>
                  )}

                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 inline-block mt-1">
                    {normOption.fareLabel || 'PROVIDER ESTIMATE'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails && onViewDetails(normOption)}
                  className="px-4 py-2 rounded-xl gradient-saffron text-slate-950 font-black text-xs transition flex items-center gap-1 shadow-sm hover:scale-102 cursor-pointer shrink-0"
                >
                  <span>View Details</span>
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-900/10 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-900 dark:text-amber-300">
              <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                CAB / TAXI / AUTO RIDE
              </span>
              <h3 className="text-base font-extrabold text-[#0A192F] dark:text-slate-100">
                {from} → {destination}
              </h3>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/40">
            Live Cab Status
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 text-center space-y-2 py-6">
          <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto" />
          <p className="text-xs font-bold text-[#0A192F] dark:text-slate-200">
            Live cab data unavailable
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Cab live pricing requires provider credentials (OLA_API_KEY / OLA_CLIENT_ID).
          </p>
        </div>
      </div>
    </div>
  );
}
