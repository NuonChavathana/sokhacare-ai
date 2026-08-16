import { HealthcareFacility } from '@/types/triage';
import {
  GeneralizedClinicalState,
  UserIntent,
  UrgencyLevel,
  ResponseType,
  NextAction
} from '@/types/symptomState';
import {
  buildClinicalStateFromHistory,
  calculatePendingQuestions
} from './symptom-state-manager';
import { assessClinicalRisk } from './risk-assessor';
import { generateGeneralizedClinicalResponse } from './response-generator';

export interface ChatResponsePayload {
  content: string;
  intent: UserIntent;
  urgency: UrgencyLevel;
  confidence: number;
  triageLevel: 'emergency' | 'urgent' | 'routine' | 'info';
  response_type: ResponseType;
  next_action: NextAction;
  state_changed: boolean;
  new_facts: Record<string, any>;
  symptom_state: GeneralizedClinicalState;
  missing_information: string[];
  pending_questions: string[];
  answered_questions: string[];
  quickReplies: string[];
  suggestedActions?: {
    type: 'call_119' | 'call_115' | 'find_facilities' | 'symptoms_triage' | 'rehydrate';
    labelKm: string;
    labelEn: string;
    link?: string;
  }[];
  facilities?: HealthcareFacility[];
  state?: GeneralizedClinicalState; // Backward compatibility
}

/**
 * Intelligent context-aware medical conversation engine for SokhaCare AI.
 * Processes state updates, extracts new facts, manages dialogue memory,
 * and produces structured debug logging for each turn.
 */
export function evaluateChatIntent(
  userQuery: string,
  language: 'km' | 'en' = 'km',
  userLat?: number,
  userLng?: number,
  conversationHistory: { role: string; content: string }[] = []
): ChatResponsePayload {
  // 1. Build messages array containing previous turns + current user query
  const allMessages = [...conversationHistory];
  if (userQuery && (!allMessages.length || allMessages[allMessages.length - 1].content !== userQuery)) {
    allMessages.push({ role: 'user', content: userQuery });
  }

  // 2. Previous state before latest turn (for debug logging & state diff)
  const previousMessages = allMessages.slice(0, -1);
  const previousState = buildClinicalStateFromHistory(previousMessages);
  const lastAssistantMsg = [...conversationHistory].reverse().find((m) => m.role === 'assistant');

  // 3. Accumulate persistent multi-turn ClinicalState across all conversation turns
  const clinicalState = buildClinicalStateFromHistory(allMessages);

  // 4. Continuous clinical risk assessment based strictly on clinical evidence
  const risk = assessClinicalRisk(clinicalState, userLat, userLng);

  // 5. Determine Next Action and Response Type
  let nextAction: NextAction = 'ask_question';
  let responseType: ResponseType = 'targeted_question';

  if (clinicalState.intent === 'greeting') {
    nextAction = 'clarify';
    responseType = 'greeting';
  } else if (clinicalState.intent === 'unknown') {
    nextAction = 'clarify';
    responseType = 'clarification';
  } else if (clinicalState.intent === 'facility_search') {
    nextAction = 'give_guidance';
    responseType = 'facility_search';
  } else if (risk.isEmergency) {
    nextAction = 'emergency_referral';
    responseType = 'emergency_alert';
  } else if (risk.isUrgent) {
    nextAction = 'urgent_referral';
    responseType = 'clinical_guidance';
  } else if (clinicalState.pendingQuestions.length === 0) {
    nextAction = 'give_guidance';
    responseType = 'clinical_guidance';
  }

  clinicalState.nextAction = nextAction;

  // 6. Generate targeted clinical response
  const generated = generateGeneralizedClinicalResponse(clinicalState, risk, language, userQuery);

  // 7. Structured Debug Logging for Every Turn (Section 15)
  if (process.env.NODE_ENV !== 'production' || process.env.DEBUG_NLP === 'true') {
    console.log(`\n================== [TURN ${clinicalState.completedTurns}] ==================`);
    console.log(`USER: "${userQuery}"`);
    console.log(`PREVIOUS STATE:`, {
      chiefComplaint: previousState.chiefComplaint,
      severity: previousState.severity,
      location: previousState.location,
      associatedSymptoms: previousState.associatedSymptoms,
      negativeSymptoms: previousState.negativeSymptoms
    });
    console.log(`LAST ASSISTANT QUESTION: "${lastAssistantMsg?.content?.slice(0, 100) || 'None'}"`);
    console.log(`EXTRACTED NEW FACTS:`, clinicalState.newlyReportedInLatestTurn);
    console.log(`STATE AFTER MERGE:`, {
      chiefComplaint: clinicalState.chiefComplaint,
      severity: clinicalState.severity,
      overallCondition: clinicalState.overallCondition,
      worsening: clinicalState.worsening,
      location: clinicalState.location,
      associatedSymptoms: clinicalState.associatedSymptoms,
      negativeSymptoms: clinicalState.negativeSymptoms,
      findings: clinicalState.findings
    });
    console.log(`PENDING QUESTIONS:`, clinicalState.pendingQuestions);
    console.log(`RISK:`, { riskLevel: risk.riskLevel, urgency: risk.urgency });
    console.log(`NEXT ACTION: "${nextAction}"`);
    console.log(`====================================================\n`);
  }

  return {
    content: generated.content,
    intent: clinicalState.intent,
    urgency: risk.urgency,
    confidence: clinicalState.confidence,
    triageLevel: risk.triageLevel,
    response_type: responseType,
    next_action: nextAction,
    state_changed: clinicalState.stateChanged,
    new_facts: { newlyReported: clinicalState.newlyReportedInLatestTurn },
    symptom_state: clinicalState,
    missing_information: clinicalState.missingInformation,
    pending_questions: clinicalState.pendingQuestions,
    answered_questions: clinicalState.answeredQuestions,
    quickReplies: generated.quickReplies,
    suggestedActions: risk.suggestedActions,
    facilities: risk.recommendedFacilities,
    state: clinicalState
  };
}
