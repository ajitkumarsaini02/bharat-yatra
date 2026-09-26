import { getStationCodeForCity } from './stationService.js';
import { getAirportCodeForCity } from './airportService.js';

/**
 * Normalizes raw train responses or provides normalized fallback structure
 */
export function normalizeTrainResults({ rawResult, from, destination, distanceKm, travelDate }) {
  const fromCode = getStationCodeForCity(from);
  const toCode = getStationCodeForCity(destination);

  // If live provider succeeded and returned train records
  if (rawResult && rawResult.success && Array.isArray(rawResult.data) && rawResult.data.length > 0) {
    return rawResult.data.map(train => {
      const trainNo = train.train_number || train.TrainNo || train.number || '12002';
      const trainName = train.train_name || train.TrainName || train.name || 'Express Train';
      const depTime = train.departure_time || train.DepartureTime || train.departure || '06:00';
      const arrTime = train.arrival_time || train.ArrivalTime || train.arrival || '08:30';
      const duration = train.duration || train.Duration || '2h 30m';
      const dist = train.distance || train.Distance || Math.round(distanceKm * 1.15);
      const fareAmount = train.fare || train.Fare ? Number(train.fare || train.Fare) : null;
      const avail = train.availability || train.Availability || 'Available';
      const status = train.status || train.Status || 'Scheduled';

      return {
        mode: 'train',
        provider: rawResult.provider || 'RailRadar',
        operator: 'Indian Railways',
        number: String(trainNo),
        name: trainName,
        source: { code: fromCode, name: from },
        destination: { code: toCode, name: destination },
        departure: depTime,
        arrival: arrTime,
        duration: duration,
        distanceKm: Number(dist),
        distanceType: 'provider',
        fare: {
          amount: fareAmount,
          currency: 'INR',
          type: fareAmount !== null ? 'live' : 'unavailable'
        },
        fareLabel: fareAmount !== null ? 'LIVE / PROVIDER DATA' : 'UNAVAILABLE',
        availability: avail,
        status: status,
        details: train
      };
    });
  }

  // Fallback Normalized Option when API key is missing or network call returned no live data
  // Calculated distance-based estimate strictly labeled ESTIMATED
  const estimatedRailKm = Math.round((distanceKm || 200) * 1.15);
  const estimatedFareAmount = Math.max(180, Math.round(estimatedRailKm * 2.2));

  return [
    {
      mode: 'train',
      provider: 'Estimated',
      operator: 'Indian Railways',
      number: '12002',
      name: `${from} - ${destination} Express`,
      source: { code: fromCode, name: from },
      destination: { code: toCode, name: destination },
      departure: '06:00',
      arrival: '08:15',
      duration: `${Math.floor(estimatedRailKm / 65)}h ${Math.round((estimatedRailKm % 65) * 0.9)}m`,
      distanceKm: estimatedRailKm,
      distanceType: 'haversine',
      fare: {
        amount: estimatedFareAmount,
        currency: 'INR',
        type: 'estimated'
      },
      fareLabel: 'ESTIMATED',
      availability: 'Live availability unavailable',
      status: 'Scheduled',
      details: {
        notice: 'Live train provider data unavailable. Showing distance-based estimated rail option.'
      }
    }
  ];
}

/**
 * Normalizes raw bus responses or provides normalized fallback structure
 */
export function normalizeBusResults({ rawResult, from, destination, roadDistanceKm, travelDate }) {
  if (rawResult && rawResult.success && Array.isArray(rawResult.data) && rawResult.data.length > 0) {
    return rawResult.data.map(bus => {
      const fareAmount = bus.fare || bus.price ? Number(bus.fare || bus.price) : null;
      return {
        mode: 'bus',
        provider: rawResult.provider || 'AOPAY',
        operator: bus.operator || bus.operatorName || 'Intercity Bus Service',
        number: bus.busNumber || bus.id || 'BUS-101',
        name: bus.busType || bus.name || 'AC Seater / Sleeper (2+1)',
        source: { code: 'BUS', name: from },
        destination: { code: 'BUS', name: destination },
        departure: bus.departureTime || bus.departure || '22:30',
        arrival: bus.arrivalTime || bus.arrival || '02:30',
        duration: bus.duration || '4h 00m',
        distanceKm: Number(bus.distance || roadDistanceKm || 200),
        distanceType: 'road',
        fare: {
          amount: fareAmount,
          currency: 'INR',
          type: fareAmount !== null ? 'live' : 'unavailable'
        },
        fareLabel: fareAmount !== null ? 'LIVE / PROVIDER DATA' : 'UNAVAILABLE',
        availability: bus.availableSeats ? `${bus.availableSeats} Seats Available` : 'Available',
        status: bus.status || 'On Time',
        boardingPoints: bus.boardingPoints || [`Main Bus Stand, ${from}`],
        droppingPoints: bus.droppingPoints || [`ISBT / City Center, ${destination}`],
        details: bus
      };
    });
  }

  // Fallback Normalized Option when API key is missing or network call returned no live data
  const dist = Math.round(roadDistanceKm || 200);
  const estimatedFareAmount = Math.max(300, Math.round(dist * 2.6));

  return [
    {
      mode: 'bus',
      provider: 'Estimated',
      operator: 'Intercity Bus Express',
      number: 'BUS-101',
      name: 'AC Sleeper / Seater (2+1)',
      source: { code: 'BUS', name: from },
      destination: { code: 'BUS', name: destination },
      departure: '22:00',
      arrival: '02:30',
      duration: `${Math.floor(dist / 50)}h ${Math.round((dist % 50) * 1.1)}m`,
      distanceKm: dist,
      distanceType: 'road',
      fare: {
        amount: estimatedFareAmount,
        currency: 'INR',
        type: 'estimated'
      },
      fareLabel: 'ESTIMATED',
      availability: 'Live seats unavailable',
      status: 'On Time',
      boardingPoints: [`Major Highway Hub, ${from}`],
      droppingPoints: [`ISBT Express Stand, ${destination}`],
      details: {
        notice: 'Live bus data unavailable. Showing estimated highway bus route option.'
      }
    }
  ];
}

/**
 * Normalizes raw flight responses or provides normalized fallback structure
 */
export function normalizeFlightResults({ rawResult, fareResult, from, destination, airDistanceKm, travelDate }) {
  const depIata = getAirportCodeForCity(from);
  const arrIata = getAirportCodeForCity(destination);

  if (rawResult && rawResult.success && Array.isArray(rawResult.data) && rawResult.data.length > 0) {
    return rawResult.data.map(flight => {
      const airlineName = flight.airline?.name || 'IndiGo / Air India';
      const flightNum = flight.flight?.iata || flight.flight?.number || '6E-204';
      const depTime = flight.departure?.scheduled ? new Date(flight.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:30';
      const arrTime = flight.arrival?.scheduled ? new Date(flight.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:00';
      const statusStr = flight.flight_status ? (flight.flight_status.charAt(0).toUpperCase() + flight.flight_status.slice(1)) : 'Scheduled';

      const liveFareAmount = fareResult && fareResult.available && fareResult.amount ? fareResult.amount : null;

      return {
        mode: 'flight',
        provider: rawResult.provider || 'Aviationstack',
        operator: airlineName,
        number: String(flightNum),
        name: `${airlineName} Non-Stop`,
        source: { code: depIata, name: `${from} Airport (${depIata})` },
        destination: { code: arrIata, name: `${destination} Airport (${arrIata})` },
        departure: depTime,
        arrival: arrTime,
        duration: '1h 30m',
        distanceKm: Math.round(airDistanceKm || 300),
        distanceType: 'haversine',
        fare: {
          amount: liveFareAmount,
          currency: 'INR',
          type: liveFareAmount !== null ? 'live' : 'unavailable'
        },
        fareLabel: liveFareAmount !== null ? 'LIVE / PROVIDER DATA' : 'UNAVAILABLE',
        availability: 'Seats Available',
        status: statusStr,
        details: flight
      };
    });
  }

  // Fallback Normalized Option when API key is missing or network call returned no live data
  const dist = Math.round(airDistanceKm || 300);
  const estimatedFareAmount = Math.max(2200, Math.round(dist * 4.8));

  return [
    {
      mode: 'flight',
      provider: 'Estimated',
      operator: 'IndiGo / Air India',
      number: '6E-204',
      name: 'Non-Stop Direct Flight',
      source: { code: depIata, name: `${from} Airport (${depIata})` },
      destination: { code: arrIata, name: `${destination} Airport (${arrIata})` },
      departure: '10:15 AM',
      arrival: '11:45 AM',
      duration: dist > 300 ? `${Math.floor(dist / 450) + 1}h ${Math.round((dist % 450) / 10)}m` : '1h 15m',
      distanceKm: dist,
      distanceType: 'haversine',
      fare: {
        amount: estimatedFareAmount,
        currency: 'INR',
        type: 'estimated'
      },
      fareLabel: 'ESTIMATED',
      availability: 'Seats Available',
      status: 'Scheduled',
      details: {
        notice: 'Live flight schedule data unavailable. Showing estimated direct flight route.'
      }
    }
  ];
}
