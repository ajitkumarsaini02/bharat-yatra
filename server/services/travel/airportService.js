import { travelCache } from './cacheService.js';

export const INDIAN_AIRPORTS = [
  { iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', state: 'Delhi' },
  { iata: 'AGR', name: 'Agra Airport / Pandit Deen Dayal Upadhyay Airport', city: 'Agra', state: 'Uttar Pradesh' },
  { iata: 'JAI', name: 'Jaipur International Airport', city: 'Jaipur', state: 'Rajasthan' },
  { iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', state: 'Maharashtra' },
  { iata: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', state: 'Karnataka' },
  { iata: 'CCU', name: 'Netaji Subhash Chandra Bose International Airport', city: 'Kolkata', state: 'West Bengal' },
  { iata: 'MAA', name: 'Chennai International Airport', city: 'Chennai', state: 'Tamil Nadu' },
  { iata: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', state: 'Telangana' },
  { iata: 'VNS', name: 'Lal Bahadur Shastri International Airport', city: 'Varanasi', state: 'Uttar Pradesh' },
  { iata: 'GOI', name: 'Dabolim Airport', city: 'Goa', state: 'Goa' },
  { iata: 'GOX', name: 'Manohar International Airport (Mopa)', city: 'Goa', state: 'Goa' },
  { iata: 'ATQ', name: 'Sri Guru Ram Dass Jee International Airport', city: 'Amritsar', state: 'Punjab' },
  { iata: 'COK', name: 'Cochin International Airport', city: 'Kochi', state: 'Kerala' },
  { iata: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan' },
  { iata: 'LKO', name: 'Chaudhary Charan Singh International Airport', city: 'Lucknow', state: 'Uttar Pradesh' },
  { iata: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', state: 'Gujarat' },
  { iata: 'IXC', name: 'Chandigarh Airport', city: 'Chandigarh', state: 'Chandigarh' },
  { iata: 'DED', name: 'Jolly Grant Airport', city: 'Dehradun', state: 'Uttarakhand' },
  { iata: 'SXR', name: 'Sheikh ul-Alam International Airport', city: 'Srinagar', state: 'Jammu & Kashmir' },
  { iata: 'GAU', name: 'Lokpriya Gopinath Bordoloi International Airport', city: 'Guwahati', state: 'Assam' },
  { iata: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra' },
  { iata: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh' }
];

/**
 * Get primary airport code for a city
 */
export function getAirportCodeForCity(cityName) {
  if (!cityName) return 'DEL';
  const clean = cityName.trim().toLowerCase();

  const cacheKey = `airport_code_${clean}`;
  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  const match = INDIAN_AIRPORTS.find(a => 
    a.city.toLowerCase() === clean || 
    clean.includes(a.city.toLowerCase()) || 
    a.name.toLowerCase().includes(clean) ||
    a.iata.toLowerCase() === clean
  );

  const code = match ? match.iata : 'DEL';
  travelCache.set(cacheKey, code, 86400);
  return code;
}

/**
 * Search airports by query
 */
export function searchAirports(query) {
  if (!query || query.trim().length < 2) return INDIAN_AIRPORTS.slice(0, 10);
  const clean = query.trim().toLowerCase();
  return INDIAN_AIRPORTS.filter(a => 
    a.name.toLowerCase().includes(clean) ||
    a.city.toLowerCase().includes(clean) ||
    a.iata.toLowerCase().includes(clean) ||
    a.state.toLowerCase().includes(clean)
  );
}
