/**
 * Destination Enrichment Service
 * Orchestrates multi-API aggregation (Geoapify, Wikimedia, Wikipedia, Wikidata, Nominatim, Open-Meteo)
 * with multi-tiered in-memory and database caching.
 */

import { searchImages } from './wikimediaService.js';
import { getDestinationSummary } from './wikipediaService.js';
import { getHeritageInfo } from './wikidataService.js';
import { geocodePlace } from './geocodingService.js';
import { getCurrentWeather } from './weatherService.js';
import { searchNearbyPlaces } from './geoapifyService.js';
import Destination from '../models/Destination.js';

// In-Memory Fallback Cache for Zero-Config Standalone Mode
const memoryEnrichmentCache = new Map();

// Cache Durations
const WEATHER_CACHE_MS = 60 * 60 * 1000; // 1 hour
const ENRICH_CACHE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Enrich destination object with live external data
 */
export async function enrichDestinationData(baseDest, options = { forceRefresh: false }) {
  if (!baseDest || !baseDest.name) return baseDest;

  const cacheKey = baseDest.id || baseDest._id || baseDest.name;
  const now = Date.now();

  // Check in-memory cache first if not forced
  if (!options.forceRefresh && memoryEnrichmentCache.has(cacheKey)) {
    const cached = memoryEnrichmentCache.get(cacheKey);
    if (now - cached.cachedAt < ENRICH_CACHE_MS) {
      // Check if weather needs quick refresh
      if (now - (cached.weatherCachedAt || 0) < WEATHER_CACHE_MS) {
        return { ...baseDest, ...cached.data };
      }
    }
  }

  const lat = baseDest.coordinates?.lat;
  const lng = baseDest.coordinates?.lng;

  try {
    // Run external API requests in parallel safely
    const [
      wikiResult,
      imagesResult,
      heritageResult,
      weatherResult,
      nearbyResult
    ] = await Promise.allSettled([
      getDestinationSummary(baseDest.name),
      searchImages(baseDest.name, 6),
      getHeritageInfo(baseDest.name),
      lat && lng ? getCurrentWeather(lat, lng) : Promise.resolve({ success: false }),
      lat && lng ? searchNearbyPlaces(lat, lng, 25000) : Promise.resolve({ success: false })
    ]);

    const enrichedFields = {};

    // 1. Wikipedia Summary
    if (wikiResult.status === 'fulfilled' && wikiResult.value.success && wikiResult.value.data) {
      enrichedFields.wikiData = wikiResult.value.data;
      if (!baseDest.description || baseDest.description.length < 50) {
        enrichedFields.description = wikiResult.value.data.extract || baseDest.description;
      }
    }

    // 2. Wikimedia Images Gallery
    if (imagesResult.status === 'fulfilled' && imagesResult.value.success && imagesResult.value.data?.length > 0) {
      enrichedFields.externalImages = imagesResult.value.data.map(img => img.imageUrl);
      enrichedFields.galleryImages = imagesResult.value.data;
    }

    // 3. Wikidata Heritage / UNESCO
    if (heritageResult.status === 'fulfilled' && heritageResult.value.success && heritageResult.value.data) {
      enrichedFields.heritageData = heritageResult.value.data;
    }

    // 4. Open-Meteo Live Weather
    if (weatherResult.status === 'fulfilled' && weatherResult.value.success && weatherResult.value.data) {
      enrichedFields.weather = weatherResult.value.data;
      enrichedFields.weatherFetchedAt = new Date();
    }

    // 5. Geoapify Nearby Attractions
    if (nearbyResult.status === 'fulfilled' && nearbyResult.value.success && nearbyResult.value.data?.length > 0) {
      enrichedFields.nearbyAttractions = nearbyResult.value.data;
    }

    enrichedFields.lastEnrichedAt = new Date();
    enrichedFields.externalSources = ['Open-Meteo', 'Wikipedia', 'Wikimedia Commons', 'Geoapify', 'OpenStreetMap'];

    // Combine base destination with enriched fields
    const finalEnriched = {
      ...baseDest,
      ...enrichedFields
    };

    // Store in memory cache
    memoryEnrichmentCache.set(cacheKey, {
      cachedAt: now,
      weatherCachedAt: now,
      data: enrichedFields
    });

    // Asynchronously persist to MongoDB if database is connected
    try {
      if (Destination && baseDest.id) {
        Destination.findOneAndUpdate(
          { id: baseDest.id },
          { $set: enrichedFields },
          { new: true, upsert: false }
        ).catch(() => {});
      }
    } catch (e) {}

    return finalEnriched;
  } catch (err) {
    console.warn(`[EnrichmentService] Graceful fallback applied for ${baseDest.name}:`, err.message);
    return baseDest;
  }
}

/**
 * Enrich weather specifically on-demand
 */
export async function getLiveDestinationWeather(lat, lng) {
  return await getCurrentWeather(lat, lng);
}
