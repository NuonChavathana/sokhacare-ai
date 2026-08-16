'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { PredictionHistoryRecord } from '@/types/prediction';
import { TextToSpeechButton } from '@/components/shared/TextToSpeechButton';
import { generateHeartSpokenSummary, generateGeneralDiseaseSpokenSummary } from '@/lib/speech/summary';
import {
  History,
  Trash2,
  HeartPulse,
  Sparkles,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Activity,
  User,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';

const mockInitialPredictions: PredictionHistoryRecord[] = [
  {
    id: 'pred-1',
    date: '2026-08-16 09:30',
    mode: 'patient_heart',
    probability: 0.88,
    riskLevel: 'High',
    age: 62,
    gender: 1,
    keySummary: '88% Risk • High Level (Typical Angina, BP 155 mmHg, Chol 265 mg/dl)',
    features: {
      Age: 62,
      Gender: 1,
      Chest_Pain_Type: 1,
      Resting_Blood_Pressure: 155,
      Cholesterol: 265,
      Fasting_Blood_Sugar: 1,
      Resting_ECG_Results: 0,
      Maximum_Heart_Rate: 125,
      Exercise_Induced_Angina: 1,
      Depression_Induced_By_Exercise: 0,
      Slope_Of_Peak_Exercise: 1,
      Major_Vessels_Colored_By_Fluoroscopy: 0,
      Thalassemia: 3,
      Risk_Score: 8.5,
      symptom_severity: 7.5,
      age_thalach_ratio: 62 / 125
    },
    language: 'km'
  },
  {
    id: 'gen-1',
    date: '2026-08-16 08:15',
    mode: 'general_disease',
    riskLevel: 'URGENT',
    keySummary: 'Dengue Fever Suspect (85% match)',
    generalResult: {
      possibleConditions: [
        {
          id: 'dengue_fever',
          name: 'ជំងឺគ្រុនឈាម (Dengue Fever)',
          nameKm: 'ជំងឺគ្រុនឈាម',
          nameEn: 'Dengue Fever',
          score: 0.85,
          urgency: 'urgent',
          matchedSymptoms: [
            { id: 'high_fever_spiking', nameEn: 'High Fever', nameKm: 'ក្តៅខ្លួនខ្លាំង' },
            { id: 'retro_orbital_pain', nameEn: 'Eye Pain', nameKm: 'ឈឺគ្រាប់ភ្នែក' }
          ],
          unmatchedPrimarySymptoms: [],
          recommendations: ['CBC blood count test', 'Hydrate with ORS'],
          description: 'Vector-borne infection endemic in Cambodia'
        }
      ],
      redFlags: [],
      overallUrgency: 'urgent',
      disclaimerEn: 'Preliminary assessment only',
      disclaimerKm: 'ការវាយតម្លៃបឋម',
      evaluatedSymptoms: ['high_fever_spiking', 'retro_orbital_pain', 'muscle_joint_aches'],
      createdAt: new Date().toISOString()
    },
    language: 'km'
  },
  {
    id: 'pred-2',
    date: '2026-08-15 15:45',
    mode: 'doctor_heart',
    probability: 0.42,
    riskLevel: 'Moderate',
    age: 50,
    gender: 1,
    keySummary: '42% Risk • Moderate Level (Atypical Angina, BP 138 mmHg, ST Slope 2)',
    features: {
      Age: 50,
      Gender: 1,
      Chest_Pain_Type: 2,
      Resting_Blood_Pressure: 138,
      Cholesterol: 220,
      Fasting_Blood_Sugar: 0,
      Resting_ECG_Results: 0,
      Maximum_Heart_Rate: 155,
      Exercise_Induced_Angina: 0,
      Depression_Induced_By_Exercise: 0.8,
      Slope_Of_Peak_Exercise: 2,
      Major_Vessels_Colored_By_Fluoroscopy: 0,
      Thalassemia: 3,
      Risk_Score: 4.5,
      symptom_severity: 3.0,
      age_thalach_ratio: 50 / 155
    },
    language: 'en'
  }
];

export default function HistoryPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';
  const [history, setHistory] = useState<PredictionHistoryRecord[]>([]);
  const [filterMode, setFilterMode] = useState<'all' | 'patient_heart' | 'doctor_heart' | 'general_disease'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('sokhacare_prediction_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory(mockInitialPredictions);
      }
    } else {
      setHistory(mockInitialPredictions);
    }
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sokhacare_prediction_history');
  };

  const filteredHistory = history.filter((item) => {
    if (filterMode === 'all') return true;
    if (filterMode === 'patient_heart') return item.mode === 'patient_heart' || item.mode === 'patient';
    if (filterMode === 'doctor_heart') return item.mode === 'doctor_heart' || item.mode === 'doctor';
    if (filterMode === 'general_disease') return item.mode === 'general_disease' || item.mode === 'general';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <span>Health & Prediction History</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t('historyTitle')}</h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearHistory')}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterMode === 'all'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          {isKm ? 'ទាំងអស់ (All)' : 'All Records'} ({history.length})
        </button>
        <button
          onClick={() => setFilterMode('patient_heart')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterMode === 'patient_heart'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Heart Patient</span>
        </button>
        <button
          onClick={() => setFilterMode('doctor_heart')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterMode === 'doctor_heart'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Heart Doctor</span>
        </button>
        <button
          onClick={() => setFilterMode('general_disease')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterMode === 'general_disease'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span>General Disease</span>
        </button>
      </div>

      {/* History List Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{t('noHistory')}</p>
            <Link
              href="/predict"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('startCheckup')}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => {
              const isHigh =
                item.riskLevel === 'High' ||
                item.riskLevel === 'EMERGENCY' ||
                (typeof item.probability === 'number' && item.probability >= 0.7);
              const isMod =
                item.riskLevel === 'Moderate' ||
                item.riskLevel === 'URGENT' ||
                (typeof item.probability === 'number' && item.probability >= 0.35 && item.probability < 0.7);

              const badgeStyle = isHigh
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : isMod
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all space-y-3 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-700/80 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center gap-1">
                        {item.mode.includes('doctor') ? (
                          <>
                            <Stethoscope className="w-3 h-3 text-teal-700 dark:text-teal-400" />
                            <span>Heart Doctor</span>
                          </>
                        ) : item.mode.includes('general') ? (
                          <>
                            <Activity className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                            <span>General Disease</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-slate-700 dark:text-slate-300" />
                            <span>Heart Patient</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {typeof item.probability === 'number' && (
                        <span className="text-xs font-black text-slate-900 dark:text-white font-mono">
                          {Math.round(item.probability * 100)}% Risk
                        </span>
                      )}
                      <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${badgeStyle}`}>
                        {item.riskLevel}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">"{item.keySummary}"</p>

                  <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 gap-2">
                    <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3 font-medium">
                      {item.features && (
                        <>
                          <span>Age: {item.features.Age} yrs</span>
                          <span>Sex: {item.features.Gender === 1 ? 'Male' : 'Female'}</span>
                          <span>BP: {item.features.Resting_Blood_Pressure} mmHg</span>
                          <span>Chol: {item.features.Cholesterol} mg/dl</span>
                        </>
                      )}
                      {item.generalResult && (
                        <span>
                          Evaluated: {item.generalResult.evaluatedSymptoms.length} symptoms •{' '}
                          {item.generalResult.redFlags.length > 0 ? '⚠️ Red Flags Detected' : 'No Red Flags'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <TextToSpeechButton
                        text={
                          item.generalResult
                            ? generateGeneralDiseaseSpokenSummary(item.generalResult, item.language)
                            : generateHeartSpokenSummary(
                                {
                                  probability: item.probability || 0,
                                  prediction: (item.probability || 0) >= 0.5 ? 1 : 0,
                                  riskLevel: (item.riskLevel as any) || 'Low',
                                  createdAt: item.date
                                },
                                item.language
                              )
                        }
                        language={item.language}
                        size="sm"
                        variant="outline"
                      />

                      <Link
                        href="/predict"
                        className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-transparent transition-all"
                      >
                        <span>{t('reEvaluate')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Evaluations and prediction records are saved on your local device for privacy.</span>
        </div>
      </div>
    </div>
  );
}
