import React from 'react';
import { Car, Navigation, ShieldAlert, Bus, Bike } from 'lucide-react';

export default function LocalTransportCard({ transportData, destination, tripDays }) {
  const options = transportData?.options || [];
  const days = tripDays || 1;

  const modeIcons = {
    'Taxi / Private Cab': Car,
    'Auto Rickshaw & E-Rickshaw': Navigation,
    'Metro & Local Bus Network': Bus,
    'Rental Vehicle (Bike / Scooter)': Bike
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5EAF0] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] border border-[#E5EAF0] flex items-center justify-center text-[#123B5D]">
            <Car className="w-5 h-5 text-[#1D5D85]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider">
              LOCAL COMMUTE & TRANSIT
            </span>
            <h3 className="text-lg font-extrabold text-[#123B5D]">
              Estimated Local Transportation ({days} Day{days !== 1 ? 's' : ''})
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#EAF4FA] text-[#123B5D] text-xs font-bold border border-[#123B5D]/20 self-start sm:self-auto">
          Estimated local transportation cost
        </span>
      </div>

      {/* Grid of Local Transport Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, idx) => {
          const IconComponent = modeIcons[opt.mode] || Car;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D]">
                    <IconComponent className="w-4 h-4 text-[#1D5D85]" />
                  </div>
                  <h4 className="font-bold text-[#123B5D] text-sm">
                    {opt.mode}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-[#718096]">
                {opt.description}
              </p>

              <div className="pt-2 border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                <span className="text-[#718096]">₹{opt.estimatedDailyCost}/day</span>
                <div className="text-right">
                  <span className="text-[10px] text-[#718096] uppercase font-bold tracking-wider block">
                    Estimated Cost
                  </span>
                  <span className="font-black text-[#F28C45] font-mono text-sm">
                    ₹{opt.estimatedTripCost?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Warning Notice */}
      <div className="p-3.5 rounded-2xl bg-[#EAF4FA] border border-[#E5EAF0] text-[#29445A] text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-[#1D5D85] shrink-0" />
        <span>
          Local commute figures are <strong>Estimated local transportation costs</strong> based on regional averages for {destination} and not live meter fares.
        </span>
      </div>

    </div>
  );
}
