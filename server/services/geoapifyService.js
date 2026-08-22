/**
 * Geoapify Places API Service
 * Handles place searching, place details, and nearby tourist attraction discovery.
 */

const GEOAPIFY_BASE = 'https://api.geoapify.com/v2';

// Supported Geoapify categories for Indian Tourism
const DEFAULT_CATEGORIES = [
  'tourism.sights',
  'tourism.attraction',
  'heritage',
  'heritage.unesco',
  'building.historic',
  'place_of_worship',
  'place_of_worship.hindu_temple',
  'entertainment.museum',
  'natural.mountain',
  'natural.beach',
  'natural.waterfall',
  'leisure.park.nature_reserve'
];

/**
 * Search places by text query and optional bounding bias
 */
export async function searchPlaces(query, lat = null, lng = null, categories = DEFAULT_CATEGORIES) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, reason: 'GEOAPIFY_API_KEY_NOT_CONFIGURED', data: [] };
  }

  try {
    const params = new URLSearchParams({
      text: query,
      apiKey: apiKey,
      limit: '10'
    });

    if (categories && categories.length > 0) {
      params.append('categories', categories.join(','));
    }

    if (lat && lng) {
      params.append('bias', `proximity:${lng},${lat}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`https://api.geoapify.com/v1/geocode/search?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, status: res.status, data: [] };
    }

    const json = await res.json();
    const places = (json.features || []).map(f => ({
      name: f.properties.name || f.properties.formatted,
      formattedAddress: f.properties.formatted,
      city: f.properties.city || f.properties.county,
      state: f.properties.state,
      country: f.properties.country,
      lat: f.properties.lat,
      lng: f.properties.lon,
      category: f.properties.category || 'Tourism',
      placeId: f.properties.place_id
    }));

    return { success: true, count: places.length, data: places };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Discover nearby attractions, temples, forts, viewpoints around coordinates
 */
export async function searchNearbyPlaces(lat, lng, radiusMeters = 20000, categories = DEFAULT_CATEGORIES) {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return { success: false, reason: 'GEOAPIFY_API_KEY_NOT_CONFIGURED', data: [] };
  }

  if (!lat || !lng) {
    return { success: false, reason: 'INVALID_COORDINATES', data: [] };
  }

  try {
    const params = new URLSearchParams({
      categories: categories.join(','),
      filter: `circle:${lng},${lat},${radiusMeters}`,
      bias: `proximity:${lng},${lat}`,
      limit: '12',
      apiKey: apiKey
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${GEOAPIFY_BASE}/places?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, status: res.status, data: [] };
    }

    const json = await res.json();
    const nearby = (json.features || []).map(f => {
      const p = f.properties;
      return {
        name: p.name || p.formatted || 'Tourist Attraction',
        address: p.formatted,
        category: formatGeoapifyCategory(p.categories),
        distanceMeters: p.distance || null,
        distanceKm: p.distance ? (p.distance / 1000).toFixed(1) + ' km' : null,
        lat: p.lat,
        lng: p.lon,
        website: p.website || null,
        openingHours: p.opening_hours || null
      };
    }).filter(item => item.name && item.name.length > 2);

    return { success: true, count: nearby.length, data: nearby };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Helper to extract human-readable category name
 */
function formatGeoapifyCategory(categories = []) {
  if (!Array.isArray(categories)) return 'Attraction';
  if (categories.some(c => c.includes('hindu_temple') || c.includes('place_of_worship'))) return 'Temple / Sacred Shrine';
  if (categories.some(c => c.includes('unesco') || c.includes('historic'))) return 'Heritage / Fort';
  if (categories.some(c => c.includes('museum'))) return 'Museum & Art';
  if (categories.some(c => c.includes('beach'))) return 'Beach & Coastal';
  if (categories.some(c => c.includes('mountain') || c.includes('viewpoint'))) return 'Scenic Viewpoint';
  if (categories.some(c => c.includes('park') || c.includes('nature_reserve'))) return 'Nature & Wildlife';
  return 'Tourist Sight';
}
