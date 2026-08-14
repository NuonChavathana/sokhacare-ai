'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, ShieldAlert, CheckCircle2, Lock, Cpu, MapPin, Info } from 'lucide-react';

export default function TrustCenterPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs font-bold text-teal-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>SokhaCare AI Trust Center & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {isKm ? 'មជ្ឈមណ្ឌលទំនុកចិត្ត និងតម្លាភាព' : 'Platform Trust Center'}
        </h1>
        <p className="text-sm text-teal-100/90 font-medium">
          {isKm
            ? 'ការប្តេជ្ញាចិត្តលើសុវត្ថិភាព ឯកជនភាព និងការកំណត់ព្រំដែនច្បាស់លាស់នៃបច្ចេកវិទ្យា AI'
            : 'Our commitments to patient safety, session privacy, AI guardrails, and data transparency.'}
        </p>
      </div>

      {/* Grid: What SokhaCare AI Does vs Does NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What it DOES */}
        <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>{isKm ? 'អ្វីដែល SokhaCare AI ផ្តល់ជូន' : 'What SokhaCare AI Does'}</span>
          </h3>

          <ul className="space-y-2 text-xs font-semibold text-emerald-950">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{isKm ? 'ការវាយតម្លៃកម្រិតបន្ទាន់បឋម (Preliminary Triage)' : 'Preliminary urgency classification (Emergency, Urgent, Routine, Self-care)'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{isKm ? 'ការស្វែងរកសញ្ញាព្រមានគ្រោះថ្នាក់ (Red-Flag Emergency Detection)' : 'Immediate detection of red-flag emergency symptoms'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{isKm ? 'ការតម្រង់ទិសទៅកាន់មន្ទីរពេទ្យ/មណ្ឌលសុខភាពសមស្រប' : 'Navigation to suitable nearby hospitals and clinics'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{isKm ? 'ការសម្រួលភាសាខ្មែរតាមសំឡេង និងអក្សរ' : 'Accessible Khmer voice & text interface'}</span>
            </li>
          </ul>
        </div>

        {/* What it DOES NOT DO */}
        <div className="bg-rose-50/70 border-2 border-rose-300 rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-extrabold text-rose-950 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>{isKm ? 'អ្វីដែល SokhaCare AI មិនធ្វើឡើយ' : 'What SokhaCare AI Does NOT Do'}</span>
          </h3>

          <ul className="space-y-2 text-xs font-semibold text-rose-950">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>{isKm ? 'មិនធ្វើរោគវិនិច្ឆ័យជំងឺជាដាច់ខាត (No Medical Diagnosis)' : 'Does NOT diagnose diseases or give medical guarantees'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>{isKm ? 'មិនជំនួសមុខតំណែងវេជ្ជបណ្ឌិត ឬគ្រូពេទ្យ' : 'Does NOT replace real doctors or hospital evaluation'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>{isKm ? 'មិនចេញវេជ្ជបញ្ជាថ្នាំ ឬព្យាបាលជំងឺ' : 'Does NOT prescribe medications or dosage instructions'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span>{isKm ? 'មិនរក្សាទុកទិន្នន័យវេជ្ជសាស្ត្រសម្ងាត់ដោយគ្មានការអនុញ្ញាត' : 'Does NOT store sensitive health records unnecessarily'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Data & AI Transparency Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Lock className="w-6 h-6 text-teal-600" />
          <span>Data Privacy & AI Guardrails Protocol</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Location Data Consent</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              Geolocation is only requested to compute distances to nearby Cambodian healthcare facilities. Users can choose manual province selection anytime.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-600" />
              <span>AI Provider Isolation</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              All AI processing flows through `AIService` abstraction with server-side validation layers. Red-flag emergency safety rules execute deterministically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
