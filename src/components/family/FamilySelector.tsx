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
    { role: 'myself', labelKey: 'myself', icon: User, color: 'bg-teal-50 border-teal-300 text-teal-900' },
    { role: 'child', labelKey: 'child', icon: Baby, color: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
    { role: 'parent', labelKey: 'parent', icon: Heart, color: 'bg-blue-50 border-blue-300 text-blue-900' },
    { role: 'elderly', labelKey: 'elderly', icon: UserCheck, color: 'bg-amber-50 border-amber-300 text-amber-900' },
    { role: 'other', labelKey: 'other', icon: Users, color: 'bg-purple-50 border-purple-300 text-purple-900' }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-base font-extrabold text-slate-900">{t('whoNeedsHelp')}</h3>
        <p className="text-xs text-slate-500">
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
                  : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 font-semibold'
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
