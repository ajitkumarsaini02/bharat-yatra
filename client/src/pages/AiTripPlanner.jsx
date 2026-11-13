import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Download,
  Bookmark,
  Compass,
  CheckCircle2,
  Sun,
  Sunset,
  ShieldCheck,
  Utensils,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { destinationsData } from '../data/mockData';
import { downloadItineraryPDF } from '../utils/itineraryPdf';

// Helper functions for matching query parameters
const matchDestination = (param) => {
  if (!param) return 'Jaipur (The Pink City)';
  const p = param.trim().toLowerCase();
  const found = destinationsData.find(d => 
    d.name.toLowerCase() === p ||
    d.name.toLowerCase().includes(p) ||
    p.includes(d.name.toLowerCase()) ||
    (d.state && d.state.toLowerCase() === p)
  );
  return found ? found.name : param;
};

const getTravelerTypeFromCount = (count) => {
  if (!count) return 'Friends Group';
  const num = Number(count);
  if (num === 1) return 'Solo Traveler';
  if (num === 2) return 'Couples Retreat';
  if (num >= 3 && num <= 5) return 'Friends Group';
  return 'Family with Kids';
};

export default function AiTripPlanner() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('destination');
  const fromParam = searchParams.get('from') || searchParams.get('startingCity');
  const daysParam = searchParams.get('days') || searchParams.get('duration');
  const travelersParam = searchParams.get('travelers') || searchParams.get('travelersCount');
  const interestParam = searchParams.get('interest');

  const { saveItinerary } = useAuth();

  // Generator Configuration State with Auto-fill from URL parameters
  const [selectedDestination, setSelectedDestination] = useState(() => matchDestination(destParam));
  const [startingCity, setStartingCity] = useState(() => fromParam || 'New Delhi');
  const [daysCount, setDaysCount] = useState(() => daysParam ? Math.min(Math.max(Number(daysParam), 1), 14) : 3);
  const [travelerType, setTravelerType] = useState(() => getTravelerTypeFromCount(travelersParam));
  const [travelStyle, setTravelStyle] = useState('Moderate');
  const [selectedInterests, setSelectedInterests] = useState(() => {
    if (interestParam === 'Food') {
      return ['Food & Culinary Trail', 'Local Bazaars & Crafts'];
    }
    if (interestParam === 'Heritage') {
      return ['Heritage & Monuments', 'Photography & Views'];
    }
    return ['Heritage & Monuments', 'Food & Culinary Trail', 'Photography & Views'];
  });

  // Keep state in sync if URL search params change
  useEffect(() => {
    if (destParam) setSelectedDestination(matchDestination(destParam));
    if (fromParam) setStartingCity(fromParam);
    if (daysParam) setDaysCount(Math.min(Math.max(Number(daysParam), 1), 14));
    if (travelersParam) setTravelerType(getTravelerTypeFromCount(travelersParam));
  }, [destParam, fromParam, daysParam, travelersParam]);

  // Processing & Output
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [activeDayTab, setActiveDayTab] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  const interestOptions = [
    'Heritage & Monuments',
    'Spiritual & Temples',
    'Food & Culinary Trail',
    'Photography & Views',
    'Nature & Scenic Landscapes',
    'Beaches & Watersports',
    'Local Bazaars & Crafts',
    'Wellness & Ayurveda'
  ];

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setIsSaved(false);

    try {
      const res = await api.generateItinerary({
        destination: selectedDestination,
        startingCity,
        days: daysCount,
        travelerType,
        travelStyle,
        interests: selectedInterests
      });

      if (res.data) {
        setGeneratedItinerary(res.data);
        setActiveDayTab(1);
        
        // Trigger celebratory confetti effect
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) {}
      }
    } catch (error) {
      console.error('Error generating AI plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate on initial load
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleSaveToProfile = async () => {
    if (generatedItinerary) {
      await saveItinerary(generatedItinerary);
      setIsSaved(true);
    }
  };

  const handleDownloadPDF = () => {
    downloadItineraryPDF(generatedItinerary);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-[#FFB36B]" />
            <span>Next-Gen AI Travel Architect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Craft Your Perfect <span className="text-[#FFB36B]">Indian Itinerary</span> in Seconds
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
            Intelligent algorithmic travel planning customized to your travel group, pace, and interests. Includes hourly slots, verified restaurant stops, daily budget estimates, and 1-click PDF export.
          </p>
        </div>
      </div>

      {/* 4 Feature Highlight Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Hourly</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Timing</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Optimized Routes</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Utensils className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Authentic</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Culinary</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">State Specialties</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Accurate</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Budgets</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Itemized Forecast</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Download className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Offline</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">1-Click PDF</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Ready for Travel</div>
        </div>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E5EAF0] space-y-6">
        <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#F28C45]" />
          <span>Customize Your Journey Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Destination Selector */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Destination City
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#F28C45]"
            >
              {!destinationsData.some(d => d.name === selectedDestination) && (
                <option value={selectedDestination}>{selectedDestination}</option>
              )}
              {destinationsData.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Starting City */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Departing From
            </label>
            <input
              type="text"
              value={startingCity}
              onChange={(e) => setStartingCity(e.target.value)}
              placeholder="e.g. New Delhi, Mumbai, Bengaluru"
              className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#F28C45]"
            />
          </div>

          {/* Trip Duration */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Trip Duration ({daysCount} Days)
            </label>
            <div className="flex items-center space-x-2 pt-2">
              {[2, 3, 4, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDaysCount(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    daysCount === num
                      ? 'bg-[#123B5D] text-white shadow-xs'
                      : 'bg-[#F7F9FC] text-[#718096] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
                  }`}
                >
                  {num}D
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Persona */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Traveler Persona
            </label>
            <select
              value={travelerType}
              onChange={(e) => setTravelerType(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-[#F7F9FC] border border-[#E5EAF0] text-xs sm:text-sm font-bold text-[#29445A] outline-hidden focus:border-[#F28C45]"
            >
              <option value="Solo Traveler">Solo Explorer</option>
              <option value="Couples Retreat">Couples / Honeymoon</option>
              <option value="Family with Kids">Family with Kids & Elders</option>
              <option value="Friends Group">Friends Group</option>
            </select>
          </div>

        </div>

        {/* Budget Style & Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-[#E5EAF0]">
          
          {/* Travel Tier */}
          <div>
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Budget Style & Comfort
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Budget', 'Moderate', 'Luxury'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    travelStyle === style
                      ? 'bg-gradient-to-r from-[#F28C45] to-[#FFB36B] text-white font-extrabold shadow-xs'
                      : 'bg-[#F7F9FC] text-[#718096] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Pills */}
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block mb-2">
              Specific Trip Interests
            </label>
            <div className="flex flex-wrap gap-1.5">
              {interestOptions.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selected
                        ? 'bg-[#EAF4FA] border border-[#F28C45] text-[#123B5D] font-bold'
                        : 'bg-[#F7F9FC] border border-[#E5EAF0] text-[#718096] hover:bg-[#EAF4FA]'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-[#F28C45] to-[#FFB36B] hover:from-[#e0752f] hover:to-[#f29c4b] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-[#F28C45]/25 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>{isGenerating ? 'AI Crafting Plan...' : 'Generate AI Day-Wise Itinerary'}</span>
          </button>
        </div>

      </div>

      {/* Generated Itinerary Output */}
      {isGenerating ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5EAF0] space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-[#F28C45] border-t-transparent animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-[#123B5D]">Crafting Your Personalized Bharat Yatra...</h3>
          <p className="text-xs text-[#718096] max-w-sm mx-auto font-medium">
            Structuring sunrise viewings, authentic culinary meals, and transit buffers tailored for {selectedDestination}.
          </p>
        </div>
      ) : generatedItinerary && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Output Action Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#EAF4FA] text-[#123B5D] text-xs font-bold border border-[#123B5D]/20">
                  AI Verified Itinerary
                </span>
                <span className="text-xs text-[#718096] font-medium">
                  {generatedItinerary.durationDays} Days • {generatedItinerary.travelerType} • {generatedItinerary.travelStyle} Style
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight">
                {generatedItinerary.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleSaveToProfile}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border cursor-pointer ${
                  isSaved
                    ? 'bg-[#EAF4FA] text-[#123B5D] border-[#F28C45]'
                    : 'bg-[#F7F9FC] text-[#29445A] hover:bg-[#EAF4FA] border-[#E5EAF0]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#F28C45] text-[#F28C45]' : ''}`} />
                <span>{isSaved ? 'Saved to Profile' : 'Save Itinerary'}</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#1D5D85] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Cost Allocation Summary Card */}
          <div className="bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs text-[#FFB36B] uppercase font-bold tracking-wider">Total Estimated Expenses</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-0.5">
                  ₹{generatedItinerary.totalEstimatedCost?.toLocaleString('en-IN')}
                  <span className="text-xs text-[#EAF4FA]/80 font-sans font-normal ml-2">Total for {daysCount} Days</span>
                </div>
              </div>
              <div className="text-xs text-[#EAF4FA]/90 max-w-xs font-medium">
                Includes accommodation, intercity & local transit, authentic meals, and monument tickets.
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-[11px] text-[#EAF4FA]/80 block font-semibold">Stay & Hotels</span>
                <span className="text-base font-bold text-[#FFB36B] font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.stay?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-[11px] text-[#EAF4FA]/80 block font-semibold">Travel & Rail/Air</span>
                <span className="text-base font-bold text-amber-200 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.travel?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-[11px] text-[#EAF4FA]/80 block font-semibold">Meals & Dining</span>
                <span className="text-base font-bold text-emerald-300 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.food?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <span className="text-[11px] text-[#EAF4FA]/80 block font-semibold">Tickets & Entry</span>
                <span className="text-base font-bold text-rose-300 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.ticketsAndActivities?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-[#EAF4FA]/80 block font-semibold">Shopping & Buffer</span>
                <span className="text-base font-bold text-sky-300 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.shoppingAndBuffer?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Day-Wise Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {generatedItinerary.days?.map((day) => (
              <button
                key={day.day}
                onClick={() => setActiveDayTab(day.day)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeDayTab === day.day
                    ? 'bg-[#123B5D] text-white shadow-md font-bold'
                    : 'bg-white text-[#29445A] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
                }`}
              >
                Day {day.day} Overview
              </button>
            ))}
          </div>

          {/* Active Day Content */}
          {generatedItinerary.days?.filter(d => d.day === activeDayTab).map((day) => (
            <div key={day.day} className="space-y-6">
              
              {/* Day Theme Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF4FA] border border-[#123B5D]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#F28C45] tracking-wider">Day Theme</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#123B5D]">{day.theme}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#718096] tracking-wider">Daily Estimate</span>
                  <div className="text-sm sm:text-base font-black text-[#123B5D] font-mono">₹{day.dailyEstimatedCost}</div>
                </div>
              </div>

              {/* Time Slots Cards: Morning, Afternoon, Evening */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Morning Slot */}
                <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#123B5D] font-bold text-xs uppercase tracking-wider">
                      <Sun className="w-4 h-4 text-[#F28C45]" />
                      <span>Morning (Sunrise & Highlights)</span>
                    </div>

                    {day.morning?.map((slot, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#718096] font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#F28C45]" />
                          <span>{slot.time}</span>
                        </div>
                        <h5 className="font-bold text-[#123B5D] text-sm sm:text-base">{slot.title}</h5>
                        <p className="text-xs text-[#718096] leading-relaxed font-medium">{slot.description}</p>
                        {slot.insiderTip && (
                          <div className="p-2.5 rounded-xl bg-[#EAF4FA] text-[#123B5D] text-[11px] font-medium border border-[#123B5D]/15">
                            💡 <strong>Tip:</strong> {slot.insiderTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                    <span className="text-[#718096] font-medium">Activity Cost</span>
                    <strong className="text-[#123B5D] font-mono">₹{day.morning[0]?.estimatedCost || 200}</strong>
                  </div>
                </div>

                {/* Afternoon Slot */}
                <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#F28C45] font-bold text-xs uppercase tracking-wider">
                      <Utensils className="w-4 h-4 text-[#F28C45]" />
                      <span>Afternoon (Cuisine & Heritage)</span>
                    </div>

                    {day.afternoon?.map((slot, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#718096] font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#F28C45]" />
                          <span>{slot.time}</span>
                        </div>
                        <h5 className="font-bold text-[#123B5D] text-sm sm:text-base">{slot.title}</h5>
                        <p className="text-xs text-[#718096] leading-relaxed font-medium">{slot.description}</p>
                        {slot.insiderTip && (
                          <div className="p-2.5 rounded-xl bg-[#FFF5EE] text-[#29445A] text-[11px] font-medium border border-[#F28C45]/20">
                            💡 <strong>Tip:</strong> {slot.insiderTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                    <span className="text-[#718096] font-medium">Activity Cost</span>
                    <strong className="text-[#123B5D] font-mono">₹{day.afternoon[0]?.estimatedCost || 350}</strong>
                  </div>
                </div>

                {/* Evening Slot */}
                <div className="bg-white rounded-3xl p-6 border border-[#E5EAF0] shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-[#1D5D85] font-bold text-xs uppercase tracking-wider">
                      <Sunset className="w-4 h-4 text-[#1D5D85]" />
                      <span>Evening (Sunset & Leisure)</span>
                    </div>

                    {day.evening?.map((slot, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#718096] font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#F28C45]" />
                          <span>{slot.time}</span>
                        </div>
                        <h5 className="font-bold text-[#123B5D] text-sm sm:text-base">{slot.title}</h5>
                        <p className="text-xs text-[#718096] leading-relaxed font-medium">{slot.description}</p>
                        {slot.insiderTip && (
                          <div className="p-2.5 rounded-xl bg-[#EAF4FA] text-[#123B5D] text-[11px] font-medium border border-[#123B5D]/20">
                            💡 <strong>Tip:</strong> {slot.insiderTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#E5EAF0] flex items-center justify-between text-xs">
                    <span className="text-[#718096] font-medium">Activity Cost</span>
                    <strong className="text-[#123B5D] font-mono">₹{day.evening[0]?.estimatedCost || 200}</strong>
                  </div>
                </div>

              </div>

              {/* Day Meals Recommended */}
              {day.mealsSuggestion && (
                <div className="bg-[#EAF4FA] rounded-2xl p-5 border border-[#123B5D]/15 space-y-3">
                  <span className="text-xs font-bold text-[#123B5D] uppercase tracking-wider block">
                    Curated Culinary Stops for Day {day.day}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-[#E5EAF0]">
                      <strong className="text-[#123B5D] block mb-0.5">Breakfast:</strong>
                      <span className="text-[#718096]">{day.mealsSuggestion.breakfast}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E5EAF0]">
                      <strong className="text-[#F28C45] block mb-0.5">Lunch:</strong>
                      <span className="text-[#718096]">{day.mealsSuggestion.lunch}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-[#E5EAF0]">
                      <strong className="text-[#1D5D85] block mb-0.5">Dinner:</strong>
                      <span className="text-[#718096]">{day.mealsSuggestion.dinner}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}

          {/* Packing Checklist & Cultural Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Smart Packing Checklist</span>
              </h3>
              <div className="space-y-2">
                {generatedItinerary.packingChecklist?.map((item, i) => (
                  <label key={i} className="flex items-start gap-2.5 text-xs text-[#29445A] cursor-pointer p-2 rounded-xl hover:bg-[#F7F9FC]">
                    <input type="checkbox" defaultChecked={i < 2} className="mt-0.5 rounded text-[#F28C45]" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Local Guidelines & Cultural Etiquette */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5EAF0] shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#123B5D] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#123B5D]" />
                <span>Local Etiquette & Safety Tips</span>
              </h3>
              <ul className="space-y-2.5">
                {generatedItinerary.localTips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#718096]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F28C45] mt-1.5 flex-shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* Bottom Call to Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Need Live Transit & Transport Comparison?
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Compare Trains, Flights, Buses, and Outstation Cabs side-by-side with real-world distance estimates and tariffs.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to="/travel-planner"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>Explore Multi-Modal Transit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Browse All 114+ Destinations</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
