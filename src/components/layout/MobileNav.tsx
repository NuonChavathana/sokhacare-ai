'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Home, Sparkles, MapPin, History, Users } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: '/', label: t('navHome'), icon: Home },
    { href: '/triage', label: t('navTriage'), icon: Sparkles },
    { href: '/family', label: t('navFamily'), icon: Users },
    { href: '/facilities', label: t('navFacilities'), icon: MapPin },
    { href: '/history', label: t('navHistory'), icon: History }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-1 py-1.5 shadow-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all active:scale-95 ${
                isActive
                  ? 'bg-teal-50 text-teal-800 font-extrabold shadow-2xs'
                  : 'text-slate-500 hover:text-teal-700 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[10px] leading-tight mt-0.5 font-bold tracking-tight">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
