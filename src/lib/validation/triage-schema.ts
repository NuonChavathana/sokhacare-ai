import { TriageResult, UrgencyLevel, FacilityType } from '@/types/triage';

/**
 * Safety validation layer for AI Triage JSON outputs
 */
export function validateTriageResult(data: any): TriageResult | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const validUrgencies: UrgencyLevel[] = ['EMERGENCY', 'URGENT', 'ROUTINE', 'SELF_CARE'];
  const validFacilities: FacilityType[] = ['hospital', 'referral_hospital', 'health_centre', 'clinic'];

  const urgency: UrgencyLevel = validUrgencies.includes(data.urgency) ? data.urgency : 'ROUTINE';
  const confidence = typeof data.confidence === 'number' ? Math.min(0.98, Math.max(0.7, data.confidence)) : 0.85;

  const summary_km = typeof data.summary_km === 'string' && data.summary_km.trim() ? data.summary_km : 'រោគសញ្ញារបស់អ្នកត្រូវបានវាយតម្លៃបឋម។';
  const summary_en = typeof data.summary_en === 'string' && data.summary_en.trim() ? data.summary_en : 'Your symptoms have been preliminarily evaluated.';

  const red_flags = Array.isArray(data.red_flags) ? data.red_flags.filter((f: any) => typeof f === 'string') : [];
  const follow_up_needed = Boolean(data.follow_up_needed);

  const recommended_facility_type: FacilityType = validFacilities.includes(data.recommended_facility_type)
    ? data.recommended_facility_type
    : 'health_centre';

  const safety_message_km = typeof data.safety_message_km === 'string' && data.safety_message_km.trim()
    ? data.safety_message_km
    : 'សូមពិគ្រោះជាមួយគ្រូពេទ្យជំនាញ ប្រសិនបើរោគសញ្ញាមិនធូរស្រាល។';

  const safety_message_en = typeof data.safety_message_en === 'string' && data.safety_message_en.trim()
    ? data.safety_message_en
    : 'Please consult a qualified healthcare provider if symptoms persist.';

  return {
    urgency,
    confidence,
    summary_km,
    summary_en,
    red_flags,
    follow_up_needed,
    follow_up_questions_km: Array.isArray(data.follow_up_questions_km) ? data.follow_up_questions_km : [],
    follow_up_questions_en: Array.isArray(data.follow_up_questions_en) ? data.follow_up_questions_en : [],
    recommended_facility_type,
    safety_message_km,
    safety_message_en
  };
}
