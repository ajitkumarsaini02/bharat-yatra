import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  ArrowRight, 
  UtensilsCrossed, 
  Train, 
  Calculator, 
  Landmark, 
  Waves, 
  Mountain, 
  Trees, 
  Flame, 
  MapPin 
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import DestinationCard from '../components/DestinationCard';
import InteractiveMap from '../components/InteractiveMap';
import { api } from '../services/api';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      const res = await api.getDestinations();
      if (res.data) {
        setDestinations(res.data);
      }
      setLoading(false);
    };
    fetchDestinations();
  }, []);

  const categories = [
    { name: 'All', icon: Compass },
    { name: 'UNESCO World Heritage & Iconic Monuments', label: 'UNESCO & Monuments', icon: Landmark },
    { name: 'Historic Forts & Citadels', label: 'Forts & Citadels', icon: Landmark },
    { name: 'Temples & Spiritual Sites', label: 'Temples & Spiritual', icon: Flame },
    { name: 'Royal Palaces, Museums & Historical Sites', label: 'Palaces & Museums', icon: Sparkles },
    { name: 'Ancient Caves & Rock-Cut Sites', label: 'Ancient Caves', icon: Mountain },
    { name: 'Beaches & Coastal Escapes', label: 'Beaches & Coastal', icon: Waves },
    { name: 'Hill Stations & Tea Estates', label: 'Hill Stations', icon: Mountain },
    { name: 'Wildlife & Tiger Reserves', label: 'Wildlife & Tigers', icon: Trees },
    { name: 'Adventure & Himalayan Circuits', label: 'Adventure Circuits', icon: Sparkles },
    { name: 'Natural Wonders', label: 'Natural Wonders', icon: Waves }
  ];

  // Exact 8 Handpicked Iconic Destinations for Home Page
  const FEATURED_HOME_IDS = [
    'dest-taj-mahal',                  // Taj Mahal
    'dest-red-fort',                   // Red Fort (Lal Qila)
    'dest-amer-fort',                  // Amer Fort & Sheesh Mahal
    'dest-ajanta-caves',               // Ajanta Caves
    'dest-golden-temple',              // Golden Temple (Sri Harmandir Sahib)
    'dest-konark-sun-temple',          // Konark Sun Temple
    'dest-mysore-palace',              // Mysore Palace (Amba Vilas)
    'dest-beach-andaman-radhanagar'    // Radhanagar Beach, Havelock Island
  ];

  // Curated featured selection for Home Page
  const featuredDestinations = activeCategory === 'All'
    ? FEATURED_HOME_IDS.map(id => destinations.find(d => d.id === id)).filter(Boolean)
    : destinations.filter(d => d.category === activeCategory).slice(0, 8);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Section with Live API Background Slideshow */}
      <HeroSection destinations={destinations} />

      {/* 2. Platform Feature Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/10 dark:border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Landmark className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A192F] dark:text-white">Iconic Heritage Sites</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Forts, palaces, caves, temples & UNESCO wonders.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 dark:bg-slate-800 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <Waves className="w-5 h-5 text-cyan-700 dark:text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A192F] dark:text-white">Beaches & Hill Stations</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Goa, Andaman, Munnar, Manali, Ooty & Darjeeling.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Trees className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A192F] dark:text-white">Wildlife & Adventure</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Jim Corbett, Kaziranga, Ladakh, Spiti & Rishikesh.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0A192F] dark:text-white">Live GIS Mapping</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Interactive Leaflet maps with state coordinates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Handpicked Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] dark:text-white tracking-tight mt-1">
              Top Featured Destinations
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              Handpicked iconic monuments, sacred temples, historic citadels and scenic getaways.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'gradient-saffron text-slate-950 shadow-md font-bold'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50/70 dark:hover:bg-slate-800 border border-amber-900/10 dark:border-amber-500/20'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-amber-700/70 dark:text-amber-400'}`} />
                  <span>{cat.label || cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Destinations Grid (Handpicked 8 Cards) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-96 rounded-3xl bg-amber-100/40 dark:bg-slate-800/40 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}

        {/* Explore All Link Banner */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={activeCategory === 'All' ? '/explore' : `/explore?category=${encodeURIComponent(activeCategory)}`}
            className="px-8 py-3.5 rounded-2xl gradient-saffron text-slate-950 font-black text-sm hover:opacity-95 transition shadow-lg shadow-amber-500/20 flex items-center space-x-2.5 cursor-pointer"
          >
            <span>Explore All Destinations in Full Directory</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
      </section>

      {/* 4. AI Planner Interactive Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl gradient-royal p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-amber-400/20">
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Personalized Day-Wise Travel Itineraries in Seconds
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell our AI your origin city, travel companions, budget bracket, and pace preference. Receive hour-by-hour route blueprints, ticket booking links, and local travel hacks instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/ai-planner"
                className="px-7 py-3.5 rounded-2xl gradient-saffron text-slate-950 font-bold text-sm hover:opacity-95 transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
              >
                <span>Launch AI Trip Planner</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>

              <Link
                to="/budget-calculator"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/20 transition flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Estimate Budget</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Regional Cuisine & Transport Section Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Cuisine Card */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-2xl font-black text-[#0A192F] dark:text-white">Authentic Regional Flavors</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Explore local culinary specialties across Indian states — from Hyderabadi Biryani and Rajasthani Dal Baati Churma to Kashmiri Wazwan and Kerala Appam.
              </p>
            </div>
            <Link
              to="/cuisine"
              className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700"
            >
              <span>Explore Food Guides</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Transport Guide Card */}
          <div className="bg-white dark:bg-[#0F172A] rounded-3xl p-8 border border-amber-900/10 dark:border-amber-500/20 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center">
                <Train className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-2xl font-black text-[#0A192F] dark:text-white">Seamless Transit & Trains</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Navigate Vande Bharat expresses, Rajdhani circuits, nearest airport codes, state highway passes, and regional cab networks with ease.
              </p>
            </div>
            <Link
              to="/transport"
              className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700"
            >
              <span>View Transport Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 6. Interactive GIS Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[#0A192F] dark:text-white tracking-tight mt-2">
              Interactive Tourism Map
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              Click on any pin to inspect ticket fares, best visiting seasons, and nearby transit routes.
            </p>
          </div>
        </div>

        <div className="h-[480px] rounded-3xl overflow-hidden shadow-xl border border-amber-900/10 dark:border-amber-500/20">
          <InteractiveMap destinations={destinations} />
        </div>
      </section>

    </div>
  );
}
