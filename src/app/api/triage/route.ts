import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai/ai-service';
import { getNearbyFacilities } from '@/lib/location/geo-utils';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import { logNewTriage } from '@/lib/db/mock-db';
import { Language } from '@/types/triage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language = 'km', userLat, userLng, forceDemo } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    const lang: Language = language === 'en' ? 'en' : 'km';
    const triageResult = await aiService.evaluateSymptoms(message, lang, forceDemo);

    // Calculate recommended facilities
    const facilities = getNearbyFacilities(
      CAMBODIA_FACILITIES,
      userLat,
      userLng,
      triageResult.recommended_facility_type,
      4
    );

    const topFacility = facilities[0]
      ? `${facilities[0].name_en} (${facilities[0].name_km})`
      : 'General Health Centre';

    // Log consultation
    logNewTriage(
      message.slice(0, 60),
      triageResult.urgency,
      topFacility,
      lang
    );

    return NextResponse.json({
      triage: triageResult,
      facilities
    });
  } catch (error: any) {
    console.error('Error in /api/triage:', error);
    return NextResponse.json(
      {
        error: 'Failed to process triage assessment',
        fallbackMessage:
          'មិនអាចភ្ជាប់ទៅ AI បានទេ។ សូមស្វែងរកការថែទាំពីមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យ ប្រសិនបើអ្នកមានការព្រួយបារម្ភអំពីរោគសញ្ញា។'
      },
      { status: 500 }
    );
  }
}
