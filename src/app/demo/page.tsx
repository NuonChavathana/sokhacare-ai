'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import {
  Presentation,
  Play,
  ArrowRight,
  Sparkles,
  Mic,
  AlertTriangle,
  MapPin,
  CheckCircle2,
  BarChart3,
  RotateCcw,
  PhoneCall,
  Navigation,
  Trophy,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';

export default function PresentationDemoPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';
  const [currentScene, setCurrentScene] = useState(1);

  const scenes = [
    {
      id: 1,
      title: isKm ? 'ឆាកទី ១៖ ណែនាំវេទិកា SokhaCare AI' : 'Scene 1: Platform Overview',
      desc: isKm ? 'វេទិកា AI វាយតម្លៃរោគសញ្ញាសុខភាពជាភាសាខ្មែរ និងណែនាំផ្លូវទៅកាន់មណ្ឌលសុខភាព' : 'Khmer AI Healthcare Triage & Navigation Platform for Cambodia'
    },
    {
      id: 2,
      title: isKm ? 'ឆាកទី ២៖ ការបញ្ចូលសំឡេងខ្មែរ (Khmer Voice)' : 'Scene 2: Khmer Voice Input',
      desc: isKm ? 'អ្នកជំងឺនិយាយរោគសញ្ញាជាភាសាខ្មែរ៖ "ខ្ញុំឈឺទ្រូងខ្លាំង ហើយពិបាកដកដង្ហើម"' : 'Patient speaks Khmer symptoms: "I have severe chest pain and difficulty breathing"'
    },
    {
      id: 3,
      title: isKm ? 'ឆាកទី ៣៖ ការវិភាគអាទិភាពសញ្ញាអាសន្ន 🔴' : 'Scene 3: Red-Flag AI Emergency Triage',
      desc: isKm ? 'ប្រព័ន្ធ AI ស្វែងរកឃើញសញ្ញាអាសន្ន និងប្រកាស 🔴 ស្ថានភាពបន្ទាន់ ភ្លាមៗ' : 'AI detects red flags and immediately triggers Red Emergency Mode'
    },
    {
      id: 4,
      title: isKm ? 'ឆាកទី ៤៖ ការតម្រង់ទិសទៅកាន់មន្ទីរពេទ្យ' : 'Scene 4: Hospital Navigation & 119 Call',
      desc: isKm ? 'ណែនាំមន្ទីរពេទ្យកាល់ម៉ែត ព្រមទាំងផ្តល់ប៊ូតុង 119 និង Google Maps Directions' : 'Recommends nearest hospital (Calmette Hospital) with 119 call button & maps'
    },
    {
      id: 5,
      title: isKm ? 'ឆាកទី ៥៖ ករណីជំងឺធម្មតា 🟢' : 'Scene 5: Routine Care Case',
      desc: isKm ? 'សាកល្បងរោគសញ្ញាស្រាល "ខ្ញុំឈឺក្បាលបន្តិច" -> បញ្ជូនទៅមណ្ឌលសុខភាព ដើម្បីកាត់បន្ថយការកកស្ទះ' : 'Test mild headache -> Routes to local health centre to prevent hospital overcrowding'
    },
    {
      id: 6,
      title: isKm ? 'ឆាកទី ៦៖ ផ្ទាំងវិភាគទិន្នន័យ (Dashboard)' : 'Scene 6: Executive Analytics Dashboard',
      desc: isKm ? 'បង្ហាញស្ថិតិការពិគ្រោះ ការបែងចែកកម្រិតបន្ទាន់ និងទិន្នន័យសម្រាប់ស្ថាប័នសុខាភិបាល' : 'Demonstrates system analytics for healthcare organizations & judges'
    }
  ];

  const handleNext = () => {
    if (currentScene < scenes.length) {
      setCurrentScene(currentScene + 1);
    }
  };

  const handlePrev = () => {
    if (currentScene > 1) {
      setCurrentScene(currentScene - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-xs font-bold text-amber-300">
            <Trophy className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>3-5 Minute Hackathon Pitch Presentation Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">SokhaCare AI Live Pitch Mode</h1>
          <p className="text-xs text-amber-100/90 font-medium">
            Guided presentation flow designed for hackathon judges and startup pitch evaluations.
          </p>
        </div>

        <button
          onClick={() => setCurrentScene(1)}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Pitch</span>
        </button>
      </div>

      {/* Pitch Step Tracker */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {scenes.map((s) => (
          <button
            key={s.id}
            onClick={() => setCurrentScene(s.id)}
            className={`p-2.5 rounded-2xl border text-center transition-all ${
              currentScene === s.id
                ? 'bg-teal-700 text-white font-black border-teal-400 scale-105 shadow-lg'
                : currentScene > s.id
                ? 'bg-teal-50 text-teal-900 border-teal-200 font-bold'
                : 'bg-white text-slate-500 border-slate-200 font-semibold'
            }`}
          >
            <span className="text-xs block font-extrabold">Scene {s.id}</span>
          </button>
        ))}
      </div>

      {/* Main Presentation Stage */}
      <div className="bg-white rounded-3xl border-2 border-teal-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-900">{scenes[currentScene - 1].title}</h2>
          <span className="text-xs font-mono font-black bg-amber-100 text-amber-950 px-3.5 py-1 rounded-full">
            Scene {currentScene} / 6
          </span>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
          💡 <strong>Presenter Pitch Script:</strong> {scenes[currentScene - 1].desc}
        </p>

        {/* Dynamic Stage Display Content per Scene */}
        <div className="min-h-[320px] flex items-center justify-center p-6 bg-slate-50/80 rounded-2xl border border-slate-200">
          {currentScene === 1 && (
            <div className="text-center space-y-4 max-w-lg">
              <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">{t('appName')}</h3>
              <p className="text-sm font-extrabold text-teal-800">{t('appTagline')}</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{t('subTagline')}</p>
            </div>
          )}

          {currentScene === 2 && (
            <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-teal-200 shadow-md space-y-4">
              <div className="flex items-center gap-3 text-teal-800 font-extrabold text-sm">
                <Mic className="w-5 h-5 animate-pulse text-rose-600" />
                <span>Khmer Voice Input Triggered</span>
              </div>
              <div className="bg-teal-50 p-4 rounded-xl text-sm font-black text-slate-900 italic border border-teal-200">
                "ខ្ញុំឈឺទ្រូងខ្លាំង ហើយពិបាកដកដង្ហើម..."
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Web Speech API (`km-KH`) automatically transcribes speech into text ready for AI triage.
              </div>
            </div>
          )}

          {currentScene === 3 && (
            <div className="w-full max-w-md bg-rose-600 text-white p-6 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
                  🔴 EMERGENCY ATTENTION
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  Confidence: 95%
                </span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                រោគសញ្ញារបស់អ្នកបង្ហាញពីរញ្ញាគ្រោះថ្នាក់ដែលត្រូវការការពិនិត្យសង្គ្រោះបន្ទាន់ភ្លាមៗ!
              </p>
              <div className="flex gap-1.5 pt-2">
                <span className="bg-rose-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  ⚠️ ឈឺទ្រូង
                </span>
                <span className="bg-rose-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  ⚠️ ពិបាកដកដង្ហើម
                </span>
              </div>
            </div>
          )}

          {currentScene === 4 && (
            <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4">
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Recommended Hospital: Calmette Hospital (មន្ទីរពេទ្យកាល់ម៉ែត)</span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                📍 3 Monivong Blvd, Daun Penh, Phnom Penh (Distance: 1.8 km)
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href="tel:119"
                  className="py-2.5 px-3 bg-rose-600 text-white text-xs font-bold rounded-xl text-center shadow-xs flex items-center justify-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 119</span>
                </a>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-slate-900 text-white text-xs font-bold rounded-xl text-center shadow-xs flex items-center justify-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          )}

          {currentScene === 5 && (
            <div className="w-full max-w-md bg-emerald-50 border border-emerald-300 p-6 rounded-2xl shadow-md space-y-3">
              <div className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>🟢 ROUTINE CARE: "ខ្ញុំឈឺក្បាលបន្តិច"</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                រោគសញ្ញារបស់អ្នកអាចទៅពិនិត្យនៅមណ្ឌលសុខភាពទួលគោក ឬគ្លីនិកជិតផ្ទះ។
              </p>
              <div className="text-[11px] font-bold text-teal-800 pt-1">
                ✓ Prevents national hospital overcrowding for non-emergency conditions.
              </div>
            </div>
          )}

          {currentScene === 6 && (
            <div className="w-full max-w-md bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-4 text-center">
              <BarChart3 className="w-12 h-12 text-teal-600 mx-auto" />
              <h4 className="font-extrabold text-base text-slate-900">Analytics Dashboard Demo</h4>
              <p className="text-xs text-slate-600 font-medium">
                Total Consultations: 1,284 | Emergency: 8% | Urgent: 22% | Routine: 48% | Self-Care: 22%
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-extrabold shadow-md"
              >
                <span>Open Full Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Scene Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentScene === 1}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-40"
          >
            ← Previous Scene
          </button>

          <button
            onClick={handleNext}
            disabled={currentScene === scenes.length}
            className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center gap-1 shadow-md disabled:opacity-40"
          >
            <span>Next Scene</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* HACKATHON JUDGE CRITERIA ALIGNMENT MATRIX */}
      <div className="bg-slate-900 text-white rounded-3xl border border-teal-900 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-teal-800 pb-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-black text-white">Hackathon & Startup Judge Criteria Matrix</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. Innovation & Accessibility</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Khmer voice speech-to-text input eliminates literacy and medical terminology barriers for Cambodian patients.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2. Patient Safety & Medical Guardrails</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Deterministic red-flag safety rules prioritize emergencies (119 call + directions) with clear preliminary notices.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>3. Smart OpenStreetMap Navigation</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Scores facilities using distance, urgency compatibility, services, open status, and emergency availability.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>4. Technical Execution & Scalability</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Full-stack Next.js 16 + Prisma ORM + Offline Data Saver mode ensuring 100% reliable execution during live judge demos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
