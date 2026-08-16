'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PredictionForm } from '@/components/predict/PredictionForm';
import { PredictionResultCard } from '@/components/predict/PredictionResultCard';
import { GeneralDiseaseForm } from '@/components/predict/GeneralDiseaseForm';
import { GeneralDiseaseResultCard } from '@/components/predict/GeneralDiseaseResultCard';
import {
  HeartDiseasePredictionResult,
  PredictionHistoryRecord,
  PredictionMode
} from '@/types/prediction';
import { GeneralDiseaseResponse } from '@/types/generalDisease';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import {
  Sparkles,
  ShieldAlert,
  HeartPulse,
  User,
  Stethoscope,
  Activity,
  Zap
} from 'lucide-react';

export default function PredictPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'general'>('patient');
  const [heartResult, setHeartResult] = useState<HeartDiseasePredictionResult | null>(null);
  const [generalResult, setGeneralResult] = useState<GeneralDiseaseResponse | null>(null);

  const handleHeartPredictionSuccess = (res: HeartDiseasePredictionResult) => {
    setHeartResult(res);

    // Save record to localStorage history
    try {
      const saved = localStorage.getItem('sokhacare_prediction_history');
      const list: PredictionHistoryRecord[] = saved ? JSON.parse(saved) : [];
      const newRecord: PredictionHistoryRecord = {
        id: `pred-${Date.now()}`,
        date: new Date().toLocaleString(isKm ? 'km-KH' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        mode: res.mode === 'doctor' ? 'doctor_heart' : 'patient_heart',
        probability: res.probability,
        riskLevel: res.riskLevel,
        age: res.features?.Age || 50,
        gender: res.features?.Gender || 1,
        keySummary: `${Math.round(res.probability * 100)}% Risk • ${res.riskLevel} Level`,
        features: res.features!,
        language: (language as 'km' | 'en') || 'km'
      };
      list.unshift(newRecord);
      if (list.length > 30) list.pop();
      localStorage.setItem('sokhacare_prediction_history', JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }

    // Scroll to results
    setTimeout(() => {
      const el = document.getElementById('prediction-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleGeneralDiseaseSuccess = (res: GeneralDiseaseResponse) => {
    setGeneralResult(res);

    // Save record to localStorage history
    try {
      const saved = localStorage.getItem('sokhacare_prediction_history');
      const list: PredictionHistoryRecord[] = saved ? JSON.parse(saved) : [];
      const topCondition = res.possibleConditions[0];
      const newRecord: PredictionHistoryRecord = {
        id: `gen-${Date.now()}`,
        date: new Date().toLocaleString(isKm ? 'km-KH' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }),
        mode: 'general_disease',
        riskLevel: res.overallUrgency.toUpperCase(),
        keySummary: topCondition
          ? `${topCondition.name} (${Math.round(topCondition.score * 100)}% match)`
          : `General Triage • ${res.overallUrgency}`,
        generalResult: res,
        language: (language as 'km' | 'en') || 'km'
      };
      list.unshift(newRecord);
      if (list.length > 30) list.pop();
      localStorage.setItem('sokhacare_prediction_history', JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }

    // Scroll to results
    setTimeout(() => {
      const el = document.getElementById('general-disease-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleReset = () => {
    setHeartResult(null);
    setGeneralResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabSwitch = (tab: 'patient' | 'doctor' | 'general') => {
    setActiveTab(tab);
    setHeartResult(null);
    setGeneralResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Hero Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-teal-900/60">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>
              {activeTab === 'general'
                ? isKm
                  ? 'ការពិនិត្យរោគសញ្ញាទូទៅ (Deterministic Engine)'
                  : 'Knowledge-Based Symptom Triage'
                : isKm
                ? 'ការពិនិត្យរោគសញ្ញា និងហានិភ័យបេះដូង AI'
                : 'AI Symptoms Triage & Risk Prediction'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('predictPageTitle')}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-medium">
            {t('predictPageSubtitle')}
          </p>
        </div>

        {/* Emergency Callout in Banner */}
        <div className="bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-xs text-xs space-y-2 shrink-0">
          <div className="font-bold text-rose-300 flex items-center gap-1.5 uppercase">
            <ShieldAlert className="w-4 h-4" />
            <span>{isKm ? 'សញ្ញាអាសន្នសុខភាព' : 'Emergency Warning'}</span>
          </div>
          <p className="text-white/90 max-w-xs leading-normal font-medium">
            {isKm
              ? 'ប្រសិនបើមានការឈឺណែនទ្រូងធ្ងន់ធ្ងរ ពិបាកដកដង្ហើម ឬក្អួតឈាម សូមប្រញាប់ទូរស័ព្ទទៅ 119 ភ្លាមៗ'
              : 'Crushing chest pain, severe dyspnea, or sudden bleeding requires immediate 119 emergency call.'}
          </p>
        </div>
      </div>

      {/* 3-Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-100 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleTabSwitch('patient')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'patient'
                ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-500/50'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('patientModeTab')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('doctor')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'doctor'
                ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-500/50'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>{t('doctorModeTab')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('general')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeTab === 'general'
                ? 'bg-teal-600 text-white shadow-md ring-2 ring-teal-500/50'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>{t('generalModeTab')}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Form Component */}
      {activeTab === 'general' ? (
        <GeneralDiseaseForm onAssessmentSuccess={handleGeneralDiseaseSuccess} />
      ) : (
        <PredictionForm
          currentMode={activeTab}
          onModeChange={(m) => setActiveTab(m === 'doctor' ? 'doctor' : 'patient')}
          onPredictionSuccess={handleHeartPredictionSuccess}
        />
      )}

      {/* Results View */}
      {heartResult && activeTab !== 'general' && (
        <div aria-live="polite">
          <PredictionResultCard
            result={heartResult}
            nearbyFacilities={CAMBODIA_FACILITIES}
            onReset={handleReset}
          />
        </div>
      )}

      {generalResult && activeTab === 'general' && (
        <div aria-live="polite">
          <GeneralDiseaseResultCard
            result={generalResult}
            nearbyFacilities={CAMBODIA_FACILITIES}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
