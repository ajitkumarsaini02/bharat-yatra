import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Star, Search, Layers, Compass, ExternalLink, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { destinationsData as fallbackDestinations } from '../data/mockData';

// Custom Pin Generator with Category-Themed Glowing Badges
const createCustomIcon = (category) => {
  let bgColor = '#D97706'; // Saffron Amber
  const c = (category || '').toLowerCase();
  if (c.includes('temple') || c.includes('spiritual') || c.includes('mandir')) bgColor = '#EA580C'; // Deep Saffron
  else if (c.includes('fort') || c.includes('qila')) bgColor = '#BE123C'; // Ruby Rose
  else if (c.includes('palace') || c.includes('mahal') || c.includes('museum')) bgColor = '#7C3AED'; // Royal Purple
  else if (c.includes('cave') || c.includes('stone')) bgColor = '#78716C'; // Ancient Stone
  else if (c.includes('beach') || c.includes('coastal') || c.includes('sea')) bgColor = '#0284C7'; // Ocean Blue
  else if (c.includes('hill') || c.includes('tea') || c.includes('ghats')) bgColor = '#059669'; // Emerald Green
  else if (c.includes('wildlife') || c.includes('tiger') || c.includes('park')) bgColor = '#CA8A04'; // Jungle Gold
  else if (c.includes('unesco') || c.includes('monument')) bgColor = '#E11D48'; // UNESCO Crimson
  else bgColor = '#B45309';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${bgColor};
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2.5px solid #FFFFFF;
        box-shadow: 0 4px 14px rgba(10,25,47,0.45);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        <div style="
          width: 11px;
          height: 11px;
          background: #FEF08A;
          border-radius: 50%;
          transform: rotate(45deg);
          box-shadow: 0 0 6px rgba(254, 240, 138, 0.9);
        "></div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

// Map Layer Tile Providers
const MAP_LAYERS = {
  voyager: {
    name: 'Voyager (Vibrant)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap'
  },
  standard: {
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  dark: {
    name: 'Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap'
  },
  satellite: {
    name: 'Satellite HD',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &copy; Earthstar Geographics'
  }
};

// Helper component to center map smoothly
function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 6, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({ destinations: initialDestinations }) {
  const [destinations, setDestinations] = useState(initialDestinations || []);
  const [loading, setLoading] = useState(!initialDestinations || initialDestinations.length === 0);
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTileLayer, setActiveTileLayer] = useState('voyager');
  const [mapCenter, setMapCenter] = useState([22.9734, 78.6569]); // Center of India
  const [mapZoom, setMapZoom] = useState(5);

  // Fetch live destinations from MongoDB if not passed as prop
  useEffect(() => {
    if (!initialDestinations || initialDestinations.length === 0) {
      const fetchDestinations = async () => {
        setLoading(true);
        try {
          const res = await api.getDestinations();
          if (res.data && res.data.length > 0) {
            setDestinations(res.data);
          } else {
            setDestinations(fallbackDestinations);
          }
        } catch (err) {
          setDestinations(fallbackDestinations);
        } finally {
          setLoading(false);
        }
      };
      fetchDestinations();
    } else {
      setDestinations(initialDestinations);
      setLoading(false);
    }
  }, [initialDestinations]);

  const zones = ['All', 'North', 'South', 'West', 'East', 'North-East'];
  const categories = [
    'All',
    'UNESCO World Heritage & Iconic Monuments',
    'Spiritual & Holy Pilgrimages',
    'Hill Stations & Tea Estates',
    'Forts & Royal Palaces',
    'Beaches & Coastal Wonders',
    'Wildlife Sanctuaries & National Parks'
  ];

  // Normalized destinations with valid coordinates
  const validDestinations = useMemo(() => {
    return (destinations || []).map(dest => {
      let lat = dest.coordinates?.lat || dest.lat;
      let lng = dest.coordinates?.lng || dest.lng;

      if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
        lat = 22.9734;
        lng = 78.6569;
      }

      return {
        ...dest,
        normalizedLat: Number(lat),
        normalizedLng: Number(lng)
      };
    });
  }, [destinations]);

  // Filtered destinations based on Search, Zone, and Category
  const filtered = useMemo(() => {
    return validDestinations.filter(d => {
      const matchZone = selectedZone === 'All' || (d.zone || '').toLowerCase() === selectedZone.toLowerCase();
      const matchCategory = selectedCategory === 'All' || (d.category || '').toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory.toLowerCase().includes((d.category || '').toLowerCase());
      const matchSearch = !searchQuery.trim() || 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (d.state || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.category || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchZone && matchCategory && matchSearch;
    });
  }, [validDestinations, selectedZone, selectedCategory, searchQuery]);

  const handleSelectMonument = (dest) => {
    setMapCenter([dest.normalizedLat, dest.normalizedLng]);
    setMapZoom(11);
  };

  const handleResetView = () => {
    setMapCenter([22.9734, 78.6569]);
    setMapZoom(5);
    setSelectedZone('All');
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div className="w-full bg-white dark:bg-[#0C1526] rounded-3xl border border-amber-900/10 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-colors">
      
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-6 bg-[#0A192F] text-white flex flex-col gap-4 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 text-white tracking-tight">
              <MapPin className="w-6 h-6 text-amber-400" />
              <span>Interactive GIS Heritage Explorer</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-400/30">
                {filtered.length} Live Monuments
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Explore geotagged monuments, sacred temples, beaches, and national parks across all 28 states of India.
            </p>
          </div>

          {/* Search Input & Reset */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monument, temple, city..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 text-xs text-slate-100 placeholder-slate-400 border border-slate-700 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleResetView}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center gap-1 border border-slate-700 cursor-pointer"
              title="Reset Map to All India"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Rows: Zone & Tile Layer Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2 border-t border-slate-800">
          
          {/* Zone Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-amber-400/80 mr-1 uppercase">Zone:</span>
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                  selectedZone === zone 
                    ? 'gradient-saffron text-slate-950 shadow-sm' 
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
            <Layers className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
            <span className="text-[11px] font-bold text-slate-300 pr-1">Layer:</span>
            {Object.keys(MAP_LAYERS).map((layerKey) => (
              <button
                key={layerKey}
                onClick={() => setActiveTileLayer(layerKey)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                  activeTileLayer === layerKey
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {MAP_LAYERS[layerKey].name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Map Canvas */}
      <div className="h-[560px] w-full relative z-10">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 text-white space-y-3">
            <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-amber-300">Loading All-India Geocoded Monuments...</p>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <MapViewController center={mapCenter} zoom={mapZoom} />

            <TileLayer
              attribution={MAP_LAYERS[activeTileLayer].attribution}
              url={MAP_LAYERS[activeTileLayer].url}
            />

            {filtered.map((dest) => (
              <Marker
                key={dest.id || dest._id}
                position={[dest.normalizedLat, dest.normalizedLng]}
                icon={createCustomIcon(dest.category)}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="w-64 p-1 space-y-2">
                    <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={dest.heroImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/80 text-amber-300 backdrop-blur-xs border border-amber-400/30">
                        {dest.category?.split('&')[0] || 'Monument'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-[#0A192F] text-sm line-clamp-1">{dest.name}</h4>
                      <span className="flex items-center text-amber-600 font-bold text-xs flex-shrink-0">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                        {dest.rating || 4.8}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-semibold">
                      <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      <span>{dest.state} • {dest.zone} India</span>
                    </div>

                    <p className="text-[11px] text-slate-700 line-clamp-2 leading-tight">
                      {dest.tagline || dest.description}
                    </p>

                    <div className="pt-2 border-t border-amber-100 flex items-center gap-2">
                      <Link
                        to={`/destination/${dest.id || dest._id}`}
                        className="flex-1 py-1.5 bg-[#0A192F] hover:bg-[#020C1B] text-amber-300 text-xs font-bold text-center rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link
                        to={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}
                        className="px-3 py-1.5 gradient-saffron text-slate-950 text-xs font-black rounded-xl flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-slate-950" />
                        <span>Plan</span>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Bottom Quick Ticker with Click-to-Center */}
      {filtered.length > 0 && (
        <div className="p-3 bg-slate-900 border-t border-slate-800 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex-shrink-0 px-2">Quick Jump:</span>
          {filtered.slice(0, 8).map((dest) => (
            <button
              key={dest.id || dest._id}
              onClick={() => handleSelectMonument(dest)}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 font-semibold whitespace-nowrap transition cursor-pointer border border-slate-700/60"
            >
              {dest.name}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
