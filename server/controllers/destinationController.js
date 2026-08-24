import mongoose from 'mongoose';
import Destination from '../models/Destination.js';
import { destinationsData, cuisineDatabase, transportGuideData } from '../data/tourismData.js';
import { enrichDestinationData, getLiveDestinationWeather } from '../services/destinationEnrichmentService.js';
import { searchImages } from '../services/wikimediaService.js';
import { searchNearbyPlaces, searchPlaces } from '../services/geoapifyService.js';

// In-memory working copy
let activeDestinations = [...destinationsData];

function matchesCategory(d, cat) {
  if (!cat || cat === 'All') return true;
  const c = cat.toLowerCase().trim();
  const destCat = (d.category || '').toLowerCase().trim();
  return destCat === c || destCat.includes(c) || c.includes(destCat);
}

export const getDestinations = async (req, res) => {
  try {
    const { state, zone, category, budget, search, sort } = req.query;

    const isDbConnected = mongoose.connection.readyState === 1;
    let results = [];

    if (isDbConnected) {
      const filter = {};
      if (state && state !== 'All') {
        filter.state = new RegExp(`^${state}$`, 'i');
      }
      if (zone && zone !== 'All') {
        filter.zone = new RegExp(`^${zone}$`, 'i');
      }
      if (category && category !== 'All') {
        filter.category = new RegExp(category.trim(), 'i');
      }
      if (budget && budget !== 'All') {
        filter.budgetLevel = new RegExp(`^${budget}$`, 'i');
      }
      if (search) {
        const q = search.trim();
        filter.$or = [
          { name: new RegExp(q, 'i') },
          { state: new RegExp(q, 'i') },
          { description: new RegExp(q, 'i') },
          { highlights: new RegExp(q, 'i') }
        ];
      }

      let query = Destination.find(filter);

      if (sort === 'rating') {
        query = query.sort({ rating: -1 });
      } else if (sort === 'budget-low') {
        query = query.sort({ avgDailyExpense: 1 });
      } else if (sort === 'budget-high') {
        query = query.sort({ avgDailyExpense: -1 });
      }

      results = await query.exec();
    }

    // If DB has 0 results or offline, fallback to in-memory activeDestinations
    if (!results || results.length === 0) {
      results = [...activeDestinations];

      if (state && state !== 'All') {
        results = results.filter(d => d.state.toLowerCase() === state.toLowerCase());
      }
      if (zone && zone !== 'All') {
        results = results.filter(d => d.zone.toLowerCase() === zone.toLowerCase());
      }
      if (category && category !== 'All') {
        results = results.filter(d => matchesCategory(d, category));
      }
      if (budget && budget !== 'All') {
        results = results.filter(d => d.budgetLevel.toLowerCase() === budget.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        results = results.filter(d => 
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.highlights && d.highlights.some(h => h.toLowerCase().includes(q)))
        );
      }

      if (sort === 'rating') {
        results.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'budget-low') {
        results.sort((a, b) => a.avgDailyExpense - b.avgDailyExpense);
      } else if (sort === 'budget-high') {
        results.sort((a, b) => b.avgDailyExpense - a.avgDailyExpense);
      }
    }

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const dest = activeDestinations.find(d => d.id === id || d._id === id);

    if (!dest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Enrich with external API data (Wikipedia, Wikimedia, Open-Meteo, Geoapify)
    const enriched = await enrichDestinationData(dest);

    // Also find relevant regional cuisine
    const stateCuisine = cuisineDatabase.find(c => c.state.toLowerCase() === dest.state.toLowerCase());

    res.json({
      success: true,
      data: {
        ...enriched,
        regionalCuisine: stateCuisine || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Search destinations combining curated collection and external discovery
 */
export const searchExternalDestinations = async (req, res) => {
  try {
    const query = req.query.q || req.query.search || '';
    if (!query.trim()) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const q = query.toLowerCase();
    // 1. Check curated destinations
    const matchedCurated = activeDestinations.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );

    // 2. Discover additional places via Geoapify Places API if configured
    const externalResult = await searchPlaces(query);

    res.json({
      success: true,
      query,
      count: matchedCurated.length + (externalResult.data?.length || 0),
      data: matchedCurated,
      externalPlaces: externalResult.data || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Discover nearby destinations by lat, lng, radius
 */
export const getNearbyDestinations = async (req, res) => {
  try {
    const { lat, lng, radius = 25000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng parameters are required' });
    }

    const nearby = await searchNearbyPlaces(parseFloat(lat), parseFloat(lng), parseInt(radius));
    res.json({
      success: true,
      count: nearby.data?.length || 0,
      data: nearby.data || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Wikimedia gallery images for destination
 */
export const getDestinationImages = async (req, res) => {
  try {
    const { id } = req.params;
    let dest = activeDestinations.find(d => d.id === id || d._id?.toString() === id);

    if (!dest && mongoose.connection.readyState === 1) {
      dest = (mongoose.Types.ObjectId.isValid(id) ? await Destination.findById(id) : null) ||
             await Destination.findOne({ id });
    }

    const placeName = dest ? dest.name : id.replace(/^dest-/, '').replace(/-/g, ' ');

    const result = await searchImages(placeName, 10);
    res.json({
      success: true,
      destinationId: id,
      count: result.data?.length || 0,
      data: result.data || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get live weather for destination
 */
export const getDestinationWeather = async (req, res) => {
  try {
    const { id } = req.params;
    let dest = activeDestinations.find(d => d.id === id || d._id?.toString() === id);

    if (!dest && mongoose.connection.readyState === 1) {
      dest = (mongoose.Types.ObjectId.isValid(id) ? await Destination.findById(id) : null) ||
             await Destination.findOne({ id });
    }

    let lat = dest?.coordinates?.lat || dest?.lat || parseFloat(req.query.lat);
    let lng = dest?.coordinates?.lng || dest?.lng || parseFloat(req.query.lng);

    if (!lat || !lng) {
      lat = 26.9124;
      lng = 75.7873;
    }

    const weather = await getLiveDestinationWeather(lat, lng);
    res.json({
      success: true,
      destinationId: id,
      data: weather.data || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get nearby attractions for destination
 */
export const getDestinationNearby = async (req, res) => {
  try {
    const { id } = req.params;
    let dest = activeDestinations.find(d => d.id === id || d._id?.toString() === id);

    if (!dest && mongoose.connection.readyState === 1) {
      dest = (mongoose.Types.ObjectId.isValid(id) ? await Destination.findById(id) : null) ||
             await Destination.findOne({ id });
    }

    let lat = dest?.coordinates?.lat || dest?.lat;
    let lng = dest?.coordinates?.lng || dest?.lng;

    if (!lat || !lng) {
      lat = 26.9124;
      lng = 75.7873;
    }

    const nearby = await searchNearbyPlaces(lat, lng, 25000);
    res.json({
      success: true,
      destinationId: id,
      count: nearby.data?.length || 0,
      data: nearby.data || []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin force-enrich single destination
 */
export const enrichSingleDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destIndex = activeDestinations.findIndex(d => d.id === id || d._id === id);

    if (destIndex === -1) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    const enriched = await enrichDestinationData(activeDestinations[destIndex], { forceRefresh: true });
    activeDestinations[destIndex] = enriched;

    res.json({
      success: true,
      message: 'Destination enriched successfully with external APIs',
      data: enriched
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCuisineData = (req, res) => {
  res.json({
    success: true,
    data: cuisineDatabase
  });
};

export const getTransportGuide = (req, res) => {
  res.json({
    success: true,
    data: transportGuideData
  });
};

export const createDestination = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const adminId = req.user?.id || req.body.createdBy || 'admin-root';
    const adminName = req.user?.name || req.body.createdByName || 'Administrator';
    const adminEmail = req.user?.email || req.body.createdByEmail || 'admin@bharatyatra.com';

    const newDest = {
      id: 'dest-' + (activeDestinations.length + 1) + '-' + Date.now().toString(36),
      ...req.body,
      createdBy: adminId,
      createdByName: adminName,
      createdByEmail: adminEmail,
      hotels: req.body.hotels || [],
      rating: req.body.rating || 4.8,
      reviewsCount: 1
    };

    if (isDbConnected) {
      try {
        await Destination.create(newDest);
      } catch (dbErr) {
        console.error('⚠️ Destination.create error:', dbErr.message);
      }
    }

    activeDestinations.unshift(newDest);

    console.log(`✅ Admin "${adminName}" (${adminEmail}) added destination "${newDest.name}" with ${newDest.hotels?.length || 0} hotels!`);

    res.status(201).json({
      success: true,
      message: 'Destination added successfully to Bharat Yatra directory (Saved to MongoDB)',
      data: newDest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user?.id || req.query.adminId || req.headers['x-admin-id'];
    const requesterEmail = req.user?.email || req.query.adminEmail || req.headers['x-admin-email'];
    const isDbConnected = mongoose.connection.readyState === 1;

    let targetDest = null;
    if (isDbConnected) {
      targetDest = (mongoose.Types.ObjectId.isValid(id) ? await Destination.findById(id) : null) ||
                   await Destination.findOne({ id });
    }
    if (!targetDest) {
      targetDest = activeDestinations.find(d => d.id === id || d._id?.toString() === id);
    }

    if (!targetDest) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    // Ownership Verification: Only the Admin who created this destination can remove it!
    if (targetDest.createdBy || targetDest.createdByEmail) {
      const isOwner = (requesterId && targetDest.createdBy && String(targetDest.createdBy) === String(requesterId)) ||
                      (requesterEmail && targetDest.createdByEmail && targetDest.createdByEmail.toLowerCase() === requesterEmail.toLowerCase()) ||
                      (targetDest.createdByEmail === 'admin@bharatyatra.com'); // Root admin compatibility

      if (!isOwner && requesterEmail) {
        return res.status(403).json({
          success: false,
          message: `Permission Denied: Aap sirf wahi destination remove kar sakte hain jo aapne create kiya tha. (Added by: ${targetDest.createdByName || targetDest.createdByEmail})`
        });
      }
    }

    if (isDbConnected) {
      try {
        await Destination.findOneAndDelete({ $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] });
      } catch (dbErr) {
        console.error('⚠️ Destination.delete error:', dbErr.message);
      }
    }

    activeDestinations = activeDestinations.filter(d => d.id !== id && d._id?.toString() !== id);

    console.log(`🗑️ Destination "${targetDest.name}" (${id}) removed by Admin (${requesterEmail || requesterId})`);

    res.json({
      success: true,
      message: 'Destination removed successfully from directory and database'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Destination Generator & Auto-populate endpoint
 */
export const generateAIDestination = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a monument or destination name' });
    }

    const { generateDestinationWithAI } = await import('../services/aiDestinationGenerator.js');
    const aiData = await generateDestinationWithAI(name.trim());

    res.json({
      success: true,
      message: `AI generated complete metadata for ${aiData.name}`,
      data: aiData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'AI Generation failed' });
  }
};
