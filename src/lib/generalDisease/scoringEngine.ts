import {
  GeneralDiseaseInput,
  GeneralDiseaseResponse,
  ConditionMatch,
  RedFlagAlert,
  GeneralUrgencyLevel
} from '@/types/generalDisease';
import { GENERAL_DISEASES_KB, GENERAL_SYMPTOMS_CATALOG } from '@/lib/data/generalDiseases';

/**
 * Deterministic rule-based scoring engine for General Disease Triage
 */
export function evaluateGeneralDiseases(input: GeneralDiseaseInput): GeneralDiseaseResponse {
  const isKm = input.language === 'km';
  const selectedSymptoms = new Set(input.symptoms || []);
  const temp = typeof input.temperature === 'number' ? input.temperature : null;

  // If high temperature, add fever if not already present
  if (temp && temp >= 37.8) {
    selectedSymptoms.add('fever');
    if (temp >= 39.0) {
      selectedSymptoms.add('high_fever_spiking');
    }
  }

  const redFlags: RedFlagAlert[] = [];
  const conditionMatches: ConditionMatch[] = [];

  // Check general symptom red flags
  GENERAL_SYMPTOMS_CATALOG.forEach((s) => {
    if (s.isRedFlag && selectedSymptoms.has(s.id)) {
      redFlags.push({
        id: `rf-${s.id}`,
        titleEn: `Critical Symptom: ${s.nameEn}`,
        titleKm: `រោគសញ្ញាគ្រោះថ្នាក់៖ ${s.nameKm}`,
        descriptionEn: `Presence of ${s.nameEn} warrants urgent medical evaluation.`,
        descriptionKm: `រោគសញ្ញា ${s.nameKm} ត្រូវការការពិនិត្យវេជ្ជសាស្ត្រជាបន្ទាន់។`
      });
    }
  });

  // Evaluate each disease in knowledge base
  for (const disease of GENERAL_DISEASES_KB) {
    let matchedWeight = 0;
    let totalPossibleWeight = 0;
    const matchedSymptomsList: { id: string; nameEn: string; nameKm: string }[] = [];
    const unmatchedPrimaryList: { id: string; nameEn: string; nameKm: string }[] = [];

    // Evaluate primary symptoms (higher weight)
    for (const ps of disease.primarySymptoms) {
      const symObj = GENERAL_SYMPTOMS_CATALOG.find((s) => s.id === ps.symptomId);
      const nameEn = symObj?.nameEn || ps.symptomId;
      const nameKm = symObj?.nameKm || ps.symptomId;
      totalPossibleWeight += ps.weight * 1.5;

      if (selectedSymptoms.has(ps.symptomId)) {
        matchedWeight += ps.weight * 1.5;
        matchedSymptomsList.push({ id: ps.symptomId, nameEn, nameKm });
      } else {
        unmatchedPrimaryList.push({ id: ps.symptomId, nameEn, nameKm });
      }
    }

    // Evaluate secondary symptoms
    for (const ss of disease.secondarySymptoms) {
      const symObj = GENERAL_SYMPTOMS_CATALOG.find((s) => s.id === ss.symptomId);
      const nameEn = symObj?.nameEn || ss.symptomId;
      const nameKm = symObj?.nameKm || ss.symptomId;
      totalPossibleWeight += ss.weight * 1.0;

      if (selectedSymptoms.has(ss.symptomId)) {
        matchedWeight += ss.weight * 1.0;
        matchedSymptomsList.push({ id: ss.symptomId, nameEn, nameKm });
      }
    }

    if (totalPossibleWeight === 0 || matchedSymptomsList.length === 0) {
      continue;
    }

    let score = matchedWeight / totalPossibleWeight;

    // Bonus for high primary match percentage
    const primaryMatchesCount = disease.primarySymptoms.filter((p) =>
      selectedSymptoms.has(p.symptomId)
    ).length;
    if (primaryMatchesCount >= 2) {
      score += 0.15;
    }

    // Temperature synergy bonus
    if (temp && temp >= 38.5 && disease.feverCharacteristic === 'high_continuous') {
      score += 0.1;
    }

    // Check disease-specific red flags
    for (const rf of disease.redFlags) {
      // If severe or matches key symptoms, trigger disease red flag
      if (
        (input.severity === 'severe' && primaryMatchesCount >= 2) ||
        (disease.id === 'dengue_fever' && selectedSymptoms.has('bleeding_gums_nose')) ||
        (disease.id === 'appendicitis' && selectedSymptoms.has('severe_rlq_pain'))
      ) {
        if (!redFlags.some((existing) => existing.id === rf.id)) {
          redFlags.push({
            id: rf.id,
            titleEn: `${disease.nameEn} Warning: ${rf.descEn}`,
            titleKm: `សញ្ញាគ្រោះថ្នាក់ ${disease.nameKm}៖ ${rf.descKm}`,
            descriptionEn: rf.descEn,
            descriptionKm: rf.descKm,
            sourceDisease: disease.nameEn
          });
        }
      }
    }

    score = Math.min(0.98, Math.max(0.1, Number(score.toFixed(3))));

    conditionMatches.push({
      id: disease.id,
      name: isKm ? disease.nameKm : disease.nameEn,
      nameKm: disease.nameKm,
      nameEn: disease.nameEn,
      score,
      urgency: disease.urgency,
      matchedSymptoms: matchedSymptomsList,
      unmatchedPrimarySymptoms: unmatchedPrimaryList,
      recommendations: isKm ? disease.recommendationsKm : disease.recommendationsEn,
      description: isKm ? disease.descriptionKm : disease.descriptionEn
    });
  }

  // Sort descending by score
  conditionMatches.sort((a, b) => b.score - a.score);
  const topConditions = conditionMatches.slice(0, 5);

  // Determine overall urgency
  let overallUrgency: GeneralUrgencyLevel = 'self_care';

  if (redFlags.length > 0) {
    const hasEmergencyFlag = redFlags.some(
      (rf) =>
        rf.id.includes('rf_app') ||
        rf.id.includes('rf_pneu') ||
        rf.id.includes('rf_dengue_bleed') ||
        rf.id.includes('shortness_of_breath') ||
        rf.id.includes('seizures') ||
        rf.id.includes('confusion')
    );
    overallUrgency = hasEmergencyFlag ? 'emergency' : 'urgent';
  } else if (topConditions.length > 0) {
    const highestConditionUrgency = topConditions[0].urgency;
    if (highestConditionUrgency === 'emergency') overallUrgency = 'emergency';
    else if (highestConditionUrgency === 'urgent') overallUrgency = 'urgent';
    else if (highestConditionUrgency === 'see_doctor') overallUrgency = 'see_doctor';
    else overallUrgency = 'self_care';
  }

  const evaluatedSymptomsList = Array.from(selectedSymptoms);

  return {
    possibleConditions: topConditions,
    redFlags,
    overallUrgency,
    disclaimerEn:
      'This tool does not provide a medical diagnosis. Always consult a qualified healthcare provider.',
    disclaimerKm:
      'ឧបករណ៍នេះមិនផ្តល់នូវការធ្វើរោគវិនិច្ឆ័យវេជ្ជសាស្ត្រផ្លូវការទេ។ សូមពិគ្រោះជាមួយគ្រូពេទ្យជំនាញជានិច្ច។',
    evaluatedSymptoms: evaluatedSymptomsList,
    createdAt: new Date().toISOString()
  };
}
