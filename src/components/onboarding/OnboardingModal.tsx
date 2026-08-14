'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, MapPin, HeartPulse, CheckCircle2, X, ArrowRight } from 'lucide-react';

export function OnboardingModal() {
  const { language } = useLanguage();
  const isKm = language === 'km';
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const seen = localStorage.getItem('sokhacare_onboarded');
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('sokhacare_onboarded', 'true');
  };

  if (!isOpen) return null;

  const slides = [
    {
      title_km: 'សូមស្វាគមន៍មកកាន់ SokhaCare AI',
      title_en: 'Welcome to SokhaCare AI',
      desc_km: 'ជំនួយការ AI វាយតម្លៃរោគសញ្ញាសុខភាពជាភាសាខ្មែរ និងណែនាំផ្លូវទៅកាន់មណ្ឌលសុខភាព',
      desc_en: 'Khmer AI Healthcare Triage & Navigation Assistant for Cambodia',
      icon: Sparkles
    },
    {
      title_km: 'ជំហានទី ១៖ ជ្រើសរើសភាសា & ទីតាំង',
      title_en: 'Step 1: Language & Location',
      desc_km: 'ប្រើប្រាស់ភាសាខ្មែរ ឬអង់គ្លេស និងអនុញ្ញាតទីតាំងដើម្បីស្វែងរកមន្ទីរពេទ្យជិតបំផុត',
      desc_en: 'Select Khmer or English and allow location to locate nearest care',
      icon: MapPin
    },
    {
      title_km: 'ជំហានទី ២៖ រៀបរាប់រោគសញ្ញាតាមអក្សរ ឬសំឡេង',
      title_en: 'Step 2: Describe Symptoms by Voice or Text',
      desc_km: 'និយាយ ឬវាយរោគសញ្ញារបស់អ្នក ដើម្បីឲ្យ AI វិភាគកម្រិតបន្ទាន់',
      desc_en: 'Speak or type your symptoms to receive instant AI preliminary guidance',
      icon: HeartPulse
    },
    {
      title_km: 'ជំហានទី ៣៖ ទទួលបានការណែនាំសុវត្ថិភាព',
      title_en: 'Step 3: Receive Safe Navigation',
      desc_km: 'ទទួលការណែនាំផ្លូវទៅមន្ទីរពេទ្យ ឬមណ្ឌលសុខភាពដែលសមស្របតាមស្ថានភាព',
      desc_en: 'Get routed to the appropriate hospital, health centre, or clinic',
      icon: CheckCircle2
    }
  ];

  const currentSlide = slides[step - 1];
  const Icon = currentSlide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-teal-200 max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-fade-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-md">
            <Icon className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900">
            {isKm ? currentSlide.title_km : currentSlide.title_en}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {isKm ? currentSlide.desc_km : currentSlide.desc_en}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 pt-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                step === i + 1 ? 'bg-teal-600 w-6' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            {isKm ? 'រំលង (Skip)' : 'Skip'}
          </button>

          {step < slides.length ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-teal-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-md"
            >
              <span>{isKm ? 'បន្ទាប់' : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md"
            >
              <span>{isKm ? 'ចាប់ផ្តើមប្រើប្រាស់' : 'Get Started'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
