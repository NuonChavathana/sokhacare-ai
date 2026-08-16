export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type UrgencyLevel = 'none' | 'unknown' | 'routine' | 'soon' | 'urgent' | 'emergency';

export type UserIntent =
  | 'greeting'
  | 'symptom_consultation'
  | 'follow_up_symptom'
  | 'facility_search'
  | 'health_question'
  | 'medication_question'
  | 'thanks'
  | 'unknown';

export type ResponseType =
  | 'greeting'
  | 'clarification'
  | 'facility_search'
  | 'targeted_question'
  | 'clinical_guidance'
  | 'emergency_alert';

export type NextAction =
  | 'ask_question'
  | 'give_guidance'
  | 'emergency_referral'
  | 'urgent_referral'
  | 'clarify';

export interface PossibleCondition {
  nameKm: string;
  nameEn: string;
  category: string;
  rationaleKm: string;
  rationaleEn: string;
  urgency: UrgencyLevel;
}

export interface ClinicalMeasurements {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  oxygenSaturation?: number;
}

export interface ClinicalFindings {
  painOnPressure?: boolean;       // Tenderness on palpation
  painOnRelease?: boolean;        // Rebound tenderness (Blumberg's sign)
  painWithMovement?: boolean;     // Worsens with walking, coughing, bumps
  rigidAbdomen?: boolean;         // Involuntary guarding / board-like rigidity
  sweating?: boolean;             // Diaphoresis
  radiatingPain?: string;         // e.g. "chest_to_left_arm", "chest_to_jaw", "epigastric_to_back", "flank_to_groin"
  visualDisturbance?: boolean;    // Blurry vision, aura, scotoma
  neurologicalWeakness?: boolean; // Limb weakness, hemiparesis
  speechDifficulty?: boolean;     // Dysarthria / aphasia
  facialDroop?: boolean;          // Facial asymmetry
  neckStiffness?: boolean;        // Nuchal rigidity
  shortnessOfBreath?: boolean;    // Dyspnea
  vomitingBlood?: boolean;        // Hematemesis
  blackStool?: boolean;           // Melena
  bloodInStool?: boolean;         // Hematochezia
  faintingOrSyncope?: boolean;    // Loss of consciousness / syncope
  numbness?: boolean;             // Paresthesia / numbness
  swellingOrEdema?: boolean;      // Joint or limb swelling
}

export interface StateUpdateResult {
  stateChanged: boolean;
  newFacts: Record<string, any>;
  answeredQuestions: string[];
  remainingQuestions: string[];
}

export interface GeneralizedClinicalState {
  intent: UserIntent;
  confidence: number;
  chiefComplaint: string | null;
  symptoms: string[];
  location: string[];             // e.g. ['arm', 'leg', 'right_lower_abdomen', 'epigastric', 'chest', 'head_one_sided']
  severity: 'mild' | 'moderate' | 'severe' | 'critical' | null;
  worsening?: boolean;            // e.g. "getting worse", "កាន់តែឈឺ", "ឈឺជាងមុន"
  overallCondition?: string;      // e.g. "very_unwell", "unwell", "stable", "improving"
  onset: 'sudden' | 'gradual' | null;
  duration: string | null;
  timing: string | null;          // e.g. "after_eating", "empty_stomach", "morning", "night", "constant", "intermittent"
  frequency: string | null;
  triggers: string[];
  relievingFactors: string[];
  associatedSymptoms: string[];   // Symptoms user confirmed (e.g. ['fever', 'nausea', 'cough', 'visual_disturbance'])
  negativeSymptoms: string[];     // Symptoms user explicitly denied (e.g. ['vomiting', 'blood_in_stool', 'chest_pain', 'fever'])
  findings: ClinicalFindings;
  measurements: ClinicalMeasurements;
  riskFactors: string[];
  redFlags: string[];             // Detected clinical red flags
  
  // Demographics / Context
  isPediatric: boolean;
  isPregnant: boolean | null;
  
  // Triage & Diagnosis Separation
  riskLevel: RiskLevel;
  urgency: UrgencyLevel;
  possibleConditions: PossibleCondition[];
  diagnosis: null;                // Strictly kept null: chatbot does not diagnose definitive diseases
  
  // Conversation & Dialogue Memory
  completedTurns: number;
  newlyReportedInLatestTurn: string[];
  pendingQuestions: string[];     // What the assistant still needs to ask
  answeredQuestions: string[];    // What has already been answered/denied
  lastQuestionAsked?: string;     // The last question asked by the assistant
  nextAction: NextAction;
  stateChanged: boolean;
  missingInformation: string[];   // For backward compatibility
}

export function createEmptyClinicalState(): GeneralizedClinicalState {
  return {
    intent: 'unknown',
    confidence: 1.0,
    chiefComplaint: null,
    symptoms: [],
    location: [],
    severity: null,
    worsening: false,
    overallCondition: undefined,
    onset: null,
    duration: null,
    timing: null,
    frequency: null,
    triggers: [],
    relievingFactors: [],
    associatedSymptoms: [],
    negativeSymptoms: [],
    findings: {},
    measurements: {},
    riskFactors: [],
    redFlags: [],
    isPediatric: false,
    isPregnant: null,
    riskLevel: 'low',
    urgency: 'none',
    possibleConditions: [],
    diagnosis: null,
    completedTurns: 0,
    newlyReportedInLatestTurn: [],
    pendingQuestions: [],
    answeredQuestions: [],
    lastQuestionAsked: undefined,
    nextAction: 'clarify',
    stateChanged: false,
    missingInformation: []
  };
}

// Backward compatibility aliases
export type SymptomState = GeneralizedClinicalState;
export const createEmptySymptomState = createEmptyClinicalState;
