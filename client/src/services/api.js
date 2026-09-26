import axios from 'axios';
import { destinationsData, cuisineDatabase, transportGuideData } from '../data/mockData';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE = rawApiUrl
  ? `${rawApiUrl.replace(/\/$/, '')}/api`
  : isLocalhost
    ? 'http://localhost:5000/api'
    : null;

const apiClient = axios.create({
  baseURL: API_BASE || undefined,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('bharat_yatra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

function matchesCategory(d, cat) {
  if (!cat || cat === 'All') return true;
  const c = cat.toLowerCase().trim();
  const destCat = (d.category || '').toLowerCase().trim();
  return destCat === c || destCat.includes(c) || c.includes(destCat);
}

// Local registration helper
const registerLocally = (userData) => {
  const registeredUsers = JSON.parse(localStorage.getItem('bharat_yatra_registered_users') || '[]');
  const exists = registeredUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
  if (exists) {
    const existErr = new Error('Email is already registered. Please sign in.');
    existErr.response = { data: { message: 'Email is already registered. Please sign in.' } };
    throw existErr;
  }

  const assignedRole = userData.role || (userData.email.toLowerCase().includes('admin') ? 'admin' : 'user');

  const newUser = {
    id: 'user-' + Date.now(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password,
    role: assignedRole,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    favorites: []
  };

  registeredUsers.push(newUser);
  localStorage.setItem('bharat_yatra_registered_users', JSON.stringify(registeredUsers));

  const token = 'by_token_' + Date.now();
  localStorage.setItem('bharat_yatra_token', token);

  const userObj = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
    favorites: newUser.favorites
  };

  return { success: true, message: 'Registration successful', token, user: userObj };
};

// Local login helper
const loginLocally = (credentials) => {
  const registeredUsers = JSON.parse(localStorage.getItem('bharat_yatra_registered_users') || '[]');
  const found = registeredUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

  if (found) {
    if (found.password && found.password !== credentials.password) {
      const customErr = new Error('Invalid password. Please check your credentials.');
      customErr.response = { data: { message: 'Invalid password. Please check your credentials.' } };
      throw customErr;
    }
    const userObj = {
      id: found.id || 'user-' + Date.now(),
      name: found.name,
      email: found.email,
      role: found.role || 'user',
      avatar: found.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      favorites: found.favorites || []
    };
    const token = 'by_token_' + Date.now();
    localStorage.setItem('bharat_yatra_token', token);
    return { success: true, token, user: userObj };
  }

  const notFoundErr = new Error('Account not found with this email. Please register first.');
  notFoundErr.response = { data: { message: 'Account not found with this email. Please register first.' } };
  throw notFoundErr;
};

// Exported API helpers with automatic fallback
export const api = {
  // Destinations
  getDestinations: async (params = {}) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/destinations', { params });
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    let filtered = [...destinationsData];
    if (params.state && params.state !== 'All') {
      filtered = filtered.filter(d => d.state.toLowerCase() === params.state.toLowerCase());
    }
    if (params.zone && params.zone !== 'All') {
      filtered = filtered.filter(d => d.zone.toLowerCase() === params.zone.toLowerCase());
    }
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(d => matchesCategory(d, params.category));
    }
    if (params.budget && params.budget !== 'All') {
      filtered = filtered.filter(d => d.budgetLevel.toLowerCase() === params.budget.toLowerCase());
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.state.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }
    return { success: true, count: filtered.length, data: filtered };
  },

  getDestinationById: async (id) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get(`/destinations/${id}`);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const dest = destinationsData.find(d => d.id === id);
    const stateCuisine = cuisineDatabase.find(c => c.state.toLowerCase() === (dest?.state || '').toLowerCase());
    return {
      success: true,
      data: dest ? { ...dest, regionalCuisine: stateCuisine || null } : null
    };
  },

  searchDestinations: async (query) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/destinations/search', { params: { q: query } });
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const q = (query || '').toLowerCase();
    const filtered = destinationsData.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q)
    );
    return { success: true, count: filtered.length, data: filtered, externalPlaces: [] };
  },

  getNearbyDestinations: async (lat, lng, radius = 25000) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/destinations/nearby', { params: { lat, lng, radius } });
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: true, count: 0, data: [] };
  },

  getDestinationImages: async (id) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get(`/destinations/${id}/images`);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: true, count: 0, data: [] };
  },

  getDestinationWeather: async (id, lat, lng) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get(`/destinations/${id}/weather`, { params: { lat, lng } });
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: false, data: null };
  },

  enrichDestination: async (id) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post(`/admin/destinations/${id}/enrich`);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: false, message: 'Enrichment requires active backend server' };
  },

  createDestination: async (destData) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/destinations', destData);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const newD = { id: 'dest-' + Date.now(), ...destData, rating: 4.8, reviewsCount: 1 };
    destinationsData.unshift(newD);
    return { success: true, message: 'Destination created successfully', data: newD };
  },

  generateAIDestination: async (name) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/destinations/ai-generate', { name });
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return {
      success: true,
      data: {
        name,
        state: 'Rajasthan',
        zone: 'West',
        category: 'UNESCO World Heritage & Iconic Monuments',
        heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        tagline: `Experience the Timeless Splendor of ${name}`,
        description: `${name} is an iconic tourism and cultural heritage landmark in India, renowned for its architectural marvels and rich history.`,
        bestTimeToVisit: 'October to March',
        idealDuration: '2-3 Days',
        budgetLevel: 'Moderate',
        avgDailyExpense: 2400,
        lat: 26.9124,
        lng: 75.7873,
        highlights: [
          `Marvel at the timeless architecture and heritage significance of ${name}`,
          `Guided walking tour exploring the historic galleries, courtyard, and artifacts`,
          `Photography during golden hour morning and evening light`
        ],
        attractions: [{ name: `${name} Main Complex`, type: 'Heritage Site', entryFee: 50, timeNeeded: '2.5 hours' }],
        famousFood: [{ name: 'Traditional Regional Thali', place: 'Local Heritage Restaurant', desc: 'Fresh regional specialties and local desserts' }],
        shoppingSpecialties: ['Handloom Sarees', 'Traditional Handicrafts'],
        transportation: {
          nearestAirport: 'Regional Airport (within 50-80 km)',
          nearestRailway: 'City Junction Railway Station',
          localCommute: 'E-rickshaws, Autos, and App Cabs'
        }
      }
    };
  },

  deleteDestination: async (id) => {
    if (API_BASE) {
      try {
        const res = await apiClient.delete(`/destinations/${id}`);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: true, message: 'Destination deleted' };
  },

  // AI Trip Planner
  generateItinerary: async (plannerParams) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/planner/generate', plannerParams);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const { destination = 'Varanasi (Kashi)', days = 3, travelerType = 'Family', travelStyle = 'Moderate', interests = ['Heritage'] } = plannerParams;
    const numDays = Math.min(Math.max(parseInt(days) || 3, 1), 7);
    const destMatch = destinationsData.find(d => d.name.toLowerCase().includes(destination.toLowerCase().split(' ')[0])) || destinationsData[0];
    
    const multiplier = travelStyle === 'Luxury' ? 2.5 : travelStyle === 'Budget' ? 0.75 : 1.2;
    const baseDailyCost = Math.round((destMatch.avgDailyExpense || 2000) * multiplier);
    const totalCost = baseDailyCost * numDays;

    const generatedDays = Array.from({ length: numDays }, (_, i) => ({
      day: i + 1,
      theme: `Day ${i + 1}: ${destMatch.highlights[i % destMatch.highlights.length] || 'Cultural & Scenic Journey'}`,
      morning: [{
        time: "08:00 AM - 11:30 AM",
        title: `Exploring ${destMatch.attractions[i % destMatch.attractions.length]?.name || destMatch.name}`,
        location: `${destMatch.name} Highlights`,
        description: `Begin your morning at the iconic landmarks, capturing golden hour morning light.`,
        type: "Sightseeing",
        estimatedCost: Math.round(250 * multiplier),
        insiderTip: "Start early to avoid mid-day rush."
      }],
      afternoon: [{
        time: "12:30 PM - 03:30 PM",
        title: `Culinary Experience & Traditional Bazaar Walk`,
        location: `${destMatch.name} Old Quarter`,
        description: `Relish ${destMatch.famousFood[0]?.name || 'local delicacies'} at ${destMatch.famousFood[0]?.place || 'heritage eateries'}.`,
        type: "Food & Crafts",
        estimatedCost: Math.round(400 * multiplier),
        insiderTip: "Sample freshly prepared regional sweets."
      }],
      evening: [{
        time: "05:30 PM - 08:30 PM",
        title: `Sunset Views & Evening Cultural Ambiance`,
        location: `${destMatch.name} Promenade`,
        description: `Unwind with stunning twilight views and explore traditional souvenir stalls.`,
        type: "Leisure & Views",
        estimatedCost: Math.round(250 * multiplier),
        insiderTip: "Keep cash handy for street vendors."
      }],
      mealsSuggestion: {
        breakfast: destMatch.famousFood[0]?.name || "Traditional breakfast",
        lunch: destMatch.famousFood[1]?.name || "Local thali",
        dinner: destMatch.famousFood[2]?.name || "Specialty dinner"
      },
      dailyEstimatedCost: baseDailyCost
    }));

    return {
      success: true,
      data: {
        title: `${numDays}-Day Curated AI Journey in ${destMatch.name}`,
        destination: destMatch.name,
        destinationId: destMatch.id,
        durationDays: numDays,
        travelerType,
        travelStyle,
        interests,
        totalEstimatedCost: totalCost,
        costBreakdown: {
          stay: Math.round(totalCost * 0.40),
          travel: Math.round(totalCost * 0.22),
          food: Math.round(totalCost * 0.20),
          ticketsAndActivities: Math.round(totalCost * 0.10),
          shoppingAndBuffer: Math.round(totalCost * 0.08)
        },
        days: generatedDays,
        packingChecklist: [
          "Valid Govt Photo ID (Aadhaar / Passport)",
          "Breathable comfortable cotton clothing and temple-appropriate attire",
          "Walking sneakers and slip-on footwear",
          "High-capacity power bank & camera equipment",
          "Sunscreen, sunglasses & refillable water flask"
        ],
        localTips: [
          `Respect cultural norms when visiting religious sanctums.`,
          `Use UPI QR codes for seamless payments across street stalls.`,
          `Check monument timings and book online tickets in advance where applicable.`
        ]
      }
    };
  },

  // Budget Calculator
  calculateBudget: async (budgetParams) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/budget/calculate', budgetParams);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const { durationDays = 4, travelersCount = 2, travelTier = 'Moderate', transitMode = 'Train' } = budgetParams;
    const days = parseInt(durationDays) || 4;
    const count = parseInt(travelersCount) || 2;
    const multiplier = travelTier === 'Luxury' ? 3.5 : travelTier === 'Budget' ? 0.8 : 1.5;
    const totalStay = Math.round(1500 * multiplier * days * count);
    const totalFood = Math.round(800 * multiplier * days * count);
    const totalTransit = (transitMode === 'Flight' ? 5000 : 1500) * count;
    const totalActivities = Math.round(400 * multiplier * days * count);
    const shopping = Math.round((totalStay + totalFood) * 0.15);
    const grandTotal = totalStay + totalFood + totalTransit + totalActivities + shopping;

    return {
      success: true,
      data: {
        grandTotal,
        perPersonCost: Math.round(grandTotal / count),
        breakdown: [
          { category: 'Stay & Accommodation', amount: totalStay, percentage: Math.round((totalStay / grandTotal) * 100), color: '#3B82F6' },
          { category: 'Intercity Travel', amount: totalTransit, percentage: Math.round((totalTransit / grandTotal) * 100), color: '#F59E0B' },
          { category: 'Food & Regional Cuisine', amount: totalFood, percentage: Math.round((totalFood / grandTotal) * 100), color: '#10B981' },
          { category: 'Entry Tickets & Activities', amount: totalActivities, percentage: Math.round((totalActivities / grandTotal) * 100), color: '#EC4899' },
          { category: 'Shopping & Buffer', amount: shopping, percentage: Math.round((shopping / grandTotal) * 100), color: '#8B5CF6' }
        ],
        moneySavingTips: [
          "Book train and hotel stays in advance to get early bird rates.",
          "Choose combined monument passes to save entry fees.",
          "Eat at renowned heritage mess outlets for authentic flavors at economical rates."
        ]
      }
    };
  },

  // Travel Distance & Cost Planner
  planTravel: async (plannerParams) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/travel/plan', plannerParams);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          throw new Error(err.response.data.message);
        }
      }
    }

    // Client-side fallback computation
    const { from = 'Delhi', destination = 'Agra', travelDate, travelersCount = 2, hotelNights = 2 } = plannerParams || {};
    
    if (!from || !from.trim() || !destination || !destination.trim()) {
      throw new Error('Both source and destination locations are required.');
    }

    if (from.trim().toLowerCase() === destination.trim().toLowerCase()) {
      throw new Error('Source and destination cannot be the same location.');
    }

    const knownCoords = {
      'delhi': { lat: 28.6139, lng: 77.2090 },
      'new delhi': { lat: 28.6139, lng: 77.2090 },
      'agra': { lat: 27.1767, lng: 78.0081 },
      'jaipur': { lat: 26.9124, lng: 75.7873 },
      'mumbai': { lat: 19.0760, lng: 72.8777 },
      'bengaluru': { lat: 12.9716, lng: 77.5946 },
      'bangalore': { lat: 12.9716, lng: 77.5946 },
      'varanasi': { lat: 25.3176, lng: 82.9739 },
      'goa': { lat: 15.2993, lng: 74.1240 },
      'kolkata': { lat: 22.5726, lng: 88.3639 },
      'chennai': { lat: 13.0827, lng: 80.2707 },
      'hyderabad': { lat: 17.3850, lng: 78.4867 },
      'shimla': { lat: 31.1048, lng: 77.1734 },
      'manali': { lat: 32.2432, lng: 77.1892 },
      'udaipur': { lat: 24.5854, lng: 73.7125 },
      'amritsar': { lat: 31.6340, lng: 74.8723 },
      'kochi': { lat: 9.9312, lng: 76.2673 },
      'rishikesh': { lat: 30.0869, lng: 78.2676 }
    };

    const findCoords = (name) => {
      const q = (name || '').toLowerCase().trim();
      const match = destinationsData.find(d => d.name.toLowerCase().includes(q) || q.includes(d.name.toLowerCase()));
      if (match?.coordinates) return { lat: match.coordinates.lat, lng: match.coordinates.lng, name: match.name };
      for (const [k, v] of Object.entries(knownCoords)) {
        if (q.includes(k) || k.includes(q)) return { ...v, name };
      }
      return { lat: 28.6139, lng: 77.2090, name };
    };

    const c1 = findCoords(from);
    const c2 = findCoords(destination);

    // Haversine formula
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(c2.lat - c1.lat);
    const dLon = toRad(c2.lng - c1.lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const geoKm = Math.round(R * c * 10) / 10 || 210;
    const roadKm = Math.round(geoKm * 1.24 * 10) / 10;
    const railKm = Math.round(geoKm * 1.15 * 10) / 10;

    const travelers = parseInt(travelersCount) || 2;
    const nights = parseInt(hotelNights) || 2;
    const days = Math.max(1, nights + 1);

    const matchedDest = destinationsData.find(d => d.name.toLowerCase().includes(destination.toLowerCase().trim()) || destination.toLowerCase().trim().includes(d.name.toLowerCase()));

    const hotels = (matchedDest?.hotels?.length ? matchedDest.hotels : [
      { name: `Heritage Grand ${destination}`, location: `${destination} City Center`, rating: 4.6, roomType: 'Executive Deluxe', pricePerNight: 3200, amenities: ['WiFi', 'Pool', 'Breakfast'] },
      { name: `Boutique Royal Stay`, location: `Near Historic Fort, ${destination}`, rating: 4.4, roomType: 'Standard Room', pricePerNight: 2400, amenities: ['WiFi', 'AC', 'Restaurant'] }
    ]).map(h => ({
      name: h.name,
      location: h.location || h.address || destination,
      rating: h.rating || 4.5,
      roomType: h.type || h.roomType || 'Standard Deluxe Room',
      pricePerNight: h.pricePerNight || 2500,
      numberOfNights: nights,
      estimatedHotelCost: (h.pricePerNight || 2500) * (nights || 1),
      amenities: h.amenities || ['Free WiFi', 'Air Conditioning', 'Breakfast']
    }));

    const dailyCab = 1200;
    const localTransportCost = dailyCab * days;

    const avgHotelNight = hotels[0]?.pricePerNight || 2500;
    const totalHotel = avgHotelNight * nights;
    const estimatedTravel = Math.round(geoKm * 2.8 * travelers);
    const foodCost = 750 * days * travelers;
    const ticketsCost = 350 * days * travelers;
    const bufferCost = Math.round((estimatedTravel + totalHotel + localTransportCost + foodCost + ticketsCost) * 0.10);
    const grandTotal = estimatedTravel + totalHotel + localTransportCost + foodCost + ticketsCost + bufferCost;

    return {
      success: true,
      query: { from: c1.name || from, destination: c2.name || destination, travelDate, travelersCount: travelers, hotelNights: nights },
      distance: {
        geographicDistanceKm: geoKm,
        geographicDistanceFormatted: `Approx. geographic distance: ${geoKm} km`,
        roadDistanceKm: roadKm,
        distinction: {
          geographic: 'Geographic Distance (Haversine air-line distance)',
          road: 'Road Distance (Highway driving route)',
          rail: 'Rail Distance (Track route length)'
        }
      },
      train: { available: false, message: 'Live train fare/availability is currently unavailable.', mode: 'Train', source: from, destination },
      bus: { available: false, message: 'Live bus fare/availability is currently unavailable.', mode: 'Bus', source: from, destination, roadDistanceKm: roadKm },
      flight: { available: false, message: 'Live flight fare/availability is currently unavailable.', mode: 'Flight', source: from, destination, airDistanceKm: geoKm },
      hotel: {
        available: false,
        liveStatusMessage: 'Live hotel pricing is currently unavailable.',
        destinationName: destination,
        numberOfNights: nights,
        travelersCount: travelers,
        hotels
      },
      localTransportation: {
        label: 'Estimated local transportation cost',
        isEstimated: true,
        estimatedTotalCost: localTransportCost,
        options: [
          { mode: 'Taxi / Private Cab', estimatedDailyCost: dailyCab, estimatedTripCost: dailyCab * days, description: 'Comfortable point-to-point AC sedan/SUV cab service' },
          { mode: 'Auto Rickshaw & E-Rickshaw', estimatedDailyCost: 450, estimatedTripCost: 450 * days, description: 'Ideal for short distances and inner market exploration' },
          { mode: 'Metro & Local Bus Network', estimatedDailyCost: 180, estimatedTripCost: 180 * days, description: 'Most economical public transport option' },
          { mode: 'Rental Vehicle (Bike / Scooter)', estimatedDailyCost: 900, estimatedTripCost: 900 * days, description: 'Self-drive freedom for exploring at your own pace' }
        ]
      },
      completeTripCost: {
        label: 'Complete Estimated Trip Cost',
        travelersCount: travelers,
        hotelNights: nights,
        tripDays: days,
        breakdown: {
          travelCost: estimatedTravel,
          hotelCost: totalHotel,
          localTransportCost: localTransportCost,
          foodCost: foodCost,
          attractionTicketsCost: ticketsCost,
          emergencyBuffer: bufferCost,
          estimatedTotal: grandTotal
        }
      },
      comparison: [
        { mode: 'Train', distanceType: 'Rail Route Distance', distance: `${railKm} km`, duration: `${Math.round(geoKm / 65)} hrs 30 mins`, fareStatus: 'Live fare unavailable' },
        { mode: 'Bus', distanceType: 'Road Distance', distance: `${roadKm} km`, duration: `${Math.round(roadKm / 50)} hrs 15 mins`, fareStatus: 'Live fare unavailable' },
        { mode: 'Flight', distanceType: 'Geographic Air Distance', distance: `${geoKm} km`, duration: '1 hr 30 mins', fareStatus: 'Live fare unavailable' }
      ]
    };
  },

  searchStationCodes: async (query) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/travel/stations/search', { params: { q: query } });
        if (res.data && res.data.success) return res.data;
      } catch (err) {}
    }
    return { success: true, data: [] };
  },

  searchAirportCodes: async (query) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/travel/airports/search', { params: { q: query } });
        if (res.data && res.data.success) return res.data;
      } catch (err) {}
    }
    return { success: true, data: [] };
  },

  saveTravelPlan: async (planData) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/travel/save-plan', planData);
        if (res.data && res.data.success) return res.data;
      } catch (err) {}
    }
    const localPlans = JSON.parse(localStorage.getItem('bharat_yatra_saved_plans') || '[]');
    const newPlan = { ...planData, id: 'plan-' + Date.now(), savedAt: new Date().toISOString() };
    localPlans.unshift(newPlan);
    localStorage.setItem('bharat_yatra_saved_plans', JSON.stringify(localPlans));
    return { success: true, message: 'Travel plan saved successfully', data: newPlan };
  },

  getTrainStatus: async (trainNumber) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/travel/train/status', { params: { trainNumber } });
        if (res.data) return res.data;
      } catch (err) {}
    }
    return { success: false, message: 'Live status currently unavailable' };
  },

  // Cuisine & Transport
  getCuisineData: async () => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/cuisine');
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: true, data: cuisineDatabase };
  },

  getTransportGuide: async () => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/transport');
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: true, data: transportGuideData };
  },

  // Saved AI Itineraries
  saveItinerary: async (itineraryData) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/planner/save', itineraryData);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const localSaved = JSON.parse(localStorage.getItem('bharat_yatra_saved_itineraries') || '[]');
    const newItin = {
      ...itineraryData,
      id: 'saved-itin-' + Date.now(),
      savedAt: new Date().toISOString()
    };
    localSaved.unshift(newItin);
    localStorage.setItem('bharat_yatra_saved_itineraries', JSON.stringify(localSaved));
    return { success: true, message: 'Itinerary saved', data: newItin };
  },

  getSavedItineraries: async () => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/planner/saved');
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const localSaved = JSON.parse(localStorage.getItem('bharat_yatra_saved_itineraries') || '[]');
    return { success: true, count: localSaved.length, data: localSaved };
  },

  deleteItinerary: async (id) => {
    if (API_BASE) {
      try {
        const res = await apiClient.delete(`/planner/saved/${id}`);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const localSaved = JSON.parse(localStorage.getItem('bharat_yatra_saved_itineraries') || '[]');
    const filtered = localSaved.filter(it => it.id !== id && it._id !== id);
    localStorage.setItem('bharat_yatra_saved_itineraries', JSON.stringify(filtered));
    return { success: true, message: 'Itinerary removed' };
  },

  // User Favorites & Wishlist
  toggleFavorite: async (destinationId) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/auth/favorites/toggle', { destinationId });
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const localFavs = JSON.parse(localStorage.getItem('bharat_yatra_favs') || '[]');
    const exists = localFavs.includes(destinationId);
    const updated = exists ? localFavs.filter(id => id !== destinationId) : [...localFavs, destinationId];
    localStorage.setItem('bharat_yatra_favs', JSON.stringify(updated));
    return { success: true, favorites: updated, isFavorite: !exists };
  },

  getFavorites: async () => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/auth/favorites');
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const localFavs = JSON.parse(localStorage.getItem('bharat_yatra_favs') || '[]');
    return { success: true, favorites: localFavs };
  },

  // Reviews
  getReviews: async (destinationId) => {
    if (API_BASE) {
      try {
        const res = await apiClient.get(`/reviews/${destinationId}`);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return {
      success: true,
      data: [
        {
          _id: 'rev-sample-1',
          destinationId,
          userName: 'Aniket Sharma',
          rating: 5,
          comment: 'An unforgettable cultural experience! Highly recommend using the AI planner.',
          travelMonth: 'Recent Visit',
          travelerType: 'Family Trip',
          likes: 12,
          createdAt: new Date().toISOString()
        }
      ]
    };
  },

  addReview: async (reviewData) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/reviews', reviewData);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return {
      success: true,
      message: 'Review recorded successfully',
      data: { _id: 'rev-' + Date.now(), ...reviewData, likes: 0, createdAt: new Date().toISOString() }
    };
  },

  likeReview: async (id) => {
    if (API_BASE) {
      try {
        const res = await apiClient.put(`/reviews/${id}/like`);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    return { success: true, likes: 1 };
  },

  // Auth: Login
  login: async (credentials) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/auth/login', credentials);
        if (res.data && typeof res.data !== 'string' && res.data.user) {
          if (res.data.token) {
            localStorage.setItem('bharat_yatra_token', res.data.token);
          }
          return res.data;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message && typeof err.response.data === 'object') {
          throw err;
        }
      }
    }
    return loginLocally(credentials);
  },

  // Auth: Register
  register: async (userData) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/auth/register', userData);
        if (res.data && typeof res.data !== 'string' && res.data.user) {
          if (res.data.token) {
            localStorage.setItem('bharat_yatra_token', res.data.token);
          }
          return res.data;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message && typeof err.response.data === 'object') {
          throw err;
        }
      }
    }
    return registerLocally(userData);
  },

  // Admin Accounts Management
  getAdmins: async () => {
    if (API_BASE) {
      try {
        const res = await apiClient.get('/admin/users');
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        // Fallback
      }
    }
    const localAdmins = JSON.parse(localStorage.getItem('bharat_yatra_admin_accounts') || '[]');
    if (localAdmins.length === 0) {
      const defaultAdmin = {
        id: 'admin-root',
        _id: 'admin-root',
        name: 'Root Administrator',
        email: 'admin@bharatyatra.com',
        role: 'admin',
        department: 'System Architecture',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdBy: 'system',
        createdByName: 'System Seed',
        createdByEmail: 'system@bharatyatra.com'
      };
      localAdmins.push(defaultAdmin);
      localStorage.setItem('bharat_yatra_admin_accounts', JSON.stringify(localAdmins));
    }
    return { success: true, count: localAdmins.length, data: localAdmins };
  },

  createAdmin: async (adminData) => {
    if (API_BASE) {
      try {
        const res = await apiClient.post('/admin/users', adminData);
        if (res.data && typeof res.data !== 'string' && res.data.success) {
          return res.data;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          throw err;
        }
      }
    }
    const localAdmins = JSON.parse(localStorage.getItem('bharat_yatra_admin_accounts') || '[]');
    const exists = localAdmins.find(a => a.email.toLowerCase() === adminData.email.toLowerCase());
    if (exists) {
      const existErr = new Error('Email is already registered as Admin.');
      existErr.response = { data: { message: 'Email is already registered as Admin.' } };
      throw existErr;
    }

    const newAdminObj = {
      id: 'admin-' + Date.now(),
      _id: 'admin-' + Date.now(),
      name: adminData.name,
      email: adminData.email.toLowerCase(),
      role: 'admin',
      department: adminData.department || 'Tourism Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdBy: adminData.createdBy || 'admin-root',
      createdByName: adminData.createdByName || 'Administrator',
      createdByEmail: adminData.createdByEmail || 'admin@bharatyatra.com',
      createdAt: new Date().toISOString()
    };

    localAdmins.unshift(newAdminObj);
    localStorage.setItem('bharat_yatra_admin_accounts', JSON.stringify(localAdmins));

    return {
      success: true,
      message: `Admin account "${newAdminObj.name}" added successfully by ${adminData.createdByName || 'You'}`,
      data: newAdminObj
    };
  },

  deleteAdmin: async (adminId, currentUserEmail, currentUserId) => {
    if (API_BASE) {
      try {
        const res = await apiClient.delete(`/admin/users/${adminId}`);
        if (res.data && typeof res.data !== 'string') {
          return res.data;
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          return err.response.data;
        }
      }
    }

    const localAdmins = JSON.parse(localStorage.getItem('bharat_yatra_admin_accounts') || '[]');
    const target = localAdmins.find(a => a.id === adminId || a._id === adminId);
    if (!target) {
      return { success: false, message: 'Admin account not found' };
    }

    const isOwner = (currentUserId && target.createdBy && String(target.createdBy) === String(currentUserId)) ||
                    (currentUserEmail && target.createdByEmail && target.createdByEmail.toLowerCase() === currentUserEmail.toLowerCase()) ||
                    (currentUserEmail === 'admin@bharatyatra.com');

    if (!isOwner) {
      return {
        success: false,
        message: `Permission Denied: Aap sirf wahi admin delete kar sakte hain jisko aapne add kiya hai. (Added by: ${target.createdByName || target.createdByEmail || 'System Seed'})`
      };
    }

    const filtered = localAdmins.filter(a => a.id !== adminId && a._id !== adminId);
    localStorage.setItem('bharat_yatra_admin_accounts', JSON.stringify(filtered));

    return { success: true, message: `Admin account "${target.name}" deleted successfully.` };
  }
};
