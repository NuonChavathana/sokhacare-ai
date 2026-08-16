'use client';

import React from 'react';
import Image from 'next/image';

export function SokhaCareLogoIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center shrink-0 border border-teal-500/20 bg-white dark:bg-slate-900 ${className}`}
    >
      <Image
        src="/sokhacare.jpg"
        alt="SokhaCare AI Logo"
        fill
        sizes="48px"
        className="object-cover"
        priority
      />
    </div>
  );
}
