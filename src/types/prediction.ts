import { GeneralDiseaseResponse } from './generalDisease';

export type PredictionMode = 'patient' | 'doctor' | 'general' | 'patient_heart' | 'doctor_heart' | 'general_disease';
export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface HeartDiseasePredictionInput {
  Age: number;
  Gender: 0 | 1;
  Chest_Pain_Type: 1 | 2 | 3 | 4;
  Resting_Blood_Pressure: number;
  Cholesterol: number;
  Fasting_Blood_Sugar: 0 | 1;
  Resting_ECG_Results: 0 | 1 | 2;
  Maximum_Heart_Rate: number;
  Exercise_Induced_Angina: 0 | 1;
  Depression_Induced_By_Exercise: number;
  Slope_Of_Peak_Exercise: 1 | 2 | 3;
  Major_Vessels_Colored_By_Fluoroscopy: 0 | 1 | 2 | 3;
  Thalassemia: 3 | 6 | 7;
  Risk_Score: number;
  symptom_severity: number;
  age_thalach_ratio: number;
}

export interface ContributingFactor {
  feature: keyof HeartDiseasePredictionInput;
  labelEn: string;
  labelKm: string;
  value: number | string;
  displayValue: string;
  impact: 'high_risk' | 'moderate_risk' | 'protective' | 'neutral';
  descriptionEn: string;
  descriptionKm: string;
  weight?: number;
}

export interface HeartDiseasePredictionResult {
  probability: number;
  prediction: 0 | 1;
  riskLevel: RiskLevel;
  createdAt: string;
  contributingFactors?: ContributingFactor[];
  coefficients?: Record<string, number>;
  features?: HeartDiseasePredictionInput;
  mode?: PredictionMode;
  isFallback?: boolean;
}

export interface PatientFormInput {
  age: number;
  gender: 0 | 1;
  chestDiscomfortType: 'none' | 'pressure' | 'sharp' | 'burning' | 'asymptomatic';
  hasHighBP: 'unknown' | 'no' | 'yes';
  knownBPValue?: number;
  hasHighCholesterol: 'unknown' | 'no' | 'yes';
  knownCholesterolValue?: number;
  hasDiabetesOrHighSugar: 'unknown' | 'no' | 'yes';
  exerciseDiscomfort: 'no' | 'yes';
  activityLevel: 'sedentary' | 'moderate' | 'active';
  knownMaxHeartRate?: number;
  symptomDescription?: string;
  associatedSymptoms: {
    shortnessOfBreath: boolean;
    palpitations: boolean;
    dizziness: boolean;
    fatigue: boolean;
    radiatingPain: boolean;
  };
}

export interface DoctorFormInput {
  Age: number;
  Gender: 0 | 1;
  Chest_Pain_Type: 1 | 2 | 3 | 4;
  Resting_Blood_Pressure: number;
  Cholesterol: number;
  Fasting_Blood_Sugar: 0 | 1;
  Resting_ECG_Results: 0 | 1 | 2;
  Maximum_Heart_Rate: number;
  Exercise_Induced_Angina: 0 | 1;
  Depression_Induced_By_Exercise: number;
  Slope_Of_Peak_Exercise: 1 | 2 | 3;
  Major_Vessels_Colored_By_Fluoroscopy: 0 | 1 | 2 | 3;
  Thalassemia: 3 | 6 | 7;
  customRiskScore?: number;
  customSymptomSeverity?: number;
  clinicalNotes?: string;
  associatedSymptoms?: string[];
}

export interface PredictionHistoryRecord {
  id: string;
  date: string;
  mode: PredictionMode;
  probability?: number;
  riskLevel?: RiskLevel | string;
  age?: number;
  gender?: 0 | 1 | string;
  keySummary: string;
  features?: HeartDiseasePredictionInput;
  generalResult?: GeneralDiseaseResponse;
  language: 'km' | 'en';
}
