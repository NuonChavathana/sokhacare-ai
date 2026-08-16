'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { GeneralDiseaseInput, GeneralDiseaseResponse } from '@/types/generalDisease';
import { GENERAL_SYMPTOMS_CATALOG } from '@/lib/data/generalDiseases';
import {
  Thermometer,
  Activity,
  AlertTriangle,
  Sparkles,
  Zap,
  Clock,
  RotateCcw,
  CheckCircle2,
  X,
  Search,
  Stethoscope
} from 'lucide-react';

interface GeneralDiseaseFormProps {
  onAssessmentSuccess: (result: GeneralDiseaseResponse) => void;
}

export function GeneralDiseaseForm({ onAssessmentSuccess }: GeneralDiseaseFormProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'fever',
    'muscle_joint_aches',
    'headache_mild_mod'
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [temperature, setTemperature] = useState<string>('38.5');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toggle symptom selection
  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  // Quick Preset Scenarios
  const applyPreset = (type: 'dengue' | 'flu' | 'gastro' | 'appendicitis' | 'pneumonia') => {
    if (type === 'dengue') {
      setAge(24);
      setGender('male');
      setSelectedSymptoms(['high_fever_spiking', 'retro_orbital_pain', 'muscle_joint_aches', 'skin_rash_petechiae']);
      setTemperature('39.5');
      setDuration('1-3 days');
      setSeverity('severe');
    } else if (type === 'flu') {
      setAge(32);
      setGender('female');
      setSelectedSymptoms(['fever', 'cough_dry', 'sore_throat', 'chills_shivering', 'muscle_joint_aches']);
      setTemperature('38.4');
      setDuration('1-3 days');
      setSeverity('moderate');
    } else if (type === 'gastro') {
      setAge(28);
      setGender('male');
      setSelectedSymptoms(['watery_diarrhea', 'nausea_vomiting', 'abdominal_cramps']);
      setTemperature('37.5');
      setDuration('< 1 day');
      setSeverity('moderate');
    } else if (type === 'appendicitis') {
      setAge(22);
      setGender('female');
      setSelectedSymptoms(['severe_rlq_pain', 'nausea_vomiting', 'loss_of_appetite', 'fever']);
      setTemperature('38.2');
      setDuration('1-3 days');
      setSeverity('severe');
    } else if (type === 'pneumonia') {
      setAge(64);
      setGender('male');
      setSelectedSymptoms(['cough_productive', 'shortness_of_breath', 'fever', 'chest_pain_breathing']);
      setTemperature('39.0');
      setDuration('4-7 days');
      setSeverity('severe');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parsedTemp = temperature ? parseFloat(temperature) : null;

    if (
      selectedSymptoms.length === 0 &&
      (!parsedTemp || isNaN(parsedTemp) || parsedTemp < 37.5)
    ) {
      setErrorMessage(
        isKm
          ? 'សូមជ្រើសរើសរោគសញ្ញាយ៉ាងហោចណាស់មួយពីបញ្ជីរោគសញ្ញាខាងក្រោម។'
          : 'Please select at least one symptom from the list below.'
      );
      return;
    }

    setLoading(true);
    try {
      const payload: GeneralDiseaseInput = {
        age,
        gender,
        symptoms: selectedSymptoms,
        duration,
        severity,
        temperature: parsedTemp && !isNaN(parsedTemp) ? parsedTemp : null,
        language: (language as 'km' | 'en') || 'km'
      };

      const res = await fetch('/api/general-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setErrorMessage(
          json.error ||
            (isKm
              ? 'សូមជ្រើសរើសរោគសញ្ញាយ៉ាងហោចណាស់មួយពីបញ្ជីខាងក្រោម។'
              : 'Please select at least one symptom from the list below.')
        );
        return;
      }

      onAssessmentSuccess(json.result);
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          (isKm
            ? 'មានបញ្ហាក្នុងការតភ្ជាប់ សូមពិនិត្យមើលម្តងទៀត។'
            : 'Network error connecting to disease matching engine.')
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter symptoms by search input
  const filteredSymptoms = GENERAL_SYMPTOMS_CATALOG.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return s.nameEn.toLowerCase().includes(term) || s.nameKm.includes(term);
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Top Presets Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>{t('predictPageTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('generalModeDesc')}</p>
        </div>

        {/* Quick Test Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap mr-1 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            {isKm ? 'គំរូ:' : 'Presets:'}
          </span>
          <button
            type="button"
            onClick={() => applyPreset('dengue')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors whitespace-nowrap"
          >
            {t('generalPresetDengue')}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('flu')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition-colors whitespace-nowrap"
          >
            {t('generalPresetFlu')}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('gastro')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-colors whitespace-nowrap"
          >
            {t('generalPresetGastro')}
          </button>
          <button
            type="button"
            onClick={() => applyPreset('appendicitis')}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors whitespace-nowrap"
          >
            {t('generalPresetAppendicitis')}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Notice: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Demographics & Temperature */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
              {t('labelAge')}
            </label>
            <input
              type="number"
              min="1"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
              {t('labelGender')}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            >
              <option value="male">{t('genderMale')}</option>
              <option value="female">{t('genderFemale')}</option>
              <option value="other">{isKm ? 'ផ្សេងទៀត (Other)' : 'Other'}</option>
            </select>
          </div>

          {/* Body Temperature */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('bodyTempLabel')}</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="34"
              max="43"
              placeholder="e.g. 38.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            />
          </div>
        </div>

        {/* Section 2: Predefined Symptoms Multi-Select Catalog */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>{t('symptomsTitle')}</span>
              <span className="text-teal-600 dark:text-teal-400 font-mono">({selectedSymptoms.length} selected)</span>
            </label>

            {/* Filter / Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={t('symptomSearchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Symptom Chips Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            {filteredSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`p-3 rounded-2xl text-xs font-bold text-left border flex items-start justify-between gap-1.5 transition-all ${
                    isSelected
                      ? symptom.isRedFlag
                        ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400'
                        : 'bg-teal-50 dark:bg-teal-950/60 border-teal-600 dark:border-teal-500 text-teal-950 dark:text-teal-200 ring-1 ring-teal-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className="line-clamp-2">{isKm ? symptom.nameKm : symptom.nameEn}</span>
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? symptom.isRedFlag
                          ? 'bg-rose-600 border-rose-600 text-white'
                          : 'bg-teal-600 border-teal-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Duration & Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Duration */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{t('symptomDuration')}</span>
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800"
            >
              <option value="< 1 day">{isKm ? 'ក្រោម ២៤ ម៉ោង (< 1 day)' : 'Less than 24 hours'}</option>
              <option value="1-3 days">{isKm ? '១ ទៅ ៣ ថ្ងៃ (1-3 days)' : '1 to 3 days'}</option>
              <option value="4-7 days">{isKm ? '៤ ទៅ ៧ ថ្ងៃ (4-7 days)' : '4 to 7 days'}</option>
              <option value="> 1 week">{isKm ? 'លើសពី ១ សប្តាហ៍ (> 1 week)' : 'More than 1 week'}</option>
              <option value="> 2 weeks">{isKm ? 'លើសពី ២ សប្តាហ៍ (> 2 weeks)' : 'More than 2 weeks'}</option>
            </select>
          </div>

          {/* Severity */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
              {t('symptomSeverity')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('mild')}
                className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                  severity === 'mild'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-200 font-black'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {t('severityMild')}
              </button>
              <button
                type="button"
                onClick={() => setSeverity('moderate')}
                className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                  severity === 'moderate'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-600 text-amber-950 dark:text-amber-200 font-black'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {t('severityModerate')}
              </button>
              <button
                type="button"
                onClick={() => setSeverity('severe')}
                className={`py-3 px-2 rounded-2xl text-xs font-bold border transition-all ${
                  severity === 'severe'
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-600 text-rose-950 dark:text-rose-200 font-black'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                {t('severitySevere')}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-black text-base shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? t('analyzingSymptoms') : t('btnAnalyzeSymptoms')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
