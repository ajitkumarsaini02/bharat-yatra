import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Printer, 
  Bookmark, 
  Compass, 
  CheckCircle2, 
  Sun, 
  Sunset, 
  ShieldCheck, 
  Utensils
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { destinationsData } from '../data/mockData';

export default function AiTripPlanner() {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || 'Jaipur (The Pink City)';

  const { saveItinerary } = useAuth();

  // Generator Configuration State
  const [selectedDestination, setSelectedDestination] = useState(initialDest);
  const [startingCity, setStartingCity] = useState('New Delhi');
  const [daysCount, setDaysCount] = useState(3);
  const [travelerType, setTravelerType] = useState('Friends Group');
  const [travelStyle, setTravelStyle] = useState('Moderate');
  const [selectedInterests, setSelectedInterests] = useState(['Heritage & Monuments', 'Food & Culinary Trail', 'Photography']);

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

  const handleSaveToProfile = () => {
    if (generatedItinerary) {
      saveItinerary(generatedItinerary);
      setIsSaved(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Personalized Indian Journey Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Tailor customized day-by-day itineraries with optimal timing, regional food spots, budget allocation, and cultural guidelines.
        </p>
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/10 space-y-6">
        <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-700" />
          <span>Customize Your Journey Preferences</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Destination Selector */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Destination City
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs sm:text-sm font-bold text-[#0A192F] outline-hidden focus:border-amber-600"
            >
              {destinationsData.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Starting City */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Departing From
            </label>
            <input
              type="text"
              value={startingCity}
              onChange={(e) => setStartingCity(e.target.value)}
              placeholder="e.g. New Delhi, Mumbai, Bengaluru"
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs sm:text-sm font-bold text-[#0A192F] outline-hidden focus:border-amber-600"
            />
          </div>

          {/* Trip Duration */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Trip Duration ({daysCount} Days)
            </label>
            <div className="flex items-center space-x-2 pt-2">
              {[2, 3, 4, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setDaysCount(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                    daysCount === num
                      ? 'bg-[#0A192F] text-amber-300 shadow-xs'
                      : 'bg-amber-50/60 text-slate-700 hover:bg-amber-100/60 border border-amber-200/60'
                  }`}
                >
                  {num}D
                </button>
              ))}
            </div>
          </div>

          {/* Traveler Persona */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Traveler Persona
            </label>
            <select
              value={travelerType}
              onChange={(e) => setTravelerType(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 text-xs sm:text-sm font-bold text-[#0A192F] outline-hidden focus:border-amber-600"
            >
              <option value="Solo Traveler">Solo Explorer</option>
              <option value="Couples Retreat">Couples / Honeymoon</option>
              <option value="Family with Kids">Family with Kids & Elders</option>
              <option value="Friends Group">Friends Group</option>
            </select>
          </div>

        </div>

        {/* Budget Style & Interests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-amber-100">
          
          {/* Travel Tier */}
          <div>
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
              Budget Style & Comfort
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Budget', 'Moderate', 'Luxury'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setTravelStyle(style)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition ${
                    travelStyle === style
                      ? 'gradient-saffron text-slate-950 font-black shadow-xs'
                      : 'bg-amber-50/60 text-slate-700 hover:bg-amber-100/60 border border-amber-200/60'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Pills */}
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-amber-900 uppercase tracking-wider block mb-2">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selected
                        ? 'bg-amber-100 border border-amber-300 text-amber-950 font-bold'
                        : 'bg-amber-50/40 border border-amber-100 text-slate-700 hover:bg-amber-100/60'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}{interest}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl gradient-saffron text-slate-950 font-black text-sm hover:opacity-95 transition shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-4 h-4 text-slate-950 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Itinerary...' : 'Generate AI Itinerary'}</span>
          </button>
        </div>

      </div>

      {/* Generated Itinerary Output */}
      {isGenerating ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 space-y-4">
          <div className="w-14 h-14 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
          <h3 className="text-lg font-bold text-[#0A192F]">Crafting Your Personalized Bharat Yatra...</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Structuring sunrise viewings, authentic culinary meals, and transit buffers tailored for {selectedDestination}.
          </p>
        </div>
      ) : generatedItinerary && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Output Action Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300">
                  AI Verified Itinerary
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {generatedItinerary.durationDays} Days • {generatedItinerary.travelerType} • {generatedItinerary.travelStyle} Style
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A192F] tracking-tight">
                {generatedItinerary.title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleSaveToProfile}
                className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                  isSaved
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{isSaved ? 'Saved to Profile' : 'Save Itinerary'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#020C1B] text-amber-300 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Cost Allocation Summary Card */}
          <div className="bg-gradient-to-br from-[#020C1B] to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-amber-400/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs text-amber-300 uppercase font-semibold">Total Estimated Expenses</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-0.5">
                  ₹{generatedItinerary.totalEstimatedCost?.toLocaleString('en-IN')}
                  <span className="text-xs text-slate-400 font-sans font-normal ml-2">Total for {daysCount} Days</span>
                </div>
              </div>
              <div className="text-xs text-slate-300 max-w-xs">
                Includes accommodation, intercity & local transit, authentic meals, and monument tickets.
              </div>
            </div>

            {/* Breakdown Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="bg-white/5 p-3.5 rounded-2xl border border-amber-400/20">
                <span className="text-[11px] text-slate-400 block">Stay & Hotels</span>
                <span className="text-base font-bold text-amber-400 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.stay?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-amber-400/20">
                <span className="text-[11px] text-slate-400 block">Travel & Rail/Air</span>
                <span className="text-base font-bold text-yellow-300 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.travel?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-amber-400/20">
                <span className="text-[11px] text-slate-400 block">Meals & Dining</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.food?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-amber-400/20">
                <span className="text-[11px] text-slate-400 block">Tickets & Entry</span>
                <span className="text-base font-bold text-rose-400 font-mono mt-1 block">
                  ₹{generatedItinerary.costBreakdown?.ticketsAndActivities?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="bg-white/5 p-3.5 rounded-2xl border border-amber-400/20 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block">Shopping & Buffer</span>
                <span className="text-base font-bold text-blue-400 font-mono mt-1 block">
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
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  activeDayTab === day.day
                    ? 'bg-[#0A192F] text-amber-300 shadow-md font-bold'
                    : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200/60'
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
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">Day Theme</span>
                  <h4 className="text-base sm:text-lg font-bold text-[#0A192F]">{day.theme}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Daily Estimate</span>
                  <div className="text-sm sm:text-base font-black text-[#0A192F] font-mono">₹{day.dailyEstimatedCost}</div>
                </div>
              </div>

              {/* Time Slots Cards: Morning, Afternoon, Evening */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Morning Slot */}
                <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <span>Morning (Sunrise & Highlights)</span>
                    </div>

                    {day.morning?.map((slot, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{slot.time}</span>
                        </div>
                        <h5 className="font-bold text-[#0A192F] text-sm sm:text-base">{slot.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">{slot.description}</p>
                        {slot.insiderTip && (
                          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-900 text-[11px] font-medium border border-amber-200">
                            💡 <strong>Tip:</strong> {slot.insiderTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Activity Cost</span>
                    <strong className="text-[#0A192F] font-mono">₹{day.morning[0]?.estimatedCost || 200}</strong>
                  </div>
                </div>

                {/* Afternoon Slot */}
                <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
                      <Utensils className="w-4 h-4 text-orange-600" />
                      <span>Afternoon (Cuisine & Heritage)</span>
                    </div>

                    {day.afternoon?.map((slot, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{slot.time}</span>
                        </div>
                        <h5 className="font-bold text-[#0A192F] text-sm sm:text-base">{slot.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">{slot.description}</p>
                        {slot.insiderTip && (
                          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-950 text-[11px] font-medium border border-orange-200">
                            💡 <strong>Tip:</strong> {slot.insiderTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Activity Cost</span>
                    <strong className="text-[#0A192F] font-mono">₹{day.afternoon[0]?.estimatedCost || 350}</strong>
                  </div>
                </div>

                {/* Evening Slot */}
                <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                      <Sunset className="w-4 h-4 text-blue-700" />
                      <span>Evening (Sunset & Leisure)</span>
                    </div>

                    {day.evening?.map((slot, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{slot.time}</span>
                        </div>
                        <h5 className="font-bold text-[#0A192F] text-sm sm:text-base">{slot.title}</h5>
                        <p className="text-xs text-slate-600 leading-relaxed">{slot.description}</p>
                        {slot.insiderTip && (
                          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-950 text-[11px] font-medium border border-blue-200">
                            💡 <strong>Tip:</strong> {slot.insiderTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Activity Cost</span>
                    <strong className="text-[#0A192F] font-mono">₹{day.evening[0]?.estimatedCost || 200}</strong>
                  </div>
                </div>

              </div>

              {/* Day Meals Recommended */}
              {day.mealsSuggestion && (
                <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/80 space-y-3">
                  <span className="text-xs font-bold text-[#0A192F] uppercase tracking-wider block">
                    Curated Culinary Stops for Day {day.day}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-amber-200/60">
                      <strong className="text-amber-800 block mb-0.5">Breakfast:</strong>
                      <span className="text-slate-600">{day.mealsSuggestion.breakfast}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-amber-200/60">
                      <strong className="text-orange-800 block mb-0.5">Lunch:</strong>
                      <span className="text-slate-600">{day.mealsSuggestion.lunch}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-amber-200/60">
                      <strong className="text-blue-800 block mb-0.5">Dinner:</strong>
                      <span className="text-slate-600">{day.mealsSuggestion.dinner}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}

          {/* Packing Checklist & Cultural Guidelines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            
            {/* Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Smart Packing Checklist</span>
              </h3>
              <div className="space-y-2">
                {generatedItinerary.packingChecklist?.map((item, i) => (
                  <label key={i} className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-amber-50">
                    <input type="checkbox" defaultChecked={i < 2} className="mt-0.5 rounded text-amber-600" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Local Guidelines & Cultural Etiquette */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span>Local Etiquette & Safety Tips</span>
              </h3>
              <ul className="space-y-2.5">
                {generatedItinerary.localTips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
