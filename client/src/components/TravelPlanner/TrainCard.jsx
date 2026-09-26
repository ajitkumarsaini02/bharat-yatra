import React from 'react';
import { Train, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import TransportResultCard from './TransportResultCard';
import FareDisplay from './FareDisplay';
import AvailabilityBadge from './AvailabilityBadge';

export default function TrainCard({ trainData, from, destination, distanceKm, onViewDetails }) {
  // If trainData is an array of normalized options or has normalized array
  const trainList = Array.isArray(trainData) 
    ? trainData 
    : (trainData?.details && Array.isArray(trainData.details) ? trainData.details : []);

  if (trainList.length > 0) {
    return (
      <div className="space-y-4">
        {trainList.map((item, idx) => {
          const normOption = item.mode ? item : {
            mode: 'train',
            provider: 'RailRadar',
            operator: 'Indian Railways',
            number: item.trainNumber || item.number || '12002',
            name: item.trainName || item.name || 'Express Train',
            source: { code: 'NDLS', name: item.sourceStation || from },
            destination: { code: 'AGC', name: item.destinationStation || destination },
            departure: item.departureTime || item.departure || '06:00',
            arrival: item.arrivalTime || item.arrival || '08:30',
            duration: item.duration || '2h 30m',
            distanceKm: item.railDistanceKm || distanceKm || 200,
            distanceType: 'provider',
            fare: { amount: item.fare || null, currency: 'INR', type: item.fare ? 'live' : 'estimated' },
            fareLabel: item.fare ? 'LIVE / PROVIDER DATA' : 'ESTIMATED',
            availability: item.availability || 'Available',
            status: 'Scheduled',
            details: item
          };
          return (
            <TransportResultCard
              key={idx}
              option={normOption}
              onViewDetails={onViewDetails}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-900/10 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center text-amber-900 dark:text-amber-300">
              <Train className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                RAILWAY TRANSIT
              </span>
              <h3 className="text-base font-extrabold text-[#0A192F] dark:text-slate-100">
                {from} → {destination}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-500/40">
            Live Data Status
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800/60 border border-amber-200/80 dark:border-slate-700 text-center space-y-2 py-6">
          <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto" />
          <p className="text-xs font-bold text-[#0A192F] dark:text-slate-200">
            Live train fare/availability is currently unavailable.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Real-time train fares and seat availability require configured provider credentials (RAILRADAR_API_KEY / INDIAN_RAIL_API_KEY).
          </p>
        </div>
      </div>
    </div>
  );
}
