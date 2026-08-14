'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { TriageResult, HealthcareFacility } from '@/types/triage';
import { scoreFacilities, ScoredFacility } from '@/lib/facilities/facility-scoring';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  PhoneCall,
  Navigation,
  Building2,
  ShieldAlert,
  Info,
  MapPin,
  UserCheck,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface TriageCardProps {
  result: TriageResult;
  facilities?: HealthcareFacility[];
}

export function TriageCard({ result, facilities = [] }: TriageCardProps) {
  const { language, t } = useLanguage();

  const isKm = language === 'km';
  const summary = isKm ? result.summary_km : result.summary_en;
  const safetyMessage = isKm ? result.safety_message_km : result.safety_message_en;

  const isEmergency = result.urgency === 'EMERGENCY';

  // Urgency styling configurations
  const config = {
    EMERGENCY: {
      badge: t('emergencyHeading'),
      headerBg: 'bg-gradient-to-r from-rose-700 via-red-600 to-rose-800 text-white animate-pulse-slow',
      borderColor: 'border-rose-600',
      boxBg: 'bg-rose-50/90',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      actionTitle: isKm ? 'តើខ្ញុំគួរធ្វើអ្វីបន្តទៀតឥឡូវនេះ? (What should I do now?):' : 'What should I do now?',
      actionText: isKm ? 'សូមប្រញាប់ទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់នៃមន្ទីរពេទ្យដែលនៅជិតបំផុតភ្លាមៗ!' : 'Go to the nearest appropriate hospital now.'
    },
    URGENT: {
      badge: t('urgentBadge'),
      headerBg: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
      borderColor: 'border-amber-400',
      boxBg: 'bg-amber-50/75',
      icon: Clock,
      iconColor: 'text-amber-600',
      actionTitle: isKm ? 'តើខ្ញុំគួរធ្វើអ្វីបន្តទៀតឥឡូវនេះ? (What should I do now?):' : 'What should I do now?',
      actionText: isKm ? 'សូមរៀបចំទៅពិនិត្យ និងពិគ្រោះជាមួយគ្រូពេទ្យនៅមន្ទីរពេទ្យបង្អែកក្នុងពេលឆាប់ៗ (ក្នុង ២៤ ម៉ោង)។' : 'Arrange a healthcare evaluation soon (within 24 hours).'
    },
    ROUTINE: {
      badge: t('routineBadge'),
      headerBg: 'bg-gradient-to-r from-teal-700 to-emerald-600 text-white',
      borderColor: 'border-teal-400',
      boxBg: 'bg-teal-50/75',
      icon: CheckCircle2,
      iconColor: 'text-teal-600',
      actionTitle: isKm ? 'តើខ្ញុំគួរធ្វើអ្វីបន្តទៀតឥឡូវនេះ? (What should I do now?):' : 'What should I do now?',
      actionText: isKm ? 'សូមទៅពិគ្រោះជាមួយគ្រូពេទ្យនៅមណ្ឌលសុខភាព ឬគ្លីនិកតាមពេលវេលាសមស្រប។' : 'Consider visiting a local clinic or health centre.'
    },
    SELF_CARE: {
      badge: t('selfCareBadge'),
      headerBg: 'bg-gradient-to-r from-blue-700 to-indigo-600 text-white',
      borderColor: 'border-blue-400',
      boxBg: 'bg-blue-50/75',
      icon: Info,
      iconColor: 'text-blue-600',
      actionTitle: isKm ? 'តើខ្ញុំគួរធ្វើអ្វីបន្តទៀតឥឡូវនេះ? (What should I do now?):' : 'What should I do now?',
      actionText: isKm ? 'បន្តតាមដានសុខភាពនៅផ្ទះ និងប្រញាប់ទៅជួបគ្រូពេទ្យប្រសិនបើរោគសញ្ញាប្រែជាធ្ងន់ធ្ងរជាងមុន។' : 'Monitor symptoms and seek care if they worsen.'
    }
  }[result.urgency];

  const IconComponent = config.icon;

  // Calculate Smart Recommendation Scores
  const scoredFacilities: ScoredFacility[] = scoreFacilities(
    facilities,
    result.urgency,
    result.recommended_facility_type
  );
  const topFacility = scoredFacilities[0];

  return (
    <div className={`rounded-3xl border-2 ${config.borderColor} overflow-hidden shadow-xl my-4 transition-all`}>
      {/* Header Badge */}
      <div className={`px-6 py-4 ${config.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <IconComponent className="w-7 h-7 stroke-[2.5]" />
          <div>
            <span className="text-lg font-extrabold tracking-wide block">{config.badge}</span>
            <span className="text-[11px] opacity-90 font-medium">
              {t('preliminaryAssessment')}
            </span>
          </div>
        </div>

        <span className="text-xs bg-white/20 border border-white/30 px-3 py-1 rounded-full font-mono font-bold">
          Confidence: {Math.round(result.confidence * 100)}%
        </span>
      </div>

      {/* Main Card Body */}
      <div className={`p-6 ${config.boxBg} space-y-5`}>
        {/* Triage Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('preliminaryAssessment')}:
          </span>
          <p className="text-base font-extrabold text-slate-900 leading-relaxed">{summary}</p>
        </div>

        {/* Red Flags Tags (If detected) */}
        {result.red_flags && result.red_flags.length > 0 && (
          <div className="bg-rose-100 border border-rose-300 p-4 rounded-2xl space-y-2">
            <span className="text-xs font-extrabold text-rose-950 block uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
              {isKm ? 'សញ្ញាអាសន្នត្រូវបានរកឃើញ (Red Flags Detected):' : 'Emergency Red Flags Detected:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.red_flags.map((flag, idx) => (
                <span
                  key={idx}
                  className="bg-rose-700 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs"
                >
                  ⚠️ {flag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* "What Should I Do Now?" Action Card (Requirement 71) */}
        <div className="bg-white p-5 rounded-2xl border-2 border-teal-400 shadow-sm space-y-2">
          <div className="flex items-center gap-2 font-extrabold text-sm text-teal-950 uppercase tracking-wider">
            <HelpCircle className="w-5 h-5 text-teal-700" />
            <span>{config.actionTitle}</span>
          </div>
          <p className="text-sm font-extrabold text-slate-900 leading-relaxed bg-teal-50/70 p-3 rounded-xl border border-teal-200">
            👉 {config.actionText}
          </p>
        </div>

        {/* Emergency Immediate Action Card */}
        {isEmergency && (
          <div className="bg-rose-600 text-white p-5 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-base">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
              <span>{t('emergencyNotice')}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:119"
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white text-rose-950 font-black shadow-md transition-all hover:bg-rose-50 text-sm"
              >
                <PhoneCall className="w-5 h-5 text-rose-600" />
                <span>{t('callEmergency')}</span>
              </a>

              {topFacility && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${topFacility.latitude},${topFacility.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold shadow-md transition-all text-sm"
                >
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  <span>{t('getDirections')}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Doctor Handoff Banner */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-white">{t('doctorHandoffTitle')}</div>
              <div className="text-[11px] text-teal-200">{t('doctorHandoffText')}</div>
            </div>
          </div>

          <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full shrink-0">
            {t('comingSoon')}
          </span>
        </div>

        {/* Recommended Facilities List with Smart Scoring & Explainable Badges (Requirements 68, 69, 70) */}
        {scoredFacilities.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                {t('recommendedFacility')}
              </span>
              <Link
                href="/facilities"
                className="text-xs font-bold text-teal-700 hover:text-teal-900 underline flex items-center gap-0.5"
              >
                <span>{t('seeAllFacilities')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {scoredFacilities.slice(0, 2).map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-teal-400 transition-all flex flex-col space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/facilities/${fac.id}`}
                          className="font-extrabold text-sm text-slate-900 hover:text-teal-700 transition-colors"
                        >
                          {isKm ? fac.name_km : fac.name_en}
                        </Link>
                        {fac.emergency_available && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            🚨 Emergency
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{isKm ? fac.address_km : fac.address_en}</span>
                      </div>

                      {fac.distance_km !== undefined && (
                        <div className="text-[11px] font-extrabold text-teal-700">
                          📍 {t('distance')}: {fac.distance_km} {t('km')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/facilities/${fac.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200"
                      >
                        {isKm ? 'ព័ត៌មាន' : 'Details'}
                      </Link>

                      {fac.phone && (
                        <a
                          href={`tel:${fac.phone.replace(/[^0-9+]/g, '')}`}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-extrabold flex items-center gap-1 border border-teal-200"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('callNow')}</span>
                        </a>
                      )}

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{t('getDirections')}</span>
                      </a>
                    </div>
                  </div>

                  {/* Explainable Recommendation Tags (Requirement 69) */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                    <span className="font-extrabold text-slate-700 block uppercase tracking-wider">
                      {isKm ? 'ហេតុអ្វីបានជាណែនាំមណ្ឌលសុខភាពនេះ? (Why this facility?):' : 'Why this facility?'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {fac.matchReasons.map((reason, rIdx) => (
                        <span
                          key={rIdx}
                          className="bg-white border border-teal-200 text-teal-900 font-bold px-2 py-0.5 rounded-md shadow-2xs"
                        >
                          {isKm ? reason.km : reason.en}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
