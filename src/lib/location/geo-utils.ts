import { HealthcareFacility, FacilityType } from '@/types/triage';

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Filter & sort facilities by user location and urgency
 */
export function getNearbyFacilities(
  facilities: HealthcareFacility[],
  userLat?: number,
  userLng?: number,
  preferredType?: FacilityType,
  limit: number = 6
): HealthcareFacility[] {
  let result = [...facilities];

  // Calculate distance if coordinates exist
  if (userLat !== undefined && userLng !== undefined) {
    result = result.map((f) => ({
      ...f,
      distance_km: calculateDistanceKm(userLat, userLng, f.latitude, f.longitude)
    }));

    // Sort by nearest
    result.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
  }

  // Prioritize preferred facility type if provided
  if (preferredType) {
    const matchingType = result.filter((f) => f.type === preferredType || (preferredType === 'hospital' && f.type === 'referral_hospital'));
    const otherTypes = result.filter((f) => f.type !== preferredType && !(preferredType === 'hospital' && f.type === 'referral_hospital'));
    result = [...matchingType, ...otherTypes];
  }

  return result.slice(0, limit);
}

/**
 * Generates a verified Google Maps Directions URL using the hospital name, address, and coordinates.
 * This guarantees Google Maps locks directly onto the official hospital listing rather than snapping to random nearby temples or alleys.
 */
export function getGoogleMapsDirectionsUrl(facility: {
  name_en: string;
  name_km?: string;
  address_en?: string;
  province?: string;
  latitude: number;
  longitude: number;
}): string {
  const destinationQuery = encodeURIComponent(
    `${facility.name_en}, ${facility.address_en || facility.province || 'Cambodia'}`
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}`;
}

