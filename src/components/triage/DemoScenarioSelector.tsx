'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DemoScenario } from '@/types/triage';
import { AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface DemoScenarioSelectorProps {
  onSelectScenario: (symptom: string) => void;
  disabled?: boolean;
}

export function DemoScenarioSelector({ onSelectScenario, disabled }: DemoScenarioSelectorProps) {
  const { language, t } = useLanguage();

  const scenarios: DemoScenario[] = [
    {
      id: 'sc-1',
      title_km: '🔴 ករណីបន្ទាន់ (Emergency)',
      title_en: '🔴 Emergency Case',
      symptom_km: 'ខ្ញុំឈឺទ្រូងខ្លាំង ហើយពិបាកដកដង្ហើម',
      symptom_en: 'I have severe chest pain and difficulty breathing.',
      expectedUrgency: 'EMERGENCY',
      badgeColor: 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100'
    },
    {
      id: 'sc-2',
      title_km: '🟠 ករណីប្រញាប់ (Urgent)',
      title_en: '🟠 Urgent Case',
      symptom_km: 'ខ្ញុំក្តៅខ្លួនខ្លាំង និងមានអាការៈអស់កម្លាំង',
      symptom_en: 'I have a high fever and severe fatigue.',
      expectedUrgency: 'URGENT',
      badgeColor: 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
    },
    {
      id: 'sc-3',
      title_km: '🟢 ករណីធម្មតា (Routine)',
      title_en: '🟢 Routine Case',
      symptom_km: 'ខ្ញុំឈឺក្បាលបន្តិចពីព្រឹក',
      symptom_en: 'I have a mild headache since this morning.',
      expectedUrgency: 'ROUTINE',
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t('demoScenarios')}
        </span>
        <span className="text-[10px] font-medium text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
          Demo Preset Scenarios
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc) => {
          const symptomText = language === 'km' ? sc.symptom_km : sc.symptom_en;
          return (
            <button
              key={sc.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectScenario(symptomText)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all shadow-2xs text-left ${sc.badgeColor} ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
              }`}
            >
              <div className="font-bold text-[11px] mb-0.5 opacity-90">
                {language === 'km' ? sc.title_km : sc.title_en}
              </div>
              <div className="font-normal italic">"{symptomText}"</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
