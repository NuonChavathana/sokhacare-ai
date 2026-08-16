'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { HeartDiseasePredictionResult, RiskLevel } from '@/types/prediction';
import { HealthcareFacility } from '@/types/triage';
import { getGoogleMapsDirectionsUrl } from '@/lib/location/geo-utils';
import { EmergencyAccessibilityCard } from './EmergencyAccessibilityCard';
import { TextToSpeechButton } from '@/components/shared/TextToSpeechButton';
import { generateHeartSpokenSummary } from '@/lib/speech/summary';
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Activity,
  MapPin,
  Phone,
  Navigation,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Info
} from 'lucide-react';

interface PredictionResultCardProps {
  result: HeartDiseasePredictionResult;
  nearbyFacilities: HealthcareFacility[];
  onReset: () => void;
}

export function PredictionResultCard({
  result,
  nearbyFacilities,
  onReset
}: PredictionResultCardProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const percentage = Math.round(result.probability * 100);
  const isHighRisk = result.riskLevel === 'High' || percentage >= 70;
  const isModerateRisk = result.riskLevel === 'Moderate' || (percentage >= 35 && percentage < 70);
  const isLowRisk = !isHighRisk && !isModerateRisk;

  // Filter for cardiac facilities
  const cardiacFacilities = nearbyFacilities.filter(
    (f) =>
      f.services.some((s) => s.toLowerCase().includes('cardiology') || s.includes('បេះដូង')) ||
      f.emergency_available ||
      f.type === 'hospital'
  ).slice(0, 3);

  const topFacility = cardiacFacilities[0] || nearbyFacilities[0];

  // Badge styling
  const badgeConfig: Record<
    RiskLevel,
    { bg: string; text: string; border: string; icon: any; titleKm: string; titleEn: string }
  > = {
    High: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      icon: AlertTriangle,
      titleKm: '🔴 ហានិភ័យខ្ពស់ (High Risk)',
      titleEn: '🔴 High Cardiovascular Risk'
    },
    Moderate: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      icon: AlertCircle,
      titleKm: '🟠 ហានិភ័យមធ្យម (Moderate Risk)',
      titleEn: '🟠 Moderate Cardiovascular Risk'
    },
    Low: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      icon: CheckCircle2,
      titleKm: '🟢 ហានិភ័យទាប (Low Risk)',
      titleEn: '🟢 Low Cardiovascular Risk'
    }
  };

  const currentBadge = badgeConfig[result.riskLevel] || badgeConfig.Low;
  const BadgeIcon = currentBadge.icon;

  return (
    <div className="space-y-8 animate-fadeIn" id="prediction-results">
      {/* High-Risk Emergency Floating Card */}
      {isHighRisk && (
        <EmergencyAccessibilityCard
          topFacility={topFacility}
          probability={result.probability}
        />
      )}

      {/* Main Prediction Score Visual Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-8">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('resultTitle')}</span>
              {result.mode && (
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 uppercase">
                  {result.mode} mode
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isKm ? currentBadge.titleKm : currentBadge.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <TextToSpeechButton
              text={generateHeartSpokenSummary(result, (language as 'km' | 'en') || 'km')}
              language={(language as 'km' | 'en') || 'km'}
            />
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('btnReset')}</span>
            </button>
          </div>
        </div>

        {/* Gauge & Probability Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Radial Meter / Large Percentage */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div
              className={`absolute -inset-1 rounded-full blur-2xl opacity-20 pointer-events-none ${
                isHighRisk
                  ? 'bg-rose-500'
                  : isModerateRisk
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />

            {/* SVG Circular Progress Meter */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  className={`transition-all duration-1000 ease-out ${
                    isHighRisk
                      ? 'stroke-rose-500'
                      : isModerateRisk
                      ? 'stroke-amber-500'
                      : 'stroke-emerald-500'
                  }`}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - result.probability)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  {percentage}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  {isKm ? 'ហានិភ័យ' : 'Risk Probability'}
                </span>
              </div>
            </div>

            <div className={`mt-4 px-4 py-1.5 rounded-full border text-xs font-black flex items-center gap-1.5 ${currentBadge.bg} ${currentBadge.text} ${currentBadge.border}`}>
              <BadgeIcon className="w-4 h-4" />
              <span>{result.riskLevel} Risk</span>
            </div>

            <div className="mt-3">
              <TextToSpeechButton
                text={generateHeartSpokenSummary(result, (language as 'km' | 'en') || 'km')}
                language={(language as 'km' | 'en') || 'km'}
                variant="outline"
                size="sm"
              />
            </div>
          </div>

          {/* Description & Clinical Interpretation */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-400" />
                <span>{isKm ? 'ការបកស្រាយលទ្ធផលគ្លីនិក' : 'Clinical Risk Interpretation'}</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {isHighRisk && (isKm ? t('riskHighDesc') : t('riskHighDesc'))}
                {isModerateRisk && (isKm ? t('riskModerateDesc') : t('riskModerateDesc'))}
                {isLowRisk && (isKm ? t('riskLowDesc') : t('riskLowDesc'))}
              </p>
            </div>

            {/* Quick Metrics summary pill box */}
            {result.features && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Resting BP</div>
                  <div className="font-extrabold text-slate-200 text-sm mt-0.5">
                    {result.features.Resting_Blood_Pressure} mmHg
                  </div>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Cholesterol</div>
                  <div className="font-extrabold text-slate-200 text-sm mt-0.5">
                    {result.features.Cholesterol} mg/dl
                  </div>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs">
                  <div className="text-slate-400 text-[10px] font-bold uppercase">Max Heart Rate</div>
                  <div className="font-extrabold text-slate-200 text-sm mt-0.5">
                    {result.features.Maximum_Heart_Rate} bpm
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Contributing Factors Section */}
        {result.contributingFactors && result.contributingFactors.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>{t('contributingFactorsTitle')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.contributingFactors.map((factor, idx) => {
                const isRisk = factor.impact === 'high_risk' || factor.impact === 'moderate_risk';
                const isProt = factor.impact === 'protective';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-all ${
                      factor.impact === 'high_risk'
                        ? 'bg-rose-950/30 border-rose-800/60 text-rose-100'
                        : factor.impact === 'moderate_risk'
                        ? 'bg-amber-950/30 border-amber-800/60 text-amber-100'
                        : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-200">
                        {isKm ? factor.labelKm : factor.labelEn}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${
                          factor.impact === 'high_risk'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : factor.impact === 'moderate_risk'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {factor.displayValue}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed font-medium">
                      {isKm ? factor.descriptionKm : factor.descriptionEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lifestyle & Clinical Recommendations for Low/Moderate Risk */}
        {!isHighRisk && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
              <span>{t('recommendationsTitle')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('recDiet')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('recExercise')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('recMonitor')}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3.5 bg-slate-950/40 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t('recConsultDoctor')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Cardiac Facilities */}
        {cardiacFacilities.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-teal-400" />
                <span>{t('cardiacFacilitiesTitle')}</span>
              </h3>
              <Link
                href="/facilities"
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <span>{isKm ? 'មើលទាំងអស់' : 'View All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cardiacFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase text-teal-400 px-2 py-0.5 bg-teal-950 border border-teal-800 rounded-md">
                        {facility.type.replace('_', ' ')}
                      </span>
                      {facility.emergency_available && (
                        <span className="text-[10px] font-black text-rose-400">24/7 ER</span>
                      )}
                    </div>
                    <div className="font-extrabold text-white text-sm">
                      {isKm ? facility.name_km : facility.name_en}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-2">
                      {isKm ? facility.address_km : facility.address_en}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <a
                      href={`tel:${facility.phone}`}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-teal-200 text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{t('callNow')}</span>
                    </a>
                    <a
                      href={getGoogleMapsDirectionsUrl(facility)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Directions"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-300 block uppercase text-[11px] tracking-wider">
              {t('disclaimerTitle')}
            </span>
            <p className="leading-relaxed font-medium">{t('disclaimerText')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
