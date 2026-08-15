'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useDataSaver } from '@/context/DataSaverContext';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { SokhaCareLogoIcon } from './SokhaCareLogoIcon';
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

      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-teal-900/60 shadow-xl text-white">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 text-xs py-1 px-4 font-black">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
              <span>SokhaCare AI • National Digital Health Startup Entry 2026</span>
              {isOffline && (
                <span className="bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <WifiOff className="w-3 h-3" /> Offline Demo
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDataSaver}
                className={`px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1 border transition-all ${
                  isDataSaver
                    ? 'bg-slate-950 text-amber-300 border-slate-950'
                    : 'bg-slate-950/20 text-slate-950 hover:bg-slate-950/30 border-slate-950/20'
                }`}
                title="Toggle Low-Bandwidth Data Saver Mode"
              >
                <Zap className="w-3 h-3" />
                <span>{isDataSaver ? 'Data Saver ON' : 'Data Saver'}</span>
              </button>

              <Link
                href="/demo"
                className="hidden sm:inline-flex items-center gap-1 font-black text-slate-950 hover:underline transition-all"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>3-5 Min Live Pitch Mode</span>
              </Link>
              <a
                href="tel:119"
                className="flex items-center gap-1 font-black text-slate-950 hover:underline transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>119 {language === 'km' ? 'សង្គ្រោះបន្ទាន់' : 'Emergency'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Custom Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <SokhaCareLogoIcon className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <div>
                <span className="text-xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                  SokhaCare AI
                </span>
                <span className="block text-[10px] font-bold text-teal-400 leading-none">
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
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-all ${
                      isActive
                        ? 'bg-teal-500/20 text-emerald-300 border border-teal-500/40 shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="flex bg-white/10 p-1 rounded-xl border border-white/15 text-xs font-extrabold">
                <button
                  onClick={() => setLanguage('km')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'km' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  ខ្មែរ
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    language === 'en' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Primary Action CTA */}
              <Link
                href="/triage"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white text-xs font-black shadow-lg shadow-teal-500/30 hover:scale-[1.02] transition-all border border-emerald-400/40"
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
