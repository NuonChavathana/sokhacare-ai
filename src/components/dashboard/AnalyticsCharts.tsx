'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { DashboardStats } from '@/types/triage';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { Activity, AlertTriangle, Clock, CheckCircle2, Info, Users, ArrowUpRight } from 'lucide-react';

interface AnalyticsChartsProps {
  stats: DashboardStats;
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const urgencyPieData = [
    { name: isKm ? 'ស្ថានភាពបន្ទាន់ (Emergency)' : 'Emergency', value: stats.emergencyCount, color: '#e11d48' },
    { name: isKm ? 'គួរទៅពិនិត្យឆាប់ៗ (Urgent)' : 'Urgent', value: stats.urgentCount, color: '#f59e0b' },
    { name: isKm ? 'ពិនិត្យតាមធម្មតា (Routine)' : 'Routine', value: stats.routineCount, color: '#0d9488' },
    { name: isKm ? 'ថែទាំខ្លួន (Self-Care)' : 'Self-Care', value: stats.selfCareCount, color: '#2563eb' }
  ];

  const symptomBarData = stats.commonSymptoms.map((s) => ({
    symptom: s.symptom.split(' ')[0],
    count: s.count
  }));

  const facilityBarData = stats.facilityTypeRequests.map((f) => ({
    name: isKm ? f.label_km.split(' ')[0] : f.label_en,
    requests: f.count
  }));

  return (
    <div className="space-y-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Consultations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>{t('totalConsultations')}</span>
            <Users className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.totalConsultations.toLocaleString()}</div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18% this month
          </div>
        </div>

        {/* Emergency */}
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold uppercase">
            <span>{t('emergencyRate')}</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-900">{stats.emergencyPercentage}%</div>
          <div className="text-xs text-rose-700 font-medium">{stats.emergencyCount} cases routed immediately</div>
        </div>

        {/* Urgent */}
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase">
            <span>{t('urgentRate')}</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900">{stats.urgentPercentage}%</div>
          <div className="text-xs text-amber-700 font-medium">{stats.urgentCount} cases evaluated</div>
        </div>

        {/* Routine */}
        <div className="bg-teal-50 p-5 rounded-2xl border border-teal-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-teal-800 text-xs font-bold uppercase">
            <span>{t('routineRate')}</span>
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-teal-900">{stats.routinePercentage}%</div>
          <div className="text-xs text-teal-700 font-medium">{stats.routineCount} routine visits</div>
        </div>

        {/* Self-Care */}
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold uppercase">
            <span>{t('selfCareRate')}</span>
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-900">{stats.selfCarePercentage}%</div>
          <div className="text-xs text-blue-700 font-medium">{stats.selfCareCount} monitored at home</div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgency Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 mb-1">
            {isKm ? 'ការបែងចែកកម្រិតបន្ទាន់ (Triage Urgency Breakdown)' : 'Triage Urgency Distribution'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">Percentage breakdown across all symptom consultations</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urgencyPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {urgencyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Common Symptoms Frequency */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 mb-1">
            {isKm ? 'រោគសញ្ញាញឹកញាប់បំផុត (Most Common Symptoms)' : 'Most Common Symptoms Reported'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">Top symptom categories submitted by Cambodian users</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomBarData}>
                <XAxis dataKey="symptom" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#0d9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-extrabold text-slate-900 mb-4">{t('recentTriageLogs')}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Symptom Summary</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Recommended Facility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stats.recentLogs.map((log) => {
                const badgeColor =
                  log.urgency === 'EMERGENCY'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : log.urgency === 'URGENT'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : log.urgency === 'ROUTINE'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border-blue-300';
                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{log.symptomSummary}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        {log.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">{log.facilityRecommended}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
