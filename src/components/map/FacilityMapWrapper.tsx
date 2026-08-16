'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HealthcareFacility } from '@/types/triage';

const DynamicGoogleFacilityMap = dynamic(() => import('./GoogleFacilityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-3">
      <span className="inline-block w-8 h-8 rounded-full border-3 border-teal-600 border-t-transparent animate-spin" />
      <span className="text-xs font-bold tracking-wide uppercase text-teal-700 dark:text-teal-400">
        Loading Google Maps & Healthcare Facilities...
      </span>
    </div>
  )
});

const DynamicLeafletFacilityMap = dynamic(() => import('./FacilityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-3">
      <span className="inline-block w-8 h-8 rounded-full border-3 border-teal-600 border-t-transparent animate-spin" />
      <span className="text-xs font-bold tracking-wide uppercase text-teal-700 dark:text-teal-400">
        Loading Leaflet Map...
      </span>
    </div>
  )
});

interface FacilityMapWrapperProps {
  facilities: HealthcareFacility[];
  userLat?: number;
  userLng?: number;
  selectedFacilityId?: string;
  onSelectFacility?: (facility: HealthcareFacility) => void;
}

export function FacilityMapWrapper(props: FacilityMapWrapperProps) {
  const provider = process.env.NEXT_PUBLIC_MAP_PROVIDER || 'google';

  if (provider === 'leaflet') {
    return <DynamicLeafletFacilityMap {...props} />;
  }

  return <DynamicGoogleFacilityMap {...props} />;
}
