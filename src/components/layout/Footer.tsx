'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SokhaCareLogoIcon } from './SokhaCareLogoIcon';
import { ShieldAlert, Phone, Heart, ExternalLink, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { language, t } = useLanguage();
  const isKm = language === 'km';

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 pt-12 pb-8 border-t border-slate-200 dark:border-teal-900/60 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-flex">
              <SokhaCareLogoIcon className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="text-xl font-black text-slate-900 dark:text-white">SokhaCare AI</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {t('appTagline')}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-teal-900 rounded-full text-xs text-teal-800 dark:text-teal-300 font-mono font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Kingdom of Cambodia • Digital Health Platform
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {isKm ? 'តំណភ្ជាប់លឿន' : 'Quick Navigation'}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navHome')}
              </Link>
              <Link href="/chat" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navChat')}
              </Link>
              <Link href="/predict" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navPredict')}
              </Link>
              <Link href="/family" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navFamily')}
              </Link>
              <Link href="/facilities" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navFacilities')}
              </Link>
              <Link href="/history" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navHistory')}
              </Link>
              <Link href="/dashboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navDashboard')}
              </Link>
              <Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                {t('navAbout')}
              </Link>
            </div>
          </div>

          {/* Column 3: Emergency Contacts in Cambodia */}
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              {isKm ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់' : 'Emergency Services'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:119" className="hover:underline">
                  119 (ទូរស័ព្ទសង្គ្រោះបន្ទាន់ / Ambulance)
                </a>
              </li>
              <li className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-semibold">
                <Phone className="w-4 h-4 shrink-0" />
                <a href="tel:115" className="hover:underline">
                  115 (ក្រសួងសុខាភិបាល / CDC Hotline)
                </a>
              </li>
              <li className="text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
                {isKm
                  ? 'មន្ទីរពេទ្យកាល់ម៉ែត៖ +855 23 426 948'
                  : 'Calmette Hospital: +855 23 426 948'}
              </li>
            </ul>
          </div>

          {/* Column 4: Safety Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {t('disclaimerTitle')}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {t('disclaimerText')}
            </p>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-bold"
            >
              <span>{t('navPrivacy')}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 dark:text-slate-400 gap-4 font-semibold">
          <p>
            © 2026 SokhaCare AI. {isKm ? 'រក្សាសិទ្ធិគ្រប់យ៉ាង' : 'All rights reserved.'}
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Cambodian Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
}
