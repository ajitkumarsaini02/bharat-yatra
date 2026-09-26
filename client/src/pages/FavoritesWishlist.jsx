import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Trash2, Sparkles, Route as RouteIcon, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { destinationsData } from '../data/mockData';
import { api } from '../services/api';
import DestinationCard from '../components/DestinationCard';

export default function FavoritesWishlist() {
  const { favorites, savedItineraries, removeItinerary } = useAuth();
  const [activeTab, setActiveTab] = useState('destinations');
  const [allDestinations, setAllDestinations] = useState(destinationsData);
  const [plannedTrips, setPlannedTrips] = useState([
    {
      id: 'trip-demo-1',
      from: 'Delhi',
      destination: 'Agra',
      travelDate: '15 Oct 2026',
      mode: 'Train / Rail',
      hotel: 'Heritage Grand Hotel',
      estimatedCost: 12500,
      status: 'Planned'
    }
  ]);

  useEffect(() => {
    const loadDests = async () => {
      try {
        const res = await api.getDestinations();
        if (res && res.data && res.data.length > 0) {
          setAllDestinations(res.data);
        }
      } catch {
        setAllDestinations(destinationsData);
      }
    };
    loadDests();
  }, []);

  const favoriteDestinations = allDestinations.filter(d => 
    favorites.some(fav => String(fav) === String(d.id) || (d._id && String(fav) === String(d._id)))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          My Saved Dashboard & Trips
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Access your shortlisted dream destinations, planned travel distance calculations, and saved AI itineraries.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-amber-50/80 dark:bg-slate-800 rounded-2xl border border-amber-200/80 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-sm'
                : 'text-amber-900 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Wishlist ({favoriteDestinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('planned')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'planned'
                ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-sm'
                : 'text-amber-900 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
            }`}
          >
            <RouteIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Planned Trips ({plannedTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('itineraries')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'itineraries'
                ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-sm'
                : 'text-amber-900 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>AI Plans ({savedItineraries.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Saved Destinations */}
      {activeTab === 'destinations' && (
        <div>
          {favoriteDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDestinations.map((dest) => (
                <DestinationCard key={dest.id || dest._id} destination={dest} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-amber-100 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] dark:text-slate-100">Your Wishlist is Empty</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Browse our directory of monuments, beaches, and spiritual places and click the heart icon to save them here.
              </p>
              <Link
                to="/explore"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#0A192F] dark:bg-amber-500 text-amber-300 dark:text-slate-950 font-bold text-xs"
              >
                Browse Destinations
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Planned Trips */}
      {activeTab === 'planned' && (
        <div className="space-y-6">
          {plannedTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedTrips.map((trip) => (
                <div key={trip.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-amber-900/10 dark:border-slate-800 shadow-md space-y-4">
                  <div className="flex justify-between items-start border-b border-amber-100 dark:border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                        PLANNED TRIP SEARCH
                      </span>
                      <h3 className="text-xl font-extrabold text-[#0A192F] dark:text-slate-100">
                        {trip.from} → {trip.destination}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40">
                      Status: {trip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Travel Date</span>
                      <span className="font-bold text-[#0A192F] dark:text-slate-100 font-mono">{trip.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Travel Mode</span>
                      <span className="font-bold text-[#0A192F] dark:text-slate-100">{trip.mode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Hotel Stay</span>
                      <span className="font-bold text-[#0A192F] dark:text-slate-100">{trip.hotel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Estimated Cost</span>
                      <span className="font-black text-amber-600 dark:text-amber-400 font-mono text-sm">₹{trip.estimatedCost?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Link
                      to={`/travel-planner?from=${encodeURIComponent(trip.from)}&destination=${encodeURIComponent(trip.destination)}`}
                      className="w-full py-2.5 rounded-xl gradient-saffron text-slate-950 font-black text-xs text-center block shadow-xs"
                    >
                      Re-Calculate Travel Distance & Fares
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-amber-100 dark:border-slate-800 space-y-4">
              <RouteIcon className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-xl font-bold text-[#0A192F] dark:text-slate-100">No Planned Trips Saved</h3>
              <Link to="/travel-planner" className="inline-block px-6 py-2.5 rounded-xl gradient-saffron text-slate-950 font-bold text-xs">
                Plan a New Trip
              </Link>
            </div>
          )}
        </div>
      )}
      {activeTab === 'itineraries' && (
        <div>
          {savedItineraries.length > 0 ? (
            <div className="space-y-6">
              {savedItineraries.map((itin) => (
                <div key={itin.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-900/10 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-500/30">
                        {itin.durationDays} Days Plan
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Saved: {new Date(itin.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0A192F] dark:text-slate-100">{itin.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Destination: <strong className="text-slate-800 dark:text-slate-100">{itin.destination}</strong> • Style: <strong className="text-slate-800 dark:text-slate-100">{itin.travelStyle}</strong> • Total Est: <strong className="text-amber-700 dark:text-amber-400 font-mono">₹{itin.totalEstimatedCost?.toLocaleString('en-IN')}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                      to={`/ai-planner?destination=${encodeURIComponent(itin.destination)}`}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#020C1B] text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>View Full Plan</span>
                    </Link>

                    <button
                      onClick={() => removeItinerary(itin.id || itin._id)}
                      className="p-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition cursor-pointer"
                      title="Remove Itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-amber-100 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] dark:text-slate-100">No Saved Itineraries Yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Generate tailored day-wise travel plans using our AI Planner and click "Save Itinerary" to preserve them for your journey.
              </p>
              <Link
                to="/ai-planner"
                className="inline-block px-6 py-2.5 rounded-xl gradient-saffron text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 cursor-pointer"
              >
                Launch AI Planner
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
