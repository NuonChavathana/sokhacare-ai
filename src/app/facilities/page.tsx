'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { HealthcareFacility, FacilityType } from '@/types/triage';
import { CAMBODIA_FACILITIES, CAMBODIA_PROVINCES, FACILITY_TYPE_LABELS } from '@/lib/data/facilities';
import { getNearbyFacilities, getGoogleMapsDirectionsUrl } from '@/lib/location/geo-utils';
import { FacilityMapWrapper } from '@/components/map/FacilityMapWrapper';
import { MapPin, Search, PhoneCall, Navigation, Clock, ShieldCheck, Filter, Compass, ChevronRight, ArrowUpDown } from 'lucide-react';

export default function FacilitiesPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [facilities, setFacilities] = useState<HealthcareFacility[]>(CAMBODIA_FACILITIES);
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortByDist, setSortByDist] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ lat?: number; lng?: number; granted: boolean }>({
    granted: false
  });
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState<boolean>(true);

  // Filter & Sort logic
  useEffect(() => {
    let result = [...CAMBODIA_FACILITIES];

    if (selectedProvince !== 'All') {
      result = result.filter((f) => f.province.toLowerCase() === selectedProvince.toLowerCase());
    }

    if (selectedType !== 'all') {
      result = result.filter((f) => f.type === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name_km.toLowerCase().includes(q) ||
          f.name_en.toLowerCase().includes(q) ||
          f.district.toLowerCase().includes(q) ||
          f.address_km.toLowerCase().includes(q) ||
          f.address_en.toLowerCase().includes(q)
      );
    }

    if (userLocation.granted && userLocation.lat && userLocation.lng) {
      result = getNearbyFacilities(result, userLocation.lat, userLocation.lng, undefined, 25);
    }

    setFacilities(result);
  }, [selectedProvince, selectedType, searchQuery, userLocation, sortByDist]);

  const requestLocation = () => {
    setShowLocationPrompt(false);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            granted: true
          });
          setLocationStatus(isKm ? 'ទីតាំងរបស់អ្នកត្រូវបានរកឃើញ!' : 'Location detected!');
        },
        (err) => {
          setLocationStatus(t('locationDenied'));
        }
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isKm ? 'ផែនទីមណ្ឌលសុខភាពកម្ពុជា' : 'Cambodia Healthcare Directory'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t('mapTitle')}</h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-medium">
            {t('mapSubtitle')}
          </p>
        </div>

        <button
          onClick={requestLocation}
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-teal-950 font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all shrink-0"
        >
          <Compass className="w-5 h-5" />
          <span>{t('allowLocation')}</span>
        </button>
      </div>

      {/* Location Permission Modal / Banner (Requirement 43) */}
      {showLocationPrompt && !userLocation.granted && (
        <div className="bg-teal-50 dark:bg-teal-950/40 border-2 border-teal-300 dark:border-teal-800 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-teal-950 dark:text-teal-200 flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-700 dark:text-teal-400" />
              <span>{t('locationPromptTitle')}</span>
            </h3>
            <p className="text-xs text-teal-900 dark:text-teal-300 font-medium">
              {isKm
                ? 'អនុញ្ញាតទីតាំងដើម្បីស្វែងរកមន្ទីរពេទ្យ និងមណ្ឌលសុខភាពដែលនៅជិតលោកអ្នកបំផុត'
                : 'Allow location access to automatically find the nearest healthcare facilities.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={requestLocation}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-xs"
            >
              {t('allowLocation')}
            </button>
            <button
              onClick={() => setShowLocationPrompt(false)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              {t('manualLocation')}
            </button>
          </div>
        </div>
      )}

      {locationStatus && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span>ℹ️ {locationStatus}</span>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Field */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isKm ? 'ស្វែងរកឈ្មោះមន្ទីរពេទ្យ...' : 'Search facility name...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium"
            />
          </div>

          {/* Province Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:border-teal-500"
            >
              {CAMBODIA_PROVINCES.map((prov) => (
                <option key={prov.value} value={prov.value}>
                  {isKm ? prov.label_km : prov.label_en}
                </option>
              ))}
            </select>
          </div>

          {/* Type Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold outline-none focus:border-teal-500"
            >
              <option value="all">{t('allTypes')}</option>
              <option value="hospital">{isKm ? 'មន្ទីរពេទ្យធំ' : 'Hospital'}</option>
              <option value="referral_hospital">{isKm ? 'មន្ទីរពេទ្យបង្អែក' : 'Referral Hospital'}</option>
              <option value="health_centre">{isKm ? 'មណ្ឌលសុខភាព' : 'Health Centre'}</option>
              <option value="clinic">{isKm ? 'គ្លីនិក / សម្ភព' : 'Clinic'}</option>
            </select>
          </div>

          {/* Sort By Distance Toggle */}
          <button
            onClick={() => setSortByDist(!sortByDist)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              sortByDist
                ? 'bg-teal-700 text-white border-teal-700 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>{t('sortByDistance')}</span>
          </button>
        </div>
      </div>

      {/* Main Map & Directory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interactive Leaflet Map Column */}
        <div className="lg:col-span-7 h-[550px]">
          <FacilityMapWrapper
            facilities={facilities}
            userLat={userLocation.lat}
            userLng={userLocation.lng}
          />
        </div>

        {/* Facility Cards Directory Column */}
        <div className="lg:col-span-5 space-y-4 max-h-[550px] overflow-y-auto pr-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              {isKm ? `រកឃើញមណ្ឌលសុខភាពចំនួន (${facilities.length})` : `Facilities Directory (${facilities.length})`}
            </span>
          </div>

          {facilities.length === 0 ? (
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">
              {isKm ? 'មិនមានមណ្ឌលសុខភាពស្របតាមការស្វែងរកទេ' : 'No facilities matched your search.'}
            </div>
          ) : (
            facilities.map((fac, idx) => (
              <div
                key={`${fac.id}-${idx}`}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 uppercase tracking-wider inline-block">
                        {FACILITY_TYPE_LABELS[fac.type]?.[isKm ? 'km' : 'en']}
                      </span>
                      {fac.rating && (
                        <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-300/40 flex items-center gap-1">
                          <span>⭐ {fac.rating.toFixed(1)}</span>
                          <span className="text-slate-500 font-medium text-[10px]">({fac.review_count})</span>
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/facilities/${fac.id}`}
                      className="font-extrabold text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors block"
                    >
                      {isKm ? fac.name_km : fac.name_en}
                    </Link>
                  </div>
                  {fac.emergency_available && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 shrink-0">
                      🚨 24/7 Emergency
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{isKm ? fac.address_km : fac.address_en}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{fac.opening_hours}</span>
                  </div>
                  {fac.distance_km !== undefined && (
                    <div className="text-xs font-extrabold text-teal-700 pt-0.5">
                      📍 {t('distance')}: {fac.distance_km} {t('km')}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/facilities/${fac.id}`}
                    className="flex-1 text-center py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>{isKm ? 'ព័ត៌មានលម្អិត' : 'View Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {fac.phone && (
                    <a
                      href={`tel:${fac.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex-1 text-center py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center gap-1 border border-teal-200 transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{t('callNow')}</span>
                    </a>
                  )}

                  <a
                    href={getGoogleMapsDirectionsUrl(fac)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('getDirections')}</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
