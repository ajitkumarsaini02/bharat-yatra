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
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-900/10 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-900 dark:text-amber-300">
            <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
              LOCAL COMMUTE & TRANSIT
            </span>
            <h3 className="text-lg font-extrabold text-[#0A192F] dark:text-slate-100">
              Estimated Local Transportation ({days} Day{days !== 1 ? 's' : ''})
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-500/30 self-start sm:self-auto">
          Estimated local transportation cost
        </span>
      </div>

      {/* Grid of Local Transport Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt, idx) => {
          const IconComponent = modeIcons[opt.mode] || Car;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-amber-50/40 dark:bg-slate-800/70 border border-amber-200/60 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-slate-700 flex items-center justify-center text-amber-800 dark:text-amber-300">
                    <IconComponent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-bold text-[#0A192F] dark:text-slate-100 text-sm">
                    {opt.mode}
                  </h4>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {opt.description}
              </p>

              <div className="pt-2 border-t border-amber-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">₹{opt.estimatedDailyCost}/day</span>
                <div className="text-right">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold tracking-wider block">
                    Estimated Cost
                  </span>
                  <span className="font-black text-amber-600 dark:text-amber-400 font-mono text-sm">
                    ₹{opt.estimatedTripCost?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Warning Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/50 border border-amber-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Local commute figures are <strong>Estimated local transportation costs</strong> based on regional averages for {destination} and not live meter fares.
        </span>
      </div>

    </div>
  );
}
