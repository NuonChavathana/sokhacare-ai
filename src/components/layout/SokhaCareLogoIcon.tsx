'use client';

import React from 'react';

export function SokhaCareLogoIcon({ className = 'w-10 h-10' }: { className?: string }) {
  return (
    <div className={`relative rounded-xl overflow-hidden shadow-md flex items-center justify-center shrink-0 border border-teal-500/40 bg-slate-950 ${className}`}>
      <svg viewBox="0 0 512 512" className="w-full h-full p-0.5">
        <defs>
          <linearGradient id="bgGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#042f2e" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="crossGradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="pulseGradIcon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        <rect width="512" height="512" rx="120" fill="url(#bgGradIcon)" />

        {/* Medical Cross */}
        <path
          d="M 216 100 H 296 V 216 H 412 V 296 H 296 V 412 H 216 V 296 H 100 V 216 H 216 Z"
          fill="url(#crossGradIcon)"
          stroke="#34d399"
          strokeWidth="10"
          rx="24"
        />

        {/* AI Network Nodes */}
        <g fill="#a7f3d0">
          <circle cx="216" cy="150" r="12" />
          <circle cx="296" cy="150" r="12" />
          <circle cx="360" cy="216" r="12" />
          <circle cx="152" cy="216" r="12" />
          <line x1="216" y1="150" x2="296" y2="150" stroke="#6ee7b7" strokeWidth="6" />
          <line x1="296" y1="150" x2="360" y2="216" stroke="#6ee7b7" strokeWidth="6" />
          <line x1="152" y1="216" x2="216" y2="150" stroke="#6ee7b7" strokeWidth="6" />
        </g>

        {/* Red Pulse Heartbeat */}
        <path
          d="M 70 256 L 170 256 L 195 180 L 225 330 L 255 160 L 285 300 L 315 220 L 340 256 L 442 256"
          fill="none"
          stroke="url(#pulseGradIcon)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
