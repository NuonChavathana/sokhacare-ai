'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Building2, ShieldCheck, Clock, PhoneCall, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ProviderPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-xs font-bold text-teal-300">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Healthcare Provider Portal</span>
          </div>

          <span className="px-3 py-1 bg-amber-400 text-slate-950 font-extrabold text-xs rounded-full">
            {t('comingSoon')}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {isKm ? 'ច្រកចូលសម្រាប់មន្ទីរពេទ្យ និងមណ្ឌលសុខភាព' : 'Healthcare Provider Dashboard'}
        </h1>
        <p className="text-sm text-slate-300 font-medium">
          {isKm
            ? 'ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យមណ្ឌលសុខភាព ម៉ោងបើកទ្វារ និងសេវាសង្គ្រោះបន្ទាន់'
            : 'Manage facility profiles, emergency availability, service offerings, and patient routing stats.'}
        </p>
      </div>

      {/* Feature Preview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 opacity-75">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Facility Profile & Capabilities</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Update facility details, available beds, surgical teams, and 24/7 ICU status in real time.
          </p>
          <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Future Module
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 opacity-75">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">Emergency Dispatch Integration</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Receive direct red-flag emergency notifications and coordinate referral patient arrivals.
          </p>
          <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Future Module
          </span>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isKm ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
        </Link>
      </div>
    </div>
  );
}
