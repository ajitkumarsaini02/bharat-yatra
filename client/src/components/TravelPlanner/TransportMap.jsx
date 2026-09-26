import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Compass, MapPin, Navigation } from 'lucide-react';

/**
 * Custom Styled Pin Icon for Leaflet
 */
const createCustomIcon = (color = '#D97706', label = '') => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
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

/**
 * TransportMap component
 * Renders intercity route between source & destination on Leaflet Map
 */
export default function TransportMap({ fromCoords, toCoords, fromName, toName, distanceInfo }) {
  if (!fromCoords?.lat || !toCoords?.lat) {
    return null;
  }

  const sourcePos = [Number(fromCoords.lat), Number(fromCoords.lng)];
  const destPos = [Number(toCoords.lat), Number(toCoords.lng)];

  // Calculate Map Bounds / Center
  const center = [
    (sourcePos[0] + destPos[0]) / 2,
    (sourcePos[1] + destPos[1]) / 2
  ];

  // Route Polyline Points
  const routeLine = [sourcePos, destPos];

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-900/10 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#0A192F] dark:text-slate-100 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>GIS Intercity Transport Route Map</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visualizing intercity transit path between {fromName || 'Source'} and {toName || 'Destination'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-0.5 bg-amber-500 inline-block"></span> Direct Air/Rail Route
          </span>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-72 w-full rounded-2xl overflow-hidden border border-amber-900/10 dark:border-slate-800 relative z-10 shadow-inner">
        <MapContainer
          center={center}
          zoom={6}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Source Marker */}
          <Marker position={sourcePos} icon={createCustomIcon('#3B82F6')}>
            <Popup>
              <div className="p-1 space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase block">Source</span>
                <h4 className="font-bold text-xs text-slate-900">{fromName || 'Source'}</h4>
                <p className="text-[10px] font-mono text-slate-500">Lat: {sourcePos[0]}, Lng: {sourcePos[1]}</p>
              </div>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={destPos} icon={createCustomIcon('#D97706')}>
            <Popup>
              <div className="p-1 space-y-1">
                <span className="text-[10px] font-bold text-amber-600 uppercase block">Destination</span>
                <h4 className="font-bold text-xs text-slate-900">{toName || 'Destination'}</h4>
                <p className="text-[10px] font-mono text-slate-500">Lat: {destPos[0]}, Lng: {destPos[1]}</p>
              </div>
            </Popup>
          </Marker>

          {/* Intercity Transit Route Polyline */}
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: '#D97706',
              weight: 4,
              opacity: 0.85,
              dashArray: '8, 8'
            }}
          />
        </MapContainer>
      </div>

      {/* Distance Legend Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/50 dark:border-slate-700/60 text-xs">
        <span className="font-medium text-slate-700 dark:text-slate-300">
          📍 {distanceInfo?.geographicDistanceFormatted || `Distance: ~${distanceInfo?.geographicDistanceKm || 200} km`}
        </span>
        <span className="text-[10px] font-mono text-amber-800 dark:text-amber-400 font-bold">
          Road: {distanceInfo?.roadDistanceKm || '~240'} km ({distanceInfo?.roadProvider || 'OSRM'})
        </span>
      </div>
    </div>
  );
}
