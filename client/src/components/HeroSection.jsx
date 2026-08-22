import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Compass } from 'lucide-react';
import { destinationsData } from '../data/mockData';
import { api } from '../services/api';

export default function HeroSection({ destinations = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Initialize with ALL destinations from the comprehensive dataset
  const [backgroundSlides, setBackgroundSlides] = useState(() => {
    const list = destinations.length > 0 ? destinations : destinationsData;
    return list.map(d => ({
      url: d.heroImage,
      title: d.name,
      state: d.state,
      category: d.category
    }));
  });

  const navigate = useNavigate();

  // Sync when live destinations prop or API updates
  useEffect(() => {
    if (destinations && destinations.length > 0) {
      setBackgroundSlides(destinations.map(d => ({
        url: d.heroImage,
        title: d.name,
        state: d.state,
        category: d.category
      })));
    } else {
      const loadApiSlides = async () => {
        try {
          const res = await api.getDestinations();
          if (res.data && res.data.length > 0) {
            setBackgroundSlides(res.data.map(d => ({
              url: d.heroImage,
              title: d.name,
              state: d.state,
              category: d.category
            })));
          }
        } catch (err) {
          console.warn('API hero load fallback:', err.message);
        }
      };
      loadApiSlides();
    }
  }, [destinations]);

  // Smooth Auto-advance background slideshow across all destinations every 5 seconds
  useEffect(() => {
    if (!backgroundSlides || backgroundSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundSlides.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const trendingPills = [
    { label: 'Taj Mahal', query: 'Taj Mahal' },
    { label: 'Amer Fort', query: 'Amer Fort' },
    { label: 'Red Fort', query: 'Delhi' },
    { label: 'Hampi Chariot', query: 'Hampi' },
    { label: 'Golden Temple', query: 'Amritsar' },
    { label: 'Charminar', query: 'Hyderabad' },
    { label: 'Konark Sun Temple', query: 'Konark' },
    { label: 'Victoria Memorial', query: 'Kolkata' }
  ];

  const currentBg = backgroundSlides[currentBgIndex] || backgroundSlides[0] || {
    url: "/monuments/taj-mahal.jpg",
    title: "Taj Mahal (Crown of Palaces)",
    state: "Uttar Pradesh",
    category: "UNESCO World Heritage & Iconic Monuments"
  };

  return (
    <div className="relative overflow-hidden bg-[#0A192F] text-white min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] max-h-[920px] flex flex-col justify-center py-4 sm:py-6">
      
      {/* Dynamic Auto-Scrolling Background Slideshow across ALL destinations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundSlides.map((slide, index) => {
          const isActive = index === currentBgIndex;
          const isPrev = index === (currentBgIndex - 1 + backgroundSlides.length) % backgroundSlides.length;
          
          if (!isActive && !isPrev) return null;

          return (
            <div
              key={slide.url + index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-70 scale-105' : 'opacity-0 scale-100'
              } transition-transform duration-[7000ms]`}
            >
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80";
                }}
              />
            </div>
          );
        })}

        {/* Balanced Navy Vignette Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020C1B]/80 via-[#0A192F]/50 to-[#0A192F]/95"></div>
      </div>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Background Current Location Tag Indicator (Bottom Right) */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-amber-400/30 text-xs shadow-lg animate-fade-in">
        <MapPin className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-white font-medium">{currentBg.title}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/25 text-amber-200 border border-amber-400/40 font-semibold">
          {currentBg.category}
        </span>
      </div>

      {/* Main Foreground Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full my-auto">
        
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white max-w-3xl leading-[1.15] drop-shadow-md">
          Explore the Timeless Magic of <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">Incredible Bharat</span>
        </h1>

        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base text-slate-200 max-w-xl font-medium leading-relaxed drop-shadow-xs">
          The centralized AI-powered tourism discovery platform. Tailor day-wise travel itineraries, estimate realistic travel budgets, and unearth local culinary secrets across India.
        </p>

        {/* Search & Action Bar */}
        <form 
          onSubmit={handleSearch}
          className="mt-4 sm:mt-5 w-full max-w-2xl glass-royal p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-amber-400/40 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="relative flex-1 w-full flex items-center pl-3 sm:pl-4">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search monuments, states, beaches (e.g. Taj Mahal, Amer Fort, Hampi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-white placeholder-slate-300 text-xs sm:text-sm outline-hidden py-2 sm:py-2.5 font-medium"
            />
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl gradient-saffron text-slate-950 font-black text-xs sm:text-sm hover:opacity-95 transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-950" />
              <span>Explore</span>
            </button>
          </div>
        </form>

        {/* Trending Quick Pills */}
        <div className="mt-3 sm:mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-amber-200 font-semibold drop-shadow-xs text-[11px] sm:text-xs">Trending Destinations:</span>
          {trendingPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => navigate(`/explore?search=${encodeURIComponent(pill.query)}`)}
              className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-amber-400/30 text-amber-100 hover:bg-white/20 hover:text-white transition font-medium text-[11px] sm:text-xs cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-3xl">
          <div className="glass-royal p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 block">All-India</span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-0.5 block font-medium">Tourism Directory</span>
          </div>
          <div className="glass-royal p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-extrabold text-yellow-300 block">AI Planner</span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-0.5 block font-medium">Day-Wise Tailored Routes</span>
          </div>
          <div className="glass-royal p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-extrabold text-amber-300 block">Smart Budget</span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-0.5 block font-medium">Category-Wise Breakdown</span>
          </div>
          <div className="glass-royal p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-amber-400/30 text-center backdrop-blur-md">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 block">100% Free</span>
            <span className="text-[11px] sm:text-xs text-slate-300 mt-0.5 block font-medium">Open Community Platform</span>
          </div>
        </div>

      </div>
    </div>
  );
}
