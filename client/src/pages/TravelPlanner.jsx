import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Compass, MapPin, Route, Navigation, ShieldCheck, Sparkles, Layers, CheckCircle2, Train, Plane, Bus, Car, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

import TravelSearch from '../components/TravelPlanner/TravelSearch';
import TravelModeTabs from '../components/TravelPlanner/TravelModeTabs';
import TransportResultCard from '../components/TravelPlanner/TransportResultCard';
import TrainCard from '../components/TravelPlanner/TrainCard';
import BusCard from '../components/TravelPlanner/BusCard';
import FlightCard from '../components/TravelPlanner/FlightCard';
import CabCard from '../components/TravelPlanner/CabCard';
import HotelCard from '../components/TravelPlanner/HotelCard';
import LocalTransportCard from '../components/TravelPlanner/LocalTransportCard';
import TravelComparison from '../components/TravelPlanner/TravelComparison';
import TripCostSummary from '../components/TravelPlanner/TripCostSummary';
import TransportMap from '../components/TravelPlanner/TransportMap';
import TravelDetailsModal from '../components/TravelPlanner/TravelDetailsModal';
import TravelLoadingState from '../components/TravelPlanner/TravelLoadingState';
import TravelErrorState from '../components/TravelPlanner/TravelErrorState';

export default function TravelPlanner() {
  const [searchParams] = useSearchParams();
  const initialFrom = searchParams.get('from') || 'Delhi';
  const initialTo = searchParams.get('destination') || 'Agra';
  const initialMode = searchParams.get('mode') || 'all';
  const initialDate = searchParams.get('travelDate') || (() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  })();
  const initialTravelers = parseInt(searchParams.get('travelersCount')) || 2;
  const initialNights = parseInt(searchParams.get('hotelNights')) || 2;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [travelPlan, setTravelPlan] = useState(null);
  const [activeTab, setActiveTab] = useState(initialMode); // 'all', 'train', 'bus', 'flight', 'hotel', 'cab', 'local', 'comparison'
  const [selectedModalOption, setSelectedModalOption] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(null);

  const executeSearch = async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.planTravel(queryParams);
      if (res && res.success) {
        setTravelPlan(res);
      } else {
        setError(res?.message || 'Failed to calculate travel options.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while calculating distance & fares.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial search on mount
  useEffect(() => {
    if (initialMode && initialMode !== 'all') {
      setActiveTab(initialMode);
    }

    executeSearch({
      from: initialFrom,
      destination: initialTo,
      travelDate: initialDate,
      travelersCount: initialTravelers,
      hotelNights: initialNights
    });
  }, [initialFrom, initialTo, initialMode, initialDate, initialTravelers, initialNights]);

  // Handle saving a travel plan option to backend database
  const handleSavePlan = async (option) => {
    if (!option) return;
    try {
      const res = await api.saveTravelPlan({
        source: travelPlan?.query?.from || 'Delhi',
        destination: travelPlan?.query?.destination || 'Agra',
        travelDate: travelPlan?.query?.travelDate || new Date().toISOString().split('T')[0],
        travellers: travelPlan?.query?.travelersCount || 1,
        mode: option.mode || 'train',
        provider: option.provider || 'Standard Provider',
        transportId: option.number || option.id || '',
        operator: option.operator || '',
        providerFare: option.fare?.type === 'live' ? option.fare.amount : null,
        estimatedFare: option.fare?.type === 'estimated' ? option.fare.amount : null,
        currency: 'INR'
      });

      if (res && res.success) {
        setSaveSuccessMessage(`Selected ${option.operator} (${option.number || option.mode}) saved to your travel plans!`);
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      }
    } catch (err) {
      console.warn('Notice saving travel plan:', err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-white shadow-2xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#F28C45]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#1D5D85]/40 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#FFB36B] text-xs font-bold tracking-wide">
            <Route className="w-4 h-4 text-[#FFB36B]" />
            <span>Multi-Modal Transit & Fare Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Compare <span className="text-[#FFB36B]">Trains, Buses, Flights & Cabs</span> Side-by-Side
          </h1>
          <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
            Calculate accurate road distances, IRCTC express train timings, state AC bus tariffs, flight duration, and outstation cab rates between any Indian origin and destination.
          </p>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Train className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">IRCTC</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Railways</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Vande Bharat, Rajdhani</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Plane className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Aviation</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Flights</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">IndiGo, Air India, Akasa</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Bus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#F28C45] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Highway</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">AC Buses</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Volvo & Multi-Axle</div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E5EAF0] shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF4FA] flex items-center justify-center text-[#123B5D] group-hover:bg-[#123B5D] group-hover:text-white transition-colors">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-[#1D5D85] bg-[#EAF4FA] px-2.5 py-1 rounded-full">Doorstep</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#123B5D] tracking-tight group-hover:text-[#F28C45] transition-colors">Outstation</div>
          <div className="text-xs sm:text-sm font-semibold text-[#718096] mt-0.5">Sedan, SUV & Tempo</div>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMessage && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-extrabold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
        </div>
      )}

      {/* Input Search Form Component */}
      <TravelSearch
        onSearch={executeSearch}
        loading={loading}
        error={error}
        setError={setError}
        initialFrom={initialFrom}
        initialTo={initialTo}
        initialDate={initialDate}
        initialTravelers={initialTravelers}
        initialNights={initialNights}
      />

      {/* Loading Skeleton */}
      {loading && <TravelLoadingState />}

      {/* Error Banner */}
      {!loading && error && <TravelErrorState message={error} onRetry={() => executeSearch({ from: initialFrom, destination: initialTo })} />}

      {/* Main Results Display */}
      {!loading && travelPlan && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Geographic Distance Highlight Banner */}
          <div className="bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FFB36B] tracking-widest block">
                  GEOGRAPHIC & TERRAIN DISTANCE METRICS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  {travelPlan.query?.from} → {travelPlan.query?.destination}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#EAF4FA]/80 block font-medium">Travel Date</span>
                <span className="text-sm font-bold text-[#FFB36B] font-mono">{travelPlan.query?.travelDate}</span>
              </div>
            </div>

            {/* Distance Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Haversine Air Distance */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-[#FFB36B] font-bold block uppercase text-[10px] tracking-wider">
                  Air / Geographic Distance
                </span>
                <div className="text-lg font-black text-white font-mono">
                  {travelPlan.distance?.geographicDistanceFormatted}
                </div>
                <p className="text-[11px] text-[#EAF4FA]/80 leading-tight">
                  Straight-line Haversine spherical distance between coordinates.
                </p>
              </div>

              {/* Road Distance */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-amber-200 font-bold block uppercase text-[10px] tracking-wider">
                  Road Highway Distance
                </span>
                <div className="text-lg font-black text-white font-mono">
                  Road Distance: {travelPlan.distance?.roadDistanceKm} km
                </div>
                <p className="text-[11px] text-[#EAF4FA]/80 leading-tight">
                  Driving route highway length ({travelPlan.distance?.roadProvider || 'OSRM / Geoapify'}).
                </p>
              </div>

              {/* Rail Distance */}
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                <span className="text-emerald-200 font-bold block uppercase text-[10px] tracking-wider">
                  Railway Track Distance
                </span>
                <div className="text-lg font-black text-white font-mono">
                  Rail Distance: ~{Math.round(travelPlan.distance?.geographicDistanceKm * 1.15)} km
                </div>
                <p className="text-[11px] text-[#EAF4FA]/80 leading-tight">
                  Estimated railway track route distance between stations.
                </p>
              </div>

            </div>
          </div>

          {/* GIS Intercity Route Map */}
          {travelPlan.query?.fromCoords && travelPlan.query?.toCoords && (
            <TransportMap
              fromCoords={travelPlan.query.fromCoords}
              toCoords={travelPlan.query.toCoords}
              fromName={travelPlan.query.from}
              toName={travelPlan.query.destination}
              distanceInfo={travelPlan.distance}
            />
          )}

          {/* Navigation Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E5EAF0]">
            {[
              { id: 'all', label: 'All Travel & Stay Options' },
              { id: 'comparison', label: 'Mode Comparison Table' },
              { id: 'train', label: 'Train Details' },
              { id: 'bus', label: 'Bus Details' },
              { id: 'flight', label: 'Flight Details' },
              { id: 'cab', label: 'Cab / Auto Details' },
              { id: 'hotel', label: 'Hotels & Stay' },
              { id: 'local', label: 'Local Transport' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#123B5D] text-white shadow-md font-bold'
                    : 'bg-white text-[#29445A] hover:bg-[#EAF4FA] border border-[#E5EAF0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Modes Cards Grid (Train, Bus, Flight, Cab) */}
          {(activeTab === 'all' || activeTab === 'train' || activeTab === 'bus' || activeTab === 'flight' || activeTab === 'cab') && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-[#123B5D] tracking-tight flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#F28C45]" />
                <span>Intercity & Local Travel Options (Train, Bus, Flight, Cab)</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {(activeTab === 'all' || activeTab === 'train') && (
                  <TrainCard
                    trainData={travelPlan.options ? travelPlan.options.filter(o => o.mode === 'train') : travelPlan.train}
                    from={travelPlan.query?.from}
                    destination={travelPlan.query?.destination}
                    distanceKm={travelPlan.distance?.geographicDistanceKm}
                    onViewDetails={(opt) => setSelectedModalOption(opt)}
                  />
                )}

                {(activeTab === 'all' || activeTab === 'bus') && (
                  <BusCard
                    busData={travelPlan.options ? travelPlan.options.filter(o => o.mode === 'bus') : travelPlan.bus}
                    from={travelPlan.query?.from}
                    destination={travelPlan.query?.destination}
                    roadDistanceKm={travelPlan.distance?.roadDistanceKm}
                    onViewDetails={(opt) => setSelectedModalOption(opt)}
                  />
                )}

                {(activeTab === 'all' || activeTab === 'flight') && (
                  <FlightCard
                    flightData={travelPlan.options ? travelPlan.options.filter(o => o.mode === 'flight') : travelPlan.flight}
                    from={travelPlan.query?.from}
                    destination={travelPlan.query?.destination}
                    airDistanceKm={travelPlan.distance?.geographicDistanceKm}
                    onViewDetails={(opt) => setSelectedModalOption(opt)}
                  />
                )}

                {(activeTab === 'all' || activeTab === 'cab') && (
                  <CabCard
                    cabData={travelPlan.cabs && travelPlan.cabs.length > 0 ? travelPlan.cabs : travelPlan.options?.filter(o => o.mode === 'cab')}
                    from={travelPlan.query?.from}
                    destination={travelPlan.query?.destination}
                    roadDistanceKm={travelPlan.distance?.roadDistanceKm}
                    onViewDetails={(opt) => setSelectedModalOption(opt)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Neutral Mode Comparison Table */}
          {(activeTab === 'all' || activeTab === 'comparison') && (
            <TravelComparison
              comparisonData={travelPlan.comparison}
              trainData={travelPlan.train}
              busData={travelPlan.bus}
              flightData={travelPlan.flight}
              distanceInfo={travelPlan.distance}
            />
          )}

          {/* Hotel Information Section */}
          {(activeTab === 'all' || activeTab === 'hotel') && (
            <HotelCard
              hotelData={travelPlan.hotel}
              destination={travelPlan.query?.destination}
              hotelNights={travelPlan.query?.hotelNights}
            />
          )}

          {/* Local Transportation Section */}
          {(activeTab === 'all' || activeTab === 'local') && (
            <LocalTransportCard
              transportData={travelPlan.localTransportation}
              destination={travelPlan.query?.destination}
              tripDays={(travelPlan.query?.hotelNights || 1) + 1}
            />
          )}

          {/* Integrated Complete Trip Cost Summary Component */}
          <TripCostSummary
            costData={travelPlan.completeTripCost}
            from={travelPlan.query?.from}
            destination={travelPlan.query?.destination}
            travelDate={travelPlan.query?.travelDate}
          />

        </div>
      )}

      {/* Bottom Call to Action */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B5D] via-[#1D5D85] to-[#123B5D] p-8 sm:p-12 text-center text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Plan an Entire Day-by-Day Vacation?
          </h2>
          <p className="text-white/80 text-sm sm:text-base font-medium">
            Use our AI engine to generate detailed daily activity plans, verified culinary hotspots, and cultural tips for your journey.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              to={`/ai-planner?destination=${encodeURIComponent(initialTo)}&from=${encodeURIComponent(initialFrom)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F28C45] hover:bg-[#d97736] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/budget-calculator?destination=${encodeURIComponent(initialTo)}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all"
            >
              <span>Calculate Total Budget</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Travel Option Details Modal */}
      {selectedModalOption && (
        <TravelDetailsModal
          option={selectedModalOption}
          query={travelPlan?.query}
          onClose={() => setSelectedModalOption(null)}
          onSavePlan={handleSavePlan}
        />
      )}

    </div>
  );
}
