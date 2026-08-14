'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CAMBODIA_FACILITIES, FACILITY_TYPE_LABELS } from '@/lib/data/facilities';
import { HealthcareFacility } from '@/types/triage';
import { Building2, Plus, Edit2, ShieldAlert, CheckCircle2, MapPin } from 'lucide-react';

export default function AdminFacilitiesPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';
  const [facilities, setFacilities] = useState<HealthcareFacility[]>(CAMBODIA_FACILITIES);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-xs font-extrabold text-amber-300">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>Demo Admin Mode</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isKm ? 'គ្រប់គ្រងទិន្នន័យមណ្ឌលសុខភាព (Admin Portal)' : 'Facility Directory Administration'}
          </h1>
          <p className="text-xs text-slate-300">Manage healthcare facilities, emergency status, and services.</p>
        </div>

        <button
          onClick={() => alert('Demo Admin Action: Add Facility Modal')}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Facility</span>
        </button>
      </div>

      {/* Admin Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Facility Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Province</th>
                <th className="py-3 px-4">Emergency 24/7</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-xs">
              {facilities.map((fac) => (
                <tr key={fac.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{isKm ? fac.name_km : fac.name_en}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-md">
                      {FACILITY_TYPE_LABELS[fac.type]?.[isKm ? 'km' : 'en']}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-bold">{fac.province}</td>
                  <td className="py-3.5 px-4">
                    {fac.emergency_available ? (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                        Yes (24/7)
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">Standard Hours</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => alert(`Edit ${fac.name_en}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
