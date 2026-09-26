import { travelCache } from '../cacheService.js';

const BASE_URL = 'https://aopay.in/bus-api';

/**
 * AOPAY Bus API Provider integration
 * Docs: https://aopay.in/bus-api
 */
export async function fetchAopayBuses({ from, destination, travelDate }) {
  const apiKey = process.env.AOPAY_BUS_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      provider: 'AOPAY',
      reason: 'NO_API_KEY',
      message: 'AOPAY Bus API Key is not configured in server environment (AOPAY_BUS_API_KEY).'
    };
  }

  const cacheKey = `aopay_bus_${from}_${destination}_${travelDate}`;
  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `${BASE_URL}/search?source=${encodeURIComponent(from)}&destination=${encodeURIComponent(destination)}&date=${travelDate || ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey.trim(),
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        provider: 'AOPAY',
        reason: 'HTTP_ERROR',
        status: response.status,
        message: `AOPAY Bus API responded with status ${response.status}`
      };
    }

    const json = await response.json();
    const result = {
      success: true,
      provider: 'AOPAY',
      data: json.buses || json.data || json
    };

    travelCache.set(cacheKey, result, 1800);
    return result;
  } catch (err) {
    return {
      success: false,
      provider: 'AOPAY',
      reason: err.name === 'AbortError' ? 'TIMEOUT' : 'FETCH_FAILED',
      message: err.message || 'Failed to connect to AOPAY Bus API.'
    };
  }
}
