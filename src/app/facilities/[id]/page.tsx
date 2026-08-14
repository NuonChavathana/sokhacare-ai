'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { CAMBODIA_FACILITIES, FACILITY_TYPE_LABELS } from '@/lib/data/facilities';
import {
  MapPin,
  PhoneCall,
  Navigation,
  Clock,
  ShieldAlert,
  Building2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function FacilityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { language, t } = useLanguage();
  const router = useRouter();
  const isKm = language === 'km';

  const facility = CAMBODIA_FACILITIES.find((f) => f.id === resolvedParams.id);

  if (!facility) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Facility Not Found</h2>
        <p className="text-sm text-slate-500">The healthcare facility you requested does not exist.</p>
        <Link
          href="/facilities"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToFacilities')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          href="/facilities"
          className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToFacilities')}</span>
        </Link>
      </div>

      {/* Main Detail Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider">
              {FACILITY_TYPE_LABELS[facility.type]?.[isKm ? 'km' : 'en']}
            </span>
            <span className="text-xs bg-emerald-400 text-teal-950 font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-950 animate-pulse" />
              {t('demoDataBadge')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold">{isKm ? facility.name_km : facility.name_en}</h1>

          <div className="flex items-center gap-2 text-sm text-teal-100">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{isKm ? facility.address_km : facility.address_en}</span>
          </div>
        </div>

        {/* Facility Info Grid */}
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">{isKm ? 'ខេត្ត/ក្រុង' : 'Province'}:</span>
              <div className="text-base font-extrabold text-slate-900">{facility.province}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">{isKm ? 'ខណ្ឌ/ស្រុក' : 'District'}:</span>
              <div className="text-base font-extrabold text-slate-900">{facility.district}</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase">{t('openHours')}:</span>
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{facility.opening_hours}</span>
              </div>
            </div>
          </div>

          {/* Emergency Availability Card */}
          <div
            className={`p-5 rounded-2xl border-2 flex items-center justify-between ${
              facility.emergency_available
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider">
                {isKm ? 'សេវាសង្គ្រោះបន្ទាន់ (Emergency Care):' : 'Emergency Capabilities:'}
              </span>
              <div className="text-base font-extrabold flex items-center gap-2">
                {facility.emergency_available ? (
                  <>
                    <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                    <span>{t('emergency24h')}</span>
                  </>
                ) : (
                  <span>{isKm ? 'មិនមានសេវាសង្គ្រោះបន្ទាន់ 24/7 ទេ' : 'Standard Operating Hours Only'}</span>
                )}
              </div>
            </div>

            {facility.emergency_phone && (
              <a
                href={`tel:${facility.emergency_phone.replace(/[^0-9+]/g, '')}`}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{facility.emergency_phone}</span>
              </a>
            )}
          </div>

          {/* Services Offered */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {t('servicesProvided')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {facility.services.map((serv, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center gap-2 text-xs font-bold text-teal-900">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{serv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {facility.phone && (
              <a
                href={`tel:${facility.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full py-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{t('callNow')} ({facility.phone})</span>
              </a>
            )}

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Navigation className="w-5 h-5 text-emerald-400" />
              <span>{t('getDirections')} (Google Maps)</span>
            </a>
          </div>

          {/* Verification Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 font-medium">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-700" />
              <span>{isKm ? 'ការដាស់តឿនផ្ទៀងផ្ទាត់ទិន្នន័យ៖' : 'Data Verification Notice:'}</span>
            </div>
            <p>{t('facilityDetailDisclaimer')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
