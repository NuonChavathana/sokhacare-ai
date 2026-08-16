'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import {
  HeartDiseasePredictionInput,
  HeartDiseasePredictionResult,
  PatientFormInput,
  DoctorFormInput,
  PredictionMode
} from '@/types/prediction';
import {
  patientInputTo16Features,
  doctorInputTo16Features,
  CLINICAL_PATIENT_DEFAULTS,
  calculateCardiovascularRiskScore,
  calculateSymptomSeverity,
  calculateAgeThalachRatio
} from '@/lib/features/riskScore';
import { validate16Features } from '@/lib/validation/prediction-schema';
import {
  User,
  Stethoscope,
  HeartPulse,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  HelpCircle,
  Zap,
  Activity,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface PredictionFormProps {
  onPredictionSuccess: (result: HeartDiseasePredictionResult) => void;
  initialMode?: PredictionMode;
  currentMode?: PredictionMode;
  onModeChange?: (mode: PredictionMode) => void;
}

export function PredictionForm({
  onPredictionSuccess,
  initialMode = 'patient',
  currentMode,
  onModeChange
}: PredictionFormProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [internalMode, setInternalMode] = useState<PredictionMode>(initialMode);
  const mode = currentMode || internalMode;
  const setMode = (m: PredictionMode) => {
    setInternalMode(m);
    if (onModeChange) onModeChange(m);
  };
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDefaultsNotice, setShowDefaultsNotice] = useState(false);
  const [showAdvancedOverrides, setShowAdvancedOverrides] = useState(false);

  // Patient Mode Form State
  const [patientData, setPatientData] = useState<PatientFormInput>({
    age: 52,
    gender: 1,
    chestDiscomfortType: 'pressure',
    hasHighBP: 'yes',
    knownBPValue: 142,
    hasHighCholesterol: 'yes',
    knownCholesterolValue: 245,
    hasDiabetesOrHighSugar: 'no',
    exerciseDiscomfort: 'yes',
    activityLevel: 'sedentary',
    knownMaxHeartRate: 145,
    associatedSymptoms: {
      shortnessOfBreath: true,
      palpitations: true,
      dizziness: false,
      fatigue: true,
      radiatingPain: true
    }
  });

  // Doctor Mode Form State
  const [doctorData, setDoctorData] = useState<DoctorFormInput>({
    Age: 58,
    Gender: 1,
    Chest_Pain_Type: 1,
    Resting_Blood_Pressure: 145,
    Cholesterol: 260,
    Fasting_Blood_Sugar: 0,
    Resting_ECG_Results: 1,
    Maximum_Heart_Rate: 135,
    Exercise_Induced_Angina: 1,
    Depression_Induced_By_Exercise: 1.8,
    Slope_Of_Peak_Exercise: 2,
    Major_Vessels_Colored_By_Fluoroscopy: 1,
    Thalassemia: 6,
    associatedSymptoms: ['shortnessOfBreath', 'radiatingPain']
  });

  // Quick preset loader
  const applyPreset = (type: 'healthy' | 'moderate' | 'high') => {
    if (mode === 'patient') {
      if (type === 'healthy') {
        setPatientData({
          age: 26,
          gender: 0,
          chestDiscomfortType: 'none',
          hasHighBP: 'no',
          knownBPValue: 115,
          hasHighCholesterol: 'no',
          knownCholesterolValue: 175,
          hasDiabetesOrHighSugar: 'no',
          exerciseDiscomfort: 'no',
          activityLevel: 'active',
          knownMaxHeartRate: 185,
          associatedSymptoms: {
            shortnessOfBreath: false,
            palpitations: false,
            dizziness: false,
            fatigue: false,
            radiatingPain: false
          }
        });
      } else if (type === 'moderate') {
        setPatientData({
          age: 48,
          gender: 1,
          chestDiscomfortType: 'sharp',
          hasHighBP: 'yes',
          knownBPValue: 135,
          hasHighCholesterol: 'no',
          knownCholesterolValue: 210,
          hasDiabetesOrHighSugar: 'no',
          exerciseDiscomfort: 'no',
          activityLevel: 'moderate',
          knownMaxHeartRate: 160,
          associatedSymptoms: {
            shortnessOfBreath: true,
            palpitations: false,
            dizziness: false,
            fatigue: true,
            radiatingPain: false
          }
        });
      } else {
        setPatientData({
          age: 65,
          gender: 1,
          chestDiscomfortType: 'pressure',
          hasHighBP: 'yes',
          knownBPValue: 165,
          hasHighCholesterol: 'yes',
          knownCholesterolValue: 285,
          hasDiabetesOrHighSugar: 'yes',
          exerciseDiscomfort: 'yes',
          activityLevel: 'sedentary',
          knownMaxHeartRate: 120,
          associatedSymptoms: {
            shortnessOfBreath: true,
            palpitations: true,
            dizziness: true,
            fatigue: true,
            radiatingPain: true
          }
        });
      }
    } else {
      if (type === 'healthy') {
        setDoctorData({
          Age: 26,
          Gender: 0,
          Chest_Pain_Type: 4,
          Resting_Blood_Pressure: 115,
          Cholesterol: 170,
          Fasting_Blood_Sugar: 0,
          Resting_ECG_Results: 0,
          Maximum_Heart_Rate: 182,
          Exercise_Induced_Angina: 0,
          Depression_Induced_By_Exercise: 0.0,
          Slope_Of_Peak_Exercise: 1,
          Major_Vessels_Colored_By_Fluoroscopy: 0,
          Thalassemia: 3
        });
      } else if (type === 'moderate') {
        setDoctorData({
          Age: 50,
          Gender: 1,
          Chest_Pain_Type: 2,
          Resting_Blood_Pressure: 138,
          Cholesterol: 230,
          Fasting_Blood_Sugar: 0,
          Resting_ECG_Results: 0,
          Maximum_Heart_Rate: 155,
          Exercise_Induced_Angina: 0,
          Depression_Induced_By_Exercise: 0.8,
          Slope_Of_Peak_Exercise: 2,
          Major_Vessels_Colored_By_Fluoroscopy: 0,
          Thalassemia: 3
        });
      } else {
        setDoctorData({
          Age: 67,
          Gender: 1,
          Chest_Pain_Type: 1,
          Resting_Blood_Pressure: 168,
          Cholesterol: 310,
          Fasting_Blood_Sugar: 1,
          Resting_ECG_Results: 2,
          Maximum_Heart_Rate: 112,
          Exercise_Induced_Angina: 1,
          Depression_Induced_By_Exercise: 2.8,
          Slope_Of_Peak_Exercise: 3,
          Major_Vessels_Colored_By_Fluoroscopy: 2,
          Thalassemia: 7
        });
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      // Assemble 16-feature vector
      let features: HeartDiseasePredictionInput;
      if (mode === 'patient') {
        features = patientInputTo16Features(patientData);
      } else {
        features = doctorInputTo16Features(doctorData);
      }

      // Pre-validation
      const validation = validate16Features(features);
      if (!validation.success) {
        const errorList = Object.values(validation.errors || {}).join(', ');
        throw new Error(errorList || 'Validation error');
      }

      // API Call
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: validation.data,
          mode,
          language
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to calculate prediction');
      }

      onPredictionSuccess(json.result);
    } catch (err: any) {
      console.error('Prediction failed:', err);
      setErrorMessage(err.message || 'Error executing prediction model');
    } finally {
      setLoading(false);
    }
  };

  // Computed metrics for Doctor Mode live display
  const doctorPreviewFeatures = doctorInputTo16Features(doctorData);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Top Header & Quick Presets Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            {mode === 'patient' ? (
              <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            ) : (
              <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            )}
            <span>{mode === 'patient' ? t('patientModeTab') : t('doctorModeTab')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {mode === 'patient' ? t('patientModeDesc') : t('doctorModeDesc')}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            {isKm ? 'គំរូ:' : 'Presets:'}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('healthy')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors whitespace-nowrap"
          >
            {isKm ? 'សុខភាពល្អ' : 'Healthy'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('moderate')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors whitespace-nowrap"
          >
            {isKm ? 'ហានិភ័យមធ្យម' : 'Moderate'}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('high')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors whitespace-nowrap"
          >
            {isKm ? 'ហានិភ័យខ្ពស់' : 'High Risk'}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Patient Mode Form */}
      {mode === 'patient' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>{t('labelAge')}</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="18"
                max="100"
                required
                value={patientData.age}
                onChange={(e) =>
                  setPatientData({ ...patientData, age: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <span>{t('labelGender')}</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPatientData({ ...patientData, gender: 1 })}
                  className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                    patientData.gender === 1
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {t('genderMale')}
                </button>
                <button
                  type="button"
                  onClick={() => setPatientData({ ...patientData, gender: 0 })}
                  className={`py-3 px-4 rounded-2xl text-xs font-extrabold border transition-all ${
                    patientData.gender === 0
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {t('genderFemale')}
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Chest Discomfort */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{t('labelChestPainPatient')}</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'none', label: t('cpNone') },
                { id: 'pressure', label: t('cpPressure') },
                { id: 'sharp', label: t('cpSharp') },
                { id: 'burning', label: t('cpBurning') }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setPatientData({
                      ...patientData,
                      chestDiscomfortType: opt.id as any
                    })
                  }
                  className={`p-3.5 rounded-2xl text-xs font-bold text-left border transition-all ${
                    patientData.chestDiscomfortType === opt.id
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-200 ring-1 ring-teal-500'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Cardiovascular Health History */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Blood Pressure */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('labelHighBP')}
              </label>
              <select
                value={patientData.hasHighBP}
                onChange={(e) =>
                  setPatientData({ ...patientData, hasHighBP: e.target.value as any })
                }
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value="unknown">{t('bpUnknown')}</option>
                <option value="no">{t('bpNo')}</option>
                <option value="yes">{t('bpYes')}</option>
              </select>
              {patientData.hasHighBP === 'yes' && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {t('labelKnownBP')}
                  </label>
                  <input
                    type="number"
                    min="80"
                    max="220"
                    placeholder="e.g. 140"
                    value={patientData.knownBPValue || ''}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        knownBPValue: parseInt(e.target.value) || undefined
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Cholesterol */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('labelCholesterolPatient')}
              </label>
              <select
                value={patientData.hasHighCholesterol}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    hasHighCholesterol: e.target.value as any
                  })
                }
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value="unknown">{t('cholUnknown')}</option>
                <option value="no">{t('cholNo')}</option>
                <option value="yes">{t('cholYes')}</option>
              </select>
              {patientData.hasHighCholesterol === 'yes' && (
                <div className="space-y-1 pt-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {t('labelKnownChol')}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="500"
                    placeholder="e.g. 240"
                    value={patientData.knownCholesterolValue || ''}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        knownCholesterolValue: parseInt(e.target.value) || undefined
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Diabetes */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('labelDiabetesPatient')}
              </label>
              <select
                value={patientData.hasDiabetesOrHighSugar}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    hasDiabetesOrHighSugar: e.target.value as any
                  })
                }
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value="no">{t('sugarNo')}</option>
                <option value="yes">{t('sugarYes')}</option>
                <option value="unknown">{isKm ? 'មិនច្បាស់ (Unknown)' : 'Not sure'}</option>
              </select>
            </div>
          </div>

          {/* Section 4: Physical Exertion & Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Exercise Discomfort */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('labelExerciseAnginaPatient')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPatientData({ ...patientData, exerciseDiscomfort: 'no' })
                  }
                  className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all ${
                    patientData.exerciseDiscomfort === 'no'
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {t('exerciseAnginaNo')}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPatientData({ ...patientData, exerciseDiscomfort: 'yes' })
                  }
                  className={`py-3 px-3 rounded-2xl text-xs font-extrabold border transition-all ${
                    patientData.exerciseDiscomfort === 'yes'
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-600 dark:border-rose-500 text-rose-900 dark:text-rose-200'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {t('exerciseAnginaYes')}
                </button>
              </div>
            </div>

            {/* Daily Physical Activity */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('labelActivityLevel')}
              </label>
              <select
                value={patientData.activityLevel}
                onChange={(e) =>
                  setPatientData({
                    ...patientData,
                    activityLevel: e.target.value as any
                  })
                }
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value="sedentary">{t('activitySedentary')}</option>
                <option value="moderate">{t('activityModerate')}</option>
                <option value="active">{t('activityActive')}</option>
              </select>
            </div>
          </div>

          {/* Section 5: Associated Symptoms Checkboxes */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
              {t('labelAssociatedSymptoms')}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { key: 'shortnessOfBreath', label: t('symShortnessOfBreath') },
                { key: 'radiatingPain', label: t('symRadiatingPain') },
                { key: 'dizziness', label: t('symDizziness') },
                { key: 'palpitations', label: t('symPalpitations') },
                { key: 'fatigue', label: t('symFatigue') }
              ].map((sym) => {
                const isChecked =
                  patientData.associatedSymptoms[
                    sym.key as keyof typeof patientData.associatedSymptoms
                  ];
                return (
                  <button
                    key={sym.key}
                    type="button"
                    onClick={() =>
                      setPatientData({
                        ...patientData,
                        associatedSymptoms: {
                          ...patientData.associatedSymptoms,
                          [sym.key]: !isChecked
                        }
                      })
                    }
                    className={`p-3 rounded-2xl text-xs font-bold text-left border flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 dark:border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{sym.label}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible Defaults Indicator */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDefaultsNotice(!showDefaultsNotice)}
              className="text-xs text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{t('defaultsNoticeTitle')}</span>
              {showDefaultsNotice ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showDefaultsNotice && (
              <div className="mt-3 p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/60 text-xs text-teal-950 dark:text-teal-200 space-y-2">
                <p className="font-medium leading-relaxed">{t('defaultsNoticeDesc')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] text-teal-800 dark:text-teal-300">
                  <div>Resting ECG: 0 (Normal)</div>
                  <div>ST Slope: 1 (Upsloping)</div>
                  <div>Fluoroscopy Vessels: 0</div>
                  <div>Thalassemia: 3 (Normal)</div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <HeartPulse className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
              <span>{loading ? t('btnPredicting') : t('btnPredict')}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Doctor Mode Form (All 16 Clinical Features) */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docAge')} (1-120)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={doctorData.Age}
                onChange={(e) =>
                  setDoctorData({ ...doctorData, Age: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* 2. Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docGender')}
              </label>
              <select
                value={doctorData.Gender}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Gender: parseInt(e.target.value) as 0 | 1
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={1}>1: Male (ប្រុស)</option>
                <option value={0}>0: Female (ស្រី)</option>
              </select>
            </div>

            {/* 3. Chest Pain Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docChestPainType')}
              </label>
              <select
                value={doctorData.Chest_Pain_Type}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Chest_Pain_Type: parseInt(e.target.value) as any
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={1}>{t('docCp1')}</option>
                <option value={2}>{t('docCp2')}</option>
                <option value={3}>{t('docCp3')}</option>
                <option value={4}>{t('docCp4')}</option>
              </select>
            </div>

            {/* 4. Resting BP */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docRestingBP')}
              </label>
              <input
                type="number"
                min="50"
                max="280"
                required
                value={doctorData.Resting_Blood_Pressure}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Resting_Blood_Pressure: parseInt(e.target.value) || 0
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* 5. Cholesterol */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docCholesterol')}
              </label>
              <input
                type="number"
                min="50"
                max="700"
                required
                value={doctorData.Cholesterol}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Cholesterol: parseInt(e.target.value) || 0
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* 6. Fasting Blood Sugar */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docFBS')}
              </label>
              <select
                value={doctorData.Fasting_Blood_Sugar}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Fasting_Blood_Sugar: parseInt(e.target.value) as 0 | 1
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={0}>{t('docFBS0')}</option>
                <option value={1}>{t('docFBS1')}</option>
              </select>
            </div>

            {/* 7. Resting ECG */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docRestingECG')}
              </label>
              <select
                value={doctorData.Resting_ECG_Results}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Resting_ECG_Results: parseInt(e.target.value) as 0 | 1 | 2
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={0}>{t('docECG0')}</option>
                <option value={1}>{t('docECG1')}</option>
                <option value={2}>{t('docECG2')}</option>
              </select>
            </div>

            {/* 8. Maximum Heart Rate (Thalach) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docMaxHR')}
              </label>
              <input
                type="number"
                min="40"
                max="250"
                required
                value={doctorData.Maximum_Heart_Rate}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Maximum_Heart_Rate: parseInt(e.target.value) || 0
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* 9. Exercise Induced Angina */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docExAngina')}
              </label>
              <select
                value={doctorData.Exercise_Induced_Angina}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Exercise_Induced_Angina: parseInt(e.target.value) as 0 | 1
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={0}>{t('docExAngina0')}</option>
                <option value={1}>{t('docExAngina1')}</option>
              </select>
            </div>

            {/* 10. ST Depression (Oldpeak) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docOldpeak')} (0.0 - 10.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={doctorData.Depression_Induced_By_Exercise}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Depression_Induced_By_Exercise: parseFloat(e.target.value) || 0
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white"
              />
            </div>

            {/* 11. Slope */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docSlope')}
              </label>
              <select
                value={doctorData.Slope_Of_Peak_Exercise}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Slope_Of_Peak_Exercise: parseInt(e.target.value) as 1 | 2 | 3
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={1}>{t('docSlope1')}</option>
                <option value={2}>{t('docSlope2')}</option>
                <option value={3}>{t('docSlope3')}</option>
              </select>
            </div>

            {/* 12. CA (Major Vessels) */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docCA')}
              </label>
              <select
                value={doctorData.Major_Vessels_Colored_By_Fluoroscopy}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Major_Vessels_Colored_By_Fluoroscopy: parseInt(
                      e.target.value
                    ) as 0 | 1 | 2 | 3
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={0}>0 vessels colored</option>
                <option value={1}>1 vessel colored</option>
                <option value={2}>2 vessels colored</option>
                <option value={3}>3 vessels colored</option>
              </select>
            </div>

            {/* 13. Thalassemia */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
                {t('docThal')}
              </label>
              <select
                value={doctorData.Thalassemia}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    Thalassemia: parseInt(e.target.value) as 3 | 6 | 7
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              >
                <option value={3}>{t('docThal3')}</option>
                <option value={6}>{t('docThal6')}</option>
                <option value={7}>{t('docThal7')}</option>
              </select>
            </div>
          </div>

          {/* Section: Live Computed Features (14, 15, 16) */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                {t('docComputedMetrics')}
              </span>
              <button
                type="button"
                onClick={() => setShowAdvancedOverrides(!showAdvancedOverrides)}
                className="text-[11px] text-teal-700 dark:text-teal-400 font-bold hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>{showAdvancedOverrides ? 'Hide Overrides' : 'Advanced Overrides'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">
                  {t('docRiskScore')}
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {doctorPreviewFeatures.Risk_Score}
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">
                  {t('docSymptomSeverity')}
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {doctorPreviewFeatures.symptom_severity}
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">
                  {t('docAgeThalachRatio')}
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {doctorPreviewFeatures.age_thalach_ratio}
                </div>
              </div>
            </div>

            {showAdvancedOverrides && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Custom Risk Score Override (0-15):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="15"
                    value={doctorData.customRiskScore ?? ''}
                    placeholder="Auto-calculated"
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        customRiskScore: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Custom Symptom Severity Override (0-10):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={doctorData.customSymptomSeverity ?? ''}
                    placeholder="Auto-calculated"
                    onChange={(e) =>
                      setDoctorData({
                        ...doctorData,
                        customSymptomSeverity: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-base shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <HeartPulse className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
              <span>{loading ? t('btnPredicting') : t('btnPredict')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
