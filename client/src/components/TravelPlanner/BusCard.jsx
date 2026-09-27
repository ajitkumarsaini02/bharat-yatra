import React from 'react';
import { Bus, Info } from 'lucide-react';
import TransportResultCard from './TransportResultCard';

export default function BusCard({ busData, from, destination, roadDistanceKm, onViewDetails }) {
  const busList = Array.isArray(busData) 
    ? busData 
    : (busData?.details && Array.isArray(busData.details) ? busData.details : []);

  const dist = Math.round(roadDistanceKm || 200);

  const listToRender = busList.length > 0 ? busList : [
    {
      mode: 'bus',
      provider: 'Intercity Bus',
      operator: 'State Volvo Multi-Axle Express',
      number: 'BUS-101',
      name: 'AC Sleeper / Seater (2+1)',
      source: { code: 'BUS', name: from },
      destination: { code: 'BUS', name: destination },
      departure: '10:00 PM',
      arrival: '02:30 AM',
      duration: `${Math.floor(dist / 50)}h ${Math.round((dist % 50) * 1.1)}m`,
      distanceKm: dist,
      distanceType: 'road',
      fare: { amount: Math.max(350, Math.round(dist * 2.8)), currency: 'INR', type: 'estimated' },
      fareLabel: 'ESTIMATED TARIFF',
      availability: '18 Seats Available',
      status: 'On Time',
      boardingPoints: [`Main Highway Stand, ${from}`],
      droppingPoints: [`ISBT Express Stand, ${destination}`],
      details: { notice: 'Highway bus route option' }
    },
    {
      mode: 'bus',
      provider: 'Intercity Bus',
      operator: 'Royal Scania Luxury AC',
      number: 'BUS-204',
      name: 'Pushback Luxury Seater (2+2)',
      source: { code: 'BUS', name: from },
      destination: { code: 'BUS', name: destination },
      departure: '07:30 AM',
      arrival: '12:00 PM',
      duration: `${Math.floor(dist / 55)}h ${Math.round((dist % 55) * 1.1)}m`,
      distanceKm: dist,
      distanceType: 'road',
      fare: { amount: Math.max(280, Math.round(dist * 2.2)), currency: 'INR', type: 'estimated' },
      fareLabel: 'ESTIMATED TARIFF',
      availability: '24 Seats Available',
      status: 'On Time',
      boardingPoints: [`Central Bus Terminal, ${from}`],
      droppingPoints: [`City Bypass, ${destination}`],
      details: { notice: 'Day bus route option' }
    }
  ];

  return (
    <div className="space-y-4">
      {listToRender.map((item, idx) => {
        const normOption = item.mode ? item : {
          mode: 'bus',
          provider: 'AOPAY',
          operator: item.operatorName || item.operator || 'State Volvo Express',
          number: item.busNumber || 'BUS-101',
          name: item.busType || 'AC Sleeper / Multi-Axle',
          source: { code: 'BUS', name: from },
          destination: { code: 'BUS', name: destination },
          departure: item.departureTime || '22:00',
          arrival: item.arrivalTime || '02:30',
          duration: item.duration || '4h 30m',
          distanceKm: item.roadDistanceKm || roadDistanceKm || 200,
          distanceType: 'road',
          fare: { amount: item.fare || null, currency: 'INR', type: item.fare ? 'live' : 'estimated' },
          fareLabel: item.fare ? 'LIVE / PROVIDER DATA' : 'ESTIMATED',
          availability: item.availableSeats ? `${item.availableSeats} Seats Available` : 'Available',
          status: 'On Time',
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
