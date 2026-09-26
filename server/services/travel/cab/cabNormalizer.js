/**
 * Cab Data Normalizer Service
 */

/**
 * Normalizes raw Ola API response or provides fallback structure
 */
export function normalizeOlaResults({ olaResult, pickup, drop, distanceKm }) {
  if (olaResult && olaResult.success && olaResult.available && Array.isArray(olaResult.categories) && olaResult.categories.length > 0) {
    return olaResult.categories.map(cat => {
      const catName = cat.display_name || cat.category || 'Ola Cab';
      const eta = cat.eta || cat.eta_minutes || 8;
      const minFare = cat.fare_breakdown?.min_fare || cat.amount_min || cat.min_fare || null;
      const maxFare = cat.fare_breakdown?.max_fare || cat.amount_max || cat.max_fare || null;
      const exactFare = cat.upfront_fare || cat.exact_fare || cat.fare || null;
      const isSurge = !!(cat.surcharge || cat.surge_multiplier > 1);

      let fareType = 'provider_estimate';
      let fareLabel = 'Ola Provider Estimate';
      if (exactFare !== null) {
        fareType = 'exact';
        fareLabel = 'LIVE PROVIDER DATA';
      }

      return {
        mode: 'cab',
        provider: 'Ola',
        category: (cat.id || cat.display_name || 'cab').toLowerCase(),
        name: `Ola ${catName}`,
        pickup: { lat: pickup.lat, lng: pickup.lng, name: pickup.name },
        drop: { lat: drop.lat, lng: drop.lng, name: drop.name },
        distanceKm: Number((cat.distance || distanceKm || 10).toFixed(1)),
        durationMinutes: Math.round(cat.duration_minutes || (distanceKm * 2) || 20),
        etaMinutes: eta,
        fare: {
          min: minFare ? Number(minFare) : null,
          max: maxFare ? Number(maxFare) : null,
          exact: exactFare ? Number(exactFare) : null,
          currency: 'INR',
          type: fareType
        },
        fareLabel: fareLabel,
        surge: isSurge,
        availability: true,
        details: cat
      };
    });
  }

  // Fallback structure when API credentials are missing
  const dist = Number((distanceKm || 15).toFixed(1));
  const estimatedMin = Math.round(dist * 14 + 50);
  const estimatedMax = Math.round(dist * 18 + 80);

  return [
    {
      mode: 'cab',
      provider: 'Estimated',
      category: 'mini',
      name: 'Cab / Sedan Ride',
      pickup: { lat: pickup.lat, lng: pickup.lng, name: pickup.name },
      drop: { lat: drop.lat, lng: drop.lng, name: drop.name },
      distanceKm: dist,
      durationMinutes: Math.round(dist * 2.5),
      etaMinutes: 6,
      fare: {
        min: estimatedMin,
        max: estimatedMax,
        exact: null,
        currency: 'INR',
        type: 'estimated'
      },
      fareLabel: 'ESTIMATED',
      surge: false,
      availability: false,
      notice: 'Live cab data unavailable. Ola API credentials (OLA_API_KEY) are required for live pricing.'
    },
    {
      mode: 'cab',
      provider: 'Estimated',
      category: 'auto',
      name: 'Auto Rickshaw',
      pickup: { lat: pickup.lat, lng: pickup.lng, name: pickup.name },
      drop: { lat: drop.lat, lng: drop.lng, name: drop.name },
      distanceKm: dist,
      durationMinutes: Math.round(dist * 3),
      etaMinutes: 4,
      fare: {
        min: Math.round(dist * 9 + 30),
        max: Math.round(dist * 12 + 50),
        exact: null,
        currency: 'INR',
        type: 'estimated'
      },
      fareLabel: 'ESTIMATED',
      surge: false,
      availability: false,
      notice: 'Live auto pricing unavailable. Showing estimated local tariff.'
    }
  ];
}
