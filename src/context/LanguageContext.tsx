'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types/triage';
import { TRANSLATIONS } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.km) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('km');

  useEffect(() => {
    const savedLang = localStorage.getItem('sokhacare_lang') as Language;
    if (savedLang === 'km' || savedLang === 'en') {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sokhacare_lang', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.km): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS.km[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
