import { NextRequest, NextResponse } from 'next/server';
import { evaluateGeneralDiseases } from '@/lib/generalDisease/scoringEngine';
import { getNearbyFacilities } from '@/lib/location/geo-utils';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import { GENERAL_SYMPTOMS_CATALOG } from '@/lib/data/generalDiseases';
import { GeneralDiseaseInput } from '@/types/generalDisease';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      age,
      gender = 'other',
      symptoms = [],
      duration = '1-3 days',
      severity = 'moderate',
      temperature = null,
      language = 'km',
      freeTextDescription = '',
      userLat,
      userLng
    } = body;

    // Validate inputs
    const parsedAge = typeof age === 'number' && !isNaN(age) ? Math.max(1, Math.min(120, age)) : 30;
    const validatedGender: 'male' | 'female' | 'other' =
      gender === 'male' || gender === 'female' ? gender : 'other';

    let resolvedSymptoms: string[] = Array.isArray(symptoms) ? [...symptoms] : [];

    // If symptoms are empty, attempt to infer from freeTextDescription
    if (resolvedSymptoms.length === 0 && typeof freeTextDescription === 'string' && freeTextDescription.trim()) {
      const lower = freeTextDescription.toLowerCase();
      GENERAL_SYMPTOMS_CATALOG.forEach((s) => {
        const matchEn = lower.includes(s.nameEn.toLowerCase()) || lower.includes(s.id.replace(/_/g, ' '));
        const matchKm = lower.includes(s.nameKm);
        if ((matchEn || matchKm) && !resolvedSymptoms.includes(s.id)) {
          resolvedSymptoms.push(s.id);
        }
      });
    }

    const parsedTemp = typeof temperature === 'number' && !isNaN(temperature) ? temperature : null;

    // If still empty but fever temperature is recorded, automatically add fever
    if (resolvedSymptoms.length === 0 && parsedTemp && parsedTemp >= 37.5) {
      resolvedSymptoms.push(parsedTemp >= 39.0 ? 'high_fever_spiking' : 'fever');
    }

    if (resolvedSymptoms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            language === 'km'
              ? 'សូមជ្រើសរើសរោគសញ្ញាយ៉ាងហោចណាស់មួយពីបញ្ជីរោគសញ្ញា'
              : 'At least one symptom must be selected for general disease assessment'
        },
        { status: 400 }
      );
    }

    const inputData: GeneralDiseaseInput = {
      age: parsedAge,
      gender: validatedGender,
      symptoms: resolvedSymptoms,
      duration,
      severity,
      temperature: parsedTemp,
      language: language === 'en' ? 'en' : 'km',
      freeTextDescription
    };

    const assessment = evaluateGeneralDiseases(inputData);

    // If urgent or emergency, include nearest facilities
    let facilities: any[] = [];
    if (assessment.overallUrgency === 'emergency' || assessment.overallUrgency === 'urgent') {
      const facilityType = assessment.overallUrgency === 'emergency' ? 'hospital' : 'referral_hospital';
      facilities = getNearbyFacilities(CAMBODIA_FACILITIES, userLat, userLng, facilityType, 3);
    }

    return NextResponse.json({
      success: true,
      result: {
        ...assessment,
        disclaimer: language === 'km' ? assessment.disclaimerKm : assessment.disclaimerEn,
        facilities
      }
    });
  } catch (error: any) {
    console.error('Error in /api/general-disease:', error);
    return NextResponse.json(
      {
        error: 'Failed to process general disease assessment',
        message: error.message || 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
