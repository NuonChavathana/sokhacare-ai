'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Volume2, Square, VolumeX, AlertCircle } from 'lucide-react';

interface TextToSpeechButtonProps {
  text: string;
  language?: 'en' | 'km';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

export function TextToSpeechButton({
  text,
  language,
  className = '',
  size = 'md',
  variant = 'secondary'
}: TextToSpeechButtonProps) {
  const { language: contextLang, t } = useLanguage();
  const activeLang = language || ((contextLang as 'en' | 'km') || 'km');
  const isKm = activeLang === 'km';

  const [isSupported, setIsSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      // Cancel speech when unmounting
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, []);

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsSpeaking(false);
  };

  const startSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
      return;
    }

    try {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isKm ? 'km-KH' : 'en-US';
      utterance.rate = 0.95; // Slightly slower for clarity in medical summaries
      utterance.pitch = 1.0;

      // Try selecting preferred voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = isKm ? 'km' : 'en';
        const matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        // e.error === 'canceled' is common when stopped by user
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Speech synthesis error:', e.error);
        }
        setIsSpeaking(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to start speech synthesis:', err);
      setIsSpeaking(false);
    }
  };

  const handleToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  if (!isSupported) {
    return null; // Gracefully hidden if Web Speech API is not supported
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2.5 py-1.5 rounded-xl text-xs gap-1.5'
      : size === 'lg'
      ? 'px-5 py-3 rounded-2xl text-sm gap-2.5'
      : 'px-4 py-2 rounded-xl text-xs gap-2';

  const variantClasses =
    variant === 'primary'
      ? isSpeaking
        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20'
        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20'
      : variant === 'outline'
      ? isSpeaking
        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25'
        : 'bg-transparent text-slate-300 border border-slate-700 hover:border-teal-500 hover:text-white'
      : isSpeaking
      ? 'bg-rose-900/60 text-rose-200 border border-rose-600/50 hover:bg-rose-900/80'
      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700';

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          isSpeaking
            ? isKm
              ? 'បញ្ឈប់ការអានលទ្ធផល'
              : 'Stop reading result'
            : isKm
            ? 'ស្តាប់ការអានសង្ខេបលទ្ធផល'
            : 'Listen to spoken result summary'
        }
        title={
          isSpeaking
            ? isKm
              ? 'ចុចដើម្បីបញ្ឈប់ការអាន'
              : 'Click to stop reading'
            : isKm
            ? 'ចុចដើម្បីស្តាប់ការអានជាសំឡេង'
            : 'Click to listen to spoken summary'
        }
        className={`inline-flex items-center justify-center font-bold transition-all active:scale-95 ${sizeClasses} ${variantClasses} ${className}`}
      >
        {isSpeaking ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <Square className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>{isKm ? 'បញ្ឈប់ការអាន' : 'Stop reading'}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>{isKm ? 'ស្តាប់លទ្ធផល' : 'Listen to result'}</span>
          </>
        )}
      </button>

      {/* Screen reader live announcement */}
      <span className="sr-only" role="status" aria-live="polite">
        {isSpeaking
          ? isKm
            ? 'កំពុងអានសង្ខេបលទ្ធផល'
            : 'Reading result summary aloud'
          : isKm
          ? 'បានបញ្ឈប់ការអាន'
          : 'Stopped reading'}
      </span>
    </div>
  );
}
