'use client';

import React, { useEffect, useRef, useState } from 'react';
import { HealthcareFacility } from '@/types/triage';
import { useLanguage } from '@/context/LanguageContext';
import { Locate, Layers, AlertCircle } from 'lucide-react';

interface GoogleFacilityMapProps {
  facilities: HealthcareFacility[];
  userLat?: number;
  userLng?: number;
  selectedFacilityId?: string;
  onSelectFacility?: (facility: HealthcareFacility) => void;
}

export default function GoogleFacilityMap({
  facilities,
  userLat = 11.5564,
  userLng = 104.9282,
  selectedFacilityId,
  onSelectFacility
}: GoogleFacilityMapProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    'AIzaSyAnwXoNSeIkJkI7vCwCFMg8PxsurnIwaE0';

  // 1. Asynchronously Load Google Maps API Script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      script.onerror = () => {
        setLoadError('Failed to load Google Maps SDK. Please check your network or API key.');
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => initMap());
    }

    function initMap() {
      if (!mapContainerRef.current || !window.google?.maps) return;

      try {
        const centerLat = facilities[0]?.latitude || userLat;
        const centerLng = facilities[0]?.longitude || userLng;

        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 12,
          mapTypeId: mapType,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: 'poi.medical',
              elementType: 'geometry',
              stylers: [{ color: '#fef2f2' }]
            },
            {
              featureType: 'poi.medical',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'on' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new window.google.maps.InfoWindow();
        setMapLoaded(true);
      } catch (err: any) {
        console.error('Google Maps initialization failed:', err);
        setLoadError(err?.message || 'Could not initialize Google Map.');
      }
    }

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, [apiKey]);

  // 2. Update Map Layer Type
  useEffect(() => {
    if (mapInstanceRef.current && window.google?.maps) {
      mapInstanceRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // 3. Render Facility and User Markers
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.google?.maps) return;

    const map = mapInstanceRef.current;
    const google = window.google;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // User Location Marker
    if (userLat && userLng) {
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);

      const userMarker = new google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map,
        title: isKm ? 'ទីតាំងរបស់អ្នក' : 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        zIndex: 999
      });

      userMarkerRef.current = userMarker;
    }

    const bounds = new google.maps.LatLngBounds();
    if (userLat && userLng) {
      bounds.extend({ lat: userLat, lng: userLng });
    }

    // Facility Markers
    facilities.forEach((fac) => {
      const isHospital = fac.type === 'hospital' || fac.type === 'referral_hospital';
      const isSelected = fac.id === selectedFacilityId;

      const markerColor = isHospital ? '#e11d48' : '#0d9488'; // Rose for Hospital, Teal for Health Centre/Clinic

      const marker = new google.maps.Marker({
        position: { lat: fac.latitude, lng: fac.longitude },
        map,
        title: isKm ? fac.name_km : fac.name_en,
        animation: isSelected ? google.maps.Animation.BOUNCE : undefined,
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: isSelected ? '#fbbf24' : '#ffffff',
          strokeWeight: isSelected ? 3 : 1.5,
          scale: isSelected ? 1.8 : 1.4,
          anchor: new google.maps.Point(12, 22)
        }
      });

      marker.addListener('click', () => {
        if (onSelectFacility) onSelectFacility(fac);

        const contentString = `
          <div style="padding: 10px; max-width: 260px; font-family: system-ui, -apple-system, sans-serif;">
            <div style="font-weight: 800; font-size: 14px; color: #0f172a; margin-bottom: 4px;">
              ${isKm ? fac.name_km : fac.name_en}
            </div>
            ${
              fac.rating
                ? `<div style="font-size: 11px; color: #d97706; font-weight: 800; margin-bottom: 5px; display: flex; align-items: center; gap: 4px;">
                    <span>⭐ ${fac.rating.toFixed(1)}</span>
                    <span style="color: #64748b; font-weight: 600;">(${fac.review_count || 0})</span>
                    <span style="color: #94a3b8;">•</span>
                    <span style="color: #0f766e; font-weight: 700;">${fac.opening_hours.includes('24') ? (isKm ? 'បើក ២៤ ម៉ោង' : 'Open 24 hours') : fac.opening_hours}</span>
                  </div>`
                : ''
            }
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px; display: flex; align-items: flex-start; gap: 4px;">
              <span>📍</span>
              <span>${isKm ? fac.address_km : fac.address_en}</span>
            </div>
            ${
              !fac.rating
                ? `<div style="font-size: 11px; color: #10b981; font-weight: 700; margin-bottom: 8px;">
                    ⏰ ${fac.opening_hours} ${fac.emergency_available ? '• 🚨 24/7' : ''}
                  </div>`
                : ''
            }
            ${
              fac.phone
                ? `<a href="tel:${fac.phone.replace(/[^0-9+]/g, '')}" style="display: block; text-align: center; background: #0d9488; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none; margin-bottom: 6px;">
                    📞 ${fac.phone}
                  </a>`
                : ''
            }
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fac.name_en + ', ' + (fac.address_en || fac.province || 'Cambodia'))}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #0f172a; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; text-decoration: none;">
              🗺️ ${isKm ? 'នាំផ្លូវតាម Google Maps' : 'Get Directions'}
            </a>
          </div>
        `;

        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(contentString);
          infoWindowRef.current.open(map, marker);
        }
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: fac.latitude, lng: fac.longitude });
    });

    if (facilities.length > 0) {
      map.fitBounds(bounds);
      const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() && map.getZoom()! > 15) {
          map.setZoom(15);
        }
        google.maps.event.removeListener(listener);
      });
    }
  }, [mapLoaded, facilities, userLat, userLng, selectedFacilityId, isKm, onSelectFacility]);

  // Recenter to user location
  const handleRecenter = () => {
    if (mapInstanceRef.current && userLat && userLng) {
      mapInstanceRef.current.panTo({ lat: userLat, lng: userLng });
      mapInstanceRef.current.setZoom(14);
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-full min-h-[500px] rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center justify-center p-6 text-center gap-3">
        <AlertCircle className="w-8 h-8 text-amber-600" />
        <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
          {isKm ? 'មិនអាចផ្ទុក Google Maps បានទេ' : 'Could not load Google Maps'}
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-300 max-w-md">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {/* Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="p-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          title={isKm ? 'ទៅកាន់ទីតាំងខ្ញុំ' : 'Recenter to My Location'}
        >
          <Locate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">{isKm ? 'ទីតាំងខ្ញុំ' : 'My Location'}</span>
        </button>

        {/* Layer Mode Toggle */}
        <button
          type="button"
          onClick={() => setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'))}
          className="p-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          title={isKm ? 'ប្តូររូបភាពផ្កាយរណប' : 'Toggle Satellite View'}
        >
          <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="hidden sm:inline">
            {mapType === 'roadmap' ? (isKm ? 'ផ្កាយរណប' : 'Satellite') : isKm ? 'ផែនទីធម្មតា' : 'Roadmap'}
          </span>
        </button>
      </div>

      {/* Bottom Google Maps & Healthcare Badge */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold">Google Maps Live</span>
        <span className="text-slate-400">|</span>
        <span className="text-teal-300 font-semibold">
          {facilities.length} {isKm ? 'មណ្ឌលសុខភាព' : 'Facilities'}
        </span>
      </div>
    </div>
  );
}
