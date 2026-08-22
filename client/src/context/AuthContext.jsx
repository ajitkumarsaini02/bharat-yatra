import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bharat_yatra_user');
    return saved ? JSON.parse(saved) : {
      id: 'user-default-1',
      name: 'Travel Explorer',
      email: 'traveler@bharatyatra.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      favorites: ['dest-taj-mahal', 'dest-amer-fort', 'dest-golden-temple']
    };
  });

  const [favorites, setFavorites] = useState(() => {
    const savedFavs = localStorage.getItem('bharat_yatra_favs');
    return savedFavs ? JSON.parse(savedFavs) : ['dest-taj-mahal', 'dest-amer-fort', 'dest-golden-temple'];
  });

  const [savedItineraries, setSavedItineraries] = useState(() => {
    const savedItin = localStorage.getItem('bharat_yatra_saved_itineraries');
    return savedItin ? JSON.parse(savedItin) : [];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('bharat_yatra_user', JSON.stringify(user));
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

  const toggleFavorite = (destId) => {
    setFavorites(prev => {
      if (prev.includes(destId)) {
        return prev.filter(id => id !== destId);
      } else {
        return [...prev, destId];
      }
    });
  };

  const saveItinerary = (itinerary) => {
    const itemWithId = {
      ...itinerary,
      savedAt: new Date().toISOString(),
      id: 'saved-itin-' + Date.now()
    };
    setSavedItineraries(prev => [itemWithId, ...prev]);
    return itemWithId;
  };

  const removeItinerary = (id) => {
    setSavedItineraries(prev => prev.filter(item => item.id !== id));
  };

  const loginUser = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.user) {
      setUser(res.user);
      if (res.user.favorites) {
        setFavorites(res.user.favorites);
      }
    }
    return res;
  };

  const registerUser = async (name, email, password) => {
    const res = await api.register({ name, email, password });
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
