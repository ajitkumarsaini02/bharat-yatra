import { travelCache } from '../cacheService.js';

const UBER_API_BASE = 'https://api.uber.com/v1.2';

/**
 * Uber Provider API Adapter implementation
 */
export async function fetchUberRideEstimates({ pickup_lat, pickup_lng, drop_lat, drop_lng }) {
  const serverToken = process.env.UBER_SERVER_TOKEN;

  if (!serverToken || !serverToken.trim()) {
    return {
      success: false,
      available: false,
      provider: 'Uber',
      reason: 'NO_CREDENTIALS',
      message: 'Live Uber cab data unavailable. Uber Server Token (UBER_SERVER_TOKEN) is not configured.'
    };
  }

  const cacheKey = `uber_${pickup_lat}_${pickup_lng}_${drop_lat}_${drop_lng}`;
  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `${UBER_API_BASE}/estimates/price?start_latitude=${pickup_lat}&start_longitude=${pickup_lng}&end_latitude=${drop_lat}&end_longitude=${drop_lng}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${serverToken.trim()}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        available: false,
        provider: 'Uber',
        reason: 'HTTP_ERROR',
        status: response.status,
        message: `Uber API responded with HTTP status ${response.status}`
      };
    }

    const json = await response.json();
    const result = {
      success: true,
      available: true,
      provider: 'Uber',
      prices: json.prices || []
    };

    travelCache.set(cacheKey, result, 300);
    return result;
  } catch (err) {
    return {
      success: false,
      available: false,
      provider: 'Uber',
      reason: err.name === 'AbortError' ? 'TIMEOUT' : 'FETCH_FAILED',
      message: err.message || 'Failed to connect to Uber API.'
    };
  }
}
