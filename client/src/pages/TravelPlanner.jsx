import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, MapPin, Route, Navigation, ShieldCheck, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [travelPlan, setTravelPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'train', 'bus', 'flight', 'hotel', 'local', 'comparison'
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
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const dateStr = nextMonth.toISOString().split('T')[0];

    executeSearch({
      from: initialFrom,
      destination: initialTo,
      travelDate: dateStr,
      travelersCount: 2,
      hotelNights: 2
    });
  }, [initialFrom, initialTo]);

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
      
      {/* Page Title Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-500/40">
          <Route className="w-3.5 h-3.5 text-amber-600" />
          <span>Bharat Yatra Distance & Cost Estimation Module</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] dark:text-white tracking-tight">
          Travel Distance & Fare Planner
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Compare Rail, Bus, Flight, Hotel and Local Commute options between any two Indian cities with exact Haversine geographic and road distance calculations.
        </p>
      </div>

      {/* Save Success Banner */}
      {saveSuccessMessage && (
        <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs font-extrabold flex items-center justify-between shadow-md">
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
      />

      {/* Loading Skeleton */}
      {loading && <TravelLoadingState />}

      {/* Error Banner */}
      {!loading && error && <TravelErrorState message={error} onRetry={() => executeSearch({ from: initialFrom, destination: initialTo })} />}

      {/* Main Results Display */}
      {!loading && travelPlan && (
        <div className="space-y-10 animate-fade-in">
          
          {/* Geographic Distance Highlight Banner */}
          <div className="bg-gradient-to-r from-[#0A192F] via-[#112240] to-[#0A192F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-400/20 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block">
                  GEOGRAPHIC & TERRAIN DISTANCE METRICS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                  {travelPlan.query?.from} → {travelPlan.query?.destination}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Travel Date</span>
                <span className="text-sm font-bold text-amber-300 font-mono">{travelPlan.query?.travelDate}</span>
              </div>
            </div>

            {/* Distance Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Haversine Air Distance */}
              <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 space-y-1">
                <span className="text-amber-300 font-bold block uppercase text-[10px] tracking-wider">
                  Air / Geographic Distance
                </span>
                <div className="text-lg font-black text-white font-mono">
                  {travelPlan.distance?.geographicDistanceFormatted}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Straight-line Haversine spherical distance between coordinates.
                </p>
              </div>

              {/* Road Distance */}
              <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 space-y-1">
                <span className="text-yellow-300 font-bold block uppercase text-[10px] tracking-wider">
                  Road Highway Distance
                </span>
                <div className="text-lg font-black text-white font-mono">
                  Road Distance: {travelPlan.distance?.roadDistanceKm} km
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Driving route highway length ({travelPlan.distance?.roadProvider || 'OSRM / Geoapify'}).
                </p>
              </div>

              {/* Rail Distance */}
              <div className="p-4 rounded-2xl bg-white/5 border border-amber-400/20 space-y-1">
                <span className="text-emerald-300 font-bold block uppercase text-[10px] tracking-wider">
                  Railway Track Distance
                </span>
                <div className="text-lg font-black text-white font-mono">
                  Rail Distance: ~{Math.round(travelPlan.distance?.geographicDistanceKm * 1.15)} km
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-amber-200/60 dark:border-slate-800">
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
                    ? 'bg-[#0A192F] dark:bg-amber-500 text-amber-300 dark:text-slate-950 shadow-md font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-amber-200/60 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Modes Cards Grid (Train, Bus, Flight, Cab) */}
          {(activeTab === 'all' || activeTab === 'train' || activeTab === 'bus' || activeTab === 'flight' || activeTab === 'cab') && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-[#0A192F] dark:text-slate-100 tracking-tight flex items-center gap-2">
                <Navigation className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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
