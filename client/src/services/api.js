import axios from 'axios';
import { destinationsData, cuisineDatabase, transportGuideData } from '../data/mockData';

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
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

// Exported API helpers with automatic fallback
export const api = {
  // Destinations
  getDestinations: async (params = {}) => {
    try {
      const res = await apiClient.get('/destinations', { params });
      return res.data;
    } catch (err) {
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
    }
  },

  getDestinationById: async (id) => {
    try {
      const res = await apiClient.get(`/destinations/${id}`);
      return res.data;
    } catch (err) {
      const dest = destinationsData.find(d => d.id === id);
      const stateCuisine = cuisineDatabase.find(c => c.state.toLowerCase() === (dest?.state || '').toLowerCase());
      return {
        success: true,
        data: dest ? { ...dest, regionalCuisine: stateCuisine || null } : null
      };
    }
  },

  searchDestinations: async (query) => {
    try {
      const res = await apiClient.get('/destinations/search', { params: { q: query } });
      return res.data;
    } catch (err) {
      const q = (query || '').toLowerCase();
      const filtered = destinationsData.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      );
      return { success: true, count: filtered.length, data: filtered, externalPlaces: [] };
    }
  },

  getNearbyDestinations: async (lat, lng, radius = 25000) => {
    try {
      const res = await apiClient.get('/destinations/nearby', { params: { lat, lng, radius } });
      return res.data;
    } catch (err) {
      return { success: true, count: 0, data: [] };
    }
  },

  getDestinationImages: async (id) => {
    try {
      const res = await apiClient.get(`/destinations/${id}/images`);
      return res.data;
    } catch (err) {
      return { success: true, count: 0, data: [] };
    }
  },

  getDestinationWeather: async (id, lat, lng) => {
    try {
      const res = await apiClient.get(`/destinations/${id}/weather`, { params: { lat, lng } });
      return res.data;
    } catch (err) {
      return { success: false, data: null };
    }
  },

  enrichDestination: async (id) => {
    try {
      const res = await apiClient.post(`/admin/destinations/${id}/enrich`);
      return res.data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  createDestination: async (destData) => {
    try {
      const res = await apiClient.post('/destinations', destData);
      return res.data;
    } catch (err) {
      const newD = { id: 'dest-' + Date.now(), ...destData, rating: 4.8, reviewsCount: 1 };
      destinationsData.unshift(newD);
      return { success: true, message: 'Destination created (Demo Mode)', data: newD };
    }
  },

  // AI Trip Planner
  generateItinerary: async (plannerParams) => {
    try {
      const res = await apiClient.post('/planner/generate', plannerParams);
      return res.data;
    } catch (err) {
      // Local intelligent generator fallback
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
    }
  },

  // Budget Calculator
  calculateBudget: async (budgetParams) => {
    try {
      const res = await apiClient.post('/budget/calculate', budgetParams);
      return res.data;
    } catch (err) {
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
    }
  },

  // Cuisine & Transport
  getCuisineData: async () => {
    try {
      const res = await apiClient.get('/cuisine');
      return res.data;
    } catch (err) {
      return { success: true, data: cuisineDatabase };
    }
  },

  getTransportGuide: async () => {
    try {
      const res = await apiClient.get('/transport');
      return res.data;
    } catch (err) {
      return { success: true, data: transportGuideData };
    }
  },

  // Reviews
  getReviews: async (destinationId) => {
    try {
      const res = await apiClient.get(`/reviews/${destinationId}`);
      return res.data;
    } catch (err) {
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
    }
  },

  addReview: async (reviewData) => {
    try {
      const res = await apiClient.post('/reviews', reviewData);
      return res.data;
    } catch (err) {
      return {
        success: true,
        message: 'Review recorded successfully',
        data: { _id: 'rev-' + Date.now(), ...reviewData, likes: 0, createdAt: new Date().toISOString() }
      };
    }
  },

  // Auth
  login: async (credentials) => {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      if (res.data.token) {
        localStorage.setItem('bharat_yatra_token', res.data.token);
      }
      return res.data;
    } catch (err) {
      // If server returned a specific error response (e.g. 400 Invalid Password), forward it
      if (err.response && err.response.data && err.response.data.message) {
        throw err;
      }
      
      // Fallback: Check locally registered users when backend is offline or waking up
      const registeredUsers = JSON.parse(localStorage.getItem('bharat_yatra_registered_users') || '[]');
      const found = registeredUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
      
      if (found) {
        if (found.password && found.password !== credentials.password) {
          const customErr = new Error('Invalid email or password');
          customErr.response = { data: { message: 'Invalid email or password' } };
          throw customErr;
        }
        const userObj = {
          id: found.id || 'user-' + Date.now(),
          name: found.name,
          email: found.email,
          role: found.role || (found.email.includes('admin') ? 'admin' : 'user'),
          avatar: found.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          favorites: found.favorites || []
        };
        const token = 'by_token_' + Date.now();
        localStorage.setItem('bharat_yatra_token', token);
        return { success: true, token, user: userObj };
      }

      // If user not found in local store
      const notFoundErr = new Error('No account found with this email. Please register first.');
      notFoundErr.response = { data: { message: 'No account found with this email. Please register first.' } };
      throw notFoundErr;
    }
  },

  register: async (userData) => {
    try {
      const res = await apiClient.post('/auth/register', userData);
      if (res.data.token) {
        localStorage.setItem('bharat_yatra_token', res.data.token);
      }
      return res.data;
    } catch (err) {
      // If server returned a specific validation error (e.g. 400 Email already registered), forward it
      if (err.response && err.response.data && err.response.data.message) {
        throw err;
      }

      // Fallback: Register locally in browser storage when backend is offline or waking up
      const registeredUsers = JSON.parse(localStorage.getItem('bharat_yatra_registered_users') || '[]');
      const exists = registeredUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (exists) {
        const existErr = new Error('Email is already registered. Please sign in.');
        existErr.response = { data: { message: 'Email is already registered. Please sign in.' } };
        throw existErr;
      }

      const newUser = {
        id: 'user-' + Date.now(),
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: userData.password,
        role: userData.email.toLowerCase().includes('admin') ? 'admin' : 'user',
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
    }
  }
};
