import express from 'express';
import { 
  planTravelOptions, 
  searchTrains, 
  getTrainStatus, 
  searchBuses, 
  searchFlights, 
  getCabEstimate,
  getCabAvailability,
  searchStationCodes, 
  searchAirportCodes, 
  saveTravelPlan, 
  getUserTravelHistory 
} from '../controllers/travelController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Main Comparison and Planning Endpoints
router.get('/compare', planTravelOptions);
router.post('/compare', planTravelOptions);
router.get('/plan', planTravelOptions);
router.post('/plan', planTravelOptions);

// Train Endpoints
router.get('/train/search', searchTrains);
router.get('/train/status', getTrainStatus);
router.get('/train/fare', searchTrains);

// Bus Endpoints
router.get('/bus/search', searchBuses);
router.get('/bus/fare', searchBuses);
router.get('/bus/seats', searchBuses);

// Flight Endpoints
router.get('/flight/search', searchFlights);
router.get('/flight/status', searchFlights);

// Cab / Taxi / Auto Endpoints
router.get('/cab/estimate', getCabEstimate);
router.get('/cab/availability', getCabAvailability);

// Autocomplete Endpoints
router.get('/stations/search', searchStationCodes);
router.get('/airports/search', searchAirportCodes);

// User Travel Plan Management
router.post('/save-plan', saveTravelPlan);
router.get('/history', verifyToken, getUserTravelHistory);

export default router;
