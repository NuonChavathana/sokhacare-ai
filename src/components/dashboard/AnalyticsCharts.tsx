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
import {
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  HeartPulse,
  Users,
  ArrowUpRight,
  ShieldAlert,
  User,
  Stethoscope,
  Sparkles
} from 'lucide-react';

interface AnalyticsChartsProps {
  stats: DashboardStats;
}

export function AnalyticsCharts({ stats }: AnalyticsChartsProps) {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  // Mode Distribution Data
  const modeData = [
    { name: isKm ? 'អ្នកជំងឺនៅផ្ទះ (Heart Patient)' : 'Heart Patient Mode', value: 654, color: '#0d9488' },
    { name: isKm ? 'វេជ្ជបណ្ឌិត (Heart Doctor)' : 'Heart Doctor Mode', value: 382, color: '#3b82f6' },
    { name: isKm ? 'រោគសញ្ញាទូទៅ (General Disease)' : 'General Disease Mode', value: 326, color: '#8b5cf6' }
  ];

  // Heart Disease Risk Breakdown
  const heartRiskData = [
    { name: isKm ? 'ហានិភ័យខ្ពស់ (High Risk)' : 'High Risk', value: stats.emergencyCount, color: '#e11d48' },
    { name: isKm ? 'ហានិភ័យមធ្យម (Moderate Risk)' : 'Moderate Risk', value: stats.urgentCount, color: '#f59e0b' },
    { name: isKm ? 'ហានិភ័យទាប (Low Risk)' : 'Low Risk', value: stats.routineCount, color: '#10b981' }
  ];

  // General Disease Urgency Breakdown
  const generalUrgencyData = [
    { name: isKm ? 'សង្គ្រោះបន្ទាន់ (Emergency)' : 'Emergency', count: 48, fill: '#e11d48' },
    { name: isKm ? 'ពិនិត្យឆាប់ៗ (Urgent Care)' : 'Urgent Care', count: 112, fill: '#f59e0b' },
    { name: isKm ? 'ជួបគ្រូពេទ្យ (See Doctor)' : 'See Doctor', count: 184, fill: '#eab308' },
    { name: isKm ? 'ថែទាំនៅផ្ទះ (Self-Care)' : 'Self-Care', count: 96, fill: '#10b981' }
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Predictions */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
            <span>{t('totalConsultations')}</span>
            <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalConsultations.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +32% this month
          </div>
        </div>

        {/* High Risk Referrals */}
        <div className="bg-rose-50 dark:bg-rose-950/40 p-5 rounded-2xl border border-rose-200 dark:border-rose-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-800 dark:text-rose-300 text-xs font-bold uppercase">
            <span>Emergency Referrals</span>
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-900 dark:text-rose-200">{stats.emergencyCount}</div>
          <div className="text-xs text-rose-700 dark:text-rose-400 font-medium">119 / Hospital Dispatches</div>
        </div>

        {/* Heart Disease High Risk Rate */}
        <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-bold uppercase">
            <span>Heart High Risk %</span>
            <HeartPulse className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-900 dark:text-amber-200">{stats.emergencyPercentage}%</div>
          <div className="text-xs text-amber-700 dark:text-amber-400 font-medium">Of heart evaluations</div>
        </div>

        {/* General Disease Triage Volume */}
        <div className="bg-purple-50 dark:bg-purple-950/40 p-5 rounded-2xl border border-purple-200 dark:border-purple-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-purple-800 dark:text-purple-300 text-xs font-bold uppercase">
            <span>General Triage</span>
            <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-900 dark:text-purple-200">440</div>
          <div className="text-xs text-purple-700 dark:text-purple-400 font-medium">Dengue, Flu, Gastro, etc.</div>
        </div>

        {/* Routine & Self-Care */}
        <div className="bg-teal-50 dark:bg-teal-950/40 p-5 rounded-2xl border border-teal-200 dark:border-teal-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-teal-800 dark:text-teal-300 text-xs font-bold uppercase">
            <span>Low Risk / Self-Care</span>
            <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-teal-900 dark:text-teal-200">{stats.routinePercentage}%</div>
          <div className="text-xs text-teal-700 dark:text-teal-400 font-medium">Preventative guidance</div>
        </div>
      </div>

      {/* Visual Charts Grid 1: Predictions by Mode & Heart Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Predictions by Mode Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isKm ? 'ការទស្សន៍ទាយតាមទម្រង់នីមួយៗ (Predictions by Mode)' : 'Evaluations by Mode'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribution across Patient, Doctor, and General Disease modes</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heart Disease Risk Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {isKm ? 'ការបែងចែកហានិភ័យបេះដូង (Heart Risk Distribution)' : 'Heart Disease Risk Distribution'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">16-feature Logistic Regression model classifications</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={heartRiskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {heartRiskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid 2: General Disease Urgency Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            {isKm ? 'កម្រិតបន្ទាន់នៃជំងឺទូទៅ (General Disease Urgency Breakdown)' : 'General Disease Triage Urgency Distribution'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Evaluated conditions (Dengue, Malaria, Typhoid, Gastroenteritis, Pneumonia, etc.)</p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={generalUrgencyData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {generalUrgencyData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Prediction Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">{t('recentTriageLogs')}</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Clinical Profile / Summary</th>
                <th className="py-3 px-4">Risk / Urgency</th>
                <th className="py-3 px-4">Recommended Facility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {stats.recentLogs.map((log, idx) => {
                const badgeColor =
                  log.urgency === 'EMERGENCY'
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                    : log.urgency === 'URGENT'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : log.urgency === 'ROUTINE'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';

                const modeTag =
                  idx % 3 === 0
                    ? { name: 'Heart Patient', style: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800' }
                    : idx % 3 === 1
                    ? { name: 'General Disease', style: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
                    : { name: 'Heart Doctor', style: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' };

                return (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${modeTag.style}`}>
                        {modeTag.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.symptomSummary}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badgeColor}`}>
                        {log.urgency}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400">{log.facilityRecommended}</td>
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
