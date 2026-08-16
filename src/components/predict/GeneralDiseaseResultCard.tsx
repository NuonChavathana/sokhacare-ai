'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { GeneralDiseaseResponse, GeneralUrgencyLevel } from '@/types/generalDisease';
import { HealthcareFacility } from '@/types/triage';
import { getGoogleMapsDirectionsUrl } from '@/lib/location/geo-utils';
import { EmergencyAccessibilityCard } from './EmergencyAccessibilityCard';
import { TextToSpeechButton } from '@/components/shared/TextToSpeechButton';
import { generateGeneralDiseaseSpokenSummary } from '@/lib/speech/summary';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Activity,
  Phone,
  Navigation,
  HelpCircle,
  Stethoscope,
  Info,
  Volume2
} from 'lucide-react';

interface GeneralDiseaseResultCardProps {
  result: GeneralDiseaseResponse;
  nearbyFacilities: HealthcareFacility[];
  onReset: () => void;
}

export function GeneralDiseaseResultCard({
  result,
  nearbyFacilities,
  onReset
}: GeneralDiseaseResultCardProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const isEmergency = result.overallUrgency === 'emergency';
  const isUrgent = result.overallUrgency === 'urgent';
  const isHighAttention = isEmergency || isUrgent;

  const topFacility = nearbyFacilities[0];

  const urgencyConfig: Record<
    GeneralUrgencyLevel,
    { bg: string; text: string; border: string; icon: any; titleKm: string; titleEn: string }
  > = {
    emergency: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/40',
      icon: AlertTriangle,
      titleKm: '🔴 ស្ថានភាពបន្ទាន់ខ្លាំង (EMERGENCY)',
      titleEn: '🔴 EMERGENCY ATTENTION REQUIRED'
    },
    urgent: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      icon: Clock,
      titleKm: '🟠 គួរទៅពិនិត្យឆាប់ៗ (URGENT CARE)',
      titleEn: '🟠 URGENT MEDICAL EVALUATION (Within 24h)'
    },
    see_doctor: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-400',
      border: 'border-yellow-500/40',
      icon: Stethoscope,
      titleKm: '🟡 គួរជួបពិគ្រោះជាមួយគ្រូពេទ្យ (SEE DOCTOR)',
      titleEn: '🟡 SCHEDULE DOCTOR CONSULTATION'
    },
    self_care: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      icon: CheckCircle2,
      titleKm: '🟢 ថែទាំខ្លួនឯង & តាមដាន (SELF-CARE)',
      titleEn: '🟢 SELF-CARE & HOME MONITORING'
    }
  };

  const currentUrgency = urgencyConfig[result.overallUrgency] || urgencyConfig.self_care;
  const UrgencyIcon = currentUrgency.icon;

  return (
    <div className="space-y-8 animate-fadeIn" id="general-disease-results">
      {/* High Attention Floating Card */}
      {isHighAttention && (
        <EmergencyAccessibilityCard
          topFacility={topFacility}
        />
      )}

      {/* Main Result Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isKm ? 'លទ្ធផលវិភាគរោគសញ្ញាទូទៅ' : 'General Disease Assessment Result'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isKm ? currentUrgency.titleKm : currentUrgency.titleEn}
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <TextToSpeechButton
              text={generateGeneralDiseaseSpokenSummary(result, (language as 'km' | 'en') || 'km')}
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

        {/* Red Flags Alert Box (if present) */}
        {result.redFlags && result.redFlags.length > 0 && (
          <div className="bg-rose-950/70 border-2 border-rose-600/80 rounded-2xl p-5 text-xs text-rose-100 space-y-3">
            <div className="flex items-center gap-2 font-black text-sm text-rose-300 uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
              <span>{t('redFlagsAlertTitle')}</span>
            </div>
            <div className="space-y-2">
              {result.redFlags.map((rf) => (
                <div key={rf.id} className="p-3 bg-rose-900/60 rounded-xl border border-rose-700/60 space-y-1">
                  <div className="font-extrabold text-white text-xs">
                    {isKm ? rf.titleKm : rf.titleEn}
                  </div>
                  <p className="text-rose-200 leading-relaxed font-medium">
                    {isKm ? rf.descriptionKm : rf.descriptionEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ranked Possible Condition Matches */}
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>{t('possibleConditionsTitle')}</span>
          </h3>

          {result.possibleConditions.length === 0 ? (
            <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-400 text-center">
              {isKm
                ? 'មិនមានជំងឺជាក់លាក់ដែលផ្គូផ្គងនឹងរោគសញ្ញានេះទេ។ សូមពិគ្រោះជាមួយគ្រូពេទ្យដើម្បីពិនិត្យបន្ថែម។'
                : 'No specific conditions strongly matched these symptoms. Please consult a doctor for a thorough evaluation.'}
            </div>
          ) : (
            <div className="space-y-4">
              {result.possibleConditions.map((condition, idx) => {
                const matchPct = Math.round(condition.score * 100);
                const condUrgency = urgencyConfig[condition.urgency] || urgencyConfig.self_care;

                return (
                  <div
                    key={condition.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 hover:border-teal-500/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-900/80 text-teal-300 font-mono font-bold text-xs flex items-center justify-center border border-teal-700/60">
                          #{idx + 1}
                        </span>
                        <h4 className="text-base font-black text-white">
                          {isKm ? condition.nameKm : condition.nameEn}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-teal-300">
                            {matchPct}% match
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${condUrgency.bg} ${condUrgency.text} ${condUrgency.border}`}>
                          {condition.urgency.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${matchPct}%` }}
                      />
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {condition.description}
                    </p>

                    {/* Matched Symptoms */}
                    {condition.matchedSymptoms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {isKm ? 'រោគសញ្ញាត្រូវគ្នា៖' : 'Matched Symptoms:'}
                        </span>
                        {condition.matchedSymptoms.map((ms) => (
                          <span
                            key={ms.id}
                            className="px-2 py-0.5 bg-teal-950/60 border border-teal-800 text-teal-200 text-[10px] font-semibold rounded-md"
                          >
                            ✓ {isKm ? ms.nameKm : ms.nameEn}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {condition.recommendations && condition.recommendations.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                          {t('actionRecommendationsTitle')}:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300 font-medium">
                          {condition.recommendations.map((rec, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Nearest Facilities Recommendation for Urgent / Emergency */}
        {isHighAttention && nearbyFacilities.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <span>{isKm ? 'មណ្ឌលសុខភាព ឬមន្ទីរពេទ្យណែនាំ' : 'Recommended Healthcare Facilities'}</span>
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
              {nearbyFacilities.slice(0, 3).map((facility) => (
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

        {/* Medical Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
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
