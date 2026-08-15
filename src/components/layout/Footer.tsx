'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { SokhaCareLogoIcon } from './SokhaCareLogoIcon';
import { ShieldAlert, Phone, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-teal-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Column 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SokhaCareLogoIcon className="w-10 h-10" />
              <span className="text-xl font-black text-white">SokhaCare AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">{t('appTagline')}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-teal-900 rounded-full text-xs text-teal-300 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              Kingdom of Cambodia Startup MVP
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              {language === 'km' ? 'តំណភ្ជាប់លឿន' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
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
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              {language === 'km' ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់' : 'Emergency Services'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-rose-400 font-bold">
                <Phone className="w-4 h-4" />
                <a href="tel:119" className="hover:underline">
                  119 (ទូរស័ព្ទសង្គ្រោះបន្ទាន់ / Ambulance)
                </a>
              </li>
              <li className="flex items-center gap-2 text-rose-300 font-semibold">
                <Phone className="w-4 h-4" />
                <a href="tel:115" className="hover:underline">
                  115 (ក្រសួងសុខាភិបាល / CDC Hotline)
                </a>
              </li>
              <li className="text-xs text-slate-400 pt-1 font-medium">
                {language === 'km'
                  ? 'មន្ទីរពេទ្យកាល់ម៉ែត៖ +855 23 426 948'
                  : 'Calmette Hospital: +855 23 426 948'}
              </li>
            </ul>
          </div>

          {/* Column 4: Safety Notice */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              {t('disclaimerTitle')}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">{t('disclaimerText')}</p>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 underline font-bold"
            >
              <span>{t('navPrivacy')}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4 font-semibold">
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
