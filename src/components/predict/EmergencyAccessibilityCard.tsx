'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { HealthcareFacility } from '@/types/triage';
import { AlertTriangle, PhoneCall, Navigation, MapPin, HeartPulse } from 'lucide-react';

interface EmergencyAccessibilityCardProps {
  topFacility?: HealthcareFacility;
  probability?: number;
  onExitEmergency?: () => void;
}

export function EmergencyAccessibilityCard({
  topFacility,
  probability,
  onExitEmergency
}: EmergencyAccessibilityCardProps) {
  const { language } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="bg-gradient-to-br from-rose-950 via-rose-900 to-red-950 text-white border-4 border-rose-500 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-rose-950/60 animate-pulse-slow">
      {/* High-visibility Emergency Header */}
      <div className="flex items-start sm:items-center justify-between border-b border-rose-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600 rounded-2xl animate-bounce text-white">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400 text-[11px] font-black text-rose-200 uppercase mb-1">
              <HeartPulse className="w-3.5 h-3.5" />
              <span>{isKm ? 'ហានិភ័យបេះដូងកម្រិតធ្ងន់ធ្ងរ' : 'HIGH CARDIAC RISK DETECTED'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {isKm ? 'ត្រូវការការយកចិត្តទុកដាក់បន្ទាន់' : 'CRITICAL CARDIAC ATTENTION'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-rose-200 mt-0.5">
              {isKm
                ? 'សូមស្វែងរកការពិនិត្យពីវេជ្ជបណ្ឌិត ឬមន្ទីរពេទ្យឯកទេសបេះដូងជាបន្ទាន់!'
                : 'Please seek urgent clinical evaluation at a specialized cardiac facility immediately!'}
            </p>
          </div>
        </div>

        {onExitEmergency && (
          <button
            onClick={onExitEmergency}
            className="text-xs bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-bold px-3 py-1.5 rounded-xl border border-rose-700 transition-colors shrink-0"
          >
            {isKm ? 'បិទ' : 'Dismiss'}
          </button>
        )}
      </div>

      {/* Emergency Facility Recommendation Box */}
      {topFacility && (
        <div className="bg-rose-900/80 border-2 border-rose-400/60 p-5 rounded-2xl space-y-2 backdrop-blur-xs">
          <span className="text-xs font-black uppercase text-rose-200 tracking-wider flex items-center gap-1">
            <MapPin className="w-4 h-4 text-emerald-400" />
            {isKm ? 'មន្ទីរពេទ្យព្យាបាលបេះដូងជិតបំផុត (Nearest Cardiac Hospital):' : 'Nearest Suitable Cardiac Hospital:'}
          </span>
          <div className="text-xl font-black text-white">{isKm ? topFacility.name_km : topFacility.name_en}</div>
          <div className="text-xs text-rose-100 flex flex-wrap items-center gap-2 font-semibold">
            <span>{isKm ? topFacility.address_km : topFacility.address_en}</span>
            {topFacility.distance_km !== undefined && (
              <span className="font-mono text-emerald-300 font-black px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40">
                {topFacility.distance_km} km
              </span>
            )}
          </div>
          {topFacility.phone && (
            <div className="text-xs text-teal-200 font-bold pt-1">
              Tel: <a href={`tel:${topFacility.phone}`} className="underline hover:text-white">{topFacility.phone}</a>
            </div>
          )}
        </div>
      )}

      {/* Oversized High-Contrast Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <a
          href="tel:119"
          className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-rose-300"
        >
          <PhoneCall className="w-7 h-7" />
          <span>{isKm ? '📞 ហៅ 119 សង្គ្រោះបន្ទាន់' : '📞 CALL 119 AMBULANCE'}</span>
        </a>

        {topFacility ? (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${topFacility.latitude},${topFacility.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-slate-700"
          >
            <Navigation className="w-7 h-7 text-emerald-400" />
            <span>{isKm ? '🗺️ យកផ្លូវទៅមន្ទីរពេទ្យ' : '🗺️ GET DIRECTIONS'}</span>
          </a>
        ) : (
          <a
            href="tel:115"
            className="py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-slate-700"
          >
            <PhoneCall className="w-7 h-7 text-amber-400" />
            <span>{isKm ? '📞 ហៅ 115 CDC Hotline' : '📞 CALL 115 HOTLINE'}</span>
          </a>
        )}
      </div>
    </div>
  );
}
