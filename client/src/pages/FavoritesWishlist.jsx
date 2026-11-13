import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, Trash2, Sparkles, Route as RouteIcon, MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';
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
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
            <Bookmark className="w-4 h-4 text-[#FFB36B]" />
            <span>Personal Traveler Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            My Saved <span className="text-[#FFB36B]">Bucket List & Itineraries</span>
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
            Manage your bookmarked Indian destinations, multi-modal travel bookings, and customized AI day-by-day itineraries all in one place.
          </p>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Saved</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">{favoriteDestinations.length}</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Wishlist Destinations</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <RouteIcon className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Transit</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">{plannedTrips.length}</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Planned Trips</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">AI Plans</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">{savedItineraries.length}</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Generated Itineraries</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Status</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Active</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Travel Dashboard</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-[#EAF4FA] rounded-2xl border border-[#E5EAF0]">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-white text-[#123B5D] shadow-sm'
                : 'text-[#718096] hover:text-[#123B5D]'
            }`}
          >
            <Heart className="w-4 h-4 text-[#F28C45]" />
            <span>Wishlist ({favoriteDestinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('planned')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'planned'
                ? 'bg-white text-[#123B5D] shadow-sm'
                : 'text-[#718096] hover:text-[#123B5D]'
            }`}
          >
            <RouteIcon className="w-4 h-4 text-[#F28C45]" />
            <span>Planned Trips ({plannedTrips.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('itineraries')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'itineraries'
                ? 'bg-white text-[#123B5D] shadow-sm'
                : 'text-[#718096] hover:text-[#123B5D]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#F28C45]" />
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
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF5EE] text-[#F28C45] flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#123B5D]">Your Wishlist is Empty</h3>
              <p className="text-xs sm:text-sm text-[#718096] max-w-sm mx-auto font-medium">
                Browse our directory of monuments, beaches, and spiritual places and click the heart icon to save them here.
              </p>
              <Link
                to="/explore"
                className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] text-white font-bold text-xs shadow-md shadow-[#F28C45]/25"
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
                <div key={trip.id} className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-md space-y-4">
                  <div className="flex justify-between items-start border-b border-[#E5EAF0] pb-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#F28C45] tracking-wider">
                        PLANNED TRIP SEARCH
                      </span>
                      <h3 className="text-xl font-extrabold text-[#123B5D]">
                        {trip.from} → {trip.destination}
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF4FA] text-[#123B5D] border border-[#123B5D]/20">
                      Status: {trip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-[#718096]">
                    <div>
                      <span className="text-[10px] text-[#718096] block font-semibold">Travel Date</span>
                      <span className="font-bold text-[#29445A] font-mono">{trip.travelDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718096] block font-semibold">Travel Mode</span>
                      <span className="font-bold text-[#29445A]">{trip.mode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718096] block font-semibold">Hotel Stay</span>
                      <span className="font-bold text-[#29445A]">{trip.hotel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718096] block font-semibold">Estimated Cost</span>
                      <span className="font-black text-[#123B5D] font-mono text-sm">₹{trip.estimatedCost?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Link
                      to={`/travel-planner?from=${encodeURIComponent(trip.from)}&destination=${encodeURIComponent(trip.destination)}`}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] text-white font-black text-xs text-center block shadow-xs"
                    >
                      Re-Calculate Travel Distance & Fares
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0] space-y-4">
              <RouteIcon className="w-10 h-10 text-[#F28C45] mx-auto" />
              <h3 className="text-xl font-bold text-[#123B5D]">No Planned Trips Saved</h3>
              <Link to="/travel-planner" className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] text-white font-bold text-xs">
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
                <div key={itin.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-[#EAF4FA] text-[#123B5D] text-xs font-bold border border-[#123B5D]/20">
                        {itin.durationDays} Days Plan
                      </span>
                      <span className="text-xs text-[#718096] font-mono">
                        Saved: {new Date(itin.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#123B5D]">{itin.title}</h3>
                    <p className="text-xs text-[#718096] font-medium">
                      Destination: <strong className="text-[#29445A]">{itin.destination}</strong> • Style: <strong className="text-[#29445A]">{itin.travelStyle}</strong> • Total Est: <strong className="text-[#123B5D] font-mono">₹{itin.totalEstimatedCost?.toLocaleString('en-IN')}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <Link
                      to={`/ai-planner?destination=${encodeURIComponent(itin.destination)}`}
                      className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#1D5D85] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FFB36B]" />
                      <span>View Full Plan</span>
                    </Link>

                    <button
                      onClick={() => removeItinerary(itin.id || itin._id)}
                      className="p-2.5 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer"
                      title="Remove Itinerary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EAF4FA] text-[#123B5D] flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8 text-[#F28C45]" />
              </div>
              <h3 className="text-xl font-bold text-[#123B5D]">No Saved Itineraries Yet</h3>
              <p className="text-xs sm:text-sm text-[#718096] max-w-sm mx-auto font-medium">
                Generate tailored day-wise travel plans using our AI Planner and click "Save Itinerary" to preserve them for your journey.
              </p>
              <Link
                to="/ai-planner"
                className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] text-white font-bold text-xs shadow-md shadow-[#F28C45]/25 cursor-pointer"
              >
                Launch AI Planner
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Bottom Call to Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Discover More Incredible Places Across India
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Explore 114+ hand-curated destinations, check out multi-modal routes, and let AI plan your dream vacation.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ai-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Launch AI Trip Planner</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
