import React, { useState } from 'react';
import { ArrowUpDown, Train, Bus, Plane, Clock, MapPin, IndianRupee } from 'lucide-react';

export default function TravelComparison({ comparisonData, trainData, busData, flightData, distanceInfo }) {
  const [sortBy, setSortBy] = useState('none'); // 'none', 'duration', 'distance'

  const modeIcons = {
    Train: Train,
    Bus: Bus,
    Flight: Plane
  };

  const getSortValue = (item, key) => {
    if (key === 'distance') {
      return parseFloat(item.distance) || 0;
    }
    if (key === 'duration') {
      const match = item.duration.match(/(\d+)\s*hrs?/);
      return match ? parseInt(match[1]) : 99;
    }
    return 0;
  };

  const sortedList = [...(comparisonData || [])].sort((a, b) => {
    if (sortBy === 'none') return 0;
    return getSortValue(a, sortBy) - getSortValue(b, sortBy);
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-slate-800 shadow-xl space-y-6">
      
      {/* Header & Sorting Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#0A192F] dark:text-slate-100 tracking-tight flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Transit Modes Comparison</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare Train, Bus, and Flight parameters side-by-side to make your personalized travel decision.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
            Compare By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2.5 rounded-xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-bold text-[#0A192F] dark:text-slate-100 outline-hidden cursor-pointer"
          >
            <option value="none">Standard Mode View</option>
            <option value="duration">Shortest Duration</option>
            <option value="distance">Travel Distance</option>
          </select>
        </div>
      </div>

      {/* Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedList.map((item, idx) => {
          const IconComponent = modeIcons[item.mode] || Train;
          return (
            <div key={idx} className="p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 space-y-4 hover:shadow-md transition">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-900 dark:text-amber-300">
                    <IconComponent className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-extrabold text-[#0A192F] dark:text-slate-100 text-base">
                    {item.mode}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-[10px] font-bold text-slate-500 border border-amber-100 dark:border-slate-700">
                  {item.distanceType}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between items-center py-1 border-b border-amber-100/60 dark:border-slate-700/60">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Distance:
                  </span>
                  <span className="font-mono font-bold text-[#0A192F] dark:text-slate-100">{item.distance}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-amber-100/60 dark:border-slate-700/60">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Duration:
                  </span>
                  <span className="font-mono font-bold text-[#0A192F] dark:text-slate-100">{item.duration}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <IndianRupee className="w-3.5 h-3.5 text-amber-600" /> Live Fare:
                  </span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{item.fareStatus}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Structured Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-amber-200/80 dark:border-slate-700">
        <table className="w-full text-left text-xs">
          <thead className="bg-amber-100/60 dark:bg-slate-800 text-[#0A192F] dark:text-slate-200 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-3.5">Mode</th>
              <th className="p-3.5">Distance Type</th>
              <th className="p-3.5">Distance</th>
              <th className="p-3.5">Duration</th>
              <th className="p-3.5">Fare Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            {sortedList.map((row, idx) => (
              <tr key={idx} className="hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-bold text-[#0A192F] dark:text-slate-100 flex items-center gap-2">
                  {row.mode}
                </td>
                <td className="p-3.5 text-slate-500 dark:text-slate-400">{row.distanceType}</td>
                <td className="p-3.5 font-mono font-bold text-[#0A192F] dark:text-slate-200">{row.distance}</td>
                <td className="p-3.5 font-mono">{row.duration}</td>
                <td className="p-3.5 font-bold text-amber-700 dark:text-amber-400">{row.fareStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        💡 <strong>User Decision First:</strong> Modes are displayed neutral for comparison. Select the mode that best matches your budget, travel time, and comfort preferences.
      </div>

    </div>
  );
}
