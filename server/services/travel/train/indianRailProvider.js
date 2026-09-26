import { travelCache } from '../cacheService.js';
import { getStationCodeForCity } from '../stationService.js';

const BASE_URL = 'https://indianrailapi.com/api/v2';

/**
 * Indian Rail API Provider implementation
 * Docs: https://indianrailapi.com/api-collection
 */
export async function fetchIndianRailTrains({ from, destination, travelDate }) {
  const apiKey = process.env.INDIAN_RAIL_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      provider: 'IndianRailAPI',
      reason: 'NO_API_KEY',
      message: 'Indian Rail API key is not configured in server environment (INDIAN_RAIL_API_KEY).'
    };
  }

  const fromCode = getStationCodeForCity(from);
  const toCode = getStationCodeForCity(destination);
  const cacheKey = `indianrail_${fromCode}_${toCode}_${travelDate}`;

  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `${BASE_URL}/TrainBetweenStation/apikey/${apiKey.trim()}/From/${fromCode}/To/${toCode}`;
    const response = await fetch(url, { signal: controller.signal });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        provider: 'IndianRailAPI',
        reason: 'HTTP_ERROR',
        status: response.status,
        message: `Indian Rail API responded with HTTP status ${response.status}`
      };
    }

    const json = await response.json();
    const result = {
      success: true,
      provider: 'IndianRailAPI',
      fromStation: fromCode,
      toStation: toCode,
      data: json.Trains || json.data || json
    };

    travelCache.set(cacheKey, result, 1800);
    return result;
  } catch (err) {
    return {
      success: false,
      provider: 'IndianRailAPI',
      reason: err.name === 'AbortError' ? 'TIMEOUT' : 'FETCH_FAILED',
      message: err.message || 'Failed to connect to Indian Rail API.'
    };
  }
}

/**
 * Fetch Fare for a train via IndianRailAPI
 */
export async function fetchIndianRailFare(trainNumber, fromCode, toCode) {
  const apiKey = process.env.INDIAN_RAIL_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;

  try {
    const url = `${BASE_URL}/TrainFare/apikey/${apiKey.trim()}/TrainNo/${trainNumber}/From/${fromCode}/To/${toCode}/Quota/GN`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json.Fares || json;
  } catch (err) {
    return null;
  }
}
