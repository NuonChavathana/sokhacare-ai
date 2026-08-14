'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { HealthcareFacility } from '@/types/triage';

const DynamicFacilityMap = dynamic(() => import('./FacilityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-semibold text-sm">
      <span className="inline-block w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mr-2" />
      Loading Map & Healthcare Markers...
    </div>
  )
});

interface FacilityMapWrapperProps {
  facilities: HealthcareFacility[];
  userLat?: number;
  userLng?: number;
  selectedFacilityId?: string;
}

export function FacilityMapWrapper(props: FacilityMapWrapperProps) {
  return <DynamicFacilityMap {...props} />;
}
