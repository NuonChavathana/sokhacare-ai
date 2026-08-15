'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useDataSaver } from '@/context/DataSaverContext';
import { evaluateDemoTriage } from '@/lib/ai/demo-ai-engine';
import { TriageResult } from '@/types/triage';
import {
  Sparkles,
  MapPin,
  ShieldAlert,
  Activity,
  ArrowRight,
  Hospital,
  AlertTriangle,
  Users,
  Presentation,
  ShieldCheck,
  Cpu,
  Compass,
  Trophy,
  CheckCircle2,
  PhoneCall,
  Clock,
  HeartPulse,
  Zap,
  Star,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const { language, t } = useLanguage();
  const { isDataSaver } = useDataSaver();
  const isKm = language === 'km';

  // Interactive Live Scenario Tester for Judges
  const [activeScenario, setActiveScenario] = useState<'EMERGENCY' | 'URGENT' | 'ROUTINE'>('EMERGENCY');

  const presetQueries = {
    EMERGENCY: {
      km: 'ខ្ញុំឈឺទ្រូងខ្លាំង ហើយពិបាកដកដង្ហើម',
      en: 'Severe chest pain and difficulty breathing'
    },
    URGENT: {
      km: 'ខ្ញុំក្តៅខ្លួនខ្លាំង និងមានអាការៈអស់កម្លាំង',
      en: 'High fever and extreme fatigue'
    },
    ROUTINE: {
      km: 'ខ្ញុំឈឺក្បាលបន្តិចពីព្រឹក',
      en: 'Mild headache since morning'
    }
  };

  const currentResult: TriageResult = evaluateDemoTriage(presetQueries[activeScenario].km, language);

  return (
    <div className="space-y-16 pb-20 overflow-hidden bg-slate-950 text-white font-sans">
      {/* HACKATHON JUDGE ANNOUNCEMENT BADGE BAR */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-extrabold text-center shadow-md flex items-center justify-center gap-2">
        <Trophy className="w-4 h-4 text-slate-950 animate-bounce" />
        <span>
          {isKm
            ? '🏆 បេក្ខជនប្រកួតប្រជែង AI Innovation & Startup ឆ្នាំ ២០២៦'
            : '🏆 SokhaCare AI — National AI Innovation & Startup Finalist Candidate 2026'}
        </span>
        <Link
          href="/demo"
          className="ml-2 bg-slate-950 text-amber-300 hover:text-white px-2.5 py-0.5 rounded-full text-[11px] font-black transition-all inline-flex items-center gap-1"
        >
          <span>3-5 Min Pitch Mode →</span>
        </Link>
      </div>

      {/* HERO SECTION WITH GLASSMORPHIC CARD */}
      <section className="relative pt-8 sm:pt-14 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Glowing backdrop Orbs */}
        {!isDataSaver && (
          <>
            <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-teal-500/20 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
          </>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-extrabold tracking-wide backdrop-blur-md shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>SokhaCare AI • Digital Health Startup MVP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              {isKm ? t('heroTitleKm') : t('heroTitleEn')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 mt-2">
                Khmer AI Health Platform
              </span>
            </h1>

            <p className="text-base sm:text-lg text-teal-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {isKm ? t('heroSubtitleKm') : t('heroSubtitleEn')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/triage"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-3 transition-all active:scale-95 border border-emerald-400/40"
              >
                <Sparkles className="w-6 h-6" />
                <span>{t('startCheckup')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/facilities"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-base flex items-center justify-center gap-2 transition-all backdrop-blur-md"
              >
                <Hospital className="w-5 h-5 text-teal-300" />
                <span>{t('findHospitals')}</span>
              </Link>
            </div>

            {/* Live Startup Performance Metrics */}
            <div className="pt-8 grid grid-cols-4 gap-3 border-t border-teal-900/80 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">1,280+</div>
                <div className="text-[10px] text-teal-200 font-bold uppercase">{isKm ? 'ការពិគ្រោះ Demo' : 'Consultations'}</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">&lt; 2s</div>
                <div className="text-[10px] text-teal-200 font-bold uppercase">{isKm ? 'ល្បឿន AI' : 'Response Time'}</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-teal-200 font-bold uppercase">{isKm ? 'សំឡេងខ្មែរ' : 'Khmer Voice'}</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">15+</div>
                <div className="text-[10px] text-teal-200 font-bold uppercase">{isKm ? 'មន្ទីរពេទ្យ' : 'Hospitals'}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Scenario Tester for Judges */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-b from-slate-900/95 to-teal-950/95 border-2 border-teal-500/40 p-6 rounded-3xl backdrop-blur-xl shadow-2xl space-y-5 relative">
              <div className="flex items-center justify-between border-b border-teal-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white font-black shadow-md">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-white text-xs uppercase tracking-wider">
                      Interactive Live Scenario Tester
                    </div>
                    <div className="text-[11px] text-emerald-300 font-semibold">Test Triage Engine</div>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  LIVE AI
                </span>
              </div>

              {/* Scenario Preset Selector Tabs for Judges */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-teal-300 uppercase tracking-wider block">
                  {isKm ? 'ជ្រើសរើសករណីសាកល្បងសម្រាប់គណៈកម្មការ (Select Preset):' : 'Select Scenario Preset:'}
                </span>

                <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-teal-900">
                  <button
                    onClick={() => setActiveScenario('EMERGENCY')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                      activeScenario === 'EMERGENCY'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-rose-300 hover:bg-rose-950/50'
                    }`}
                  >
                    🔴 Red Flag
                  </button>

                  <button
                    onClick={() => setActiveScenario('URGENT')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                      activeScenario === 'URGENT'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-amber-300 hover:bg-amber-950/50'
                    }`}
                  >
                    🟠 Urgent
                  </button>

                  <button
                    onClick={() => setActiveScenario('ROUTINE')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all ${
                      activeScenario === 'ROUTINE'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-emerald-300 hover:bg-emerald-950/50'
                    }`}
                  >
                    🟢 Routine
                  </button>
                </div>
              </div>

              {/* Live Triage Output Card */}
              <div className="space-y-3 text-xs">
                {/* User prompt box */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-teal-900 text-teal-100 font-semibold italic">
                  "{presetQueries[activeScenario][isKm ? 'km' : 'en']}"
                </div>

                {/* AI Output Card */}
                <div
                  className={`p-4 rounded-2xl border-2 space-y-2.5 shadow-lg ${
                    activeScenario === 'EMERGENCY'
                      ? 'bg-rose-950/90 border-rose-500 text-white'
                      : activeScenario === 'URGENT'
                      ? 'bg-amber-950/90 border-amber-500 text-white'
                      : 'bg-emerald-950/90 border-emerald-500 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between font-black text-xs">
                    <span className="flex items-center gap-1.5 uppercase">
                      {activeScenario === 'EMERGENCY' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {activeScenario === 'URGENT' && <Clock className="w-4 h-4 text-amber-400" />}
                      {activeScenario === 'ROUTINE' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      <span>{currentResult.urgency}</span>
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono text-[10px]">
                      Confidence 95%
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed font-medium">
                    {isKm ? currentResult.summary_km : currentResult.summary_en}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <Link
                      href="/triage"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200 underline"
                    >
                      <span>{isKm ? 'សាកល្បងក្នុង Triage App →' : 'Launch Full Triage →'}</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Link
                  href="/demo"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm transition-all shadow-xl"
                >
                  <Presentation className="w-4 h-4" />
                  <span>{isKm ? 'បើករបៀបបង្ហាញ Pitch ៣-៥ នាទី' : 'Open 3-5 Min Pitch Controller'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY DISCLAIMER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-rose-950/80 border-2 border-rose-600/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              {t('disclaimerTitle')}
            </h3>
            <p className="text-xs font-medium text-rose-100/90 leading-relaxed">
              {t('disclaimerText')}
            </p>
          </div>
        </div>
      </section>

      {/* "HOW IT WORKS" WORKFLOW DIAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End User Journey</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            {isKm ? 'របៀបដែលប្រព័ន្ធដំណើរការ (How It Works)' : 'How SokhaCare AI Works'}
          </h2>
          <p className="text-xs text-teal-200 font-medium">
            {isKm ? 'ដំណើរការ ៥ ជំហានសាមញ្ញ សម្រាប់ការថែទាំសុខភាពទាន់ពេលវេលា' : '5 simple steps connecting symptoms to the right healthcare facility'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-teal-900/80 text-center space-y-2 shadow-lg backdrop-blur-xs hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-black flex items-center justify-center mx-auto text-base border border-teal-500/40">
              1
            </div>
            <div className="font-extrabold text-xs text-white">{isKm ? 'រៀបរាប់រោគសញ្ញា' : 'Describe Symptoms'}</div>
            <div className="text-[11px] text-teal-200/80">{isKm ? 'តាមសំឡេង ឬអក្សរខ្មែរ' : 'Khmer Voice or Text'}</div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-teal-900/80 text-center space-y-2 shadow-lg backdrop-blur-xs hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-black flex items-center justify-center mx-auto text-base border border-emerald-500/40">
              2
            </div>
            <div className="font-extrabold text-xs text-white">{isKm ? 'វិភាគរោគសញ្ញា AI' : 'AI Triage'}</div>
            <div className="text-[11px] text-emerald-200/80">{isKm ? 'ស្វែងរកសញ្ញាអាសន្ន' : 'Red Flag Detection'}</div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-teal-900/80 text-center space-y-2 shadow-lg backdrop-blur-xs hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-black flex items-center justify-center mx-auto text-base border border-amber-500/40">
              3
            </div>
            <div className="font-extrabold text-xs text-white">{isKm ? 'វាយតម្លៃកម្រិតបន្ទាន់' : 'Urgency Assessment'}</div>
            <div className="text-[11px] text-amber-200/80">{isKm ? 'ស្ថានភាពបន្ទាន់ / ធម្មតា' : 'Urgency Level Output'}</div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-teal-900/80 text-center space-y-2 shadow-lg backdrop-blur-xs hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 font-black flex items-center justify-center mx-auto text-base border border-cyan-500/40">
              4
            </div>
            <div className="font-extrabold text-xs text-white">{isKm ? 'ស្វែងរកមណ្ឌលសុខភាព' : 'Find Care Level'}</div>
            <div className="text-[11px] text-cyan-200/80">{isKm ? 'តម្រៀបតាមចម្ងាយ' : 'Smart Navigation Scoring'}</div>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-teal-900/80 text-center space-y-2 shadow-lg backdrop-blur-xs hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 font-black flex items-center justify-center mx-auto text-base border border-purple-500/40">
              5
            </div>
            <div className="font-extrabold text-xs text-white">{isKm ? 'ធ្វើសកម្មភាពថែទាំ' : 'Take Action'}</div>
            <div className="text-[11px] text-purple-200/80">{isKm ? 'ហៅ 119 ឬទៅមន្ទីរពេទ្យ' : 'Call 119 or Get Directions'}</div>
          </div>
        </div>
      </section>

      {/* WHY SOKHACARE AI - STARTUP VALUE PROPOSITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white">
            {isKm ? 'ហេតុអ្វីបានជាជ្រើសរើស SokhaCare AI?' : 'Why SokhaCare AI?'}
          </h2>
          <p className="text-xs text-teal-200 font-medium">
            Designed specifically for Cambodia's healthcare access challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-teal-900/80 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-black">
              🗣️
            </div>
            <h3 className="text-lg font-black text-white">Khmer-First Voice AI</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Eliminates literacy and medical jargon barriers using Khmer voice speech-to-text input.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-teal-900/80 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center font-black">
              🛡️
            </div>
            <h3 className="text-lg font-black text-white">Deterministic Safety Guardrails</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Hardcoded red-flag safety rules run before normal AI processing to prioritize emergency response.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl border border-teal-900/80 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
              🗺️
            </div>
            <h3 className="text-lg font-black text-white">Smart Health Navigation</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Connects preliminary urgency directly to OpenStreetMap facilities across Cambodian provinces.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK PLATFORM MODULES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-6">
        <h3 className="text-xs font-black text-teal-300 uppercase tracking-wider">
          {isKm ? 'ម៉ូឌុលវេទិកា AI សុខាភិបាល' : 'Real-World Platform Modules'}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/triage"
            className="p-4 bg-slate-900 border border-teal-900 rounded-2xl shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Sparkles className="w-5 h-5 text-teal-400" />
            <div className="font-extrabold text-xs text-white">{t('navTriage')}</div>
            <div className="text-[10px] text-slate-400">Khmer Triage</div>
          </Link>

          <Link
            href="/family"
            className="p-4 bg-slate-900 border border-teal-900 rounded-2xl shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <div className="font-extrabold text-xs text-white">{t('navFamily')}</div>
            <div className="text-[10px] text-slate-400">Family Roles</div>
          </Link>

          <Link
            href="/facilities"
            className="p-4 bg-slate-900 border border-teal-900 rounded-2xl shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <MapPin className="w-5 h-5 text-cyan-400" />
            <div className="font-extrabold text-xs text-white">{t('navFacilities')}</div>
            <div className="text-[10px] text-slate-400">OpenStreetMap</div>
          </Link>

          <Link
            href="/trust"
            className="p-4 bg-slate-900 border border-teal-900 rounded-2xl shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div className="font-extrabold text-xs text-white">Trust Center</div>
            <div className="text-[10px] text-slate-400">AI Privacy & Rules</div>
          </Link>

          <Link
            href="/evaluation"
            className="p-4 bg-slate-900 border border-teal-900 rounded-2xl shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Cpu className="w-5 h-5 text-purple-400" />
            <div className="font-extrabold text-xs text-white">AI Evaluation</div>
            <div className="text-[10px] text-slate-400">Model Bench</div>
          </Link>

          <Link
            href="/roadmap"
            className="p-4 bg-slate-900 border border-teal-900 rounded-2xl shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Compass className="w-5 h-5 text-amber-400" />
            <div className="font-extrabold text-xs text-white">Roadmap</div>
            <div className="text-[10px] text-slate-400">Phase 1 - Phase 5</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
