import { NextRequest, NextResponse } from 'next/server';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const province = searchParams.get('province');
  const type = searchParams.get('type');
  const query = searchParams.get('q')?.toLowerCase();

  let facilities = [...CAMBODIA_FACILITIES];

  if (province && province !== 'All') {
    facilities = facilities.filter((f) => f.province.toLowerCase() === province.toLowerCase());
  }

  if (type && type !== 'all') {
    facilities = facilities.filter((f) => f.type === type);
  }

  if (query) {
    facilities = facilities.filter(
      (f) =>
        f.name_km.toLowerCase().includes(query) ||
        f.name_en.toLowerCase().includes(query) ||
        f.address_km.toLowerCase().includes(query) ||
        f.address_en.toLowerCase().includes(query) ||
        f.district.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({ facilities });
}
