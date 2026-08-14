'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import { Calendar, Clock, Hospital, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AppointmentsPage() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  const [facilityId, setFacilityId] = useState(CAMBODIA_FACILITIES[0].id);
  const [service, setService] = useState('General Consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white rounded-3xl p-8 shadow-xl space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-300/40 rounded-full text-xs font-bold text-amber-200">
          <Calendar className="w-4 h-4 text-amber-300" />
          <span>Demo Appointment Request Feature</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t('appointmentsTitle')}</h1>
        <p className="text-sm text-teal-100/90 font-medium">{t('appointmentSubtitle')}</p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-emerald-950">
            {isKm ? 'សំណើការណាត់ជួបត្រូវបានផ្ញើ (Demo Data)' : 'Demo Appointment Request Submitted'}
          </h3>
          <p className="text-sm text-emerald-900 max-w-md mx-auto leading-relaxed">
            {isKm
              ? 'នេះជាការសាកល្បង Demo មុខងារណាត់ជួប។ មិនមានការកក់ពិតប្រាកដជាមួយមន្ទីរពេទ្យឡើយ។'
              : 'This is a feature prototype demo. No actual hospital appointment has been booked.'}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md"
          >
            {isKm ? 'បង្កើតការណាត់ថ្មី' : 'Create New Request'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Facility Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {isKm ? 'ជ្រើសរើសមន្ទីរពេទ្យ / មណ្ឌលសុខភាព' : 'Select Healthcare Facility'}:
            </label>
            <select
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-teal-500"
            >
              {CAMBODIA_FACILITIES.map((f) => (
                <option key={f.id} value={f.id}>
                  {isKm ? f.name_km : f.name_en} ({f.province})
                </option>
              ))}
            </select>
          </div>

          {/* Service Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              {isKm ? 'ប្រភេទសេវា' : 'Select Service'}:
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-teal-500"
            >
              <option value="General Consultation">General Consultation (ពិនិត្យជំងឺទូទៅ)</option>
              <option value="Pediatrics">Pediatric Checkup (ពិនិត្យជំងឺកុមារ)</option>
              <option value="Maternal Care">Maternal & Child Health (ថែទាំមាតា និងទារក)</option>
              <option value="Vaccination">Vaccination (ចាក់វ៉ាក់សាំង)</option>
            </select>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {isKm ? 'កាលបរិច្ឆេទ' : 'Preferred Date'}:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                {isKm ? 'ម៉ោង' : 'Preferred Time'}:
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:border-teal-500"
              >
                <option value="08:00">08:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:30">03:30 PM</option>
              </select>
            </div>
          </div>

          {/* Disclaimer badge */}
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {isKm
                ? 'នេះជាមុខងារ Demo សម្រាប់សាកល្បងប៉ុណ្ណោះ'
                : 'This is a prototype feature for demonstration purposes.'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 text-white font-extrabold text-sm shadow-md transition-all"
          >
            {t('submitAppointment')}
          </button>
        </form>
      )}
    </div>
  );
}
