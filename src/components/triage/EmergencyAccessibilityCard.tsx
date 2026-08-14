'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { HealthcareFacility } from '@/types/triage';
import { AlertTriangle, PhoneCall, Navigation, MapPin } from 'lucide-react';

interface EmergencyAccessibilityCardProps {
  topFacility?: HealthcareFacility;
  onExitEmergency?: () => void;
}

export function EmergencyAccessibilityCard({
  topFacility,
  onExitEmergency
}: EmergencyAccessibilityCardProps) {
  const { language } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="bg-rose-950 text-white border-4 border-rose-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-pulse-slow">
      {/* High-visibility Emergency Badge */}
      <div className="flex items-center justify-between border-b border-rose-800 pb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-10 h-10 text-rose-400 animate-bounce" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              🔴 {isKm ? 'ស្ថានភាពបន្ទាន់ខ្លាំង' : 'EMERGENCY ATTENTION'}
            </h2>
            <p className="text-sm font-extrabold text-rose-200">
              {isKm
                ? 'សូមស្វែងរកការថែទាំវេជ្ជសាស្ត្រជាបន្ទាន់ភ្លាមៗ!'
                : 'Please seek emergency medical care immediately!'}
            </p>
          </div>
        </div>

        {onExitEmergency && (
          <button
            onClick={onExitEmergency}
            className="text-xs bg-rose-900/80 hover:bg-rose-900 text-rose-300 font-bold px-3 py-1.5 rounded-xl border border-rose-700"
          >
            {isKm ? 'ចាកចេញពីរបៀបបន្ទាន់' : 'Exit Emergency View'}
          </button>
        )}
      </div>

      {/* Facility Recommendation Box */}
      {topFacility && (
        <div className="bg-rose-900/90 border-2 border-rose-400/60 p-5 rounded-2xl space-y-2">
          <span className="text-xs font-black uppercase text-rose-200 tracking-wider">
            {isKm ? 'មន្ទីរពេទ្យសង្គ្រោះជិតបំផុត (Nearest Suitable Hospital):' : 'Nearest Suitable Hospital:'}
          </span>
          <div className="text-xl font-black text-white">{isKm ? topFacility.name_km : topFacility.name_en}</div>
          <div className="text-xs text-rose-100 flex items-center gap-1 font-semibold">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isKm ? topFacility.address_km : topFacility.address_en}</span>
            {topFacility.distance_km !== undefined && (
              <span className="font-mono text-emerald-300 font-black ml-2">
                ({topFacility.distance_km} km)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Oversized High-Contrast Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <a
          href="tel:119"
          className="py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-rose-300"
        >
          <PhoneCall className="w-8 h-8" />
          <span>📞 {isKm ? 'ហៅ 119 ភ្លាមៗ' : 'CALL 119 NOW'}</span>
        </a>

        {topFacility && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${topFacility.latitude},${topFacility.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-slate-700"
          >
            <Navigation className="w-8 h-8 text-emerald-400" />
            <span>🗺️ {isKm ? 'យកផ្លូវទៅមន្ទីរពេទ្យ' : 'GET DIRECTIONS'}</span>
          </a>
        )}
      </div>
    </div>
  );
}
