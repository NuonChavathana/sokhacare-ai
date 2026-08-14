'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Activity, ShieldAlert, Phone, Heart, MapPin, ExternalLink } from 'lucide-react';

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-extrabold text-white">SokhaCare AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{t('appTagline')}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-teal-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              Kingdom of Cambodia MVP
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'km' ? 'តំណភ្ជាប់លឿន' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link href="/triage" className="hover:text-teal-400 transition-colors">
                  {t('navTriage')}
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-teal-400 transition-colors">
                  {t('navFacilities')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                  {t('navDashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency Contacts in Cambodia */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'km' ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់' : 'Emergency Services'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2 text-rose-400 font-bold">
                <Phone className="w-4 h-4" />
                <a href="tel:119" className="hover:underline">
                  119 (ទូរស័ព្ទសង្គ្រោះបន្ទាន់ / Ambulance)
                </a>
              </li>
              <li className="flex items-center gap-2 text-rose-300">
                <Phone className="w-4 h-4" />
                <a href="tel:115" className="hover:underline">
                  115 (ក្រសួងសុខាភិបាល / CDC Hotline)
                </a>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                {language === 'km'
                  ? 'មន្ទីរពេទ្យកាល់ម៉ែត៖ +855 23 426 948'
                  : 'Calmette Hospital: +855 23 426 948'}
              </li>
            </ul>
          </div>

          {/* Column 4: Safety Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              {t('disclaimerTitle')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">{t('disclaimerText')}</p>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 underline font-medium"
            >
              <span>{t('navPrivacy')}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            © 2026 SokhaCare AI. {language === 'km' ? 'រក្សាសិទ្ធិគ្រប់យ៉ាង' : 'All rights reserved.'} — Hackathon & Innovation Demo MVP
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Cambodian Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
