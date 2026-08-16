'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Sparkles,
  MapPin,
  ShieldAlert,
  Activity,
  ArrowRight,
  Hospital,
  Users,
  ShieldCheck,
  Cpu,
  Compass,
  CheckCircle2,
  PhoneCall,
  Clock,
  HeartPulse,
  Zap,
  Volume2,
  Mic,
  Stethoscope,
  BarChart3,
  Info,
  Bot
} from 'lucide-react';

export default function LandingPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="space-y-16 pb-20 overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans transition-colors duration-200">
      {/* HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Glowing backdrop Orbs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-teal-400/10 dark:bg-teal-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[300px] bg-emerald-400/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-500/15 border border-teal-200 dark:border-teal-400/30 text-teal-800 dark:text-teal-300 text-xs font-extrabold tracking-wide backdrop-blur-md shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>{isKm ? 'វេទិកា AI សុខាភិបាលកម្ពុជា' : 'SokhaCare AI • Khmer Digital Health Platform'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-950 dark:text-white">
              {isKm ? t('heroTitleKm') : t('heroTitleEn')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 dark:from-emerald-300 dark:via-teal-200 dark:to-cyan-400 mt-2">
                Khmer AI Health Platform
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-teal-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {isKm ? t('heroSubtitleKm') : t('heroSubtitleEn')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <Link
                href="/chat"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-teal-600/25 flex items-center justify-center gap-2.5 transition-all active:scale-95 border border-emerald-500/40"
              >
                <Bot className="w-5 h-5" />
                <span>{t('startChat')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/predict"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-900 dark:text-teal-200 border border-teal-300 dark:border-teal-700 font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{t('startCheckup')}</span>
              </Link>

              <Link
                href="/facilities"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-slate-200 dark:border-white/20 font-extrabold text-base flex items-center justify-center gap-2 transition-all backdrop-blur-md"
              >
                <Hospital className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                <span>{t('findHospitals')}</span>
              </Link>
            </div>

            {/* Clinical & Platform Performance Metrics */}
            <div className="pt-8 grid grid-cols-4 gap-3 border-t border-slate-200 dark:border-teal-900/80 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-teal-700 dark:text-emerald-400">1,280+</div>
                <div className="text-[10px] text-slate-600 dark:text-teal-200 font-bold uppercase">{isKm ? 'ការពិគ្រោះសុខភាព' : 'Consultations'}</div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-teal-700 dark:text-emerald-400">&lt; 2s</div>
                <div className="text-[10px] text-slate-600 dark:text-teal-200 font-bold uppercase">{isKm ? 'ល្បឿន AI' : 'Response Time'}</div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-teal-700 dark:text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-600 dark:text-teal-200 font-bold uppercase">{isKm ? 'សំឡេងខ្មែរ' : 'Khmer Voice'}</div>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl backdrop-blur-xs">
                <div className="text-xl sm:text-2xl font-black text-teal-700 dark:text-emerald-400">15+</div>
                <div className="text-[10px] text-slate-600 dark:text-teal-200 font-bold uppercase">{isKm ? 'មន្ទីរពេទ្យ' : 'Hospitals'}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Rebalanced Clinical AI Product Showcase Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-gradient-to-b dark:from-slate-900/95 dark:via-slate-900/90 dark:to-teal-950/95 border-2 border-slate-200 dark:border-teal-500/40 p-6 rounded-3xl shadow-xl dark:shadow-2xl space-y-5 relative">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-teal-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-emerald-400 flex items-center justify-center font-black border border-teal-200 dark:border-teal-500/40 shadow-inner">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {isKm ? 'ប្រព័ន្ធវិភាគគ្លីនិក AI' : 'SokhaCare Clinical Platform'}
                    </h3>
                    <p className="text-[11px] text-teal-700 dark:text-emerald-300 font-semibold">
                      {isKm ? 'ផ្ទៀងផ្ទាត់លើទិន្នន័យវេជ្ជសាស្ត្រ' : '16-Feature ML & Triage Engine'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/30 px-2.5 py-1 rounded-full font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              {/* Core Clinical Capabilities List */}
              <div className="space-y-3">
                {/* Capability 1: Heart Disease ML Model */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-teal-900/80 flex items-start gap-3 hover:border-teal-400 dark:hover:border-teal-500/50 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200 dark:border-rose-500/30">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center justify-between">
                      <span>{isKm ? 'ទស្សន៍ទាយហានិភ័យបេះដូង (16 កត្តា)' : 'Cardiovascular Risk Prediction'}</span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono font-bold">ML Model</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isKm
                        ? 'គំរូ Logistic Regression វិភាគលើ ១៦ កត្តាគ្លីនិក ជាមួយរបៀបអ្នកជំងឺ & វេជ្ជបណ្ឌិត'
                        : 'Evaluates 16 clinical parameters with Patient at Home and Doctor modes'}
                    </p>
                  </div>
                </div>

                {/* Capability 2: General Disease Triage */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-teal-900/80 flex items-start gap-3 hover:border-teal-400 dark:hover:border-teal-500/50 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200 dark:border-teal-500/30">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center justify-between">
                      <span>{isKm ? 'ពិនិត្យរោគសញ្ញាជំងឺទូទៅ' : 'General Disease Symptom Triage'}</span>
                      <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono font-bold">Rule Engine</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isKm
                        ? 'វិភាគជំងឺញឹកញាប់នៅកម្ពុជា (គ្រុនឈាម គ្រុនចាញ់ រលាកសួត ពុលចំណី) ជាមួយសញ្ញាអាសន្ន'
                        : 'Matches regional conditions (Dengue, Malaria, Pneumonia) with red-flag detection'}
                    </p>
                  </div>
                </div>

                {/* Capability 3: Bilingual Voice AI */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-teal-900/80 flex items-start gap-3 hover:border-teal-400 dark:hover:border-teal-500/50 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-500/30">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center justify-between">
                      <span>{isKm ? 'សំឡេងនិយាយ & អានលទ្ធផល' : 'Bilingual Voice & Audio Reader'}</span>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">Web Speech</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isKm
                        ? 'បញ្ចូលរោគសញ្ញាជាសំឡេងខ្មែរ/អង់គ្លេស និងមុខងារអានសង្ខេបលទ្ធផលជាសំឡេង'
                        : 'Khmer & English voice-to-text input plus text-to-speech audio reader'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Launch Link */}
              <div className="pt-2">
                <Link
                  href="/predict"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-600/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isKm ? 'ចាប់ផ្តើមវាយតម្លៃហានិភ័យសុខភាព →' : 'Launch Prediction & Triage Engine →'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFETY DISCLAIMER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-200 dark:border-rose-600/80 rounded-3xl p-6 shadow-md dark:shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-black text-rose-950 dark:text-white flex items-center gap-2">
              {t('disclaimerTitle')}
            </h3>
            <p className="text-xs font-medium text-rose-900 dark:text-rose-100/90 leading-relaxed">
              {t('disclaimerText')}
            </p>
          </div>
        </div>
      </section>

      {/* "HOW IT WORKS" WORKFLOW DIAGRAM SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-800 dark:text-teal-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>End-to-End Care Journey</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {isKm ? 'របៀបដែលប្រព័ន្ធដំណើរការ (How It Works)' : 'How SokhaCare AI Works'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-teal-200 font-medium">
            {isKm ? 'ដំណើរការ ៥ ជំហានសាមញ្ញ សម្រាប់ការថែទាំសុខភាពទាន់ពេលវេលា' : '5 simple steps connecting symptoms to the right healthcare facility'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-teal-900/80 text-center space-y-2 shadow-xs dark:shadow-lg hover:border-teal-400 dark:hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 font-black flex items-center justify-center mx-auto text-base border border-teal-200 dark:border-teal-500/40">
              1
            </div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{isKm ? 'រៀបរាប់រោគសញ្ញា' : 'Describe Symptoms'}</div>
            <div className="text-[11px] text-slate-500 dark:text-teal-200/80">{isKm ? 'តាមសំឡេង ឬអក្សរខ្មែរ' : 'Khmer Voice or Text'}</div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-teal-900/80 text-center space-y-2 shadow-xs dark:shadow-lg hover:border-teal-400 dark:hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-black flex items-center justify-center mx-auto text-base border border-emerald-200 dark:border-emerald-500/40">
              2
            </div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{isKm ? 'វិភាគរោគសញ្ញា AI' : 'AI Analysis'}</div>
            <div className="text-[11px] text-slate-500 dark:text-emerald-200/80">{isKm ? 'ស្វែងរកសញ្ញាអាសន្ន' : 'Red Flag Detection'}</div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-teal-900/80 text-center space-y-2 shadow-xs dark:shadow-lg hover:border-teal-400 dark:hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center mx-auto text-base border border-amber-200 dark:border-amber-500/40">
              3
            </div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{isKm ? 'វាយតម្លៃកម្រិតបន្ទាន់' : 'Risk & Urgency Output'}</div>
            <div className="text-[11px] text-slate-500 dark:text-amber-200/80">{isKm ? 'កម្រិតហានិភ័យ %' : 'Percentage & Badges'}</div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-teal-900/80 text-center space-y-2 shadow-xs dark:shadow-lg hover:border-teal-400 dark:hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-black flex items-center justify-center mx-auto text-base border border-cyan-200 dark:border-cyan-500/40">
              4
            </div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{isKm ? 'ស្វែងរកមណ្ឌលសុខភាព' : 'Find Facilities'}</div>
            <div className="text-[11px] text-slate-500 dark:text-cyan-200/80">{isKm ? 'តម្រៀបតាមចម្ងាយ' : 'Smart Hospital Directory'}</div>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200 dark:border-teal-900/80 text-center space-y-2 shadow-xs dark:shadow-lg hover:border-teal-400 dark:hover:border-teal-500/60 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 font-black flex items-center justify-center mx-auto text-base border border-purple-200 dark:border-purple-500/40">
              5
            </div>
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{isKm ? 'ធ្វើសកម្មភាពថែទាំ' : 'Take Action'}</div>
            <div className="text-[11px] text-slate-500 dark:text-purple-200/80">{isKm ? 'ហៅ 119 ឬទៅមន្ទីរពេទ្យ' : 'Call 119 or Directions'}</div>
          </div>
        </div>
      </section>

      {/* WHY SOKHACARE AI - KEY CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {isKm ? 'ហេតុអ្វីបានជាជ្រើសរើស SokhaCare AI?' : 'Why SokhaCare AI?'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-teal-200 font-medium">
            Designed specifically for Cambodia's healthcare access challenges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-teal-900/80 space-y-3 shadow-xs dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 flex items-center justify-center font-black">
              🗣️
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Khmer-First Voice AI</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Eliminates literacy and medical jargon barriers using Khmer voice speech-to-text input and text-to-speech reading.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-teal-900/80 space-y-3 shadow-xs dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 flex items-center justify-center font-black">
              🛡️
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Deterministic Safety Guardrails</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Hardcoded red-flag safety rules prioritize emergency response for acute cardiac and infectious symptoms.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-teal-900/80 space-y-3 shadow-xs dark:shadow-lg">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black">
              🗺️
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Smart Health Navigation</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Connects preliminary assessment directly to specialized hospitals and emergency services across Cambodian provinces.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK PLATFORM MODULES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pt-6">
        <h3 className="text-xs font-black text-teal-700 dark:text-teal-300 uppercase tracking-wider">
          {isKm ? 'ម៉ូឌុលវេទិកា AI សុខាភិបាល' : 'Real-World Platform Modules'}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <Link
            href="/chat"
            className="p-4 bg-white dark:bg-slate-900 border-2 border-teal-500/40 dark:border-teal-500/60 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Bot className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{t('navChat')}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Conversational AI</div>
          </Link>

          <Link
            href="/predict"
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{t('navPredict')}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Heart & General Triage</div>
          </Link>

          <Link
            href="/family"
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{t('navFamily')}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Family Roles</div>
          </Link>

          <Link
            href="/facilities"
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{t('navFacilities')}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">OpenStreetMap</div>
          </Link>

          <Link
            href="/trust"
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">Trust Center</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">AI Privacy & Rules</div>
          </Link>

          <Link
            href="/dashboard"
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{t('navDashboard')}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Health Analytics</div>
          </Link>

          <Link
            href="/about"
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-2xl shadow-xs dark:shadow-md hover:border-teal-500 transition-all space-y-1.5"
          >
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div className="font-extrabold text-xs text-slate-900 dark:text-white">{t('navAbout')}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Mission & Vision</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
