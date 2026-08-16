'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Activity, Target, ShieldAlert, Cpu, Heart, CheckCircle2, Hospital } from 'lucide-react';

export default function AboutPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 text-xs font-bold border border-teal-200 dark:border-teal-800">
          <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>SokhaCare AI Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
          {isKm ? 'អំពីប្រព័ន្ធ SokhaCare AI' : 'About SokhaCare AI'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          {t('subTagline')}
        </p>
      </div>

      {/* Grid: Mission, Problem, Solution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Our Mission */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('missionTitle')}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t('missionDesc')}</p>
        </div>

        {/* The Problem */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isKm ? 'បញ្ហាប្រឈម (The Problem)' : 'The Healthcare Challenge'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isKm
              ? 'ប្រជាជនកម្ពុជាច្រើនតែពន្យារពេលពិនិត្យសុខភាព ឬធ្វើឲ្យមានការកកស្ទះនៅមន្ទីរពេទ្យធំៗសម្រាប់ជំងឺកម្រិតស្រាល ដោយសារកង្វះប្រព័ន្ធណែនាំសុខភាពជាភាសាខ្មែរ។'
              : 'Cambodians often delay seeking medical care or overcrowd major national hospitals for minor concerns due to limited healthcare triage options.'}
          </p>
        </div>

        {/* The Solution */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {isKm ? 'ដំណោះស្រាយរបស់យើង' : 'Our AI Solution'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isKm
              ? 'ការរួមបញ្ចូលគ្នារវាង AI វាយតម្លៃរោគសញ្ញាតាមសំឡេង/អក្សរខ្មែរ និងប្រព័ន្ធតម្រង់ទិសទៅកាន់មណ្ឌលសុខភាព/គ្លីនិកដែលនៅជិតបំផុត។'
              : 'A lightweight AI assistant taking Khmer voice & text symptoms, triaging urgency levels, and directing patients to appropriate nearby clinics and hospitals.'}
          </p>
        </div>
      </div>

      {/* Technical Architecture Overview */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-extrabold text-emerald-400 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>System Architecture & Workflow</span>
        </h3>

        <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl font-mono text-xs text-teal-200 overflow-x-auto space-y-2 leading-relaxed">
          <div className="text-white font-bold text-sm mb-2">User (Khmer Text or Voice Input)</div>
          <div>↓</div>
          <div>Web Speech API (km-KH) / Speech-to-Text</div>
          <div>↓</div>
          <div>AIService Abstraction (Gemini 2.5 Flash / Demo AI Engine)</div>
          <div>↓</div>
          <div>Structured Triage Engine (Red Flag Detection + Urgency Classification)</div>
          <div>↓</div>
          <div>Structured JSON Output (EMERGENCY / URGENT / ROUTINE / SELF-CARE)</div>
          <div>↓</div>
          <div>Facility Matcher & Live Google Maps Navigation (Geo-Distance Calculation)</div>
        </div>
      </div>
    </div>
  );
}
