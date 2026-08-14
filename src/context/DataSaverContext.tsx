'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DataSaverContextType {
  isDataSaver: boolean;
  toggleDataSaver: () => void;
  isOffline: boolean;
}

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

export function DataSaverProvider({ children }: { children: React.ReactNode }) {
  const [isDataSaver, setIsDataSaver] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('sokhacare_datasaver');
    if (saved === 'true') {
      setIsDataSaver(true);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const toggleDataSaver = () => {
    const next = !isDataSaver;
    setIsDataSaver(next);
    localStorage.setItem('sokhacare_datasaver', String(next));
  };

  return (
    <DataSaverContext.Provider value={{ isDataSaver, toggleDataSaver, isOffline }}>
      {children}
    </DataSaverContext.Provider>
  );
}

export function useDataSaver() {
  const context = useContext(DataSaverContext);
  if (!context) {
    throw new Error('useDataSaver must be used within DataSaverProvider');
  }
  return context;
}
