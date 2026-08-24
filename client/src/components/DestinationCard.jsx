import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, Heart, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// HD Internet Fallback Map for crystal-clear tourism imagery
const fallbackImageMap = {
  "taj-mahal": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
  "amer-fort": "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
  "hawa-mahal": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
  "red-fort": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
  "golden-temple": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
  "qutub-minar": "https://images.unsplash.com/photo-1545129139-1beb780cf337?auto=format&fit=crop&w=1200&q=80",
  "india-gate": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
  "charminar": "https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80",
  "victoria-memorial": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
  "gateway-of-india": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
  "konark-sun-temple": "https://images.unsplash.com/photo-1600100397608-f010f443b74a?auto=format&fit=crop&w=1200&q=80",
  "meenakshi-amman-temple": "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80",
  "stone-chariot-hampi": "https://images.unsplash.com/photo-1600100397608-f4639be5b9d5?auto=format&fit=crop&w=1200&q=80",
  "city-palace-udaipur": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80",
  "kedarnath-temple": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
  "default": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
};

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAuth();
  const destId = destination.id || destination._id;
  const isFav = favorites.some(fav => String(fav) === String(destination.id) || (destination._id && String(fav) === String(destination._id)));
  const [imgSrc, setImgSrc] = useState(destination.heroImage);

  // Sync state whenever destination changes
  useEffect(() => {
    setImgSrc(destination.heroImage);
  }, [destination.heroImage, destination.id, destination._id]);

  const handleImageError = () => {
    const matchedKey = Object.keys(fallbackImageMap).find(k => destination.id?.includes(k) || destination.heroImage?.includes(k));
    setImgSrc(matchedKey ? fallbackImageMap[matchedKey] : fallbackImageMap.default);
  };

  const handleCardClick = (e) => {
    navigate(`/destination/${destId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white dark:bg-[#0C1526] rounded-3xl overflow-hidden border border-amber-900/10 dark:border-amber-500/25 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
        <img
          src={imgSrc || destination.heroImage}
          alt={destination.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/95 via-[#0A192F]/20 to-black/35"></div>

        {/* Unified Luxury Category Badge & Duration (Top Left/Right) */}
        <div className="absolute top-3.5 left-3.5 right-14 flex items-center justify-between gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/40 shadow-md truncate max-w-[190px]">
            {destination.category}
          </span>
          <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-black/85 text-amber-300 backdrop-blur-md flex items-center gap-1 border border-amber-400/40 shadow-md flex-shrink-0">
            <Clock className="w-3 h-3 text-amber-400" />
            {destination.idealDuration || '3 Days'}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(destId);
          }}
          className={`absolute top-3.5 right-3.5 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 cursor-pointer shadow-lg ${
            isFav 
              ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-rose-500/50 border border-rose-300/40' 
              : 'bg-black/75 text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/30'
          }`}
          title={isFav ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : 'fill-rose-500/20'}`} />
        </button>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-4 right-4">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-0.5 drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{destination.state} • {destination.zone} India</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight line-clamp-1 drop-shadow-md">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-medium">
            {destination.description}
          </p>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="mt-3 space-y-1.5 border-t border-amber-100/60 dark:border-slate-800 pt-3">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Top Experiences:</span>
              <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-1 font-medium">
                {destination.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                    <span className="truncate">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-amber-100/60 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-800/70 dark:text-amber-400 uppercase font-bold block">Avg Daily Cost</span>
            <span className="text-base font-extrabold text-[#0A192F] dark:text-white flex items-center">
              ₹{destination.avgDailyExpense?.toLocaleString('en-IN') || 2000}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">/ person</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/destination/${destination.id}`);
              }}
              className="px-3.5 py-2 rounded-xl text-slate-800 dark:text-slate-100 bg-amber-50 dark:bg-slate-800/90 hover:bg-amber-100 dark:hover:bg-slate-700 transition font-bold text-xs flex items-center gap-1 border border-amber-200/60 dark:border-amber-500/30 cursor-pointer shadow-xs"
              title="View Details"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ai-planner?destination=${encodeURIComponent(destination.name)}`);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 gradient-saffron hover:opacity-95 transition flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>AI Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
