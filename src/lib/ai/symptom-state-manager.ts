import {
  GeneralizedClinicalState,
  createEmptyClinicalState,
  NextAction
} from '@/types/symptomState';
import { extractClinicalEntities, ExtractedClinicalEntities } from './entity-extractor';

/**
 * Merges newly extracted clinical entities into the existing GeneralizedClinicalState.
 * Calculates state_changed, new_facts, answered_questions, and remaining_questions.
 */
export function mergeClinicalEntities(
  currentState: GeneralizedClinicalState,
  extracted: ExtractedClinicalEntities
): GeneralizedClinicalState {
  const nextState: GeneralizedClinicalState = {
    ...currentState,
    intent: extracted.intent,
    confidence: extracted.confidence,
    findings: { ...currentState.findings, ...extracted.findings },
    measurements: { ...currentState.measurements, ...extracted.measurements },
    completedTurns: currentState.completedTurns + 1,
    newlyReportedInLatestTurn: [],
    answeredQuestions: [...currentState.answeredQuestions],
    stateChanged: false
  };

  const newFacts: Record<string, any> = {};
  const newlyReported: string[] = [];
  let changed = false;

  // 1. Chief Complaint
  if (extracted.chiefComplaint && (!currentState.chiefComplaint || currentState.chiefComplaint === 'unknown')) {
    nextState.chiefComplaint = extracted.chiefComplaint;
    newFacts.chiefComplaint = extracted.chiefComplaint;
    newlyReported.push(`chief_complaint:${extracted.chiefComplaint}`);
    changed = true;
  }

  // 2. Symptoms
  if (extracted.symptoms.length > 0) {
    const freshSymptoms = extracted.symptoms.filter((s) => !currentState.symptoms.includes(s));
    if (freshSymptoms.length > 0) {
      nextState.symptoms = Array.from(new Set([...currentState.symptoms, ...extracted.symptoms]));
      newFacts.symptoms = freshSymptoms;
      newlyReported.push(...freshSymptoms.map((s) => `symptom:${s}`));
      changed = true;
    }
  }

  // 3. Location / Body parts
  if (extracted.location.length > 0) {
    const newLocations = extracted.location.filter((l) => !currentState.location.includes(l));
    if (newLocations.length > 0) {
      nextState.location = Array.from(new Set([...currentState.location, ...extracted.location]));
      newFacts.location = nextState.location;
      newlyReported.push(...newLocations.map((l) => `location:${l}`));
      changed = true;
    }
  }

  // 4. Severity & Overall Condition & Worsening
  if (extracted.severity) {
    if (currentState.severity !== extracted.severity) {
      nextState.severity = extracted.severity;
      newFacts.severity = extracted.severity;
      newlyReported.push(`severity:${extracted.severity}`);
      changed = true;
    }
  }

  if (extracted.overallCondition && currentState.overallCondition !== extracted.overallCondition) {
    nextState.overallCondition = extracted.overallCondition;
    newFacts.overallCondition = extracted.overallCondition;
    newlyReported.push(`overallCondition:${extracted.overallCondition}`);
    changed = true;
  }

  if (extracted.worsening && !currentState.worsening) {
    nextState.worsening = true;
    newFacts.worsening = true;
    newlyReported.push('worsening:true');
    changed = true;
  }

  // 5. Onset & Duration & Timing
  if (extracted.onset && currentState.onset !== extracted.onset) {
    nextState.onset = extracted.onset;
    newFacts.onset = extracted.onset;
    newlyReported.push(`onset:${extracted.onset}`);
    changed = true;
  }
  if (extracted.duration && currentState.duration !== extracted.duration) {
    nextState.duration = extracted.duration;
    newFacts.duration = extracted.duration;
    newlyReported.push(`duration:${extracted.duration}`);
    changed = true;
  }
  if (extracted.timing && currentState.timing !== extracted.timing) {
    nextState.timing = extracted.timing;
    newFacts.timing = extracted.timing;
    newlyReported.push(`timing:${extracted.timing}`);
    changed = true;
  }

  // 6. Positive Associated Symptoms (Visual changes, fever, nausea, etc.)
  if (extracted.positiveSymptoms.length > 0) {
    const newPositive = extracted.positiveSymptoms.filter(
      (s) => !currentState.associatedSymptoms.includes(s)
    );
    if (newPositive.length > 0) {
      nextState.associatedSymptoms = Array.from(
        new Set([...currentState.associatedSymptoms, ...extracted.positiveSymptoms])
      );
      nextState.negativeSymptoms = currentState.negativeSymptoms.filter(
        (s) => !extracted.positiveSymptoms.includes(s)
      );
      newFacts.positiveSymptoms = newPositive;
      newlyReported.push(...newPositive.map((s) => `symptom:${s}`));
      changed = true;
    }
  }

  // 7. Negative Symptoms (Denials: "no fever", "no visual changes", "no stiff neck")
  if (extracted.negativeSymptoms.length > 0) {
    const newNegative = extracted.negativeSymptoms.filter(
      (s) => !currentState.negativeSymptoms.includes(s)
    );
    if (newNegative.length > 0) {
      nextState.negativeSymptoms = Array.from(
        new Set([...currentState.negativeSymptoms, ...extracted.negativeSymptoms])
      );
      nextState.associatedSymptoms = currentState.associatedSymptoms.filter(
        (s) => !extracted.negativeSymptoms.includes(s)
      );
      newFacts.negativeSymptoms = newNegative;
      newlyReported.push(...newNegative.map((s) => `denied:${s}`));
      changed = true;
    }
  }

  // 8. Triggers & Relieving Factors
  if (extracted.triggers.length > 0) {
    nextState.triggers = Array.from(new Set([...currentState.triggers, ...extracted.triggers]));
  }
  if (extracted.relievingFactors.length > 0) {
    nextState.relievingFactors = Array.from(
      new Set([...currentState.relievingFactors, ...extracted.relievingFactors])
    );
  }

  // 9. Clinical Findings (Visual disturbance, pain on release, sweating, stiff neck)
  if (extracted.findings.visualDisturbance && !currentState.findings.visualDisturbance) {
    newFacts.visualDisturbance = true;
    newlyReported.push('finding:visual_disturbance');
    changed = true;
  }
  if (extracted.findings.neckStiffness && !currentState.findings.neckStiffness) {
    newFacts.neckStiffness = true;
    newlyReported.push('finding:neck_stiffness');
    changed = true;
  }
  if (extracted.findings.painOnRelease && !currentState.findings.painOnRelease) {
    newFacts.painOnRelease = true;
    newlyReported.push('finding:pain_on_release');
    changed = true;
  }
  if (extracted.findings.sweating && !currentState.findings.sweating) {
    newFacts.sweating = true;
    newlyReported.push('finding:sweating');
    changed = true;
  }

  // 10. Update Answered & Pending Questions Dynamically
  const answeredNow: string[] = [];
  if (newFacts.visualDisturbance || nextState.negativeSymptoms.includes('visual_disturbance')) {
    answeredNow.push('visual_changes');
  }
  if (nextState.associatedSymptoms.includes('fever') || nextState.negativeSymptoms.includes('fever')) {
    answeredNow.push('fever');
  }
  if (nextState.findings.neckStiffness || nextState.negativeSymptoms.includes('stiff_neck')) {
    answeredNow.push('stiff_neck');
  }
  if (nextState.duration) {
    answeredNow.push('duration');
  }
  if (nextState.onset) {
    answeredNow.push('onset_speed');
  }
  if (nextState.location.length > 0) {
    answeredNow.push('location');
  }
  if (nextState.severity) {
    answeredNow.push('severity');
  }

  nextState.answeredQuestions = Array.from(new Set([...currentState.answeredQuestions, ...answeredNow]));
  nextState.pendingQuestions = calculatePendingQuestions(nextState);
  nextState.missingInformation = nextState.pendingQuestions;
  nextState.newlyReportedInLatestTurn = newlyReported;
  nextState.stateChanged = changed;

  return nextState;
}

/**
 * Calculates pending questions that are still missing from the clinical state.
 */
export function calculatePendingQuestions(state: GeneralizedClinicalState): string[] {
  const pending: string[] = [];
  const complaint = state.chiefComplaint || (state.symptoms.length > 0 ? state.symptoms[0] : null);

  if (!complaint || state.intent !== 'symptom_consultation' && state.intent !== 'follow_up_symptom') {
    return pending;
  }

  // 1. Headache
  if (complaint === 'headache' || complaint.includes('head')) {
    if (!state.onset && !state.answeredQuestions.includes('onset_speed')) {
      pending.push('onset_speed');
    }
    if (
      !state.findings.visualDisturbance &&
      !state.negativeSymptoms.includes('visual_disturbance') &&
      !state.answeredQuestions.includes('visual_changes')
    ) {
      pending.push('visual_changes');
    }
    if (
      !state.associatedSymptoms.includes('fever') &&
      !state.negativeSymptoms.includes('fever') &&
      !state.answeredQuestions.includes('fever')
    ) {
      pending.push('fever');
    }
    if (
      !state.findings.neckStiffness &&
      !state.negativeSymptoms.includes('stiff_neck') &&
      !state.answeredQuestions.includes('stiff_neck')
    ) {
      pending.push('stiff_neck');
    }
    if (!state.duration && !state.answeredQuestions.includes('duration')) {
      pending.push('duration');
    }
  }

  // 2. Abdominal Pain
  else if (complaint === 'abdominal_pain' || complaint.includes('stomach') || complaint.includes('epigastric')) {
    if (state.location.length === 0 && !state.answeredQuestions.includes('location')) {
      pending.push('location');
    }
    if (!state.timing && !state.answeredQuestions.includes('timing')) {
      pending.push('timing');
    }
    if (
      !state.associatedSymptoms.includes('fever') &&
      !state.negativeSymptoms.includes('fever') &&
      !state.answeredQuestions.includes('fever')
    ) {
      pending.push('fever');
    }
    if (
      !state.associatedSymptoms.includes('nausea') &&
      !state.associatedSymptoms.includes('vomiting') &&
      !state.negativeSymptoms.includes('vomiting')
    ) {
      pending.push('nausea_vomiting');
    }
    if (
      !state.findings.painOnRelease &&
      state.location.includes('right_lower_abdomen')
    ) {
      pending.push('tenderness_rebound');
    }
  }

  // 3. Limb Pain
  else if (
    complaint === 'limb_pain' ||
    state.location.includes('arm') ||
    state.location.includes('leg')
  ) {
    if (!state.duration && !state.answeredQuestions.includes('duration')) {
      pending.push('duration');
    }
    if (
      !state.findings.neurologicalWeakness &&
      !state.findings.numbness &&
      !state.negativeSymptoms.includes('weakness_numbness')
    ) {
      pending.push('weakness_or_numbness');
    }
    if (
      !state.findings.shortnessOfBreath &&
      !state.negativeSymptoms.includes('shortness_of_breath')
    ) {
      pending.push('chest_or_breathing_screening');
    }
  }

  // 4. Chest Pain
  else if (complaint === 'chest_pain' || complaint.includes('chest')) {
    if (!state.findings.shortnessOfBreath && !state.negativeSymptoms.includes('shortness_of_breath')) {
      pending.push('shortness_of_breath');
    }
    if (!state.findings.sweating) {
      pending.push('sweating');
    }
  }

  return pending;
}

/**
 * Reconstructs the GeneralizedClinicalState from a multi-turn chat history.
 */
export function buildClinicalStateFromHistory(
  messages: { role: string; content: string }[]
): GeneralizedClinicalState {
  let state = createEmptyClinicalState();
  const userMessages = messages.filter((m) => m.role === 'user');

  for (const userMsg of userMessages) {
    const extracted = extractClinicalEntities(userMsg.content || '', state);
    state = mergeClinicalEntities(state, extracted);
  }

  return state;
}

// Backward compatibility aliases
export const buildSymptomStateFromHistory = buildClinicalStateFromHistory;
export const mergeEntitiesIntoState = mergeClinicalEntities;
