import { 
  calculateTravelPlan, 
  searchTrainOptions, 
  searchBusOptions, 
  searchFlightOptions,
  getCabRideEstimates
} from '../services/travelService.js';
import { searchStations } from '../services/travel/stationService.js';
import { searchAirports } from '../services/travel/airportService.js';
import { fetchRailRadarLiveStatus } from '../services/travel/train/railRadarProvider.js';
import TravelPlan from '../models/TravelPlan.js';
import TravelSearch from '../models/TravelSearch.js';
import mongoose from 'mongoose';

/**
 * Controller for intercity travel comparison & plan calculation
 */
export async function planTravelOptions(req, res) {
  try {
    const { from, destination, travelDate, travelersCount, hotelNights, mode } = {
      ...req.query,
      ...req.body
    };

    const result = await calculateTravelPlan({
      from,
      destination,
      travelDate,
      travelersCount,
      hotelNights,
      mode
    });

    if (mongoose.connection.readyState === 1 && result && result.distance) {
      try {
        await TravelSearch.create({
          userId: req.user?.id || null,
          fromLocation: from,
          toDestination: destination,
          travelDate: travelDate || new Date().toISOString().split('T')[0],
          travelersCount: parseInt(travelersCount) || 1,
          hotelNights: parseInt(hotelNights) || 1,
          geographicDistanceKm: result.distance.geographicDistanceKm,
          roadDistanceKm: result.distance.roadDistanceKm
        });
      } catch (dbErr) {
        // Non-blocking notice
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in planTravelOptions controller:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'Unable to calculate travel plan. Please check inputs.'
    });
  }
}

/**
 * Endpoint for Train Search
 */
export async function searchTrains(req, res) {
  try {
    const { from, destination, travelDate } = { ...req.query, ...req.body };
    const trains = await searchTrainOptions({ from, destination, travelDate, distanceKm: 200 });
    return res.status(200).json({ success: true, count: trains.length, data: trains });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Endpoint for Train Live Status
 */
export async function getTrainStatus(req, res) {
  try {
    const { trainNumber } = req.query;
    if (!trainNumber) return res.status(400).json({ success: false, message: 'Train number required' });
    const status = await fetchRailRadarLiveStatus(trainNumber);
    return res.status(200).json(status);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Endpoint for Bus Search
 */
export async function searchBuses(req, res) {
  try {
    const { from, destination, travelDate } = { ...req.query, ...req.body };
    const buses = await searchBusOptions({ from, destination, travelDate, roadDistanceKm: 200 });
    return res.status(200).json({ success: true, count: buses.length, data: buses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Endpoint for Flight Search
 */
export async function searchFlights(req, res) {
  try {
    const { from, destination, travelDate } = { ...req.query, ...req.body };
    const flights = await searchFlightOptions({ from, destination, travelDate, airDistanceKm: 300 });
    return res.status(200).json({ success: true, count: flights.length, data: flights });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Endpoint for Cab / Taxi / Auto Ride Estimates
 * GET /api/travel/cab/estimate
 */
export async function getCabEstimate(req, res) {
  try {
    const { from, destination, category } = { ...req.query, ...req.body };
    const result = await getCabRideEstimates({ from, destination, category });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Endpoint for Cab Ride Availability
 * GET /api/travel/cab/availability
 */
export async function getCabAvailability(req, res) {
  try {
    const { from, destination } = { ...req.query, ...req.body };
    const result = await getCabRideEstimates({ from, destination });
    return res.status(200).json({
      success: true,
      available: result.isLive,
      provider: result.provider,
      categoriesCount: result.data ? result.data.length : 0,
      data: result.data
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Autocomplete for Railway Stations
 */
export async function searchStationCodes(req, res) {
  try {
    const { q } = req.query;
    const stations = searchStations(q);
    return res.status(200).json({ success: true, data: stations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Autocomplete for Airports
 */
export async function searchAirportCodes(req, res) {
  try {
    const { q } = req.query;
    const airports = searchAirports(q);
    return res.status(200).json({ success: true, data: airports });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Save Travel Plan Selection
 */
export async function saveTravelPlan(req, res) {
  try {
    const {
      source,
      destination,
      travelDate,
      returnDate,
      travellers,
      mode,
      provider,
      transportId,
      operator,
      providerFare,
      estimatedFare,
      currency
    } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: 'Travel plan saved in memory mode.',
        data: req.body
      });
    }

    const savedPlan = await TravelPlan.create({
      userId: req.user?.id || null,
      source,
      destination,
      travelDate,
      returnDate: returnDate || null,
      travellers: parseInt(travellers) || 1,
      mode: mode || 'train',
      provider: provider || 'Standard',
      transportId: transportId || '',
      operator: operator || '',
      providerFare: providerFare || null,
      estimatedFare: estimatedFare || null,
      currency: currency || 'INR'
    });

    return res.status(201).json({ success: true, data: savedPlan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * Get saved travel searches for logged-in user
 */
export async function getUserTravelHistory(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const searches = await TravelSearch.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ success: true, count: searches.length, data: searches });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch travel history' });
  }
}
