export type GeneralUrgencyLevel = 'emergency' | 'urgent' | 'see_doctor' | 'self_care';

export interface GeneralDiseaseSymptom {
  id: string;
  nameEn: string;
  nameKm: string;
  category: 'fever' | 'respiratory' | 'gastrointestinal' | 'neurological' | 'systemic' | 'cardiovascular' | 'urinary' | 'skin';
  isRedFlag?: boolean;
}

export interface GeneralDiseaseProfile {
  id: string;
  nameEn: string;
  nameKm: string;
  category: string;
  descriptionEn: string;
  descriptionKm: string;
  urgency: GeneralUrgencyLevel;
  primarySymptoms: { symptomId: string; weight: number }[];
  secondarySymptoms: { symptomId: string; weight: number }[];
  redFlags: { id: string; descEn: string; descKm: string }[];
  minAge?: number;
  maxAge?: number;
  genderSpecific?: 'male' | 'female';
  typicalDuration?: string;
  feverCharacteristic?: 'high_continuous' | 'spiking' | 'mild' | 'none';
  recommendationsEn: string[];
  recommendationsKm: string[];
}

export interface GeneralDiseaseInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  symptoms: string[];
  duration?: string; // e.g. "< 1 day", "1-3 days", "4-7 days", "> 1 week", "> 2 weeks"
  severity?: 'mild' | 'moderate' | 'severe';
  temperature?: number | null; // Celsius e.g. 38.5
  language?: 'en' | 'km';
  freeTextDescription?: string;
}

export interface ConditionMatch {
  id: string;
  name: string;
  nameKm: string;
  nameEn: string;
  score: number; // 0 to 1
  urgency: GeneralUrgencyLevel;
  matchedSymptoms: { id: string; nameEn: string; nameKm: string }[];
  unmatchedPrimarySymptoms: { id: string; nameEn: string; nameKm: string }[];
  recommendations: string[];
  description: string;
}

export interface RedFlagAlert {
  id: string;
  titleEn: string;
  titleKm: string;
  descriptionEn: string;
  descriptionKm: string;
  sourceDisease?: string;
}

export interface GeneralDiseaseResponse {
  possibleConditions: ConditionMatch[];
  redFlags: RedFlagAlert[];
  overallUrgency: GeneralUrgencyLevel;
  disclaimerEn: string;
  disclaimerKm: string;
  evaluatedSymptoms: string[];
  createdAt: string;
}
