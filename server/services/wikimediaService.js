/**
 * Wikimedia Commons API Service
 * Fetches verified high-resolution tourist photographs and image galleries.
 */

const WIKIMEDIA_ENDPOINT = 'https://commons.wikimedia.org/w/api.php';

/**
 * Search Wikimedia Commons images for a given destination
 */
export async function searchImages(placeName, limit = 6) {
  if (!placeName || placeName.trim() === '') {
    return { success: false, data: [] };
  }

  // Clean place query (e.g. remove parenthesis annotations)
  const cleanQuery = placeName.replace(/\(.*?\)/g, '').trim();

  try {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `${cleanQuery} India`,
      gsrnamespace: '6', // File namespace
      gsrlimit: String(limit),
      prop: 'imageinfo',
      iiprop: 'url|size|extmetadata',
      iiurlwidth: '1200', // Request 1200px width thumbnail
      format: 'json',
      origin: '*'
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${WIKIMEDIA_ENDPOINT}?${params.toString()}`, {
      headers: {
        'User-Agent': 'BharatYatra/1.0 (Tourism Discovery Platform; contact@bharatyatra.in)'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, data: [] };
    }

    const json = await res.json();
    if (!json.query || !json.query.pages) {
      return { success: true, count: 0, data: [] };
    }

    const pages = Object.values(json.query.pages);
    const images = pages
      .map(page => {
        const info = page.imageinfo && page.imageinfo[0];
        if (!info) return null;

        // Skip non-photo formats or icons
        const url = info.thumburl || info.url;
        if (!url || url.endsWith('.svg') || url.endsWith('.ogg') || url.endsWith('.pdf')) {
          return null;
        }

        const meta = info.extmetadata || {};
        return {
          title: page.title.replace(/^File:/, '').replace(/\.[^/.]+$/, ''),
          imageUrl: url,
          fullUrl: info.url,
          width: info.thumbwidth || info.width,
          height: info.thumbheight || info.height,
          description: meta.ImageDescription?.value?.replace(/<[^>]*>?/gm, '') || null,
          artist: meta.Artist?.value?.replace(/<[^>]*>?/gm, '') || 'Wikimedia Commons',
          license: meta.LicenseShortName?.value || 'Creative Commons'
        };
      })
      .filter(Boolean);

    return { success: true, count: images.length, data: images };
  } catch (error) {
    return { success: false, error: error.message, data: [] };
  }
}

/**
 * Get single best image for a place
 */
export async function getBestImage(placeName) {
  const result = await searchImages(placeName, 3);
  if (result.success && result.data.length > 0) {
    return {
      success: true,
      imageUrl: result.data[0].imageUrl,
      fullUrl: result.data[0].fullUrl,
      title: result.data[0].title
    };
  }
  return { success: false, imageUrl: null };
}
