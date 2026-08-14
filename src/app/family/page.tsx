'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { FamilySelector, PatientRole } from '@/components/family/FamilySelector';
import { Users, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FamilyPage() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [role, setRole] = useState<PatientRole>('myself');

  const handleStartTriage = () => {
    router.push(`/triage?role=${role}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-8 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>{t('familyTitle')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{t('familyTitle')}</h1>
        <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed font-medium">
          {t('familySubtitle')}
        </p>
      </div>

      {/* Role Selection Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <FamilySelector selectedRole={role} onSelectRole={setRole} />

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              {language === 'km'
                ? 'ព័ត៌មានគ្រួសារមិនត្រូវបានរក្សាទុកជាឯកសារផ្ទាល់ខ្លួនឡើយ'
                : 'No sensitive personal family health data is stored unnecessarily.'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleStartTriage}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-extrabold text-base shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('startCheckup')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
