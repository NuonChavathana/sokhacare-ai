'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardStats } from '@/types/triage';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { BarChart3, Activity, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/stats');
      const data = await res.json();
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-teal-200 mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>Health Analytics & Insights</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{t('dashboardTitle')}</h1>
          <p className="text-sm text-teal-100/90 font-medium mt-1">{t('dashboardSubtitle')}</p>
        </div>

        <button
          onClick={fetchStats}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading || !stats ? (
        <div className="p-12 text-center text-slate-400 font-semibold">
          <span className="inline-block w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mr-2" />
          Loading analytics metrics...
        </div>
      ) : (
        <AnalyticsCharts stats={stats} />
      )}
    </div>
  );
}
