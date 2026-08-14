'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

interface TriageProgressProps {
  currentStep: 1 | 2 | 3;
}

export function TriageProgress({ currentStep }: TriageProgressProps) {
  const { language } = useLanguage();
  const isKm = language === 'km';

  const steps = [
    {
      step: 1,
      km: 'ជំហាន ១ នៃ ៣៖ ស្វែងយល់ពីរោគសញ្ញារបស់អ្នក',
      en: 'Step 1 of 3: Understanding your symptoms'
    },
    {
      step: 2,
      km: 'ជំហាន ២ នៃ ៣៖ ពិនិត្យសញ្ញាព្រមានសំខាន់ៗ',
      en: 'Step 2 of 3: Checking important warning signs'
    },
    {
      step: 3,
      km: 'ជំហាន ៣ នៃ ៣៖ រៀបចំការណែនាំថែទាំសុខភាព',
      en: 'Step 3 of 3: Preparing your care recommendation'
    }
  ];

  const currentLabel = isKm ? steps[currentStep - 1].km : steps[currentStep - 1].en;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-3 shadow-2xs space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
        <span className="flex items-center gap-1.5 text-teal-800">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          <span>{currentLabel}</span>
        </span>
        <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
          {currentStep} / 3
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full transition-all duration-500 rounded-full"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}
