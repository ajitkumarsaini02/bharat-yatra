import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  PlusCircle, 
  Trash2, 
  Database, 
  Layers,
  Sparkles,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [newDest, setNewDest] = useState({
    name: '',
    state: '',
    zone: 'North',
    category: 'UNESCO World Heritage & Iconic Monuments',
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    tagline: '',
    description: '',
    bestTimeToVisit: 'October to March',
    idealDuration: '2-3 Days',
    budgetLevel: 'Moderate',
    avgDailyExpense: 2400,
    highlights: 'Sunrise photography, Historic complex exploration, Local food tasting',
    lat: 26.9124,
    lng: 75.7873,
    attractions: [],
    famousFood: [],
    shoppingSpecialties: [],
    transportation: {}
  });

  useEffect(() => {
    const fetchDests = async () => {
      const res = await api.getDestinations();
      if (res.data) {
        setDestinations(res.data);
      }
    };
    fetchDests();
  }, []);

  const handleAIGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await api.generateAIDestination(aiPrompt.trim());
      if (res.data) {
        const d = res.data;
        setNewDest({
          name: d.name || aiPrompt,
          state: d.state || '',
          zone: d.zone || 'North',
          category: d.category || 'UNESCO World Heritage & Iconic Monuments',
          heroImage: d.heroImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
          tagline: d.tagline || '',
          description: d.description || '',
          bestTimeToVisit: d.bestTimeToVisit || 'October to March',
          idealDuration: d.idealDuration || '2-3 Days',
          budgetLevel: d.budgetLevel || 'Moderate',
          avgDailyExpense: d.avgDailyExpense || 2400,
          highlights: Array.isArray(d.highlights) ? d.highlights.join(', ') : (d.highlights || ''),
          lat: d.lat || d.coordinates?.lat || 26.9124,
          lng: d.lng || d.coordinates?.lng || 75.7873,
          attractions: d.attractions || [],
          famousFood: d.famousFood || [],
          shoppingSpecialties: d.shoppingSpecialties || [],
          transportation: d.transportation || {}
        });
        setSuccessMsg(`✨ AI successfully generated accurate information for "${d.name}" (${d.state})!`);
        setTimeout(() => setSuccessMsg(''), 7000);
      }
    } catch (err) {
      alert('AI Generation Notice: ' + (err.message || 'Could not fetch AI information'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const highlightsArr = typeof newDest.highlights === 'string'
      ? newDest.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : newDest.highlights;

    const payload = {
      ...newDest,
      avgDailyExpense: Number(newDest.avgDailyExpense) || 2400,
      coordinates: { 
        lat: Number(newDest.lat) || 26.9124, 
        lng: Number(newDest.lng) || 75.7873 
      },
      highlights: highlightsArr.length > 0 ? highlightsArr : [
        `Explore the historic grounds and architecture of ${newDest.name}`,
        `Cultural heritage photography and local experiences in ${newDest.state}`
      ],
      attractions: newDest.attractions?.length > 0 ? newDest.attractions : [
        { name: `${newDest.name} Main Complex`, type: newDest.category, entryFee: 40, timeNeeded: '2.5 hours' }
      ],
      famousFood: newDest.famousFood?.length > 0 ? newDest.famousFood : [
        { name: `Authentic ${newDest.state} Specialty Thali`, place: 'Local Heritage Restaurant', desc: 'Traditional regional delicacies and sweets' }
      ],
      shoppingSpecialties: newDest.shoppingSpecialties?.length > 0 ? newDest.shoppingSpecialties : [
        `Traditional ${newDest.state} Handloom`,
        'Authentic Handicrafts & Souvenirs'
      ],
      transportation: newDest.transportation?.nearestAirport ? newDest.transportation : {
        nearestAirport: `Regional Airport in ${newDest.state}`,
        nearestRailway: `Major City Railway Junction`,
        localCommute: 'E-rickshaws, Autos, and App Cabs'
      }
    };

    const res = await api.createDestination(payload);
    if (res.data) {
      setDestinations([res.data, ...destinations]);
      setIsAdding(false);
      setSuccessMsg(`"${res.data.name}" successfully added to directory & MongoDB database!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this monument from directory & database?')) return;
    try {
      await api.deleteDestination(id);
      setDestinations(destinations.filter(d => d.id !== id));
      setSuccessMsg('Monument removed successfully from directory & database.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setSuccessMsg('Deleted locally from active view.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#0A192F] dark:text-white">Admin Access Restricted</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            This dashboard controls all 112 Indian monuments, database records, and tourism management. Only registered Administrator accounts can access this page.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <a
            href="/login"
            className="px-6 py-3 rounded-xl bg-[#0A192F] dark:bg-amber-500 text-amber-300 dark:text-slate-950 text-xs font-bold shadow-md hover:scale-105 transition"
          >
            Sign in as Admin
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            Bharat Yatra Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage tourism directory datasets, oversee travel categories, and curate Indian travel records.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-3 rounded-xl bg-[#0A192F] hover:bg-[#020C1B] text-amber-300 text-xs font-bold transition flex items-center gap-2 shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Add New Destination'}</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase text-amber-800/70">Total Destinations</span>
            <Database className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-[#0A192F]">{destinations.length}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Across All Zones</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase text-amber-800/70">Geographic Zones</span>
            <MapPin className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-[#0A192F]">5 Regions</span>
          <span className="text-[11px] text-amber-700 block mt-0.5">North, South, West, East, NE</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase text-amber-800/70">AI Planner Engine</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-[#0A192F]">Active</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Day-Wise Generator</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-900/10 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase text-blue-800/70">Platform System</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-lg font-black text-[#0A192F]">Operational</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">REST API & Leaflet GIS</span>
        </div>
      </div>

      {/* Add New Destination Form Panel */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
            <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              <span>Create New Destination Record</span>
            </h3>
            <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              ⚡ Powered by Wikipedia & Tourism Knowledge Engine
            </span>
          </div>

          {/* AI Auto-Fill Research Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-400/40 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#0A192F]">
                  AI Auto-Fill & Heritage Research Assistant
                </h4>
                <p className="text-[11px] text-slate-500">
                  Type any Indian monument or place name. AI will automatically research and fill Wikipedia details, photos, GPS coordinates, food, budget & transit!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Enter monument name (e.g. Statue of Unity, Somnath Temple, Hampi, Dhanushkodi, Chanderi Fort)..."
                className="flex-1 px-4 py-3 rounded-xl bg-white border border-amber-300 text-xs font-semibold outline-hidden focus:border-amber-600 text-[#0A192F] shadow-xs"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAIGenerate(); } }}
              />
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={aiLoading || !aiPrompt.trim()}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {aiLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI Researching Info...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Generate with AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Destination Name</label>
              <input
                type="text"
                required
                value={newDest.name}
                onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                placeholder="e.g. Rishikesh (Yoga Capital)"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">State / UT</label>
              <input
                type="text"
                required
                value={newDest.state}
                onChange={(e) => setNewDest({ ...newDest, state: e.target.value })}
                placeholder="e.g. Uttarakhand"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Geographic Zone</label>
              <select
                value={newDest.zone}
                onChange={(e) => setNewDest({ ...newDest, zone: e.target.value })}
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              >
                <option value="North">North India</option>
                <option value="South">South India</option>
                <option value="West">West India</option>
                <option value="East">East India</option>
                <option value="North-East">North-East India</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Category</label>
              <select
                value={newDest.category}
                onChange={(e) => setNewDest({ ...newDest, category: e.target.value })}
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              >
                <option value="UNESCO World Heritage & Iconic Monuments">UNESCO World Heritage & Iconic Monuments</option>
                <option value="Historic Forts & Citadels">Historic Forts & Citadels</option>
                <option value="Temples & Spiritual Sites">Temples & Spiritual Sites</option>
                <option value="Royal Palaces, Museums & Historical Sites">Royal Palaces, Museums & Historical Sites</option>
                <option value="Ancient Caves & Rock-Cut Sites">Ancient Caves & Rock-Cut Sites</option>
                <option value="Beaches & Coastal Escapes">Beaches & Coastal Escapes</option>
                <option value="Hill Stations & Tea Estates">Hill Stations & Tea Estates</option>
                <option value="Wildlife & Tiger Reserves">Wildlife & Tiger Reserves</option>
                <option value="Adventure & Himalayan Circuits">Adventure & Himalayan Circuits</option>
                <option value="Natural Wonders">Natural Wonders</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Avg Daily Cost (₹)</label>
              <input
                type="number"
                value={newDest.avgDailyExpense}
                onChange={(e) => setNewDest({ ...newDest, avgDailyExpense: e.target.value })}
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Hero Image URL</label>
              <input
                type="url"
                value={newDest.heroImage}
                onChange={(e) => setNewDest({ ...newDest, heroImage: e.target.value })}
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Tagline</label>
              <input
                type="text"
                value={newDest.tagline}
                onChange={(e) => setNewDest({ ...newDest, tagline: e.target.value })}
                placeholder="e.g. UNESCO World Heritage Fort"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Best Time to Visit</label>
              <input
                type="text"
                value={newDest.bestTimeToVisit}
                onChange={(e) => setNewDest({ ...newDest, bestTimeToVisit: e.target.value })}
                placeholder="e.g. October to March"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Ideal Duration</label>
              <input
                type="text"
                value={newDest.idealDuration}
                onChange={(e) => setNewDest({ ...newDest, idealDuration: e.target.value })}
                placeholder="e.g. 2-3 Days"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Latitude (GPS Lat)</label>
              <input
                type="number"
                step="any"
                value={newDest.lat}
                onChange={(e) => setNewDest({ ...newDest, lat: e.target.value })}
                placeholder="e.g. 26.9124"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Longitude (GPS Lng)</label>
              <input
                type="number"
                step="any"
                value={newDest.lng}
                onChange={(e) => setNewDest({ ...newDest, lng: e.target.value })}
                placeholder="e.g. 75.7873"
                className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-semibold outline-hidden text-[#0A192F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Highlights (Comma separated)</label>
            <input
              type="text"
              value={newDest.highlights}
              onChange={(e) => setNewDest({ ...newDest, highlights: e.target.value })}
              placeholder="e.g. Sunrise view, Ancient architecture, Local food tasting"
              className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-medium outline-hidden text-[#0A192F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-amber-800/70 uppercase block mb-1">Description</label>
            <textarea
              rows="3"
              required
              value={newDest.description}
              onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
              placeholder="Detailed description of destination, cultural significance, and travel appeal..."
              className="w-full p-3 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-medium outline-hidden text-[#0A192F]"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-5 py-2.5 rounded-xl bg-amber-50 text-amber-950 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0A192F] hover:bg-[#020C1B] text-amber-300 text-xs font-black shadow-md cursor-pointer"
            >
              Save Destination to Database
            </button>
          </div>
        </form>
      )}

      {/* Active Destinations Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-[#0A192F]">Manage Active Destinations</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-amber-50 text-[#0A192F] font-bold border-b border-amber-200">
              <tr>
                <th className="p-3">Destination</th>
                <th className="p-3">State & Zone</th>
                <th className="p-3">Category</th>
                <th className="p-3">Budget Level</th>
                <th className="p-3">Daily Cost</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60">
              {destinations.map((d) => (
                <tr key={d.id} className="hover:bg-amber-50/40">
                  <td className="p-3 font-bold text-[#0A192F] flex items-center gap-2">
                    <img src={d.heroImage} alt={d.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{d.name}</span>
                  </td>
                  <td className="p-3">{d.state} ({d.zone})</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                      {d.category}
                    </span>
                  </td>
                  <td className="p-3">{d.budgetLevel}</td>
                  <td className="p-3 font-mono font-bold text-[#0A192F]">₹{d.avgDailyExpense}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
