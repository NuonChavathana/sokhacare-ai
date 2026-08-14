import { HealthcareFacility, UrgencyLevel, FacilityType } from '@/types/triage';

export interface ScoredFacility extends HealthcareFacility {
  score: number;
  matchReasons: { km: string; en: string }[];
}

/**
 * Smart Health Navigation Engine: Facility Scoring Algorithm
 * Facility Score = Distance Score (0-40) + Urgency Compatibility (0-30) + Service Compatibility (0-15) + Opening Status (0-10) + Emergency Capability (0-5)
 */
export function scoreFacilities(
  facilities: HealthcareFacility[],
  urgency: UrgencyLevel,
  preferredType?: FacilityType
): ScoredFacility[] {
  return facilities.map((facility) => {
    let score = 0;
    const matchReasons: { km: string; en: string }[] = [];

    // 1. Distance Score (max 40 pts)
    const dist = facility.distance_km ?? 5.0;
    if (dist <= 2) {
      score += 40;
      matchReasons.push({ km: '✓ នៅជិតលោកអ្នក (ក្រោម ២ គ.ម)', en: '✓ Nearby (< 2 km)' });
    } else if (dist <= 5) {
      score += 30;
      matchReasons.push({ km: '✓ នៅជិតសមរម្យ (ក្រោម ៥ គ.ម)', en: '✓ Reasonably nearby (< 5 km)' });
    } else if (dist <= 15) {
      score += 15;
    } else {
      score += 5;
    }

    // 2. Urgency Compatibility (max 30 pts)
    if (urgency === 'EMERGENCY') {
      if (facility.type === 'hospital') {
        score += 30;
        matchReasons.push({ km: '✓ ប្រភេទមន្ទីរពេទ្យធំសមស្របសម្រាប់ករណីបន្ទាន់', en: '✓ Suitable major hospital for emergency' });
      } else if (facility.type === 'referral_hospital') {
        score += 25;
        matchReasons.push({ km: '✓ មន្ទីរពេទ្យបង្អែកមានសមត្ថភាពសង្គ្រោះ', en: '✓ Referral hospital capable of emergency care' });
      } else {
        score += 5;
      }
    } else if (urgency === 'URGENT') {
      if (facility.type === 'referral_hospital' || facility.type === 'hospital') {
        score += 30;
        matchReasons.push({ km: '✓ មន្ទីរពេទ្យសមស្របសម្រាប់ការពិនិត្យប្រញាប់', en: '✓ Suitable hospital for urgent evaluation' });
      } else if (facility.type === 'health_centre') {
        score += 20;
        matchReasons.push({ km: '✓ មណ្ឌលសុខភាពតំបន់', en: '✓ Local health centre' });
      }
    } else {
      // ROUTINE / SELF_CARE
      if (facility.type === 'health_centre' || facility.type === 'clinic') {
        score += 30;
        matchReasons.push({ km: '✓ មណ្ឌលសុខភាព/គ្លីនិកសមស្របសម្រាប់ជំងឺទូទៅ', en: '✓ Health centre/clinic appropriate for routine care' });
      } else {
        score += 15;
      }
    }

    // 3. Emergency Capability (max 15 pts)
    if (facility.emergency_available) {
      score += 15;
      matchReasons.push({ km: '✓ មានសេវាសង្គ្រោះបន្ទាន់ 24/7', en: '✓ 24/7 Emergency available' });
    }

    // 4. Opening Status (max 10 pts)
    if (facility.opening_hours.includes('24') || facility.opening_hours.includes('២៤')) {
      score += 10;
      matchReasons.push({ km: '✓ បើកទ្វារ ២៤ ម៉ោង', en: '✓ Currently open 24 hours' });
    } else {
      score += 5;
    }

    // 5. Preferred Type Alignment (max 5 pts)
    if (preferredType && facility.type === preferredType) {
      score += 5;
    }

    return {
      ...facility,
      score: Math.min(100, score),
      matchReasons
    };
  }).sort((a, b) => b.score - a.score);
}
