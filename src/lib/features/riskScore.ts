import {
  HeartDiseasePredictionInput,
  PatientFormInput,
  DoctorFormInput,
  ContributingFactor
} from '@/types/prediction';

/**
 * Standard clinical defaults used when advanced diagnostic lab values
 * are unavailable (e.g. for non-clinician patients answering at home).
 */
export const CLINICAL_PATIENT_DEFAULTS = {
  Resting_ECG_Results: 0 as 0 | 1 | 2,
  Slope_Of_Peak_Exercise: 1 as 1 | 2 | 3,
  Major_Vessels_Colored_By_Fluoroscopy: 0 as 0 | 1 | 2 | 3,
  Thalassemia: 3 as 3 | 6 | 7,
  Cholesterol: 200,
  Resting_Blood_Pressure: 120,
  Maximum_Heart_Rate: 160,
  Fasting_Blood_Sugar: 0 as 0 | 1,
  Exercise_Induced_Angina: 0 as 0 | 1,
  Depression_Induced_By_Exercise: 0,
  Chest_Pain_Type: 2 as 1 | 2 | 3 | 4
};

/**
 * Feature 16: Computes Age to Maximum Heart Rate (thalach) Ratio
 * Formula: Age / Maximum_Heart_Rate
 */
export function calculateAgeThalachRatio(age: number, maxHeartRate: number): number {
  const safeThalach = maxHeartRate > 0 ? maxHeartRate : 160;
  const ratio = age / safeThalach;
  return Number(ratio.toFixed(4));
}

/**
 * Feature 14: Rule-based Cardiovascular Risk Score (0 - 15 Scale)
 *
 * Clinical Formula based on Framingham & ACC/AHA Risk Metric Principles:
 * - Age:
 *     < 40: 0.5 pts | 40-49: 1.5 pts | 50-59: 3.0 pts | 60-69: 4.5 pts | >= 70: 6.0 pts
 * - Gender: Male: +1.5 pts, Female: +0.5 pts
 * - Systolic Blood Pressure (Resting BP):
 *     < 120: 0.0 pts | 120-139 (Pre-HTN): 1.0 pt | 140-159 (Stage 1 HTN): 2.0 pts | >= 160 (Stage 2 HTN): 3.5 pts
 * - Total Cholesterol:
 *     < 200: 0.0 pts | 200-239: 1.0 pt | >= 240: 2.5 pts
 * - Fasting Blood Sugar (>120 mg/dl): +1.5 pts
 * - Exercise Induced Angina: +2.0 pts
 * - ST Depression (Oldpeak):
 *     0.0-1.0: 0.0 pts | 1.1-2.0: 1.5 pts | > 2.0: 3.0 pts
 * - Major Vessels Colored (0-3): +1.0 pt per vessel
 * - Thalassemia Defect (6 or 7): +2.0 pts
 */
export function calculateCardiovascularRiskScore(
  inputs: Partial<HeartDiseasePredictionInput>
): number {
  let score = 0;

  // 1. Age Contribution
  const age = inputs.Age ?? 50;
  if (age < 40) score += 0.5;
  else if (age < 50) score += 1.5;
  else if (age < 60) score += 3.0;
  else if (age < 70) score += 4.5;
  else score += 6.0;

  // 2. Gender Contribution
  if (inputs.Gender === 1) {
    score += 1.5; // Male baseline statistical factor
  } else {
    score += 0.5;
  }

  // 3. Resting Blood Pressure (mmHg)
  const bp = inputs.Resting_Blood_Pressure ?? 120;
  if (bp >= 160) score += 3.5;
  else if (bp >= 140) score += 2.0;
  else if (bp >= 120) score += 1.0;

  // 4. Serum Cholesterol (mg/dl)
  const chol = inputs.Cholesterol ?? 200;
  if (chol >= 240) score += 2.5;
  else if (chol >= 200) score += 1.0;

  // 5. Fasting Blood Sugar
  if (inputs.Fasting_Blood_Sugar === 1) {
    score += 1.5;
  }

  // 6. Exercise Induced Angina
  if (inputs.Exercise_Induced_Angina === 1) {
    score += 2.0;
  }

  // 7. ST Depression (Oldpeak)
  const oldpeak = inputs.Depression_Induced_By_Exercise ?? 0;
  if (oldpeak > 2.0) score += 3.0;
  else if (oldpeak > 1.0) score += 1.5;

  // 8. Major Vessels Colored
  const vessels = inputs.Major_Vessels_Colored_By_Fluoroscopy ?? 0;
  score += vessels * 1.0;

  // 9. Thalassemia Defect
  if (inputs.Thalassemia === 6 || inputs.Thalassemia === 7) {
    score += 2.0;
  }

  return Number(Math.min(15, Math.max(0, score)).toFixed(2));
}

/**
 * Feature 15: Symptom Severity Score (0 - 10 Scale)
 *
 * Derived from Chest Pain Type and associated acute cardiac symptoms:
 * - Chest Pain Type:
 *     Type 1 (Typical Angina): 5.0 pts
 *     Type 2 (Atypical Angina): 3.0 pts
 *     Type 3 (Non-anginal Pain): 1.5 pts
 *     Type 4 (Asymptomatic): 0.0 pts
 * - Associated Symptoms:
 *     Radiating Pain (jaw/neck/arm/back): +2.5 pts
 *     Shortness of breath (Dyspnea): +2.0 pts
 *     Dizziness / Presyncope: +1.5 pts
 *     Palpitations / Tachycardia: +1.0 pt
 *     Cold sweat / Extreme fatigue: +1.0 pt
 */
export function calculateSymptomSeverity(
  chestPainType: 1 | 2 | 3 | 4,
  symptoms?: {
    shortnessOfBreath?: boolean;
    palpitations?: boolean;
    dizziness?: boolean;
    fatigue?: boolean;
    radiatingPain?: boolean;
  } | string[]
): number {
  let score = 0;

  // Baseline from chest pain type
  switch (chestPainType) {
    case 1:
      score += 5.0; // Typical angina
      break;
    case 2:
      score += 3.0; // Atypical angina
      break;
    case 3:
      score += 1.5; // Non-anginal pain
      break;
    case 4:
    default:
      score += 0.0; // Asymptomatic
      break;
  }

  if (Array.isArray(symptoms)) {
    if (symptoms.includes('radiatingPain') || symptoms.includes('radiating_pain')) score += 2.5;
    if (symptoms.includes('shortnessOfBreath') || symptoms.includes('shortness_of_breath')) score += 2.0;
    if (symptoms.includes('dizziness')) score += 1.5;
    if (symptoms.includes('palpitations')) score += 1.0;
    if (symptoms.includes('fatigue')) score += 1.0;
  } else if (symptoms) {
    if (symptoms.radiatingPain) score += 2.5;
    if (symptoms.shortnessOfBreath) score += 2.0;
    if (symptoms.dizziness) score += 1.5;
    if (symptoms.palpitations) score += 1.0;
    if (symptoms.fatigue) score += 1.0;
  }

  return Number(Math.min(10, Math.max(0, score)).toFixed(2));
}

/**
 * Transforms Patient Form Data into the full 16-feature vector
 */
export function patientInputTo16Features(input: PatientFormInput): HeartDiseasePredictionInput {
  // Map patient chest pain description to clinical chest pain type
  let chestPainType: 1 | 2 | 3 | 4 = 4; // default asymptomatic
  if (input.chestDiscomfortType === 'pressure') {
    chestPainType = 1; // Typical angina (pressure, squeezing)
  } else if (input.chestDiscomfortType === 'sharp') {
    chestPainType = 2; // Atypical angina
  } else if (input.chestDiscomfortType === 'burning') {
    chestPainType = 3; // Non-anginal pain (burning, indigestion-like)
  } else {
    chestPainType = 4; // None
  }

  // Blood pressure mapping
  let bp = CLINICAL_PATIENT_DEFAULTS.Resting_Blood_Pressure;
  if (input.knownBPValue && input.knownBPValue >= 70 && input.knownBPValue <= 240) {
    bp = input.knownBPValue;
  } else if (input.hasHighBP === 'yes') {
    bp = 145; // Clinically reasonable estimate for diagnosed hypertension
  } else if (input.hasHighBP === 'no') {
    bp = 118;
  }

  // Cholesterol mapping
  let chol = CLINICAL_PATIENT_DEFAULTS.Cholesterol;
  if (input.knownCholesterolValue && input.knownCholesterolValue >= 100 && input.knownCholesterolValue <= 500) {
    chol = input.knownCholesterolValue;
  } else if (input.hasHighCholesterol === 'yes') {
    chol = 250; // Clinically reasonable estimate for diagnosed hyperlipidemia
  } else if (input.hasHighCholesterol === 'no') {
    chol = 185;
  }

  // Fasting Blood Sugar (>120 mg/dl)
  const fbs: 0 | 1 = input.hasDiabetesOrHighSugar === 'yes' ? 1 : 0;

  // Maximum Heart Rate estimate based on age & activity (Tanaka formula: 208 - 0.7 * age)
  let maxHr = CLINICAL_PATIENT_DEFAULTS.Maximum_Heart_Rate;
  if (input.knownMaxHeartRate && input.knownMaxHeartRate >= 60 && input.knownMaxHeartRate <= 220) {
    maxHr = input.knownMaxHeartRate;
  } else {
    const estimatedMax = Math.round(208 - 0.7 * input.age);
    if (input.activityLevel === 'sedentary') {
      maxHr = Math.max(120, estimatedMax - 15);
    } else if (input.activityLevel === 'active') {
      maxHr = Math.min(195, estimatedMax + 10);
    } else {
      maxHr = estimatedMax;
    }
  }

  const exerciseAngina: 0 | 1 = input.exerciseDiscomfort === 'yes' ? 1 : 0;

  // Derived features
  const symptomSeverity = calculateSymptomSeverity(chestPainType, input.associatedSymptoms);

  const partialFeatures: Partial<HeartDiseasePredictionInput> = {
    Age: input.age,
    Gender: input.gender,
    Chest_Pain_Type: chestPainType,
    Resting_Blood_Pressure: bp,
    Cholesterol: chol,
    Fasting_Blood_Sugar: fbs,
    Resting_ECG_Results: CLINICAL_PATIENT_DEFAULTS.Resting_ECG_Results,
    Maximum_Heart_Rate: maxHr,
    Exercise_Induced_Angina: exerciseAngina,
    Depression_Induced_By_Exercise: CLINICAL_PATIENT_DEFAULTS.Depression_Induced_By_Exercise,
    Slope_Of_Peak_Exercise: CLINICAL_PATIENT_DEFAULTS.Slope_Of_Peak_Exercise,
    Major_Vessels_Colored_By_Fluoroscopy: CLINICAL_PATIENT_DEFAULTS.Major_Vessels_Colored_By_Fluoroscopy,
    Thalassemia: CLINICAL_PATIENT_DEFAULTS.Thalassemia
  };

  const riskScore = calculateCardiovascularRiskScore(partialFeatures);
  const ageThalachRatio = calculateAgeThalachRatio(input.age, maxHr);

  return {
    Age: input.age,
    Gender: input.gender,
    Chest_Pain_Type: chestPainType,
    Resting_Blood_Pressure: bp,
    Cholesterol: chol,
    Fasting_Blood_Sugar: fbs,
    Resting_ECG_Results: CLINICAL_PATIENT_DEFAULTS.Resting_ECG_Results,
    Maximum_Heart_Rate: maxHr,
    Exercise_Induced_Angina: exerciseAngina,
    Depression_Induced_By_Exercise: CLINICAL_PATIENT_DEFAULTS.Depression_Induced_By_Exercise,
    Slope_Of_Peak_Exercise: CLINICAL_PATIENT_DEFAULTS.Slope_Of_Peak_Exercise,
    Major_Vessels_Colored_By_Fluoroscopy: CLINICAL_PATIENT_DEFAULTS.Major_Vessels_Colored_By_Fluoroscopy,
    Thalassemia: CLINICAL_PATIENT_DEFAULTS.Thalassemia,
    Risk_Score: riskScore,
    symptom_severity: symptomSeverity,
    age_thalach_ratio: ageThalachRatio
  };
}

/**
 * Transforms Doctor Form Data into the full 16-feature vector
 */
export function doctorInputTo16Features(input: DoctorFormInput): HeartDiseasePredictionInput {
  const ageThalachRatio = calculateAgeThalachRatio(input.Age, input.Maximum_Heart_Rate);

  const symptomSeverity =
    input.customSymptomSeverity !== undefined
      ? input.customSymptomSeverity
      : calculateSymptomSeverity(input.Chest_Pain_Type, input.associatedSymptoms);

  const partialFeatures: Partial<HeartDiseasePredictionInput> = {
    Age: input.Age,
    Gender: input.Gender,
    Chest_Pain_Type: input.Chest_Pain_Type,
    Resting_Blood_Pressure: input.Resting_Blood_Pressure,
    Cholesterol: input.Cholesterol,
    Fasting_Blood_Sugar: input.Fasting_Blood_Sugar,
    Resting_ECG_Results: input.Resting_ECG_Results,
    Maximum_Heart_Rate: input.Maximum_Heart_Rate,
    Exercise_Induced_Angina: input.Exercise_Induced_Angina,
    Depression_Induced_By_Exercise: input.Depression_Induced_By_Exercise,
    Slope_Of_Peak_Exercise: input.Slope_Of_Peak_Exercise,
    Major_Vessels_Colored_By_Fluoroscopy: input.Major_Vessels_Colored_By_Fluoroscopy,
    Thalassemia: input.Thalassemia
  };

  const riskScore =
    input.customRiskScore !== undefined
      ? input.customRiskScore
      : calculateCardiovascularRiskScore(partialFeatures);

  return {
    Age: input.Age,
    Gender: input.Gender,
    Chest_Pain_Type: input.Chest_Pain_Type,
    Resting_Blood_Pressure: input.Resting_Blood_Pressure,
    Cholesterol: input.Cholesterol,
    Fasting_Blood_Sugar: input.Fasting_Blood_Sugar,
    Resting_ECG_Results: input.Resting_ECG_Results,
    Maximum_Heart_Rate: input.Maximum_Heart_Rate,
    Exercise_Induced_Angina: input.Exercise_Induced_Angina,
    Depression_Induced_By_Exercise: input.Depression_Induced_By_Exercise,
    Slope_Of_Peak_Exercise: input.Slope_Of_Peak_Exercise,
    Major_Vessels_Colored_By_Fluoroscopy: input.Major_Vessels_Colored_By_Fluoroscopy,
    Thalassemia: input.Thalassemia,
    Risk_Score: riskScore,
    symptom_severity: symptomSeverity,
    age_thalach_ratio: ageThalachRatio
  };
}

/**
 * Analyzes features to generate human-readable contributing factors
 */
export function analyzeContributingFactors(
  features: HeartDiseasePredictionInput,
  coefficients?: Record<string, number>
): ContributingFactor[] {
  const factors: ContributingFactor[] = [];

  // 1. Major Fluoroscopy Vessels
  if (features.Major_Vessels_Colored_By_Fluoroscopy > 0) {
    factors.push({
      feature: 'Major_Vessels_Colored_By_Fluoroscopy',
      labelEn: 'Vessel Calcification / Fluoroscopy',
      labelKm: 'សរសៃឈាមបេះដូងកកស្ទះ (Fluoroscopy)',
      value: features.Major_Vessels_Colored_By_Fluoroscopy,
      displayValue: `${features.Major_Vessels_Colored_By_Fluoroscopy} vessels`,
      impact: 'high_risk',
      descriptionEn: `${features.Major_Vessels_Colored_By_Fluoroscopy} major coronary vessel(s) showed fluoroscopy coloring.`,
      descriptionKm: `មានសរសៃឈាមបេះដូងចម្បងចំនួន ${features.Major_Vessels_Colored_By_Fluoroscopy} ដែលបង្ហាញសញ្ញាតឹង ឬកកស្ទះ។`
    });
  }

  // 2. Chest Pain Type
  if (features.Chest_Pain_Type === 1) {
    factors.push({
      feature: 'Chest_Pain_Type',
      labelEn: 'Typical Angina',
      labelKm: 'ការឈឺណែនទ្រូងធ្ងន់ធ្ងរ (Typical Angina)',
      value: features.Chest_Pain_Type,
      displayValue: 'Typical Angina (Type 1)',
      impact: 'high_risk',
      descriptionEn: 'Pressure or constriction in the chest, strongly associated with myocardial ischemia.',
      descriptionKm: 'ការឈឺណែនទ្រូងខ្លាំងដែលជាសញ្ញាព្រមានសំខាន់នៃកង្វះឈាមទៅចិញ្ចឹមបេះដូង។'
    });
  } else if (features.Chest_Pain_Type === 2) {
    factors.push({
      feature: 'Chest_Pain_Type',
      labelEn: 'Atypical Chest Pain',
      labelKm: 'ការឈឺចុកទ្រូងមិនទៀងទាត់ (Atypical Angina)',
      value: features.Chest_Pain_Type,
      displayValue: 'Atypical Angina (Type 2)',
      impact: 'moderate_risk',
      descriptionEn: 'Chest discomfort that may indicate cardiac stress.',
      descriptionKm: 'អាការៈចុកឆ្អល់ទ្រូងដែលអាចពាក់ព័ន្ធនឹងសម្ពាធបេះដូង។'
    });
  }

  // 3. Resting Blood Pressure
  if (features.Resting_Blood_Pressure >= 140) {
    factors.push({
      feature: 'Resting_Blood_Pressure',
      labelEn: 'High Blood Pressure (Hypertension)',
      labelKm: 'សម្ពាធឈាមឡើងខ្ពស់ (លើសឈាម)',
      value: features.Resting_Blood_Pressure,
      displayValue: `${features.Resting_Blood_Pressure} mmHg`,
      impact: features.Resting_Blood_Pressure >= 160 ? 'high_risk' : 'moderate_risk',
      descriptionEn: `Elevated systolic blood pressure (${features.Resting_Blood_Pressure} mmHg) strains coronary arteries.`,
      descriptionKm: `សម្ពាធឈាម ${features.Resting_Blood_Pressure} mmHg បង្កើនបន្ទុកដល់បេះដូង និងសរសៃឈាម។`
    });
  } else if (features.Resting_Blood_Pressure <= 120) {
    factors.push({
      feature: 'Resting_Blood_Pressure',
      labelEn: 'Optimal Blood Pressure',
      labelKm: 'សម្ពាធឈាមល្អធម្មតា',
      value: features.Resting_Blood_Pressure,
      displayValue: `${features.Resting_Blood_Pressure} mmHg`,
      impact: 'protective',
      descriptionEn: 'Resting blood pressure is in the optimal healthy range.',
      descriptionKm: 'សម្ពាធឈាមស្ថិតក្នុងកម្រិតល្អប្រសើរសម្រាប់សុខភាពបេះដូង។'
    });
  }

  // 4. Cholesterol
  if (features.Cholesterol >= 240) {
    factors.push({
      feature: 'Cholesterol',
      labelEn: 'High Serum Cholesterol',
      labelKm: 'ជាតិខ្លាញ់ក្នុងឈាមខ្ពស់ (Cholesterol)',
      value: features.Cholesterol,
      displayValue: `${features.Cholesterol} mg/dl`,
      impact: 'high_risk',
      descriptionEn: `High cholesterol (${features.Cholesterol} mg/dl) elevates atherosclerosis risk.`,
      descriptionKm: `កម្រិតជាតិខ្លាញ់ ${features.Cholesterol} mg/dl អាចបង្កើនកំណកក្នុងសរសៃឈាម។`
    });
  } else if (features.Cholesterol <= 190) {
    factors.push({
      feature: 'Cholesterol',
      labelEn: 'Healthy Cholesterol Level',
      labelKm: 'កម្រិតជាតិខ្លាញ់ល្អ',
      value: features.Cholesterol,
      displayValue: `${features.Cholesterol} mg/dl`,
      impact: 'protective',
      descriptionEn: 'Cholesterol is within normal desirable parameters.',
      descriptionKm: 'កម្រិតជាតិខ្លាញ់ស្ថិតក្នុងរង្វង់ធម្មតាសមរម្យ។'
    });
  }

  // 5. Thalassemia Defect
  if (features.Thalassemia === 6 || features.Thalassemia === 7) {
    factors.push({
      feature: 'Thalassemia',
      labelEn: 'Thalassemia / Perfusion Defect',
      labelKm: 'ភាពមិនប្រក្រតីនៃចរន្តឈាម (Thalassemia Defect)',
      value: features.Thalassemia,
      displayValue: features.Thalassemia === 6 ? 'Fixed Defect' : 'Reversible Defect',
      impact: 'high_risk',
      descriptionEn: 'Scintigraphy showed cardiac perfusion abnormalities.',
      descriptionKm: 'ការពិនិត្យបង្ហាញភាពមិនប្រក្រតីនៃលំហូរឈាមក្នុងសាច់ដុំបេះដូង។'
    });
  }

  // 6. Exercise Induced Angina
  if (features.Exercise_Induced_Angina === 1) {
    factors.push({
      feature: 'Exercise_Induced_Angina',
      labelEn: 'Exercise-Induced Angina',
      labelKm: 'ឈឺទ្រូងពេលធ្វើចលនា ឬហាត់ប្រាណ',
      value: 1,
      displayValue: 'Yes',
      impact: 'high_risk',
      descriptionEn: 'Pain triggered during physical exertion indicates decreased cardiac reserve.',
      descriptionKm: 'ការឈឺទ្រូងពេលធ្វើសកម្មភាពបញ្ជាក់ពីសម្ពាធលើបេះដូង។'
    });
  }

  // 7. ST Depression
  if (features.Depression_Induced_By_Exercise >= 1.5) {
    factors.push({
      feature: 'Depression_Induced_By_Exercise',
      labelEn: 'ST Depression (Oldpeak)',
      labelKm: 'ការប្រែប្រួលរលកបេះដូង ST Depression',
      value: features.Depression_Induced_By_Exercise,
      displayValue: `${features.Depression_Induced_By_Exercise} mm`,
      impact: 'high_risk',
      descriptionEn: `Significant ST depression (${features.Depression_Induced_By_Exercise} mm) indicates myocardial stress.`,
      descriptionKm: `រលកបេះដូង ST ចុះទាប ${features.Depression_Induced_By_Exercise} mm បង្ហាញពីការចុះខ្សោយអុកស៊ីសែនក្នុងបេះដូង។`
    });
  }

  // 8. Age
  if (features.Age >= 60) {
    factors.push({
      feature: 'Age',
      labelEn: 'Age Risk Factor',
      labelKm: 'កត្តាអាយុ',
      value: features.Age,
      displayValue: `${features.Age} years`,
      impact: 'moderate_risk',
      descriptionEn: `Cardiovascular risk increases progressively with age (${features.Age} yrs).`,
      descriptionKm: `ហានិភ័យបេះដូងកើនឡើងតាមអាយុ (${features.Age} ឆ្នាំ)។`
    });
  }

  return factors;
}
