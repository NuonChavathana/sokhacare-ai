'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { HeartPulse, Bot, Sparkles, MapPin, History, Users, BarChart3 } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: '/', label: t('navHome'), icon: HeartPulse },
    { href: '/chat', label: t('navChat'), icon: Bot },
    { href: '/predict', label: t('navPredict'), icon: Sparkles },
    { href: '/family', label: t('navFamily'), icon: Users },
    { href: '/facilities', label: t('navFacilities'), icon: MapPin },
    { href: '/history', label: t('navHistory'), icon: History }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-teal-900/60 px-2 py-1.5 shadow-2xl shadow-black pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-1.5 px-2 rounded-2xl transition-all duration-150 motion-reduce:transition-none active:scale-95 min-w-[52px] ${
                isActive
                  ? 'bg-teal-500/20 text-emerald-300 font-black border border-teal-500/40 shadow-xs shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span className="text-[10px] leading-tight mt-1 font-bold tracking-tight text-center truncate max-w-[56px]">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
