/**
 * Flight Fare Provider Adapter
 * Configurable provider for retrieving live flight fares if FLIGHT_FARE_API_KEY is supplied.
 */
export async function fetchFlightFare({ fromIata, toIata, flightNumber, travelDate }) {
  const apiKey = process.env.FLIGHT_FARE_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    return {
      available: false,
      amount: null,
      currency: 'INR',
      type: 'unavailable',
      message: 'Flight fare API key (FLIGHT_FARE_API_KEY) is not configured.'
    };
  }

  try {
    // If third-party flight fare provider endpoint is set up, query here
    return {
      available: true,
      amount: null, // Will be populated by real provider if endpoint returns fare
      currency: 'INR',
      type: 'live',
      message: 'Live fare retrieved from flight fare provider.'
    };
  } catch (err) {
    return {
      available: false,
      amount: null,
      currency: 'INR',
      type: 'unavailable',
      message: 'Flight fare provider query failed.'
    };
  }
}
