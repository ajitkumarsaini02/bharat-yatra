/**
 * Open-Meteo Weather Service
 * Real-time weather, temperature, condition descriptions, and daily forecast.
 * No API key required.
 */

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

// WMO Weather interpretation codes
const WMO_CODES = {
  0: { description: 'Clear Sky', icon: '☀️', condition: 'Sunny' },
  1: { description: 'Mainly Clear', icon: '🌤️', condition: 'Clear' },
  2: { description: 'Partly Cloudy', icon: '⛅', condition: 'Partly Cloudy' },
  3: { description: 'Overcast', icon: '☁️', condition: 'Overcast' },
  45: { description: 'Foggy', icon: '🌫️', condition: 'Fog' },
  48: { description: 'Depositing Rime Fog', icon: '🌫️', condition: 'Fog' },
  51: { description: 'Light Drizzle', icon: '🌦️', condition: 'Drizzle' },
  53: { description: 'Moderate Drizzle', icon: '🌦️', condition: 'Drizzle' },
  55: { description: 'Dense Drizzle', icon: '🌧️', condition: 'Drizzle' },
  61: { description: 'Slight Rain', icon: '🌦️', condition: 'Rain' },
  63: { description: 'Moderate Rain', icon: '🌧️', condition: 'Rain' },
  65: { description: 'Heavy Rain', icon: '⛈️', condition: 'Heavy Rain' },
  71: { description: 'Slight Snow Fall', icon: '🌨️', condition: 'Snow' },
  73: { description: 'Moderate Snow Fall', icon: '❄️', condition: 'Snow' },
  75: { description: 'Heavy Snow Fall', icon: '❄️', condition: 'Heavy Snow' },
  80: { description: 'Slight Rain Showers', icon: '🌦️', condition: 'Showers' },
  81: { description: 'Moderate Rain Showers', icon: '🌧️', condition: 'Showers' },
  82: { description: 'Violent Rain Showers', icon: '⛈️', condition: 'Thunderstorm' },
  95: { description: 'Thunderstorm', icon: '⚡', condition: 'Thunderstorm' },
  96: { description: 'Thunderstorm with Slight Hail', icon: '⛈️', condition: 'Thunderstorm' },
  99: { description: 'Thunderstorm with Heavy Hail', icon: '⛈️', condition: 'Thunderstorm' }
};

/**
 * Get current live weather for coordinates
 */
export async function getCurrentWeather(lat, lng) {
  if (!lat || !lng) {
    return { success: false, data: null };
  }

  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
      timezone: 'Asia/Kolkata',
      forecast_days: '4'
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${OPEN_METEO_BASE}?${params.toString()}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, data: null };
    }

    const json = await res.json();
    const current = json.current || {};
    const daily = json.daily || {};
    const wCode = current.weather_code ?? 0;
    const weatherMeta = WMO_CODES[wCode] || { description: 'Pleasant', icon: '🌤️', condition: 'Fair' };

    // Format 3-day forecast
    const forecast = (daily.time || []).slice(0, 3).map((dateStr, idx) => {
      const code = daily.weather_code?.[idx] ?? 0;
      const meta = WMO_CODES[code] || { description: 'Pleasant', icon: '🌤️', condition: 'Fair' };
      const date = new Date(dateStr);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      return {
        date: dateStr,
        dayName,
        maxTemp: Math.round(daily.temperature_2m_max?.[idx] ?? current.temperature_2m),
        minTemp: Math.round(daily.temperature_2m_min?.[idx] ?? current.temperature_2m - 5),
        rainChance: daily.precipitation_probability_max?.[idx] ?? 0,
        weatherCode: code,
        condition: meta.condition,
        icon: meta.icon
      };
    });

    return {
      success: true,
      data: {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature ?? current.temperature_2m),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        precipitation: current.precipitation,
        weatherCode: wCode,
        condition: weatherMeta.condition,
        description: weatherMeta.description,
        icon: weatherMeta.icon,
        forecast,
        fetchedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
}
