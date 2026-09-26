import { fetchOlaRideEstimates } from './olaProvider.js';
import { fetchUberRideEstimates } from './uberProvider.js';
import { normalizeOlaResults } from './cabNormalizer.js';
import { getCoordinatesForPlace, fetchRoadDistance } from '../travelService.js';

/**
 * Main Cab Service Orchestrator
 */
export async function getCabRideEstimates({ from, destination, category }) {
  if (!from || !destination) {
    throw new Error('Pickup (from) and drop (destination) locations are required for cab search.');
  }

  const pickupCoords = await getCoordinatesForPlace(from);
  const dropCoords = await getCoordinatesForPlace(destination);

  const roadData = await fetchRoadDistance(
    pickupCoords.lat,
    pickupCoords.lng,
    dropCoords.lat,
    dropCoords.lng
  );
  const roadDistanceKm = roadData.distanceKm;

  // Query Ola Developer API
  const olaResult = await fetchOlaRideEstimates({
    pickup_lat: pickupCoords.lat,
    pickup_lng: pickupCoords.lng,
    drop_lat: dropCoords.lat,
    drop_lng: dropCoords.lng,
    category
  });

  const normalizedOptions = normalizeOlaResults({
    olaResult,
    pickup: pickupCoords,
    drop: dropCoords,
    distanceKm: roadDistanceKm
  });

  return {
    success: true,
    provider: olaResult.available ? 'Ola' : 'Estimated',
    roadDistanceKm,
    roadProvider: roadData.provider,
    isLive: olaResult.available,
    message: olaResult.available ? 'Live cab data retrieved from Ola Developer API.' : 'Live cab data unavailable. Showing estimated local cab tariffs.',
    data: normalizedOptions
  };
}

/**
 * Calculate Local Transfer Estimates between Airport/Station, Hotel, and Attractions
 */
export function calculateLocalTransferEstimate(transfersList = []) {
  if (!Array.isArray(transfersList) || transfersList.length === 0) {
    return {
      label: 'Estimated Local Transport Cost',
      totalMinFare: 650,
      totalMaxFare: 950,
      isProviderConfirmed: false,
      transfers: []
    };
  }

  let totalMin = 0;
  let totalMax = 0;
  let allConfirmed = true;

  const processedTransfers = transfersList.map(t => {
    const min = t.fare?.min || t.minFare || 150;
    const max = t.fare?.max || t.maxFare || 250;
    const isLive = t.fare?.type === 'provider_estimate' || t.fare?.type === 'exact';

    if (!isLive) allConfirmed = false;

    totalMin += min;
    totalMax += max;

    return {
      from: t.from || 'Origin',
      to: t.to || 'Destination',
      category: t.category || 'Cab / Auto',
      distanceKm: t.distanceKm || 10,
      minFare: min,
      maxFare: max,
      isLive
    };
  });

  return {
    label: allConfirmed ? 'Provider Confirmed Local Transport Cost' : 'Estimated Local Transport Cost',
    totalMinFare: totalMin,
    totalMaxFare: totalMax,
    isProviderConfirmed: allConfirmed,
    transfers: processedTransfers
  };
}
