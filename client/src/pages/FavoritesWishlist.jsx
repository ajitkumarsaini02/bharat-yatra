import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Trash2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { destinationsData } from '../data/mockData';
import DestinationCard from '../components/DestinationCard';

export default function FavoritesWishlist() {
  const { favorites, savedItineraries, removeItinerary } = useAuth();
  const [activeTab, setActiveTab] = useState('destinations');

  const favoriteDestinations = destinationsData.filter(d => favorites.includes(d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Saved Destinations & Itineraries
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Access your shortlisted dream destinations and saved AI day-wise trip plans anytime.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-amber-50/80 dark:bg-slate-800 rounded-2xl border border-amber-200/80 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-sm'
                : 'text-amber-900 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Saved Destinations ({favoriteDestinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('itineraries')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'itineraries'
                ? 'bg-white dark:bg-slate-900 text-[#0A192F] dark:text-amber-300 shadow-sm'
                : 'text-amber-900 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>AI Itineraries ({savedItineraries.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Saved Destinations */}
      {activeTab === 'destinations' && (
        <div>
          {favoriteDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
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

      {/* Tab 2: Saved AI Itineraries */}
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
