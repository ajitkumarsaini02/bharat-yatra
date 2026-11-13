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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xl space-y-6">
      
      {/* Header & Sorting Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF0] pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#123B5D] tracking-tight flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-[#1D5D85]" />
            <span>Transit Modes Comparison</span>
          </h3>
          <p className="text-xs text-[#718096] mt-0.5">
            Compare Train, Bus, and Flight parameters side-by-side to make your personalized travel decision.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-[#123B5D] uppercase tracking-wider">
            Compare By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2.5 rounded-xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs font-bold text-[#123B5D] outline-hidden cursor-pointer"
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
            <div key={idx} className="p-5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-4 hover:shadow-md transition">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] border border-[#E5EAF0] flex items-center justify-center text-[#123B5D]">
                    <IconComponent className="w-5 h-5 text-[#1D5D85]" />
                  </div>
                  <h4 className="font-extrabold text-[#123B5D] text-base">
                    {item.mode}
                  </h4>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white text-[10px] font-bold text-[#718096] border border-[#E5EAF0]">
                  {item.distanceType}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#29445A]">
                <div className="flex justify-between items-center py-1 border-b border-[#E5EAF0]">
                  <span className="flex items-center gap-1.5 text-[#718096]">
                    <MapPin className="w-3.5 h-3.5 text-[#1D5D85]" /> Distance:
                  </span>
                  <span className="font-mono font-bold text-[#123B5D]">{item.distance}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-[#E5EAF0]">
                  <span className="flex items-center gap-1.5 text-[#718096]">
                    <Clock className="w-3.5 h-3.5 text-[#1D5D85]" /> Duration:
                  </span>
                  <span className="font-mono font-bold text-[#123B5D]">{item.duration}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="flex items-center gap-1.5 text-[#718096]">
                    <IndianRupee className="w-3.5 h-3.5 text-[#1D5D85]" /> Live Fare:
                  </span>
                  <span className="font-bold text-[#F28C45]">{item.fareStatus}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Structured Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#E5EAF0]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#EAF4FA] text-[#123B5D] font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="p-3.5">Mode</th>
              <th className="p-3.5">Distance Type</th>
              <th className="p-3.5">Distance</th>
              <th className="p-3.5">Duration</th>
              <th className="p-3.5">Fare Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAF0] text-[#29445A] font-medium">
            {sortedList.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#EAF4FA]/50 transition">
                <td className="p-3.5 font-bold text-[#123B5D] flex items-center gap-2">
                  {row.mode}
                </td>
                <td className="p-3.5 text-[#718096]">{row.distanceType}</td>
                <td className="p-3.5 font-mono font-bold text-[#123B5D]">{row.distance}</td>
                <td className="p-3.5 font-mono">{row.duration}</td>
                <td className="p-3.5 font-bold text-[#F28C45]">{row.fareStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-[#718096] text-center">
        💡 <strong>User Decision First:</strong> Modes are displayed neutral for comparison. Select the mode that best matches your budget, travel time, and comfort preferences.
      </div>

    </div>
  );
}
