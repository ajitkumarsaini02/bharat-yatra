import { travelCache } from './cacheService.js';

// Comprehensive registry of major Indian Railway Stations
export const INDIAN_STATIONS = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'Delhi', state: 'Delhi' },
  { code: 'DLI', name: 'Old Delhi Junction', city: 'Delhi', state: 'Delhi' },
  { code: 'NZM', name: 'Hazrat Nizamuddin', city: 'Delhi', state: 'Delhi' },
  { code: 'ANVT', name: 'Anand Vihar Terminal', city: 'Delhi', state: 'Delhi' },
  { code: 'AGC', name: 'Agra Cantt', city: 'Agra', state: 'Uttar Pradesh' },
  { code: 'AF', name: 'Agra Fort', city: 'Agra', state: 'Uttar Pradesh' },
  { code: 'JP', name: 'Jaipur Junction', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'GADJ', name: 'Gandhinagar Jaipur', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'MMCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'BDTS', name: 'Bandra Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'LTT', name: 'Lokmanya Tilak Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'SBC', name: 'KSR Bengaluru City', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'YPR', name: 'Yesvantpur Junction', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'HWH', name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'SDAH', name: 'Sealdah', city: 'Kolkata', state: 'West Bengal' },
  { code: 'KOAA', name: 'Kolkata Terminal', city: 'Kolkata', state: 'West Bengal' },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'MS', name: 'Chennai Egmore', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'SC', name: 'Secunderabad Junction', city: 'Hyderabad', state: 'Telangana' },
  { code: 'HYB', name: 'Hyderabad Deccan Nampally', city: 'Hyderabad', state: 'Telangana' },
  { code: 'BSB', name: 'Varanasi Junction', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'DDU', name: 'Pt. Deen Dayal Upadhyaya Junction', city: 'Varanasi', state: 'Uttar Pradesh' },
  { code: 'ASR', name: 'Amritsar Junction', city: 'Amritsar', state: 'Punjab' },
  { code: 'MAO', name: 'Madgaon Junction', city: 'Goa', state: 'Goa' },
  { code: 'KRMI', name: 'Karmali', city: 'Goa', state: 'Goa' },
  { code: 'UDZ', name: 'Udaipur City', city: 'Udaipur', state: 'Rajasthan' },
  { code: 'SML', name: 'Shimla Railway Station', city: 'Shimla', state: 'Himachal Pradesh' },
  { code: 'LKO', name: 'Lucknow Charbagh', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'LJN', name: 'Lucknow Junction', city: 'Lucknow', state: 'Uttar Pradesh' },
  { code: 'ADI', name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'ERS', name: 'Ernakulam Junction (South)', city: 'Kochi', state: 'Kerala' },
  { code: 'HW', name: 'Haridwar Junction', city: 'Rishikesh', state: 'Uttarakhand' },
  { code: 'RK', name: 'Roorkee', city: 'Rishikesh', state: 'Uttarakhand' },
  { code: 'CDG', name: 'Chandigarh Junction', city: 'Chandigarh', state: 'Chandigarh' },
  { code: 'BPL', name: 'Bhopal Junction', city: 'Bhopal', state: 'Madhya Pradesh' },
  { code: 'RKMP', name: 'Rani Kamlapati (Habibganj)', city: 'Bhopal', state: 'Madhya Pradesh' }
];

/**
 * Get primary station code for a city name
 */
export function getStationCodeForCity(cityName) {
  if (!cityName) return 'NDLS';
  const clean = cityName.trim().toLowerCase();
  
  const cacheKey = `station_code_${clean}`;
  const cached = travelCache.get(cacheKey);
  if (cached) return cached;

  const match = INDIAN_STATIONS.find(s => 
    s.city.toLowerCase() === clean || 
    clean.includes(s.city.toLowerCase()) || 
    s.name.toLowerCase().includes(clean) ||
    s.code.toLowerCase() === clean
  );

  const code = match ? match.code : 'NDLS';
  travelCache.set(cacheKey, code, 86400); // 24h
  return code;
}

/**
 * Search stations by query
 */
export function searchStations(query) {
  if (!query || query.trim().length < 2) return INDIAN_STATIONS.slice(0, 10);
  const clean = query.trim().toLowerCase();
  return INDIAN_STATIONS.filter(s => 
    s.name.toLowerCase().includes(clean) ||
    s.city.toLowerCase().includes(clean) ||
    s.code.toLowerCase().includes(clean) ||
    s.state.toLowerCase().includes(clean)
  );
}
