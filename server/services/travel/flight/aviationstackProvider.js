import { travelCache } from '../cacheService.js';
import { getAirportCodeForCity } from '../airportService.js';

const BASE_URL = 'https://api.aviationstack.com/v1/flights';

/**
 * Aviationstack Flight Data Provider
 * Docs: https://aviationstack.com/
 */
export async function fetchAviationstackFlights({ from, destination, travelDate }) {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      provider: 'Aviationstack',
      reason: 'NO_API_KEY',
      message: 'Aviationstack API Key is not configured in server environment (AVIATIONSTACK_API_KEY).'
    };
  }

  const depIata = getAirportCodeForCity(from);
  const arrIata = getAirportCodeForCity(destination);
  const cacheKey = `aviationstack_${depIata}_${arrIata}_${travelDate}`;

  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `${BASE_URL}?access_key=${apiKey.trim()}&dep_iata=${depIata}&arr_iata=${arrIata}`;
    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        provider: 'Aviationstack',
        reason: 'HTTP_ERROR',
        status: response.status,
        message: `Aviationstack API responded with HTTP status ${response.status}`
      };
    }

    const json = await response.json();
    const result = {
      success: true,
      provider: 'Aviationstack',
      depIata,
      arrIata,
      data: json.data || []
    };

    travelCache.set(cacheKey, result, 1800);
    return result;
  } catch (err) {
    return {
      success: false,
      provider: 'Aviationstack',
      reason: err.name === 'AbortError' ? 'TIMEOUT' : 'FETCH_FAILED',
      message: err.message || 'Failed to connect to Aviationstack API.'
    };
  }
}
