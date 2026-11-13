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
              className="bg-white rounded-3xl p-5 border border-[#E5EAF0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-[#E5EAF0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-[#EAF4FA] text-[#123B5D] shadow-sm shrink-0">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider block">
                      {normOption.provider} RIDE ESTIMATE
                    </span>
                    <h4 className="text-base font-black text-[#123B5D]">
                      {normOption.name}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>ETA: {normOption.etaMinutes || 8} min</span>
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-[#F7F9FC] p-3 rounded-2xl border border-[#E5EAF0] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#718096] block font-medium">Road Distance</span>
                  <span className="font-extrabold text-[#123B5D] font-mono">{normOption.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#718096] block font-medium">Est. Drive Time</span>
                  <span className="font-extrabold text-[#1D5D85] font-mono">{normOption.durationMinutes} min</span>
                </div>
              </div>

              {/* Fare & Notice */}
              <div className="pt-2 border-t border-[#E5EAF0] flex items-end justify-between gap-3">
                <div>
                  {isUpfront ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#718096] font-medium block">Upfront Fare:</span>
                      <span className="text-xl font-black text-[#123B5D] font-mono">
                        ₹{exactFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (minFare && maxFare) ? (
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#718096] font-medium block">Estimated Fare Range:</span>
                      <span className="text-lg sm:text-xl font-black text-[#123B5D] font-mono">
                        ₹{minFare.toLocaleString('en-IN')} – ₹{maxFare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-[#718096]">Live Fare Unavailable</span>
                  )}

                  <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#EAF4FA] text-[#123B5D] border border-[#E5EAF0] inline-block mt-1">
                    {normOption.fareLabel || 'PROVIDER ESTIMATE'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onViewDetails && onViewDetails(normOption)}
                  className="px-4 py-2 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs transition flex items-center gap-1 shadow-sm hover:scale-102 cursor-pointer shrink-0"
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

  const dist = Math.round(roadDistanceKm || 200);

  const listToRender = cabList.length > 0 ? cabList : [
    {
      mode: 'cab',
      provider: 'Uber / Ola Outstation',
      category: 'Sedan',
      name: 'AC Sedan Outstation (Dzire / Etios)',
      pickup: { lat: 0, lng: 0, name: from },
      drop: { lat: 0, lng: 0, name: destination },
      distanceKm: dist,
      durationMinutes: Math.round((dist / 55) * 60),
      etaMinutes: 10,
      fare: { min: Math.round(dist * 12), max: Math.round(dist * 15), exact: null, currency: 'INR', type: 'estimated' },
      fareLabel: 'OUTSTATION TARIFF',
      surge: false,
      availability: true,
      details: { notice: 'Doorstep pickup outstation AC cab' }
    },
    {
      mode: 'cab',
      provider: 'Uber / Ola Outstation',
      category: 'SUV',
      name: 'Outstation SUV (Innova Crysta / Ertiga)',
      pickup: { lat: 0, lng: 0, name: from },
      drop: { lat: 0, lng: 0, name: destination },
      distanceKm: dist,
      durationMinutes: Math.round((dist / 55) * 60),
      etaMinutes: 12,
      fare: { min: Math.round(dist * 16), max: Math.round(dist * 20), exact: null, currency: 'INR', type: 'estimated' },
      fareLabel: 'OUTSTATION TARIFF',
      surge: false,
      availability: true,
      details: { notice: 'Spacious 6-seater family SUV' }
    }
  ];

  return (
    <div className="space-y-4">
      {listToRender.map((item, idx) => {
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
            className="bg-white rounded-3xl p-5 border border-[#E5EAF0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-[#E5EAF0] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#EAF4FA] text-[#123B5D] shadow-sm shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider block">
                    {normOption.provider} RIDE ESTIMATE
                  </span>
                  <h4 className="text-base font-black text-[#123B5D]">
                    {normOption.name}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>ETA: {normOption.etaMinutes || 8} min</span>
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 bg-[#F7F9FC] p-3 rounded-2xl border border-[#E5EAF0] text-center text-xs">
              <div>
                <span className="text-[10px] text-[#718096] block font-medium">Road Distance</span>
                <span className="font-extrabold text-[#123B5D] font-mono">{normOption.distanceKm} km</span>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] block font-medium">Est. Drive Time</span>
                <span className="font-extrabold text-[#1D5D85] font-mono">{normOption.durationMinutes} min</span>
              </div>
            </div>

            {/* Fare & Notice */}
            <div className="pt-2 border-t border-[#E5EAF0] flex items-end justify-between gap-3">
              <div>
                {isUpfront ? (
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#718096] font-medium block">Upfront Fare:</span>
                    <span className="text-xl font-black text-[#123B5D] font-mono">
                      ₹{exactFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (minFare && maxFare) ? (
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#718096] font-medium block">Estimated Fare Range:</span>
                    <span className="text-lg sm:text-xl font-black text-[#123B5D] font-mono">
                      ₹{minFare.toLocaleString('en-IN')} – ₹{maxFare.toLocaleString('en-IN')}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-[#718096]">Live Fare Unavailable</span>
                )}

                <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#EAF4FA] text-[#123B5D] border border-[#E5EAF0] inline-block mt-1">
                  {normOption.fareLabel || 'PROVIDER ESTIMATE'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onViewDetails && onViewDetails(normOption)}
                className="px-4 py-2 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs transition flex items-center gap-1 shadow-sm hover:scale-102 cursor-pointer shrink-0"
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
