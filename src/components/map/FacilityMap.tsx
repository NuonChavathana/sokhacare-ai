'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { HealthcareFacility } from '@/types/triage';
import { useLanguage } from '@/context/LanguageContext';
import { PhoneCall, Navigation, Clock, ShieldCheck, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface FacilityMapProps {
  facilities: HealthcareFacility[];
  userLat?: number;
  userLng?: number;
  selectedFacilityId?: string;
}

// Center map controller component
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 12);
  }, [lat, lng, map]);
  return null;
}

export default function FacilityMap({
  facilities,
  userLat = 11.5564,
  userLng = 104.9282,
  selectedFacilityId
}: FacilityMapProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  // Calculate center coordinates
  const centerLat = facilities[0]?.latitude || userLat;
  const centerLng = facilities[0]?.longitude || userLng;

  return (
    <div className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative z-0">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '500px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap lat={centerLat} lng={centerLng} />

        {/* User Location Marker */}
        <Marker position={[userLat, userLng]} icon={userIcon}>
          <Popup>
            <div className="text-center font-bold text-xs p-1">
              📍 {isKm ? 'ទីតាំងរបស់អ្នក' : 'Your Location'}
            </div>
          </Popup>
        </Marker>

        {/* Facility Markers */}
        {facilities.map((fac) => (
          <Marker key={fac.id} position={[fac.latitude, fac.longitude]}>
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="font-extrabold text-sm text-slate-900 mb-1">
                  {isKm ? fac.name_km : fac.name_en}
                </div>
                <div className="text-xs text-slate-600 mb-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{isKm ? fac.address_km : fac.address_en}</span>
                </div>

                <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{fac.opening_hours}</span>
                </div>

                {fac.phone && (
                  <a
                    href={`tel:${fac.phone.replace(/[^0-9+]/g, '')}`}
                    className="block w-full text-center py-1.5 px-3 rounded-lg bg-teal-600 text-white font-bold text-xs mb-1.5 shadow-2xs hover:bg-teal-700 transition-colors"
                  >
                    📞 {fac.phone}
                  </a>
                )}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-1.5 px-3 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-2xs hover:bg-slate-800 transition-colors"
                >
                  🗺️ {t('getDirections')}
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
