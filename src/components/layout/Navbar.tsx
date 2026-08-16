'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { SokhaCareLogoIcon } from './SokhaCareLogoIcon';
import {
  HeartPulse,
  Sparkles,
  Bot,
  Users,
  MapPin,
  History,
  BarChart3,
  Info,
  Shield,
  PhoneCall,
  Menu,
  X,
  ChevronRight,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isKm = language === 'km';

  // Scroll detection for dynamic shadow/blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Main navigation links
  const navLinks = [
    { href: '/', label: t('navHome'), icon: HeartPulse },
    { href: '/chat', label: t('navChat'), icon: Bot },
    { href: '/predict', label: t('navPredict'), icon: Sparkles },
    { href: '/family', label: t('navFamily'), icon: Users },
    { href: '/facilities', label: t('navFacilities'), icon: MapPin },
    { href: '/history', label: t('navHistory'), icon: History },
    { href: '/dashboard', label: t('navDashboard'), icon: BarChart3 },
    { href: '/about', label: t('navAbout'), icon: Info },
    { href: '/privacy', label: t('navPrivacy'), icon: Shield }
  ];

  return (
    <>
      <OnboardingModal />

      <header
        className={`sticky top-0 z-50 transition-all duration-200 motion-reduce:transition-none ${
          isScrolled
            ? 'bg-slate-950/90 backdrop-blur-xl border-b border-teal-900/60 shadow-xl shadow-black/30 py-2.5'
            : 'bg-slate-950/70 backdrop-blur-md border-b border-teal-900/30 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-teal-400 rounded-xl"
              aria-label="SokhaCare AI Home"
            >
              <div className="relative">
                <SokhaCareLogoIcon className="w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute -inset-1 rounded-full bg-teal-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                  SokhaCare AI
                </span>
                <span className="block text-[10px] font-bold text-teal-400/90 leading-none tracking-wide">
                  {isKm ? 'វេទិកា AI សុខាភិបាលកម្ពុជា' : 'Khmer Digital Health Platform'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-teal-900/40 backdrop-blur-md"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-150 motion-reduce:transition-none ${
                      isActive
                        ? 'bg-teal-500/20 text-emerald-300 border border-teal-500/40 shadow-xs shadow-teal-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 transition-colors ${
                        isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* 119 Emergency Hotline Button (Desktop & Tablet) */}
              <a
                href="tel:119"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 text-xs font-black transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400"
                title="Emergency Ambulance Hotline"
                aria-label="Call 119 Emergency Hotline"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>119 {isKm ? 'សង្គ្រោះបន្ទាន់' : 'Emergency'}</span>
              </a>

              {/* Language Switcher Toggle */}
              <div
                className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-teal-900/60 text-xs font-extrabold shadow-inner"
                role="group"
                aria-label="Language selection"
              >
                <button
                  type="button"
                  onClick={() => setLanguage('km')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-150 motion-reduce:transition-none ${
                    language === 'km'
                      ? 'bg-teal-600 text-white font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-pressed={language === 'km'}
                >
                  ខ្មែរ
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all duration-150 motion-reduce:transition-none ${
                    language === 'en'
                      ? 'bg-teal-600 text-white font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-pressed={language === 'en'}
                >
                  EN
                </button>
              </div>

              {/* Theme Switcher Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-teal-900/60 text-slate-300 hover:text-white transition-all shadow-inner focus-visible:ring-2 focus-visible:ring-teal-400 cursor-pointer"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={
                  theme === 'dark'
                    ? isKm
                      ? 'ប្តូរទៅ Light Mode'
                      : 'Switch to Light Mode'
                    : isKm
                    ? 'ប្តូរទៅ Dark Mode'
                    : 'Switch to Dark Mode'
                }
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-teal-300 transition-transform duration-300 hover:-rotate-12" />
                )}
              </button>

              {/* Primary Predict CTA Button (Desktop) */}
              <Link
                href="/predict"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-black shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95 transition-all border border-emerald-400/40 focus-visible:ring-2 focus-visible:ring-teal-300"
              >
                <Sparkles className="w-4 h-4 text-emerald-100" />
                <span>{t('startCheckup')}</span>
              </Link>

              {/* Mobile Hamburger Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl bg-slate-900 border border-teal-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-teal-400"
                aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-teal-300" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-down Menu Content */}
          <div className="fixed top-16 left-0 right-0 max-h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950 border-b border-teal-900/80 p-6 shadow-2xl space-y-6 animate-fadeIn">
            {/* Navigation Links Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-teal-400/80 uppercase tracking-wider block px-2">
                {isKm ? 'ម៉ឺនុយរុករក' : 'Navigation Menu'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-sm font-extrabold transition-all ${
                        isActive
                          ? 'bg-teal-500/20 text-emerald-300 border border-teal-500/40 shadow-xs'
                          : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isActive ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Actions: Theme Toggle, Predict CTA & 119 Call */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">
                  {isKm ? 'ផ្ទាំងរចនាបថ (Theme)' : 'Display Theme'}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white shadow-xs"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dark</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-teal-300" />
                      <span>Light</span>
                    </>
                  )}
                </button>
              </div>

              <Link
                href="/predict"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-black text-sm shadow-xl shadow-teal-500/30 transition-all border border-emerald-400/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('startCheckup')}</span>
              </Link>

              <a
                href="tel:119"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-extrabold text-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>119 {isKm ? 'ហៅសង្គ្រោះបន្ទាន់' : 'Call 119 Ambulance'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
