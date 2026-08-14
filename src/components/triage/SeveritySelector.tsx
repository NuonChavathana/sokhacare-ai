'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SeveritySelectorProps {
  value: number;
  onChange: (val: number) => void;
}

export function SeveritySelector({ value, onChange }: SeveritySelectorProps) {
  const { language } = useLanguage();
  const isKm = language === 'km';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 my-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
        <span>{isKm ? 'តើអាការៈមានកម្រិតធ្ងន់ធ្ងរប៉ុណ្ណា? (Severity Level):' : 'How severe is it?'}</span>
        <span className="text-teal-700 font-extrabold bg-teal-100 px-2 py-0.5 rounded-md">
          {value} / 5
        </span>
      </div>

      <div className="flex justify-between gap-1.5">
        {[1, 2, 3, 4, 5].map((num) => {
          const isActive = value === num;
          const bgColors = [
            'hover:bg-emerald-100 text-emerald-800',
            'hover:bg-teal-100 text-teal-800',
            'hover:bg-amber-100 text-amber-800',
            'hover:bg-orange-100 text-orange-800',
            'hover:bg-rose-100 text-rose-800'
          ];
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-extrabold transition-all shadow-2xs ${
                isActive
                  ? 'bg-teal-700 text-white border-teal-700 scale-105 shadow-md'
                  : `bg-white border-slate-200 ${bgColors[num - 1]}`
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
        <span>{isKm ? 'ស្រាល (Mild)' : '1 - Mild'}</span>
        <span>{isKm ? 'មធ្យម' : '3 - Moderate'}</span>
        <span>{isKm ? 'ធ្ងន់ធ្ងរខ្លាំង (Severe)' : '5 - Severe'}</span>
      </div>
    </div>
  );
}
