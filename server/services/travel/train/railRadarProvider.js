import { travelCache } from '../cacheService.js';
import { getStationCodeForCity } from '../stationService.js';

const BASE_URL = 'https://api.railradar.in/v1';

/**
 * RailRadar Provider implementation for Indian Railway Data
 * Docs: https://railradar.in/docs
 */
export async function fetchRailRadarTrains({ from, destination, travelDate }) {
  const apiKey = process.env.RAILRADAR_API_KEY;

  // If no API key is provided, report unconfigured status cleanly
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      provider: 'RailRadar',
      reason: 'NO_API_KEY',
      message: 'RailRadar API Key is not configured in server environment (RAILRADAR_API_KEY).'
    };
  }

  const fromCode = getStationCodeForCity(from);
  const toCode = getStationCodeForCity(destination);
  const cacheKey = `railradar_${fromCode}_${toCode}_${travelDate}`;

  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const url = `${BASE_URL}/trains/between-stations?from=${fromCode}&to=${toCode}&date=${travelDate || ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        provider: 'RailRadar',
        reason: 'HTTP_ERROR',
        status: response.status,
        message: `RailRadar API responded with HTTP status ${response.status}`
      };
    }

    const json = await response.json();
    const result = {
      success: true,
      provider: 'RailRadar',
      fromStation: fromCode,
      toStation: toCode,
      data: json.data || json.trains || json
    };

    travelCache.set(cacheKey, result, 1800); // 30 min cache
    return result;
  } catch (err) {
    return {
      success: false,
      provider: 'RailRadar',
      reason: err.name === 'AbortError' ? 'TIMEOUT' : 'FETCH_FAILED',
      message: err.message || 'Failed to connect to RailRadar API.'
    };
  }
}

/**
 * Fetch live status for a train via RailRadar
 */
export async function fetchRailRadarLiveStatus(trainNumber) {
  const apiKey = process.env.RAILRADAR_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return { success: false, reason: 'NO_API_KEY', message: 'RailRadar API Key missing' };
  }

  try {
    const url = `${BASE_URL}/trains/${trainNumber}/live-status`;
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${apiKey.trim()}` }
    });
    if (!res.ok) return { success: false, message: `Status ${res.status}` };
    const json = await res.json();
    return { success: true, data: json.data || json };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
