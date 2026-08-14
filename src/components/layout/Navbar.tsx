'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useDataSaver } from '@/context/DataSaverContext';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import {
  Activity,
  MapPin,
  BarChart3,
  Sparkles,
  PhoneCall,
  Users,
  History,
  Presentation,
  ShieldCheck,
  Cpu,
  Building2,
  Compass,
  Zap,
  WifiOff
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { isDataSaver, toggleDataSaver, isOffline } = useDataSaver();

  const navLinks = [
    { href: '/', label: t('navHome'), icon: Activity },
    { href: '/triage', label: t('navTriage'), icon: Sparkles },
    { href: '/family', label: t('navFamily'), icon: Users },
    { href: '/facilities', label: t('navFacilities'), icon: MapPin },
    { href: '/history', label: t('navHistory'), icon: History },
    { href: '/dashboard', label: t('navDashboard'), icon: BarChart3 },
    { href: '/trust', label: 'Trust Center', icon: ShieldCheck },
    { href: '/evaluation', label: 'AI Bench', icon: Cpu },
    { href: '/demo', label: t('navDemoPitch'), icon: Presentation }
  ];

  return (
    <>
      <OnboardingModal />

      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-teal-100 shadow-2xs">
        {/* Top Emergency & Data Saver Bar */}
        <div className="bg-gradient-to-r from-teal-950 via-teal-900 to-emerald-950 text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-teal-100">{t('demoNotice')}</span>
              {isOffline && (
                <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline Demo
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Data Saver Toggle Button */}
              <button
                onClick={toggleDataSaver}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1 border transition-all ${
                  isDataSaver
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/10 hover:bg-white/20 text-teal-200 border-white/20'
                }`}
                title="Toggle Low-Bandwidth Data Saver Mode"
              >
                <Zap className="w-3 h-3" />
                <span>{isDataSaver ? 'Data Saver ON' : 'Data Saver'}</span>
              </button>

              <Link
                href="/demo"
                className="hidden sm:inline-flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200 transition-colors"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>3-5 Min Live Pitch Mode</span>
              </Link>
              <a
                href="tel:119"
                className="flex items-center gap-1 font-bold text-rose-300 hover:text-rose-200 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>119 / 115 {language === 'km' ? 'សង្គ្រោះបន្ទាន់' : 'Emergency'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-700 bg-clip-text text-transparent">
                  SokhaCare AI
                </span>
                <span className="block text-[10px] font-bold text-teal-600 leading-none">
                  {language === 'km' ? 'វេទិកា AI សុខាភិបាលកម្ពុជា' : 'Khmer Digital Health Platform'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 font-extrabold shadow-2xs'
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setLanguage('km')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'km' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ខ្មែរ
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'en' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Primary Action CTA */}
              <Link
                href="/triage"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white text-xs font-extrabold shadow-md shadow-teal-700/20 hover:scale-[1.02] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('startCheckup')}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
