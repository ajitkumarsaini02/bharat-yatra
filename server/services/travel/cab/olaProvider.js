import { travelCache } from '../cacheService.js';

const OLA_API_BASE = 'https://devapi.olacabs.com/v1';

/**
 * Ola Developer API Provider implementation
 * Docs: https://developers.olacabs.com/docs/overview
 */
export async function fetchOlaRideEstimates({ pickup_lat, pickup_lng, drop_lat, drop_lng, category }) {
  const apiKey = process.env.OLA_API_KEY;
  const clientId = process.env.OLA_CLIENT_ID;

  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      available: false,
      provider: 'Ola',
      reason: 'NO_CREDENTIALS',
      message: 'Live cab data unavailable. Ola Developer API key (OLA_API_KEY) is not configured.'
    };
  }

  const cacheKey = `ola_${pickup_lat}_${pickup_lng}_${drop_lat}_${drop_lng}_${category || 'all'}`;
  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    let url = `${OLA_API_BASE}/products?pickup_lat=${pickup_lat}&pickup_lng=${pickup_lng}&drop_lat=${drop_lat}&drop_lng=${drop_lng}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-APP-TOKEN': apiKey.trim(),
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        available: false,
        provider: 'Ola',
        reason: 'HTTP_ERROR',
        status: response.status,
        message: `Ola API responded with status ${response.status}`
      };
    }

    const json = await response.json();
    const result = {
      success: true,
      available: true,
      provider: 'Ola',
      categories: json.categories || json.products || json.rides || []
    };

    travelCache.set(cacheKey, result, 300); // 5 min TTL
    return result;
  } catch (err) {
    return {
      success: false,
      available: false,
      provider: 'Ola',
      reason: err.name === 'AbortError' ? 'TIMEOUT' : 'FETCH_FAILED',
      message: err.message || 'Failed to connect to Ola Developer API.'
    };
  }
}
