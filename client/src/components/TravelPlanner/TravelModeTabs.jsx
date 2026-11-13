import React from 'react';
import { Layers, Train, Bus, Plane, Car } from 'lucide-react';

/**
 * Reusable TravelModeTabs component
 * Tabs: [ All ] [ Train ] [ Bus ] [ Flight ] [ Cab / Taxi ]
 */
export default function TravelModeTabs({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'all', label: 'All Modes', icon: Layers },
    { id: 'train', label: 'Train', icon: Train },
    { id: 'bus', label: 'Bus', icon: Bus },
    { id: 'flight', label: 'Flight', icon: Plane },
    { id: 'cab', label: 'Cab / Taxi', icon: Car }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              isActive
                ? 'bg-[#123B5D] text-white shadow-md font-extrabold'
                : 'bg-white text-[#29445A] hover:text-[#123B5D] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
