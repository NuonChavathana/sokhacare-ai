'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useDataSaver } from '@/context/DataSaverContext';
import {
  Sparkles,
  Mic,
  MapPin,
  ShieldAlert,
  Activity,
  ArrowRight,
  HeartPulse,
  Hospital,
  ChevronRight,
  AlertTriangle,
  Users,
  Presentation,
  ShieldCheck,
  Cpu,
  Building2,
  Compass,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { language, t } = useLanguage();
  const { isDataSaver } = useDataSaver();
  const isKm = language === 'km';

  return (
    <div className="space-y-16 pb-16 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-teal-950 via-teal-900 to-slate-950 text-white pt-12 sm:pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background glow if not in data saver */}
        {!isDataSaver && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-emerald-500/15 blur-[140px] rounded-full pointer-events-none" />
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-200 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>SokhaCare AI • Khmer Digital Health Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              {isKm ? t('heroTitleKm') : t('heroTitleEn')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 mt-2">
                SokhaCare AI Platform
              </span>
            </h1>

            <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {isKm ? t('heroSubtitleKm') : t('heroSubtitleEn')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/triage"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-lg shadow-xl shadow-teal-900/50 flex items-center justify-center gap-3 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span>{t('startCheckup')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/facilities"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base flex items-center justify-center gap-2 transition-all backdrop-blur-xs"
              >
                <Hospital className="w-5 h-5 text-teal-300" />
                <span>{t('findHospitals')}</span>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-teal-800/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-2xl font-extrabold text-emerald-300">100%</div>
                <div className="text-xs text-teal-200">{isKm ? 'ភាសាខ្មែរ & សំឡេង' : 'Khmer Voice & Text'}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-300">24/7</div>
                <div className="text-xs text-teal-200">{isKm ? 'ការវាយតម្លៃបឋម' : 'Instant AI Triage'}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-300">15+</div>
                <div className="text-xs text-teal-200">{isKm ? 'មន្ទីរពេទ្យកម្ពុជា' : 'Cambodian Hospitals'}</div>
              </div>
            </div>
          </div>

          {/* Right AI Interaction Preview Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-slate-900/90 border border-teal-500/30 p-6 rounded-3xl backdrop-blur-md shadow-2xl space-y-5 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-md">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-sm">AI Interaction Preview</div>
                    <div className="text-xs text-emerald-300 font-medium">Khmer Voice & Red-Flag Triage</div>
                  </div>
                </div>
                <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-400/40 px-2 py-0.5 rounded-full font-bold">
                  Red-Flag Test
                </span>
              </div>

              {/* Sample Dialog Bubbles */}
              <div className="space-y-3 text-xs">
                {/* User Message */}
                <div className="bg-teal-800/60 text-teal-50 p-3.5 rounded-2xl rounded-tr-none font-semibold ml-auto max-w-[85%] border border-teal-600/40 shadow-xs">
                  "{t('previewQuery')}"
                </div>

                {/* AI Emergency Response */}
                <div className="bg-rose-950/90 border border-rose-500/60 text-white p-4 rounded-2xl rounded-tl-none font-medium max-w-[95%] shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      {t('previewBadge')}
                    </span>
                    <span className="text-[10px] bg-rose-900/80 px-2 py-0.5 rounded-full text-rose-200">
                      Emergency Mode
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-rose-100 font-medium">
                    {t('previewText')}
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/facilities"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 underline"
                    >
                      <span>{t('previewLink')}</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/triage"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm transition-all shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isKm ? 'សាកល្បងពិនិត្យរោគសញ្ញាឥឡូវនេះ' : 'Test AI Triage Now'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY DISCLAIMER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-extrabold text-rose-950 flex items-center gap-2">
              {t('disclaimerTitle')}
            </h3>
            <p className="text-sm font-medium text-rose-900 leading-relaxed">
              {t('disclaimerText')}
            </p>
          </div>
        </div>
      </section>

      {/* "HOW IT WORKS" VISUAL WORKFLOW SECTION (Requirement 108) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isKm ? 'របៀបដែលប្រព័ន្ធដំណើរការ (How It Works)' : 'How SokhaCare AI Works'}
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            {isKm ? 'ដំណើរការ ៥ ជំហានសាមញ្ញ សម្រាប់ការថែទាំសុខភាពទាន់ពេលវេលា' : '5 simple steps connecting symptoms to the right healthcare facility'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center mx-auto text-base">
              1
            </div>
            <div className="font-extrabold text-xs text-slate-900">{isKm ? 'រៀបរាប់រោគសញ្ញា' : 'Describe Symptoms'}</div>
            <div className="text-[11px] text-slate-500">{isKm ? 'តាមសំឡេង ឬអក្សរខ្មែរ' : 'Khmer Voice or Text'}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center mx-auto text-base">
              2
            </div>
            <div className="font-extrabold text-xs text-slate-900">{isKm ? 'វិភាគរោគសញ្ញា AI' : 'AI Triage'}</div>
            <div className="text-[11px] text-slate-500">{isKm ? 'ស្វែងរកសញ្ញាអាសន្ន' : 'Red Flag Detection'}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center mx-auto text-base">
              3
            </div>
            <div className="font-extrabold text-xs text-slate-900">{isKm ? 'វាយតម្លៃកម្រិតបន្ទាន់' : 'Urgency Assessment'}</div>
            <div className="text-[11px] text-slate-500">{isKm ? 'ស្ថានភាពបន្ទាន់ / ធម្មតា' : 'Urgency Level Output'}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center mx-auto text-base">
              4
            </div>
            <div className="font-extrabold text-xs text-slate-900">{isKm ? 'ស្វែងរកមណ្ឌលសុខភាព' : 'Find Care Level'}</div>
            <div className="text-[11px] text-slate-500">{isKm ? 'តម្រៀបតាមចម្ងាយ' : 'Smart Navigation Scoring'}</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-2 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center mx-auto text-base">
              5
            </div>
            <div className="font-extrabold text-xs text-slate-900">{isKm ? 'ធ្វើសកម្មភាពថែទាំ' : 'Take Action'}</div>
            <div className="text-[11px] text-slate-500">{isKm ? 'ហៅ 119 ឬទៅមន្ទីរពេទ្យ' : 'Call 119 or Get Directions'}</div>
          </div>
        </div>
      </section>

      {/* QUICK REAL-WORLD PLATFORM MODULES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
          {isKm ? 'ម៉ូឌុលវេទិកា AI សុខាភិបាល' : 'Real-World Platform Modules'}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Link
            href="/triage"
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-1.5"
          >
            <Sparkles className="w-5 h-5 text-teal-600" />
            <div className="font-extrabold text-xs text-slate-900">{t('navTriage')}</div>
            <div className="text-[10px] text-slate-500">Khmer Triage</div>
          </Link>

          <Link
            href="/family"
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-1.5"
          >
            <Users className="w-5 h-5 text-emerald-600" />
            <div className="font-extrabold text-xs text-slate-900">{t('navFamily')}</div>
            <div className="text-[10px] text-slate-500">Family Roles</div>
          </Link>

          <Link
            href="/facilities"
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-1.5"
          >
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="font-extrabold text-xs text-slate-900">{t('navFacilities')}</div>
            <div className="text-[10px] text-slate-500">OpenStreetMap</div>
          </Link>

          <Link
            href="/trust"
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-1.5"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div className="font-extrabold text-xs text-slate-900">Trust Center</div>
            <div className="text-[10px] text-slate-500">AI Privacy & Rules</div>
          </Link>

          <Link
            href="/evaluation"
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-1.5"
          >
            <Cpu className="w-5 h-5 text-purple-600" />
            <div className="font-extrabold text-xs text-slate-900">AI Evaluation</div>
            <div className="text-[10px] text-slate-500">Model Bench</div>
          </Link>

          <Link
            href="/roadmap"
            className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-teal-400 hover:shadow-md transition-all space-y-1.5"
          >
            <Compass className="w-5 h-5 text-amber-600" />
            <div className="font-extrabold text-xs text-slate-900">Roadmap</div>
            <div className="text-[10px] text-slate-500">Phase 1 - Phase 5</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
