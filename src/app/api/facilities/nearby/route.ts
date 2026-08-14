import { NextRequest, NextResponse } from 'next/server';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import { getNearbyFacilities } from '@/lib/location/geo-utils';
import { FacilityType } from '@/types/triage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const preferredType = (searchParams.get('type') as FacilityType) || undefined;

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Valid lat and lng query parameters required' }, { status: 400 });
  }

  const facilities = getNearbyFacilities(CAMBODIA_FACILITIES, lat, lng, preferredType, 10);
  return NextResponse.json({ facilities });
}
