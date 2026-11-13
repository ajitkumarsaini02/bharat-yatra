import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Compass, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { destinationsData } from '../data/mockData';
import { api } from '../services/api';

export default function HeroSection({ destinations = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Initialize with ALL destinations from dataset
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

  // Sync with live data
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

  // Smooth Auto-advance background slideshow every 6 seconds
  useEffect(() => {
    if (!backgroundSlides || backgroundSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundSlides.length);
    }, 6000);
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

  const popularPills = [
    { label: 'Jaipur', query: 'Jaipur' },
    { label: 'Agra', query: 'Agra' },
    { label: 'Manali', query: 'Manali' },
    { label: 'Goa', query: 'Goa' },
    { label: 'Varanasi', query: 'Varanasi' },
    { label: 'Kerala', query: 'Kerala' },
    { label: 'Kashmir', query: 'Kashmir' }
  ];

  const currentBg = backgroundSlides[currentBgIndex] || backgroundSlides[0] || {
    url: "/monuments/taj-mahal.jpg",
    title: "Taj Mahal",
    state: "Uttar Pradesh",
    category: "UNESCO World Heritage"
  };

  return (
    <div className="relative overflow-hidden bg-[#123B5D] text-white min-h-[580px] lg:min-h-[660px] flex flex-col justify-center py-16 sm:py-20">
      
      {/* Background Slideshow Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {backgroundSlides.map((slide, index) => {
          const isActive = index === currentBgIndex;
          const isPrev = index === (currentBgIndex - 1 + backgroundSlides.length) % backgroundSlides.length;
          
          if (!isActive && !isPrev) return null;

          return (
            <div
              key={slide.url + index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-85 scale-105' : 'opacity-0 scale-100'
              } transition-transform duration-[8000ms]`}
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

        {/* Ocean Blue Gradient Overlay for High Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#123B5D]/75 via-[#123B5D]/60 to-[#123B5D]/95"></div>
      </div>

      {/* Subtle Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-[#FFB36B]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#F28C45]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Location Badge on Bottom Right */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs shadow-lg">
        <MapPin className="w-3.5 h-3.5 text-[#FFB36B]" />
        <span className="text-white font-semibold">{currentBg.title}</span>
        <span className="text-white/40">•</span>
        <span className="text-white/80">{currentBg.state}</span>
      </div>

      {/* Main Foreground Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center w-full my-auto space-y-6">
        
        {/* Sub-badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FFB36B]" />
          <span>Centralized Indian Tourism & AI Travel Platform</span>
        </div>

        {/* Exact Required Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.12] drop-shadow-md">
          Discover the Incredible Beauty of <span className="text-[#FFB36B] drop-shadow-sm">India</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base lg:text-lg text-[#EAF4FA] max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-xs">
          Explore India’s timeless culture, ancient heritage, majestic mountains, and sun-kissed beaches with intelligent AI trip planning and verified travel guides.
        </p>

        {/* Modern Clean Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-2xl bg-white p-2 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2 mt-2"
        >
          <div className="relative flex-1 w-full flex items-center pl-4 py-1">
            <Search className="w-5 h-5 text-[#1D5D85] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, monuments, hill stations (e.g. Jaipur, Manali, Goa)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[#29445A] placeholder-[#718096] text-xs sm:text-sm font-semibold outline-hidden py-1.5"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-[#F28C45]/30 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search</span>
          </button>
        </form>

        {/* Prominent CTA Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            to="/explore"
            className="px-6 py-3 rounded-xl sm:rounded-2xl bg-[#F28C45] hover:bg-[#e0752f] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#F28C45]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Destinations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/ai-planner"
            className="px-6 py-3 rounded-xl sm:rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FFB36B]" />
            <span>AI Trip Planner</span>
          </Link>
        </div>

        {/* Popular Destination Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-3">
          <span className="text-[#EAF4FA]/80 font-semibold text-xs">Popular Searches:</span>
          {popularPills.map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={() => navigate(`/explore?search=${encodeURIComponent(pill.query)}`)}
              className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
            >
              {pill.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
