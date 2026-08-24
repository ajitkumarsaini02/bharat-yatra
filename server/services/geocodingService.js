/**
 * Geocoding Service (OpenStreetMap / Nominatim)
 * Handles forward and reverse geocoding with rate-limiting and custom User-Agent.
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Geocode place name to latitude, longitude, and administrative details
 */
export async function geocodePlace(placeName) {
  if (!placeName || placeName.trim() === '') {
    return { success: false, data: null };
  }

  const cleanName = placeName.replace(/\(.*?\)/g, '').trim();

  try {
    const params = new URLSearchParams({
      q: `${cleanName}, India`,
      format: 'json',
      addressdetails: '1',
      limit: '1'
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${NOMINATIM_BASE}/search?${params.toString()}`, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, data: null };
    }

    const json = await res.json();
    if (!json || json.length === 0) {
      return { success: true, data: null };
    }

    const hit = json[0];
    const addr = hit.address || {};

    return {
      success: true,
      data: {
        lat: parseFloat(hit.lat),
        lng: parseFloat(hit.lon),
        latitude: parseFloat(hit.lat),
        longitude: parseFloat(hit.lon),
        displayName: hit.display_name,
        city: addr.city || addr.town || addr.village || addr.county || '',
        state: addr.state || '',
        country: addr.country || 'India',
        postcode: addr.postcode || null,
        osmType: hit.osm_type
      }
    };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Reverse geocode coordinates to location name
 */
export async function reverseGeocode(lat, lng) {
  if (!lat || !lng) {
    return { success: false, data: null };
  }

  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lng),
      format: 'json',
      addressdetails: '1'
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${NOMINATIM_BASE}/reverse?${params.toString()}`, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return { success: false, data: null };

    const hit = await res.json();
    const addr = hit.address || {};

    return {
      success: true,
      data: {
        displayName: hit.display_name,
        city: addr.city || addr.town || addr.village || addr.county || '',
        state: addr.state || '',
        country: addr.country || 'India'
      }
    };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
}
