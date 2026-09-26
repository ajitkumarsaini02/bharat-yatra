import React from 'react';
import { Building2, Star, CheckCircle2, Info, Moon } from 'lucide-react';

export default function HotelCard({ hotelData, destination, hotelNights }) {
  const isLiveAvailable = hotelData && hotelData.available;
  const hotelsList = hotelData?.hotels || [];
  const nights = hotelNights || 1;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-900/10 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-900 dark:text-amber-300">
            <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
              HOTEL & ACCOMMODATION
            </span>
            <h3 className="text-lg font-extrabold text-[#0A192F] dark:text-slate-100">
              Hotels in {destination} ({nights} Night{nights !== 1 ? 's' : ''})
            </h3>
          </div>
        </div>

        {/* Status badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
          isLiveAvailable 
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40' 
            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
        }`}>
          {isLiveAvailable ? 'Live Rates Active' : 'Live hotel pricing is currently unavailable.'}
        </span>
      </div>

      {/* Notice if live hotel pricing unavailable */}
      {!isLiveAvailable && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Note:</strong> Live hotel pricing is currently unavailable. Displaying estimated hotel rates for planning.
          </span>
        </div>
      )}

      {/* Hotels List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotelsList.map((hotel, index) => {
          const totalEstimated = (hotel.pricePerNight || 2500) * nights;
          return (
            <div key={index} className="p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/70 border border-amber-200/60 dark:border-slate-700 space-y-4 flex flex-col justify-between hover:border-amber-400 transition">
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#0A192F] dark:text-slate-100 text-base">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {hotel.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-300/60 dark:border-amber-500/40 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities?.map((amenity, aIdx) => (
                    <span key={aIdx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-amber-100 dark:border-slate-700">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Calculation */}
              <div className="pt-3 border-t border-amber-100 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#0A192F] dark:text-slate-200">
                    ₹{hotel.pricePerNight?.toLocaleString('en-IN')}/night
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {nights} Night{nights !== 1 ? 's' : ''} Stay
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold tracking-wider block">
                    Estimated Hotel Cost
                  </span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                    ₹{totalEstimated.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
