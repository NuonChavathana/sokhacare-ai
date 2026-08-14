export type Language = 'km' | 'en';

export type UrgencyLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'SELF_CARE';

export type FacilityType = 'hospital' | 'referral_hospital' | 'health_centre' | 'clinic';

export interface TriageResult {
  urgency: UrgencyLevel;
  confidence: number;
  summary_km: string;
  summary_en: string;
  red_flags: string[];
  follow_up_needed: boolean;
  follow_up_questions_km?: string[];
  follow_up_questions_en?: string[];
  recommended_facility_type: FacilityType;
  safety_message_km: string;
  safety_message_en: string;
}

export interface HealthcareFacility {
  id: string;
  name_km: string;
  name_en: string;
  type: FacilityType;
  province: string;
  district: string;
  address_km: string;
  address_en: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergency_phone?: string;
  opening_hours: string;
  emergency_available: boolean;
  services: string[];
  distance_km?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  triageResult?: TriageResult;
  recommendedFacilities?: HealthcareFacility[];
  isThinking?: boolean;
}

export interface DemoScenario {
  id: string;
  title_km: string;
  title_en: string;
  symptom_km: string;
  symptom_en: string;
  expectedUrgency: UrgencyLevel;
  badgeColor: string;
}

export interface DashboardStats {
  totalConsultations: number;
  emergencyCount: number;
  urgentCount: number;
  routineCount: number;
  selfCareCount: number;
  emergencyPercentage: number;
  urgentPercentage: number;
  routinePercentage: number;
  selfCarePercentage: number;
  avgConversationLength: number;
  commonSymptoms: { symptom: string; count: number; category: string }[];
  facilityTypeRequests: { type: string; label_km: string; label_en: string; count: number }[];
  recentLogs: {
    id: string;
    timestamp: string;
    symptomSummary: string;
    urgency: UrgencyLevel;
    facilityRecommended: string;
    language: Language;
  }[];
}
