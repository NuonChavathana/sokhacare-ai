'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Home, Sparkles, MapPin, History, Grid, Users } from 'lucide-react';

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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex justify-around items-center">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                isActive ? 'text-teal-700 font-extrabold scale-105' : 'text-slate-500 hover:text-teal-600 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
              <span className="text-[10px] leading-none whitespace-nowrap">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
