import React from 'react';
import { Route } from 'lucide-react';

export default function TravelLoadingState() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-amber-100 dark:border-slate-800 space-y-5 shadow-xl animate-pulse">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
        <Route className="w-7 h-7 animate-spin" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-[#0A192F] dark:text-slate-100">
          Querying Intercity Transit Providers & Live Fares...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Searching RailRadar, IndianRail, AOPAY Bus, and Aviationstack APIs for live schedules, track routes, and fare data.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700"></div>
        ))}
      </div>
    </div>
  );
}
