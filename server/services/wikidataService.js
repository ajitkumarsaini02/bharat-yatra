/**
 * Wikidata API Service
 * Fetches structured heritage info, UNESCO status, inception dates, and official links.
 */

const WIKIDATA_ENDPOINT = 'https://www.wikidata.org/w/api.php';

/**
 * Search Wikidata entity and fetch structured properties
 */
export async function getHeritageInfo(placeName) {
  if (!placeName || placeName.trim() === '') {
    return { success: false, data: null };
  }

  const cleanName = placeName.replace(/\(.*?\)/g, '').trim();

  try {
    const searchUrl = `${WIKIDATA_ENDPOINT}?action=wbsearchentities&search=${encodeURIComponent(cleanName + ' India')}&language=en&format=json&origin=*&limit=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const searchRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!searchRes.ok) return { success: false, data: null };

    const searchJson = await searchRes.json();
    const entity = searchJson.search?.[0];
    if (!entity || !entity.id) {
      return { success: true, data: null };
    }

    // Fetch entity claims
    const entityUrl = `${WIKIDATA_ENDPOINT}?action=wbgetentities&ids=${entity.id}&props=claims|descriptions&languages=en&format=json&origin=*`;
    const entityRes = await fetch(entityUrl, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      }
    });

    if (!entityRes.ok) return { success: false, data: null };

    const entityJson = await entityRes.json();
    const claims = entityJson.entities?.[entity.id]?.claims || {};

    // P1435 = Heritage designation, P856 = Official website, P571 = Inception, P149 = Architectural style
    const isUnesco = claims.P1435 ? claims.P1435.some(c => c.mainsnak?.datavalue?.value?.id === 'Q9259') : false;
    const officialWebsite = claims.P856?.[0]?.mainsnak?.datavalue?.value || null;
    const inception = claims.P571?.[0]?.mainsnak?.datavalue?.value?.time || null;

    return {
      success: true,
      data: {
        wikidataId: entity.id,
        label: entity.label,
        description: entity.description,
        isUnescoHeritage: isUnesco,
        officialWebsite: officialWebsite,
        inceptionYear: inception ? extractYear(inception) : null
      }
    };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
}

function extractYear(timeStr) {
  const match = timeStr.match(/[+-](\d{4})/);
  return match ? match[1] : null;
}
