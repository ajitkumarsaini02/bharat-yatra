/**
 * Wikipedia API Service
 * Fetches concise encyclopedic descriptions, thumbnails, and article URLs.
 */

const WIKIPEDIA_REST_ENDPOINT = 'https://en.wikipedia.org/api/rest_v1/page/summary';

/**
 * Get Wikipedia summary for a destination
 */
export async function getDestinationSummary(placeName) {
  if (!placeName || placeName.trim() === '') {
    return { success: false, data: null };
  }

  // Sanitize place name (e.g. Taj Mahal -> Taj_Mahal)
  const cleanTitle = placeName
    .replace(/\(.*?\)/g, '')
    .trim()
    .replace(/\s+/g, '_');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${WIKIPEDIA_REST_ENDPOINT}/${encodeURIComponent(cleanTitle)}`, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      // If direct match not found, try searching via Wikipedia query API
      return await searchAndSummarize(placeName);
    }

    const json = await res.json();
    return {
      success: true,
      data: {
        title: json.title,
        description: json.description || '',
        extract: json.extract || '',
        wikipediaUrl: json.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanTitle)}`,
        thumbnail: json.thumbnail?.source || null,
        coordinates: json.coordinates ? {
          lat: json.coordinates.lat,
          lng: json.coordinates.lon
        } : null
      }
    };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
}

/**
 * Fallback search if exact page title doesn't match
 */
async function searchAndSummarize(query) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' India')}&format=json&origin=*&utf8=1`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return { success: false, data: null };

    const json = await res.json();
    const firstHit = json.query?.search?.[0];
    if (!firstHit) return { success: false, data: null };

    // Fetch summary for top search hit
    const summaryRes = await fetch(`${WIKIPEDIA_REST_ENDPOINT}/${encodeURIComponent(firstHit.title.replace(/\s+/g, '_'))}`, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      }
    });

    if (!summaryRes.ok) return { success: false, data: null };

    const summaryJson = await summaryRes.json();
    return {
      success: true,
      data: {
        title: summaryJson.title,
        description: summaryJson.description || '',
        extract: summaryJson.extract || '',
        wikipediaUrl: summaryJson.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(firstHit.title)}`,
        thumbnail: summaryJson.thumbnail?.source || null,
        coordinates: summaryJson.coordinates ? {
          lat: summaryJson.coordinates.lat,
          lng: summaryJson.coordinates.lon
        } : null
      }
    };
  } catch (e) {
    return { success: false, error: e.message, data: null };
  }
}
