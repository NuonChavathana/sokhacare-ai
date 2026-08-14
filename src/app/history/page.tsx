'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { UrgencyLevel } from '@/types/triage';
import { History, Trash2, Sparkles, MapPin, Calendar, ShieldCheck } from 'lucide-react';

interface HistoryItem {
  id: string;
  date: string;
  symptomSummary: string;
  urgency: UrgencyLevel;
  facility: string;
}

const mockInitialHistory: HistoryItem[] = [
  {
    id: 'h-1',
    date: '2026-08-14 14:20',
    symptomSummary: 'ឈឺទ្រូងខ្លាំង និងពិបាកដកដង្ហើម',
    urgency: 'EMERGENCY',
    facility: 'Calmette Hospital'
  },
  {
    id: 'h-2',
    date: '2026-08-14 11:05',
    symptomSummary: 'ក្តៅខ្លួនខ្លាំង និងអស់កម្លាំង',
    urgency: 'URGENT',
    facility: 'Siem Reap Provincial Referral Hospital'
  },
  {
    id: 'h-3',
    date: '2026-08-13 09:30',
    symptomSummary: 'ឈឺក្បាលបន្តិចពីព្រឹក',
    urgency: 'ROUTINE',
    facility: 'Tuol Kouk Health Centre'
  }
];

export default function HistoryPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sokhacare_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory(mockInitialHistory);
      }
    } else {
      setHistory(mockInitialHistory);
    }
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sokhacare_history');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Session History</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t('historyTitle')}</h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-400/40 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('clearHistory')}</span>
          </button>
        )}
      </div>

      {/* History List Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <History className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-500">{t('noHistory')}</p>
            <Link
              href="/triage"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('startCheckup')}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => {
              const badgeStyle =
                item.urgency === 'EMERGENCY'
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : item.urgency === 'URGENT'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : item.urgency === 'ROUTINE'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : 'bg-blue-100 text-blue-900 border-blue-300';
              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all space-y-2 bg-slate-50/50"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-medium text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </span>

                    <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${badgeStyle}`}>
                      {item.urgency}
                    </span>
                  </div>

                  <p className="text-sm font-extrabold text-slate-900">"{item.symptomSummary}"</p>

                  <div className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recommended: {item.facility}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>History is saved locally on your device for session privacy.</span>
        </div>
      </div>
    </div>
  );
}
