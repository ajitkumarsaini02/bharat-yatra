import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Star } from 'lucide-react';
import { destinationsData } from '../data/mockData';

const createCustomIcon = (category) => {
  let bgColor = '#D97706'; // Saffron Amber
  const c = (category || '').toLowerCase();
  if (c.includes('temple') || c.includes('spiritual')) bgColor = '#EA580C'; // Deep Orange
  else if (c.includes('fort')) bgColor = '#BE123C'; // Ruby Rose
  else if (c.includes('palace') || c.includes('museum')) bgColor = '#7C3AED'; // Royal Purple
  else if (c.includes('cave')) bgColor = '#78716C'; // Ancient Stone
  else if (c.includes('beach') || c.includes('coastal')) bgColor = '#0284C7'; // Ocean Blue
  else if (c.includes('hill') || c.includes('tea')) bgColor = '#059669'; // Emerald
  else if (c.includes('adventure') || c.includes('circuit')) bgColor = '#D97706'; // Amber Flame
  else if (c.includes('wildlife') || c.includes('tiger')) bgColor = '#CA8A04'; // Jungle Gold
  else if (c.includes('natural') || c.includes('wonder')) bgColor = '#0891B2'; // Waterfall Cyan
  else bgColor = '#B45309'; // Rajputana Brass

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(10,25,47,0.35);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #FEF08A;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function InteractiveMap({ destinations = destinationsData }) {
  const [selectedZone, setSelectedZone] = useState('All');
  
  // Center of India
  const defaultCenter = [22.9734, 78.6569];

  const zones = ['All', 'North', 'South', 'West', 'East', 'North-East'];

  const filtered = selectedZone === 'All' 
    ? destinations 
    : destinations.filter(d => d.zone.toLowerCase() === selectedZone.toLowerCase());

  return (
    <div className="w-full bg-white rounded-3xl border border-amber-900/10 shadow-lg overflow-hidden flex flex-col">
      {/* Map Control Bar */}
      <div className="p-4 sm:p-6 bg-[#0A192F] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Interactive Geographic Explorer</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click on markers across India to preview attractions, best times, and AI plan shortcuts.
          </p>
        </div>

        {/* Zone Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700">
          {zones.map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition ${
                selectedZone === zone 
                  ? 'gradient-saffron text-slate-950 font-bold shadow-xs' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="h-[520px] w-full relative z-10">
        <MapContainer
          center={defaultCenter}
          zoom={5}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filtered.map((dest) => (
            <Marker
              key={dest.id}
              position={[dest.coordinates.lat, dest.coordinates.lng]}
              icon={createCustomIcon(dest.category)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="w-64 p-1">
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    className="w-full h-28 object-cover rounded-xl mb-2"
                  />
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#0A192F] text-sm">{dest.name}</span>
                    <span className="flex items-center text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {dest.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800/70 mb-2 font-medium">
                    {dest.state} • {dest.category}
                  </p>
                  <p className="text-xs text-slate-700 line-clamp-2 mb-3">
                    {dest.tagline || dest.description}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-100">
                    <Link
                      to={`/destination/${dest.id}`}
                      className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-bold text-center rounded-lg border border-amber-200/60"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/ai-planner?destination=${encodeURIComponent(dest.name)}`}
                      className="px-2.5 py-1.5 gradient-saffron text-slate-950 text-xs font-black rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      <span>Plan</span>
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
