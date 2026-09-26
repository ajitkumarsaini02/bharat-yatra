import React from 'react';
import { Plane, Info } from 'lucide-react';
import TransportResultCard from './TransportResultCard';

export default function FlightCard({ flightData, from, destination, airDistanceKm, onViewDetails }) {
  const flightList = Array.isArray(flightData) 
    ? flightData 
    : (flightData?.details && Array.isArray(flightData.details) ? flightData.details : []);

  if (flightList.length > 0) {
    return (
      <div className="space-y-4">
        {flightList.map((item, idx) => {
          const normOption = item.mode ? item : {
            mode: 'flight',
            provider: 'Aviationstack',
            operator: item.airline || item.operator || 'IndiGo / Air India',
            number: item.flightNumber || '6E-204',
            name: `${item.airline || 'IndiGo'} Non-Stop`,
            source: { code: 'AIR', name: item.departureAirport || from },
            destination: { code: 'AIR', name: item.arrivalAirport || destination },
            departure: item.departureTime || '10:15 AM',
            arrival: item.arrivalTime || '11:45 AM',
            duration: item.duration || '1h 30m',
            distanceKm: item.airDistanceKm || airDistanceKm || 300,
            distanceType: 'haversine',
            fare: { amount: item.fare || null, currency: 'INR', type: item.fare ? 'live' : 'estimated' },
            fareLabel: item.fare ? 'LIVE / PROVIDER DATA' : 'ESTIMATED',
            availability: 'Seats Available',
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
              <Plane className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                AIRLINE TRANSIT
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
            Live flight fare unavailable
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Aviationstack provides live status/schedules. Fares require a configured fare provider (FLIGHT_FARE_API_KEY).
          </p>
        </div>
      </div>
    </div>
  );
}
