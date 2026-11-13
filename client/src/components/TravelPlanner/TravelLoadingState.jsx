import React from 'react';
import { Route } from 'lucide-react';

export default function TravelLoadingState() {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-[#E5EAF0] space-y-5 shadow-xl animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-[#EAF4FA] text-[#123B5D] flex items-center justify-center mx-auto">
        <Route className="w-7 h-7 animate-spin text-[#F28C45]" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-[#123B5D]">
          Querying Intercity Transit Providers & Live Fares...
        </h3>
        <p className="text-xs text-[#718096] max-w-md mx-auto">
          Searching RailRadar, IndianRail, AOPAY Bus, and Aviationstack APIs for live schedules, track routes, and fare data.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0]"></div>
        ))}
      </div>
    </div>
  );
}
