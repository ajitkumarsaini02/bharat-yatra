import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bharat_yatra_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed.id === 'user-default-1' || parsed.email === 'traveler@bharatyatra.com' || parsed.email === 'admin@bharatyatra.com') {
        localStorage.removeItem('bharat_yatra_user');
        localStorage.removeItem('bharat_yatra_token');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavs = localStorage.getItem('bharat_yatra_favs');
      if (!savedFavs) return [];
      const parsed = JSON.parse(savedFavs);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const isLegacyDemo = parsed.includes('dest-taj-mahal') || parsed.includes('dest-1');
        if (isLegacyDemo && parsed.length <= 3) {
          localStorage.removeItem('bharat_yatra_favs');
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [savedItineraries, setSavedItineraries] = useState(() => {
    const savedItin = localStorage.getItem('bharat_yatra_saved_itineraries');
    return savedItin ? JSON.parse(savedItin) : [];
  });

  // Sync favorites and itineraries from MongoDB Atlas on user login
  useEffect(() => {
    if (user) {
      localStorage.setItem('bharat_yatra_user', JSON.stringify(user));
      // Fetch fresh favorites and saved itineraries from MongoDB Atlas
      const fetchUserDataFromDb = async () => {
        try {
          const [favRes, itinRes] = await Promise.allSettled([
            api.getFavorites(),
            api.getSavedItineraries()
          ]);
          if (favRes.status === 'fulfilled' && favRes.value?.favorites) {
            setFavorites(favRes.value.favorites);
          }
          if (itinRes.status === 'fulfilled' && itinRes.value?.data) {
            setSavedItineraries(itinRes.value.data);
          }
        } catch (e) {
          console.log('Using cached local storage for user data');
        }
      };
      fetchUserDataFromDb();
    } else {
      localStorage.removeItem('bharat_yatra_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('bharat_yatra_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('bharat_yatra_saved_itineraries', JSON.stringify(savedItineraries));
  }, [savedItineraries]);

  const toggleFavorite = async (destId) => {
    setFavorites(prev => {
      if (prev.includes(destId)) {
        return prev.filter(id => id !== destId);
      } else {
        return [...prev, destId];
      }
    });

    if (user) {
      try {
        const res = await api.toggleFavorite(destId);
        if (res.favorites) {
          setFavorites(res.favorites);
        }
      } catch (err) {
        console.error('Toggle favorite error:', err);
      }
    }
  };

  const saveItinerary = async (itinerary) => {
    try {
      const res = await api.saveItinerary(itinerary);
      const saved = res.data || {
        ...itinerary,
        savedAt: new Date().toISOString(),
        id: 'saved-itin-' + Date.now()
      };
      setSavedItineraries(prev => [saved, ...prev.filter(i => (i.id || i._id) !== (saved.id || saved._id))]);
      return saved;
    } catch (err) {
      const fallbackItem = {
        ...itinerary,
        savedAt: new Date().toISOString(),
        id: 'saved-itin-' + Date.now()
      };
      setSavedItineraries(prev => [fallbackItem, ...prev]);
      return fallbackItem;
    }
  };

  const removeItinerary = async (id) => {
    try {
      await api.deleteItinerary(id);
    } catch (err) {
      console.error('Delete itinerary error:', err);
    }
    setSavedItineraries(prev => prev.filter(item => (item.id || item._id) !== id));
  };

  const loginUser = async (email, password, role = 'user') => {
    const res = await api.login({ email, password, role });
    if (res.user) {
      setUser(res.user);
      if (res.user.favorites) {
        setFavorites(res.user.favorites);
      }
    }
    return res;
  };

  const registerUser = async (name, email, password, role = 'user', adminSecretKey = '') => {
    const res = await api.register({ name, email, password, role, adminSecretKey });
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logoutUser = () => {
    localStorage.removeItem('bharat_yatra_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      favorites,
      savedItineraries,
      toggleFavorite,
      saveItinerary,
      removeItinerary,
      loginUser,
      registerUser,
      logoutUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      favorites: [],
      savedItineraries: [],
      toggleFavorite: () => {},
      saveItinerary: () => {},
      removeItinerary: () => {},
      loginUser: async () => {},
      registerUser: async () => {},
      logoutUser: () => {},
      isAuthenticated: false,
      isAdmin: false
    };
  }
  return context;
};
