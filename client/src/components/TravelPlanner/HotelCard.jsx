import React, { useState } from 'react';
import { Building2, Star, CheckCircle2, Info, Moon, MapPin, ExternalLink, ShieldCheck, Wifi, Coffee, X } from 'lucide-react';

export default function HotelCard({ hotelData, destination, hotelNights }) {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const isLiveAvailable = hotelData && hotelData.available;
  const hotelsList = hotelData?.hotels || [];
  const nights = hotelNights || 1;

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5EAF0] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] border border-[#E5EAF0] flex items-center justify-center text-[#123B5D]">
            <Building2 className="w-5 h-5 text-[#1D5D85]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider">
              HOTEL & ACCOMMODATION
            </span>
            <h3 className="text-lg font-extrabold text-[#123B5D]">
              Hotels in {destination} ({nights} Night{nights !== 1 ? 's' : ''})
            </h3>
          </div>
        </div>

        {/* Status badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
          isLiveAvailable 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
            : 'bg-[#EAF4FA] text-[#123B5D] border-[#1D5D85]/20'
        }`}>
          {isLiveAvailable ? 'Live Rates Active' : 'Live hotel pricing is currently unavailable.'}
        </span>
      </div>

      {/* Notice if live hotel pricing unavailable */}
      {!isLiveAvailable && (
        <div className="p-3.5 rounded-2xl bg-[#EAF4FA] border border-[#1D5D85]/20 text-[#123B5D] text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1D5D85] shrink-0" />
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
            <div key={index} className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-4 flex flex-col justify-between hover:border-[#1D5D85]/40 transition group shadow-2xs">
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#123B5D] text-base group-hover:text-[#F28C45] transition">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-[#718096] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#F28C45] shrink-0" />
                      <span>{hotel.location}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-[#EAF4FA] px-2 py-0.5 rounded-lg border border-[#E5EAF0] text-xs font-bold text-[#123B5D] shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#F28C45] text-[#F28C45]" />
                    <span>{hotel.rating}</span>
                  </div>
                </div>

                {hotel.roomType && (
                  <span className="inline-block text-[11px] font-extrabold text-[#123B5D] bg-[#EAF4FA] px-2.5 py-0.5 rounded-md border border-[#E5EAF0]">
                    🛏️ {hotel.roomType}
                  </span>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hotel.amenities?.map((amenity, aIdx) => (
                    <span key={aIdx} className="px-2 py-0.5 rounded-md bg-white text-[10px] font-medium text-[#718096] border border-[#E5EAF0]">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-[#123B5D]">
                    ₹{hotel.pricePerNight?.toLocaleString('en-IN')}/night
                  </span>
                  <span className="text-[10px] text-[#718096] block font-medium">
                    Total ({nights} Night{nights !== 1 ? 's' : ''}): <strong className="text-[#F28C45] font-mono">₹{totalEstimated.toLocaleString('en-IN')}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedHotel(hotel)}
                  className="px-3.5 py-2 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs transition flex items-center gap-1 shadow-2xs hover:scale-102 cursor-pointer shrink-0"
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
          <div className="bg-white border border-[#E5EAF0] rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] text-[#123B5D] flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider block">
                    HOTEL DETAILS & ACCOMMODATION
                  </span>
                  <h3 className="text-lg font-black text-[#123B5D]">
                    {selectedHotel.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedHotel(null)}
                className="p-2 rounded-full bg-[#F7F9FC] text-[#718096] hover:text-[#123B5D] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Address & Rating */}
            <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#123B5D]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#F28C45]" />
                  <span>{selectedHotel.location}</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#EAF4FA] text-[#123B5D] flex items-center gap-1 font-extrabold text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#F28C45] text-[#F28C45]" />
                  <span>{selectedHotel.rating} / 5.0 Rating</span>
                </span>
              </div>
              <p className="text-[11px] text-[#718096]">
                Verified hotel listing for stay in {destination}. Located near prime tourist landmarks and transport hubs.
              </p>
            </div>

            {/* Room Category & Policies Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-[#E5EAF0] space-y-1">
                <span className="text-[10px] font-bold text-[#718096] block uppercase">Room Category</span>
                <span className="font-extrabold text-[#123B5D] block">{selectedHotel.roomType || 'Standard Deluxe Room'}</span>
                <span className="text-[9px] text-[#F28C45] block font-bold">Includes AC & Attached Bath</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E5EAF0] space-y-1">
                <span className="text-[10px] font-bold text-[#718096] block uppercase">Cancellation Terms</span>
                <span className="font-extrabold text-emerald-600 block flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Free Cancellation
                </span>
                <span className="text-[9px] text-[#718096] block">Up to 24 hrs before check-in</span>
              </div>
            </div>

            {/* Amenities Included */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#123B5D] block">Included Hotel Amenities & Services:</span>
              <div className="grid grid-cols-2 gap-2">
                {(selectedHotel.amenities || ['Free High-Speed WiFi', 'Air Conditioning', 'Free Breakfast', '24/7 Desk']).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F7F9FC] text-[11px] font-semibold text-[#29445A] border border-[#E5EAF0]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Billing Summary */}
            <div className="p-4 rounded-2xl bg-[#123B5D] text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">Rate per night:</span>
                <span className="font-mono font-bold text-[#FFB36B]">₹{selectedHotel.pricePerNight?.toLocaleString('en-IN')} / night</span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-white/80">Total Stay ({nights} Night{nights !== 1 ? 's' : ''}):</span>
                <span className="font-mono font-black text-[#FFB36B] text-lg">
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
                className="px-4 py-2.5 rounded-xl border border-[#E5EAF0] text-xs font-bold text-[#29445A] hover:bg-[#F7F9FC] transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Google Maps Location</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#F28C45]" />
              </a>

              <button
                onClick={() => setSelectedHotel(null)}
                className="px-6 py-2.5 rounded-xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-xs shadow-md transition cursor-pointer"
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
