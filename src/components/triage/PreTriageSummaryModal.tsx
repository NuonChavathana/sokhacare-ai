'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Edit3, CheckCircle2, AlertCircle } from 'lucide-react';

interface PreTriageSummaryModalProps {
  symptoms: string;
  severity: number;
  role: string;
  onEdit: () => void;
  onConfirm: () => void;
}

export function PreTriageSummaryModal({
  symptoms,
  severity,
  role,
  onEdit,
  onConfirm
}: PreTriageSummaryModalProps) {
  const { language } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="bg-teal-50/80 border-2 border-teal-300 p-4 rounded-2xl space-y-3 my-3 shadow-sm">
      <div className="flex items-center justify-between font-extrabold text-xs text-teal-950 border-b border-teal-200 pb-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-teal-700" />
          <span>{isKm ? 'សេចក្តីសង្ខេបព័ត៌មានរបស់អ្នក (Your Information Summary):' : 'Confirm Your Information:'}</span>
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 underline text-[11px]"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isKm ? 'កែប្រែ (Edit)' : 'Edit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white p-2.5 rounded-xl border border-teal-200 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">{isKm ? 'រោគសញ្ញា' : 'Symptoms'}:</span>
          <div className="font-extrabold text-slate-900 truncate">"{symptoms}"</div>
        </div>

        <div className="bg-white p-2.5 rounded-xl border border-teal-200 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">{isKm ? 'កម្រិតធ្ងន់ធ្ងរ' : 'Severity'}:</span>
          <div className="font-extrabold text-teal-800">{severity} / 5</div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1"
        >
          <span>{isKm ? 'បន្តទៅការវាយតម្លៃបឋម →' : 'Continue to Preliminary Assessment →'}</span>
        </button>
      </div>
    </div>
  );
}
