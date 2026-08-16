'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { User, Baby, Heart, UserCheck, Users } from 'lucide-react';

export type PatientRole = 'myself' | 'child' | 'parent' | 'elderly' | 'other';

interface FamilySelectorProps {
  selectedRole: PatientRole;
  onSelectRole: (role: PatientRole) => void;
}

export function FamilySelector({ selectedRole, onSelectRole }: FamilySelectorProps) {
  const { language, t } = useLanguage();

  const options: { role: PatientRole; labelKey: string; icon: any; color: string }[] = [
    { role: 'myself', labelKey: 'myself', icon: User, color: 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-300' },
    { role: 'child', labelKey: 'child', icon: Baby, color: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' },
    { role: 'parent', labelKey: 'parent', icon: Heart, color: 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300' },
    { role: 'elderly', labelKey: 'elderly', icon: UserCheck, color: 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300' },
    { role: 'other', labelKey: 'other', icon: Users, color: 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-300' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{t('whoNeedsHelp')}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'km'
            ? 'ការជ្រើសរើសសមាជិកគ្រួសារ ជួយ AI ផ្តល់សំណួរ និងការណែនាំបានកាន់តែច្បាស់លាស់'
            : 'Selecting who needs help adapts the AI follow-up questions to their age group.'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedRole === opt.role;
          return (
            <button
              key={opt.role}
              type="button"
              onClick={() => onSelectRole(opt.role)}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center shadow-xs ${
                isSelected
                  ? 'border-teal-600 bg-teal-600 text-white scale-[1.03] shadow-md font-extrabold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-300 dark:hover:border-teal-600 font-semibold'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-white/20 text-white' : opt.color
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs leading-tight">{t(opt.labelKey as any)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
