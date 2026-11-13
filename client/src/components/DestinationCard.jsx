import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Sparkles, Heart, Clock, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// High-Definition fallback mapping for Indian destinations
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
  "manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
  "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
  "kashmir": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
  "kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
  "default": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
};

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, toggleFavorite, isAuthenticated } = useAuth();
  const destId = destination.id || destination._id;
  const isFav = favorites.some(fav => String(fav) === String(destination.id) || (destination._id && String(fav) === String(destination._id)));
  const [imgSrc, setImgSrc] = useState(destination.heroImage);

  // Sync state whenever destination changes
  useEffect(() => {
    setImgSrc(destination.heroImage);
  }, [destination.heroImage, destination.id, destination._id]);

  const handleImageError = () => {
    const matchedKey = Object.keys(fallbackImageMap).find(k => 
      destination.id?.toLowerCase().includes(k) || 
      destination.name?.toLowerCase().includes(k) || 
      destination.heroImage?.toLowerCase().includes(k)
    );
    setImgSrc(matchedKey ? fallbackImageMap[matchedKey] : fallbackImageMap.default);
  };

  const handleCardClick = () => {
    navigate(`/destination/${destId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-2xl overflow-hidden border border-[#E5EAF0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1.5 cursor-pointer"
    >
      {/* Destination Image Banner */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <img
          src={imgSrc || destination.heroImage}
          alt={destination.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/90 via-[#123B5D]/20 to-black/30"></div>

        {/* Top Badges Strip: Category & Ideal Duration */}
        <div className="absolute top-3 left-3 right-12 flex items-center justify-between gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#123B5D]/80 backdrop-blur-md text-white border border-white/20 shadow-xs truncate max-w-[180px]">
            {destination.category}
          </span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-[#123B5D] backdrop-blur-md flex items-center gap-1 shadow-xs shrink-0">
            <Clock className="w-3 h-3 text-[#F28C45]" />
            {destination.idealDuration || '2-3 Days'}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isAuthenticated) {
              navigate('/login', { state: { from: location.pathname + location.search } });
              return;
            }
            toggleFavorite(destId);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 cursor-pointer shadow-md ${
            isFav 
              ? 'bg-[#F28C45] text-white shadow-[#F28C45]/40' 
              : 'bg-black/50 text-white hover:text-[#F28C45] hover:bg-white border border-white/20'
          }`}
          title={isFav ? "Remove from favorites" : "Save to favorites"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
        </button>

        {/* Location & Title Overlay on Bottom of Image */}
        <div className="absolute bottom-3 left-3.5 right-3.5">
          <div className="flex items-center gap-1 text-[#FFB36B] text-[11px] font-bold mb-0.5">
            <MapPin className="w-3 h-3 text-[#FFB36B]" />
            <span>{destination.state} • {destination.zone} India</span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight line-clamp-1 drop-shadow-sm">
            {destination.name}
          </h3>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <p className="text-xs text-[#718096] line-clamp-2 leading-relaxed font-medium">
            {destination.description}
          </p>

          {/* Highlights Preview */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E5EAF0] space-y-1">
              <span className="text-[10px] font-bold text-[#1D5D85] uppercase tracking-wider block">
                Top Experience:
              </span>
              <p className="text-xs text-[#29445A] line-clamp-1 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F28C45] shrink-0"></span>
                <span>{destination.highlights[0]}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer: Price & Actions */}
        <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#718096] uppercase font-semibold block">Avg Daily Cost</span>
            <span className="text-sm sm:text-base font-black text-[#123B5D] flex items-center">
              ₹{destination.avgDailyExpense?.toLocaleString('en-IN') || 2200}
              <span className="text-[10px] font-normal text-[#718096] ml-1">/ person</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/destination/${destination.id}`);
              }}
              className="px-3 py-1.5 rounded-xl text-[#123B5D] bg-[#EAF4FA] hover:bg-[#d6e9f5] transition font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 text-[#1D5D85]" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/ai-planner?destination=${encodeURIComponent(destination.name)}`);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] shadow-xs cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI Plan</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
