import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  ArrowRight, 
  UtensilsCrossed, 
  Route as RouteIcon, 
  Landmark, 
  Waves, 
  Mountain, 
  Trees, 
  Flame, 
  MapPin,
  Clock,
  CheckCircle2,
  Shield,
  Star,
  Users
} from 'lucide-react';
import HeroSection from '../components/HeroSection';
import DestinationCard from '../components/DestinationCard';
import InteractiveMap from '../components/InteractiveMap';
import { api } from '../services/api';
import { destinationsData } from '../data/mockData';

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await api.getDestinations();
        if (res.data && res.data.length > 0) {
          setDestinations(res.data);
        } else {
          setDestinations(destinationsData);
        }
      } catch (err) {
        setDestinations(destinationsData);
      }
      setLoading(false);
    };
    fetchDestinations();
  }, []);

  // 6 Required Core Explore Categories
  const exploreCategories = [
    {
      id: 'mountains',
      name: 'Mountains',
      desc: 'Himalayan peaks, scenic valleys & tea estates',
      icon: Mountain,
      query: 'Hill Stations & Tea Estates',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80',
      placesCount: '24+ Hill Stations'
    },
    {
      id: 'beaches',
      name: 'Beaches',
      desc: 'Golden coastal escapes, sunsets & azure waters',
      icon: Waves,
      query: 'Beaches & Coastal Escapes',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      placesCount: '18+ Coastlines'
    },
    {
      id: 'historical',
      name: 'Historical Places',
      desc: 'UNESCO citadels, royal palaces & ancient ruins',
      icon: Landmark,
      query: 'Historic Forts & Citadels',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
      placesCount: '42+ Monuments'
    },
    {
      id: 'temples',
      name: 'Temples',
      desc: 'Sacred sanctums, divine ghats & ancient carvings',
      icon: Flame,
      query: 'Temples & Spiritual Sites',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=600&q=80',
      placesCount: '30+ Holy Sites'
    },
    {
      id: 'adventure',
      name: 'Adventure',
      desc: 'River rafting, high passes, trekking & safaris',
      icon: Compass,
      query: 'Adventure & Himalayan Circuits',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
      placesCount: '15+ Trails'
    },
    {
      id: 'wildlife',
      name: 'Wildlife',
      desc: 'Royal Bengal tigers, national parks & reserves',
      icon: Trees,
      query: 'Wildlife & Tiger Reserves',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=600&q=80',
      placesCount: '12+ Sanctuaries'
    }
  ];

  // Exactly requested popular destinations: Jaipur, Agra, Manali, Goa, Varanasi, Kerala, Kashmir
  const targetPopularNames = ['Jaipur', 'Agra', 'Manali', 'Goa', 'Varanasi', 'Kerala', 'Kashmir', 'Amritsar'];

  const popularDestinations = targetPopularNames.map(name => {
    const found = destinations.find(d => 
      d.name.toLowerCase().includes(name.toLowerCase()) || 
      (d.state && d.state.toLowerCase().includes(name.toLowerCase()))
    );
    if (found) return found;

    // Fallback card if not in live MongoDB query yet
    const fallbackMap = {
      'Jaipur': { id: 'dest-amer-fort', name: 'Jaipur (The Pink City)', state: 'Rajasthan', zone: 'West', category: 'Historic Forts & Citadels', heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', description: 'Explore Hawa Mahal, Amer Fort, and vibrant bazaars.', avgDailyExpense: 2400, idealDuration: '3 Days' },
      'Agra': { id: 'dest-taj-mahal', name: 'Agra (City of the Taj)', state: 'Uttar Pradesh', zone: 'North', category: 'UNESCO World Heritage', heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', description: 'The timeless white-marble wonder of the world by the Yamuna River.', avgDailyExpense: 2200, idealDuration: '2 Days' },
      'Manali': { id: 'dest-manali', name: 'Manali & Solang Valley', state: 'Himachal Pradesh', zone: 'North', category: 'Hill Stations & Tea Estates', heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', description: 'Snowy peaks, apple orchards, and adventurous Rohtang Pass.', avgDailyExpense: 2600, idealDuration: '4 Days' },
      'Goa': { id: 'dest-goa-calangute', name: 'Goa (Beaches & Heritage)', state: 'Goa', zone: 'West', category: 'Beaches & Coastal Escapes', heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', description: 'Pristine coastal beaches, Portuguese architecture, and fresh seafood.', avgDailyExpense: 3200, idealDuration: '4 Days' },
      'Varanasi': { id: 'dest-varanasi-ghats', name: 'Varanasi (Kashi)', state: 'Uttar Pradesh', zone: 'North', category: 'Temples & Spiritual Sites', heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80', description: 'Centuries-old Ganga aarti, sacred ghats, and spiritual transcendence.', avgDailyExpense: 1800, idealDuration: '3 Days' },
      'Kerala': { id: 'dest-alleppey', name: 'Kerala (God\'s Own Country)', state: 'Kerala', zone: 'South', category: 'Beaches & Coastal Escapes', heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', description: 'Serene backwaters, emerald tea gardens of Munnar, and Ayurvedic wellness.', avgDailyExpense: 2800, idealDuration: '5 Days' },
      'Kashmir': { id: 'dest-kashmir-valley', name: 'Srinagar & Kashmir Valley', state: 'Jammu & Kashmir', zone: 'North', category: 'Adventure & Himalayan Circuits', heroImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', description: 'Dal Lake shikara rides, snow peaks of Gulmarg, and lush Mughal gardens.', avgDailyExpense: 3500, idealDuration: '5 Days' },
      'Amritsar': { id: 'dest-golden-temple', name: 'Amritsar (Golden Temple)', state: 'Punjab', zone: 'North', category: 'Temples & Spiritual Sites', heroImage: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80', description: 'The radiant Sri Harmandir Sahib, holy sarovar, and legendary hospitality.', avgDailyExpense: 1900, idealDuration: '2 Days' }
    };
    return fallbackMap[name] || destinations[0];
  }).filter(Boolean);

  // 4 Featured Travel Experiences
  const featuredExperiences = [
    {
      title: 'The Golden Triangle Heritage Odyssey',
      route: 'Delhi ➔ Agra ➔ Jaipur',
      duration: '4 Days / 3 Nights',
      price: '₹8,500',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
      description: 'Witness the Taj Mahal at sunrise, climb the ramparts of Amer Fort, and stroll the grand Mughal bazaars of Delhi.',
      tag: 'Most Popular'
    },
    {
      title: 'God\'s Own Country Backwaters & Tea Trails',
      route: 'Cochin ➔ Munnar ➔ Alleppey',
      duration: '5 Days / 4 Nights',
      price: '₹12,400',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      description: 'Cruise tranquil backwaters in a traditional thatched houseboat and breathe in fresh mist across endless tea slopes.',
      tag: 'Relaxation'
    },
    {
      title: 'Himalayan Serenity & Mountain Highs',
      route: 'Chandigarh ➔ Manali ➔ Solang',
      duration: '4 Days / 3 Nights',
      price: '₹9,800',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      description: 'Breathtaking cedar forests, snow-clad mountain passes, hot springs of Vashisht, and paragliding over Solang Valley.',
      tag: 'Adventure'
    },
    {
      title: 'Royal Rajasthan: Desert Forts & Havelis',
      route: 'Jaipur ➔ Jodhpur ➔ Udaipur',
      duration: '6 Days / 5 Nights',
      price: '₹15,200',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      description: 'Explore Lake Pichola palaces, the towering blue bastions of Mehrangarh, and golden sand dune folk nights.',
      tag: 'Royal Heritage'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <HeroSection destinations={destinations} />

      {/* 2. EXPLORE CATEGORIES (Mountains, Beaches, Historical Places, Temples, Adventure, Wildlife) */}
      <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E5EAF0]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
                Diverse Indian Landscapes
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight mt-0.5">
                Explore Categories
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-xs sm:text-sm font-bold text-[#123B5D] hover:text-[#F28C45] flex items-center gap-1 transition"
            >
              <span>View All 114+ Places</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {exploreCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/explore?category=${encodeURIComponent(cat.query)}`)}
                  className="group relative rounded-2xl overflow-hidden border border-[#E5EAF0] bg-[#F7F9FC] hover:border-[#F28C45] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="h-28 w-full overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/90 via-[#123B5D]/40 to-transparent"></div>
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-1.5 text-white">
                      <div className="w-6 h-6 rounded-lg bg-[#F28C45] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-extrabold truncate">{cat.name}</span>
                    </div>
                  </div>
                  <div className="p-2.5 text-center">
                    <span className="text-[11px] font-bold text-[#718096] block truncate">
                      {cat.placesCount}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. POPULAR DESTINATIONS (Jaipur, Agra, Manali, Goa, Varanasi, Kerala, Kashmir) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FA] text-[#123B5D] text-xs font-bold mb-1.5">
              <Star className="w-3.5 h-3.5 fill-[#F28C45] text-[#F28C45]" />
              <span>Handpicked Destinations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
              Popular Destinations
            </h2>
            <p className="text-sm text-[#718096] mt-1 max-w-xl font-medium">
              Discover the most cherished travel spots across India — from royal desert forts to tranquil backwaters and snowy Himalayan heights.
            </p>
          </div>

          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl border border-[#123B5D]/20 text-[#123B5D] hover:bg-[#EAF4FA] text-xs font-bold transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Explore All Destinations</span>
            <ArrowRight className="w-4 h-4 text-[#F28C45]" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest) => (
            <DestinationCard key={dest.id || dest.name} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED TRAVEL EXPERIENCES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
            Curated Journeys
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            Featured Travel Experiences
          </h2>
          <p className="text-sm text-[#718096] font-medium">
            Complete multi-city vacation routes designed by travel connoisseurs with realistic timing and verified costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredExperiences.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-[#E5EAF0] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/80 via-transparent to-transparent"></div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#F28C45] text-white shadow-xs">
                    {exp.tag}
                  </span>
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[11px] font-bold text-[#FFB36B] block">{exp.route}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-base font-extrabold text-[#123B5D] leading-snug line-clamp-2">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#718096] line-clamp-3 leading-relaxed font-medium">
                    {exp.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-3 border-t border-[#E5EAF0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#718096] block font-semibold">{exp.duration}</span>
                  <span className="text-sm font-black text-[#123B5D]">from {exp.price}</span>
                </div>

                <Link
                  to="/ai-planner"
                  className="px-3 py-1.5 rounded-xl bg-[#EAF4FA] hover:bg-[#F28C45] text-[#123B5D] hover:text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE BHARAT YATRA */}
      <section id="about-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#123B5D] to-[#1D5D85] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#F28C45]/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold text-[#FFB36B] uppercase tracking-widest block">
              About Bharat Yatra
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Why Choose Bharat Yatra
            </h2>
            <p className="text-sm text-[#EAF4FA]/80 font-medium">
              We bridge ancient cultural wonders with cutting-edge travel technology to make discovering India completely seamless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* Pillar 1: Easy Trip Planning */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#F28C45] flex items-center justify-center shadow-lg shadow-[#F28C45]/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Easy Trip Planning</h3>
              <p className="text-xs text-[#EAF4FA]/85 leading-relaxed font-medium">
                Tailor custom day-by-day itineraries in seconds using intelligent AI algorithms trained on Indian routes and monument opening hours.
              </p>
            </div>

            {/* Pillar 2: Discover Hidden Destinations */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB36B] flex items-center justify-center shadow-lg shadow-[#FFB36B]/30">
                <Compass className="w-6 h-6 text-[#123B5D]" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Discover Hidden Gems</h3>
              <p className="text-xs text-[#EAF4FA]/85 leading-relaxed font-medium">
                Unearth 114+ hand-curated destinations, from famous UNESCO wonders to remote living root bridges and serene coastal bays.
              </p>
            </div>

            {/* Pillar 3: Explore Indian Culture */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#F28C45] flex items-center justify-center shadow-lg shadow-[#F28C45]/30">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Explore Indian Culture</h3>
              <p className="text-xs text-[#EAF4FA]/85 leading-relaxed font-medium">
                Immerse yourself in regional state cuisines, legendary street foods, centuries-old festivals, and verified historical architectural lore.
              </p>
            </div>

            {/* Pillar 4: Personalized Travel Experiences */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3 hover:bg-white/15 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB36B] flex items-center justify-center shadow-lg shadow-[#FFB36B]/30">
                <RouteIcon className="w-6 h-6 text-[#123B5D]" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Personalized Travel</h3>
              <p className="text-xs text-[#EAF4FA]/85 leading-relaxed font-medium">
                Compare Trains, Intercity Buses, Flights, and Outstation Cabs side-by-side with transparent tariffs, realistic distances, and hotel estimates.
              </p>
            </div>

          </div>

          {/* Learn More CTA */}
          <div className="pt-8 text-center relative z-10">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Learn More About Our Mission & Story</span>
              <ArrowRight className="w-4 h-4 text-[#FFB36B]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE GIS TOURISM MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
              Geographic Navigation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#123B5D] tracking-tight mt-0.5">
              Interactive Tourism Map
            </h2>
            <p className="text-sm text-[#718096] font-medium mt-1 max-w-xl">
              Filter destinations across India's North, South, East, West, and North-East zones directly on interactive high-definition maps.
            </p>
          </div>

          <Link
            to="/map"
            className="px-5 py-2.5 rounded-xl bg-[#EAF4FA] text-[#123B5D] hover:bg-[#d6e9f5] font-bold text-xs transition flex items-center gap-2 self-start md:self-auto cursor-pointer border border-[#E5EAF0]"
          >
            <span>Open Fullscreen Map</span>
            <ArrowRight className="w-4 h-4 text-[#F28C45]" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E5EAF0] shadow-xl">
          <InteractiveMap destinations={destinations} />
        </div>
      </section>

      {/* 7. REGIONAL CUISINE BANNER STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5EAF0] shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FA] text-[#123B5D] text-xs font-bold">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#F28C45]" />
              <span>Taste of India</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight">
              Savor Authentic Indian Regional Flavors
            </h2>
            <p className="text-xs sm:text-sm text-[#718096] leading-relaxed font-medium">
              From Awadhi dum biryanis of Lucknow and Rajasthani Dal Baati Churma to coastal Malabar fish curries and legendary Amritsari kulchas. Explore verified iconic food joints across every Indian state.
            </p>
            <div className="pt-2">
              <Link
                to="/cuisine"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F28C45] hover:bg-[#e0752f] text-white text-xs font-extrabold shadow-md shadow-[#F28C45]/25 transition"
              >
                <span>Explore 50+ Regional Delicacies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden shadow-lg border border-[#E5EAF0] shrink-0 relative">
            <img
              src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
              alt="Indian Regional Cuisine"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#123B5D]/80 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs font-black text-white">Traditional Indian Thali & Delicacies</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Explore the Wonders of Bharat?
            </h2>
            <p className="text-xs sm:text-sm text-[#EAF4FA] font-medium leading-relaxed">
              Create your personalized day-by-day travel plan, discover verified historic monuments, and calculate accurate travel budgets in under two minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/ai-planner"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#F28C45]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Itinerary</span>
            </Link>

            <Link
              to="/travel-planner"
              className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <RouteIcon className="w-4 h-4 text-[#FFB36B]" />
              <span>Compare Travel Fares</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
