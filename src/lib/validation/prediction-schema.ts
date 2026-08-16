import { HeartDiseasePredictionInput } from '@/types/prediction';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Validates the full 16-feature input vector for Heart Disease Prediction
 */
export function validate16Features(data: any): ValidationResult<HeartDiseasePredictionInput> {
  if (!data || typeof data !== 'object') {
    return { success: false, errors: { form: 'Input payload must be a valid JSON object' } };
  }

  const errors: Record<string, string> = {};

  // Age: 18 - 120
  const age = Number(data.Age);
  if (isNaN(age) || age < 1 || age > 120) {
    errors.Age = 'Age must be between 1 and 120 years';
  }

  // Gender: 0 or 1
  const gender = Number(data.Gender);
  if (gender !== 0 && gender !== 1) {
    errors.Gender = 'Gender must be 0 (Female) or 1 (Male)';
  }

  // Chest Pain Type: 1, 2, 3, or 4
  const cp = Number(data.Chest_Pain_Type);
  if (![1, 2, 3, 4].includes(cp)) {
    errors.Chest_Pain_Type = 'Chest Pain Type must be 1 (Typical), 2 (Atypical), 3 (Non-anginal), or 4 (Asymptomatic)';
  }

  // Resting Blood Pressure: 60 - 260 mmHg
  const bp = Number(data.Resting_Blood_Pressure);
  if (isNaN(bp) || bp < 50 || bp > 280) {
    errors.Resting_Blood_Pressure = 'Resting Blood Pressure must be between 50 and 280 mmHg';
  }

  // Cholesterol: 80 - 650 mg/dl
  const chol = Number(data.Cholesterol);
  if (isNaN(chol) || chol < 50 || chol > 700) {
    errors.Cholesterol = 'Cholesterol must be between 50 and 700 mg/dl';
  }

  // Fasting Blood Sugar: 0 or 1
  const fbs = Number(data.Fasting_Blood_Sugar);
  if (fbs !== 0 && fbs !== 1) {
    errors.Fasting_Blood_Sugar = 'Fasting Blood Sugar must be 0 (<= 120 mg/dl) or 1 (> 120 mg/dl)';
  }

  // Resting ECG Results: 0, 1, or 2
  const ecg = Number(data.Resting_ECG_Results);
  if (![0, 1, 2].includes(ecg)) {
    errors.Resting_ECG_Results = 'Resting ECG Results must be 0 (Normal), 1 (ST-T abnormality), or 2 (LVH)';
  }

  // Maximum Heart Rate: 50 - 240 bpm
  const maxHr = Number(data.Maximum_Heart_Rate);
  if (isNaN(maxHr) || maxHr < 40 || maxHr > 250) {
    errors.Maximum_Heart_Rate = 'Maximum Heart Rate must be between 40 and 250 bpm';
  }

  // Exercise Induced Angina: 0 or 1
  const exAngina = Number(data.Exercise_Induced_Angina);
  if (exAngina !== 0 && exAngina !== 1) {
    errors.Exercise_Induced_Angina = 'Exercise Induced Angina must be 0 (No) or 1 (Yes)';
  }

  // Depression Induced By Exercise (Oldpeak): 0.0 - 10.0
  const oldpeak = Number(data.Depression_Induced_By_Exercise);
  if (isNaN(oldpeak) || oldpeak < 0 || oldpeak > 12) {
    errors.Depression_Induced_By_Exercise = 'ST Depression (Oldpeak) must be between 0.0 and 12.0 mm';
  }

  // Slope Of Peak Exercise: 1, 2, or 3
  const slope = Number(data.Slope_Of_Peak_Exercise);
  if (![1, 2, 3].includes(slope)) {
    errors.Slope_Of_Peak_Exercise = 'Slope of Peak Exercise must be 1 (Upsloping), 2 (Flat), or 3 (Downsloping)';
  }

  // Major Vessels: 0, 1, 2, or 3
  const vessels = Number(data.Major_Vessels_Colored_By_Fluoroscopy);
  if (![0, 1, 2, 3].includes(vessels)) {
    errors.Major_Vessels_Colored_By_Fluoroscopy = 'Major Vessels must be an integer between 0 and 3';
  }

  // Thalassemia: 3, 6, or 7
  const thal = Number(data.Thalassemia);
  if (![3, 6, 7].includes(thal)) {
    errors.Thalassemia = 'Thalassemia must be 3 (Normal), 6 (Fixed Defect), or 7 (Reversible Defect)';
  }

  // Computed / Rule-based features
  const riskScore = typeof data.Risk_Score === 'number' ? data.Risk_Score : 0;
  const symptomSeverity = typeof data.symptom_severity === 'number' ? data.symptom_severity : 0;
  const ageThalachRatio =
    typeof data.age_thalach_ratio === 'number' && data.age_thalach_ratio > 0
      ? data.age_thalach_ratio
      : age / (maxHr || 160);

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const validatedData: HeartDiseasePredictionInput = {
    Age: Math.round(age),
    Gender: gender as 0 | 1,
    Chest_Pain_Type: cp as 1 | 2 | 3 | 4,
    Resting_Blood_Pressure: Math.round(bp),
    Cholesterol: Math.round(chol),
    Fasting_Blood_Sugar: fbs as 0 | 1,
    Resting_ECG_Results: ecg as 0 | 1 | 2,
    Maximum_Heart_Rate: Math.round(maxHr),
    Exercise_Induced_Angina: exAngina as 0 | 1,
    Depression_Induced_By_Exercise: Number(oldpeak.toFixed(2)),
    Slope_Of_Peak_Exercise: slope as 1 | 2 | 3,
    Major_Vessels_Colored_By_Fluoroscopy: vessels as 0 | 1 | 2 | 3,
    Thalassemia: thal as 3 | 6 | 7,
    Risk_Score: Number(riskScore.toFixed(2)),
    symptom_severity: Number(symptomSeverity.toFixed(2)),
    age_thalach_ratio: Number(ageThalachRatio.toFixed(4))
  };

  return { success: true, data: validatedData };
}
