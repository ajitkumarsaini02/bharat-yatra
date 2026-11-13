import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Award, 
  Heart, 
  Route as RouteIcon, 
  UtensilsCrossed, 
  Calendar, 
  ArrowRight, 
  Globe, 
  Building2, 
  CheckCircle2,
  Landmark,
  Compass as NavCompass,
  Train,
  Camera
} from 'lucide-react';

export default function AboutUs() {
  const stats = [
    { label: 'Curated Destinations', value: '114+', desc: 'Handpicked across all zones', icon: Landmark },
    { label: 'States & Union Territories', value: '28 & 8', desc: '100% Pan-India coverage', icon: Globe },
    { label: 'Iconic Regional Cuisines', value: '50+', desc: 'Authentic food trails & stalls', icon: UtensilsCrossed },
    { label: 'Verified Monuments', value: '350+', desc: 'Archaeological & UNESCO sites', icon: Camera }
  ];

  const pillars = [
    {
      title: 'Intelligent AI Trip Planning',
      desc: 'Our AI engine understands monument operating hours, prayer timings, peak tourist seasons, and realistic intercity transit durations to craft day-by-day itineraries tailored to your pace.',
      icon: Sparkles,
      color: 'bg-[#F28C45]'
    },
    {
      title: 'Multi-Modal Transit Intelligence',
      desc: 'Transparent comparisons across Indian Railways (IRCTC trains), Interstate AC Sleeper buses, direct flights, and outstation cabs with realistic fares, travel hours, and route tracking.',
      icon: Train,
      color: 'bg-[#123B5D]'
    },
    {
      title: 'Zero Hidden Cost Budgeting',
      desc: 'Predict accurate travel budgets before you pack your bags. From heritage entry passes and local auto tariffs to heritage stays and regional thalis, get realistic expense breakdowns.',
      icon: RouteIcon,
      color: 'bg-[#1D5D85]'
    },
    {
      title: 'Interactive GIS Heritage Explorer',
      desc: 'Visualize monuments, hill circuits, coastal drives, and national parks on interactive high-definition maps with GPS coordinates and live zone-based filters.',
      icon: NavCompass,
      color: 'bg-[#F28C45]'
    }
  ];

  const values = [
    {
      title: 'Authenticity & Cultural Reverence',
      desc: 'We honor the deep history and diverse sacred traditions of India by working with local lore, historical facts, and verified travel guidelines.',
      icon: Heart
    },
    {
      title: 'Sustainable & Responsible Tourism',
      desc: 'Encouraging mindful travel that supports local village artisans, regional eateries, eco-sensitive sanctuaries, and ancient heritage preservation.',
      icon: ShieldCheck
    },
    {
      title: 'Empowering Independent Travelers',
      desc: 'Democratizing travel information so anyone — solo explorers, families, or international travelers — can traverse India with complete confidence.',
      icon: Users
    },
    {
      title: 'Uncompromised Transparency',
      desc: 'No paid destination biases, no hidden platform commissions, and zero inflated tariffs. Just honest, accurate travel guidance.',
      icon: Award
    }
  ];

  return (
    <div className="space-y-16 py-8 sm:py-12">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F28C45]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#F28C45]" />
              <span>About Bharat Yatra Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Celebrating the Living Soul & Heritage of <span className="text-[#FFB36B]">Incredible India</span>
            </h1>

            <p className="text-sm sm:text-base text-[#EAF4FA]/90 leading-relaxed font-medium pt-2">
              Bharat Yatra was conceived with a single bold mission: to build India’s most comprehensive, culturally authentic, and technologically intelligent travel planning platform. From the snowy crests of the Himalayas to the tranquil backwaters of Kerala, we guide travelers through thousands of years of living culture.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/explore"
                className="px-6 py-3 rounded-xl bg-[#F28C45] hover:bg-[#e0752f] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#F28C45]/30 hover:scale-105 active:scale-95 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Explore 114+ Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-planner"
                className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFB36B]" />
                <span>Try AI Trip Planner</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUMERICAL IMPACT STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-black text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                    {s.value}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] text-[#123B5D] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#F28C45]" />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-[#123B5D]">{s.label}</h4>
                <p className="text-xs text-[#718096] font-medium">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. OUR STORY & VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
                Our Genesis & Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#123B5D] tracking-tight mt-1">
                Why We Built Bharat Yatra
              </h2>
            </div>

            <p className="text-sm text-[#718096] leading-relaxed font-medium">
              India is not just a destination; it is an ancient tapestry of languages, architectures, sacred traditions, cuisines, and geographies. Yet for decades, domestic and international travelers faced fragmented booking engines, generic recommendations, and confusing transport itineraries.
            </p>

            <p className="text-sm text-[#718096] leading-relaxed font-medium">
              We asked ourselves: <em>What if an intelligent platform could seamlessly bridge centuries-old heritage lore with modern AI planning, transparent Indian Railways timetable integration, verified road distances, and honest daily expenditure breakdowns?</em>
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Hand-curated knowledge verified from state tourism boards and ASI records.',
                'Real-time transport intelligence spanning Trains, Flights, Buses, and Outstation Cabs.',
                'Day-wise AI itinerary crafting tailored to budget, family size, and pace.',
                'Authentic local street food & regional cuisine curation across every state.'
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#29445A] font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#F28C45] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xl space-y-6 relative overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden aspect-video shadow-md">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80"
                alt="Taj Mahal Agra"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#FFB36B] tracking-wider block">UNESCO Heritage Circuit</span>
                  <h3 className="text-lg font-black text-white">Taj Mahal & Agra Fort Heritage Circuit</h3>
                  <p className="text-xs text-[#EAF4FA]/80">Curated travel intelligence with realistic travel hours and verified entry guidance.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5EAF0]">
              <div className="p-3.5 rounded-xl bg-[#EAF4FA] space-y-1">
                <span className="text-[10px] font-bold text-[#718096] uppercase block">Mission</span>
                <p className="text-xs font-black text-[#123B5D]">Frictionless Indian Travel</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#EAF4FA] space-y-1">
                <span className="text-[10px] font-bold text-[#718096] uppercase block">Coverage</span>
                <p className="text-xs font-black text-[#123B5D]">Kashmir to Kanyakumari</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FOUR CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
            What Sets Us Apart
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            Our Core Technology & Travel Pillars
          </h2>
          <p className="text-xs sm:text-sm text-[#718096] font-medium">
            Designed specifically for the nuances of Indian geography, multi-modal transport, and seasonal climates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${pillar.color} text-white flex items-center justify-center shadow-md shadow-[#123B5D]/15`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-[#123B5D] group-hover:text-[#F28C45] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#718096] leading-relaxed font-medium">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. OUR CORE VALUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#F28C45] uppercase tracking-widest block">
            Ethos & Integrity
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#123B5D] tracking-tight">
            Values That Guide Every Recommendation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EAF4FA] text-[#123B5D] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#F28C45]" />
                </div>
                <h4 className="text-sm font-bold text-[#123B5D]">{val.title}</h4>
                <p className="text-xs text-[#718096] leading-relaxed font-medium">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Explore India Like Never Before?
            </h2>
            <p className="text-xs sm:text-sm text-[#EAF4FA] font-medium leading-relaxed">
              Plan your next journey with verified historical details, smart day-wise itineraries, and transparent multi-modal transit comparisons.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/ai-planner"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-[#F28C45]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Free AI Itinerary</span>
            </Link>

            <Link
              to="/explore"
              className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-[#FFB36B]" />
              <span>Browse Destinations</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

