'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, ShieldAlert, CheckCircle2, PhoneCall } from 'lucide-react';

export default function PrivacyPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const safetyRules = [
    {
      km: '១. មិនដែលធ្វើរោគវិនិច្ឆ័យជំងឺដោយអះអាងថាជាការច្បាស់លាស់ 100% ឡើយ។',
      en: '1. Never diagnose a disease with absolute medical certainty.'
    },
    {
      km: '២. មិនដែលអះអាងថាជំនួសមុខតំណែងវេជ្ជបណ្ឌិត ឬគ្រូពេទ្យឡើយ។',
      en: '2. Never claim to replace a real doctor or healthcare specialist.'
    },
    {
      km: '៣. មិនដែលហាមឃាត់ ឬរារាំងការទទួលបានការសង្គ្រោះបន្ទាន់ឡើយ។',
      en: '3. Never discourage emergency medical care or ambulance dispatch.'
    },
    {
      km: '៤. រោគសញ្ញាសញ្ញាអាសន្ន (Red-flags) ត្រូវតែទទួលបានអាទិភាពខ្ពស់បំផុត។',
      en: '4. Red-flag emergency symptoms must always take top priority.'
    },
    {
      km: '៥. នៅពេលមិនប្រាកដប្រជា ត្រូវតែណែនាំឲ្យទៅពិនិត្យជាមួយគ្រូពេទ្យជំនាញ។',
      en: '5. When uncertain, recommend professional medical evaluation.'
    },
    {
      km: '៦. រក្សាការផ្តល់ប្រឹក្សាឲ្យមានភាពសាមញ្ញ ងាយយល់ និងមានសុវត្ថិភាព។',
      en: '6. Keep health advice simple, clear, and strictly safe.'
    },
    {
      km: '៧. បញ្ជាក់ច្បាស់ៗពីដែនកំណត់នៃបច្ចេកវិទ្យា AI។',
      en: '7. Clearly communicate AI technology boundaries and limitations.'
    },
    {
      km: '៨. មិនបង្កើត ឬប្រឌិតលេខទូរស័ព្ទសង្គ្រោះបន្ទាន់ ឬឈ្មោះមន្ទីរពេទ្យក្លែងក្លាយឡើយ។',
      en: '8. Do not fabricate emergency contacts or healthcare facility data.'
    },
    {
      km: '៩. មិនបង្ហាញការគិត ឬស្មុគស្មាញផ្ទៃក្នុងរបស់ AI ដល់អ្នកប្រើប្រាស់ឡើយ។',
      en: '9. Do not expose internal raw AI prompt reasoning.'
    },
    {
      km: '១០. ចាត់ទុកលទ្ធផលវាយតម្លៃទាំងអស់ត្រឹមជាព័ត៌មានណែនាំបឋមប៉ុណ្ណោះ។',
      en: '10. Treat all triage outputs as preliminary navigation guidance only.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-950">
              {t('privacyTitle')}
            </h1>
            <p className="text-xs text-rose-800 font-semibold mt-0.5">
              SokhaCare AI Ethical Safety & Privacy Protocols
            </p>
          </div>
        </div>
        <p className="text-sm text-rose-900 leading-relaxed font-medium">
          {t('disclaimerText')}
        </p>
      </div>

      {/* 10 Safety Principles List */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <span>{t('safetyRulesTitle')}</span>
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {safetyRules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm font-semibold text-slate-800">
                {isKm ? rule.km : rule.en}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cambodian Emergency Contact Box */}
      <div className="bg-gradient-to-r from-teal-900 to-emerald-900 text-white p-6 rounded-3xl space-y-3 shadow-lg">
        <h3 className="font-extrabold text-base flex items-center gap-2 text-rose-300">
          <PhoneCall className="w-5 h-5" />
          <span>{isKm ? 'លេខទំនាក់ទំនងសង្គ្រោះបន្ទាន់កម្ពុជា' : 'Cambodia Emergency Hotline Numbers'}</span>
        </h3>
        <ul className="text-xs space-y-1.5 text-teal-100 font-medium">
          <li>• 119 - រថយន្តសង្គ្រោះបន្ទាន់ (Ambulance Service)</li>
          <li>• 115 - ក្រសួងសុខាភិបាល (Ministry of Health CDC)</li>
          <li>• +855 23 426 948 - មន្ទីរពេទ្យកាល់ម៉ែត (Calmette Hospital Phnom Penh)</li>
          <li>• +855 63 760 311 - មន្ទីរពេទ្យបង្អែកខេត្តសៀមរាប (Siem Reap Provincial Hospital)</li>
        </ul>
      </div>
    </div>
  );
}
