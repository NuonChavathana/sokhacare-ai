'use client';

import React, { Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ChatWindow } from '@/components/triage/ChatWindow';
import { ShieldAlert, Sparkles } from 'lucide-react';

export default function TriagePage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isKm ? 'ការពិនិត្យរោគសញ្ញាសុខភាព AI' : 'AI Health Symptom Triage'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t('triageTitle')}</h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-medium">
            {t('triageSubtitle')}
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-xs text-xs space-y-2 shrink-0">
          <div className="font-bold text-rose-300 flex items-center gap-1.5 uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Red Flags</span>
          </div>
          <p className="text-white/90 max-w-xs leading-normal font-medium">
            {isKm
              ? 'ប្រសិនបើមានការឈឺទ្រូងខ្លាំង ពិបាកដកដង្ហើម ឬសន្លប់ សូមប្រញាប់ហៅ 119 ភ្លាមៗ'
              : 'Severe chest pain or choking requires immediate emergency call 119.'}
          </p>
        </div>
      </div>

      {/* Main Chat Assistant Component wrapped in Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="h-[600px] bg-white rounded-3xl border border-teal-100 p-8 flex items-center justify-center text-slate-400 font-semibold text-sm">
            <span className="inline-block w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mr-2" />
            Loading SokhaCare AI Triage Assistant...
          </div>
        }
      >
        <ChatWindow />
      </Suspense>
    </div>
  );
}
