import React, { useState } from 'react';
import { Building2, Star, CheckCircle2, Info, Moon, MapPin, ExternalLink, ShieldCheck, Wifi, Coffee, X } from 'lucide-react';

export default function HotelCard({ hotelData, destination, hotelNights }) {
  const [selectedHotel, setSelectedHotel] = useState(null);
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

      {/* Hotels List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hotelsList.map((hotel, index) => {
          const totalEstimated = (hotel.pricePerNight || 2500) * nights;
          return (
            <div key={index} className="p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/70 border border-amber-200/60 dark:border-slate-700 space-y-4 flex flex-col justify-between hover:border-amber-400 transition group shadow-2xs">
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#0A192F] dark:text-slate-100 text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{hotel.location}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-300/60 dark:border-amber-500/40 text-xs font-bold text-amber-900 dark:text-amber-300 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                {hotel.roomType && (
                  <span className="inline-block text-[11px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-700/50">
                    🛏️ {hotel.roomType}
                  </span>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities?.map((amenity, aIdx) => (
                    <span key={aIdx} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-amber-100 dark:border-slate-700">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t border-amber-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#0A192F] dark:text-slate-200">
                    ₹{hotel.pricePerNight?.toLocaleString('en-IN')}/night
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Total ({nights} Night{nights !== 1 ? 's' : ''}): <strong className="text-amber-600 dark:text-amber-400 font-mono">₹{totalEstimated.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHotel(hotel)}
                  className="px-3.5 py-2 rounded-xl gradient-saffron text-slate-950 font-black text-xs transition flex items-center gap-1 shadow-2xs hover:scale-102 cursor-pointer shrink-0"
                >
                  <span>View Details</span>
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Hotel Detailed Inspection Modal */}
      {selectedHotel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-amber-300/40 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
                    HOTEL DETAILS & ACCOMMODATION
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    {selectedHotel.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Rating */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{selectedHotel.location}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 flex items-center gap-1 font-extrabold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{selectedHotel.rating} / 5.0 Rating</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verified hotel listing for stay in {destination}. Located near prime tourist landmarks and transport hubs.
              </p>
            </div>

            {/* Room Category & Policies Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Room Category</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 block">{selectedHotel.roomType || 'Standard Deluxe Room'}</span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400 block font-bold">Includes AC & Attached Bath</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase">Cancellation Terms</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Free Cancellation
                </span>
                <span className="text-[9px] text-slate-400 block">Up to 24 hrs before check-in</span>
              </div>
            </div>

            {/* Amenities Included */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Included Hotel Amenities & Services:</span>
              <div className="grid grid-cols-2 gap-2">
                {(selectedHotel.amenities || ['Free High-Speed WiFi', 'Air Conditioning', 'Free Breakfast', '24/7 Desk']).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-amber-100 dark:border-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Billing Summary */}
            <div className="p-4 rounded-2xl bg-[#0A192F] text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">Rate per night:</span>
                <span className="font-mono font-bold text-amber-300">₹{selectedHotel.pricePerNight?.toLocaleString('en-IN')} / night</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-slate-300">Total Stay ({nights} Night{nights !== 1 ? 's' : ''}):</span>
                <span className="font-mono font-black text-amber-300 text-lg">
                  ₹{((selectedHotel.pricePerNight || 2500) * nights).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedHotel.name + ', ' + selectedHotel.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Google Maps Location</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              </a>

              <button
                onClick={() => setSelectedHotel(null)}
                className="px-6 py-2.5 rounded-xl gradient-saffron text-slate-950 font-black text-xs shadow-md hover:opacity-95 transition cursor-pointer"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
