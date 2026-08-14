'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Compass, CheckCircle2, Clock, Sparkles, Building2, Calendar, ShieldCheck } from 'lucide-react';

export default function RoadmapPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const phases = [
    {
      phase: 'Phase 1 (Implemented)',
      title_km: 'ការវាយតម្លៃរោគសញ្ញាតាម AI និងការតម្រង់ទិសចម្ងាយ',
      title_en: 'Khmer AI Triage & OpenStreetMap Navigation MVP',
      status: 'Implemented / LIVE DEMO',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      items: [
        'Khmer voice & text symptom triage (Web Speech API)',
        'Red-flag emergency detection & 119 emergency call dispatch',
        'Leaflet OpenStreetMap healthcare facility directory',
        'Smart Health Navigation scoring engine'
      ]
    },
    {
      phase: 'Phase 2 (Planned)',
      title_km: 'បណ្តាញផ្ទៀងផ្ទាត់ទិន្នន័យមណ្ឌលសុខភាពផ្លូវការ',
      title_en: 'Verified Healthcare Facility Data Sync',
      status: 'Planned (Phase 2)',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      items: [
        'Direct synchronization with Ministry of Health facility dataset',
        'Real-time bed availability & emergency ICU capacity tracking',
        'Multi-lingual support (Khmer, English, Chinese)'
      ]
    },
    {
      phase: 'Phase 3 (Planned)',
      title_km: 'ប្រព័ន្ធច្រកចូលសម្រាប់គ្រូពេទ្យ និងការណាត់ជួប',
      title_en: 'Healthcare Provider Portal & Direct Booking',
      status: 'Planned (Phase 3)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      items: [
        'Provider portal for hospital administrators',
        'Direct online consultation appointment booking',
        'Ambulance dispatch integration with 119/115'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Platform Expansion Roadmap</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isKm ? 'ផែនការអភិវឌ្ឍន៍ SokhaCare AI' : 'SokhaCare AI Product Roadmap'}
        </h1>
        <p className="text-sm text-teal-100/90 font-medium">
          Strategic development phases from hackathon MVP to national digital health platform.
        </p>
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        {phases.map((p, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">{isKm ? p.title_km : p.title_en}</h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${p.badgeColor}`}>
                {p.status}
              </span>
            </div>

            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              {p.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
