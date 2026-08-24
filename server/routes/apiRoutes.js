import express from 'express';
import mongoose from 'mongoose';
import { register, login, getProfile, toggleFavorite, getFavorites } from '../controllers/authController.js';
import { 
  getDestinations, 
  getDestinationById, 
  getCuisineData, 
  getTransportGuide, 
  createDestination, 
  deleteDestination,
  searchExternalDestinations,
  getNearbyDestinations,
  getDestinationImages,
  getDestinationWeather,
  getDestinationNearby,
  enrichSingleDestination,
  generateAIDestination
} from '../controllers/destinationController.js';
import { generateItinerary, saveItinerary, getSavedItineraries, deleteSavedItinerary } from '../controllers/aiPlannerController.js';
import { calculateBudget } from '../controllers/budgetController.js';
import { getReviewsByDestination, addReview, likeReview } from '../controllers/reviewController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// --- Auth & Favorites Routes ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', verifyToken, getProfile);
router.post('/auth/favorites/toggle', verifyToken, toggleFavorite);
router.get('/auth/favorites', verifyToken, getFavorites);

// --- Extended External Search & Proximity Discovery Routes ---
router.get('/destinations/search', searchExternalDestinations);
router.get('/destinations/nearby', getNearbyDestinations);

// --- Destination CRUD & Detail Routes ---
router.get('/destinations', getDestinations);
router.get('/destinations/:id', getDestinationById);
router.post('/destinations', createDestination);
router.post('/destinations/ai-generate', generateAIDestination);
router.delete('/destinations/:id', deleteDestination);

// --- Destination Enrichment Sub-Endpoints ---
router.get('/destinations/:id/images', getDestinationImages);
router.get('/destinations/:id/weather', getDestinationWeather);
router.get('/destinations/:id/nearby', getDestinationNearby);

// --- Admin Sync / Force Enrichment Route ---
router.post('/admin/destinations/:id/enrich', verifyToken, enrichSingleDestination);

// --- AI Planner Routes ---
router.post('/planner/generate', generateItinerary);
router.post('/planner/save', saveItinerary);
router.get('/planner/saved', getSavedItineraries);
router.delete('/planner/saved/:id', deleteSavedItinerary);

// --- Budget Calculator Routes ---
router.post('/budget/calculate', calculateBudget);

// --- Cuisine & Transport Routes ---
router.get('/cuisine', getCuisineData);
router.get('/transport', getTransportGuide);

// --- Review Routes ---
router.get('/reviews/:destinationId', getReviewsByDestination);
router.post('/reviews', addReview);
router.put('/reviews/:id/like', likeReview);

// --- System Status & Health Check ---
router.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'online',
    app: 'Bharat Yatra REST API',
    version: '2.0.0',
    database: {
      connected: isDbConnected,
      status: isDbConnected ? 'MongoDB Connected' : 'Disconnected (Using In-Memory Fallback)'
    },
    services: {
      geoapify: !!process.env.GEOAPIFY_API_KEY,
      openMeteo: 'active',
      wikimedia: 'active',
      wikipedia: 'active',
      nominatim: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
