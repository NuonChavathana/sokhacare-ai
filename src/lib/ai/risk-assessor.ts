import {
  GeneralizedClinicalState,
  RiskLevel,
  UrgencyLevel,
  PossibleCondition
} from '@/types/symptomState';
import { HealthcareFacility } from '@/types/triage';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import { getNearbyFacilities } from '@/lib/location/geo-utils';

export interface GeneralizedRiskAssessment {
  riskLevel: RiskLevel;
  urgency: UrgencyLevel;
  triageLevel: 'emergency' | 'urgent' | 'routine' | 'info';
  isEmergency: boolean;
  isUrgent: boolean;
  redFlags: string[];
  possibleConditions: PossibleCondition[];
  recommendedFacilities: HealthcareFacility[];
  suggestedActions: {
    type: 'call_119' | 'call_115' | 'find_facilities' | 'symptoms_triage' | 'rehydrate';
    labelKm: string;
    labelEn: string;
    link?: string;
  }[];
  clinicalRationaleKm: string;
  clinicalRationaleEn: string;
}

export type ClinicalRiskEvaluation = GeneralizedRiskAssessment;

export function assessClinicalRisk(
  state: GeneralizedClinicalState,
  userLat?: number,
  userLng?: number
): GeneralizedRiskAssessment {
  const redFlags: string[] = [];
  const possibleConditions: PossibleCondition[] = [];
  const suggestedActions: GeneralizedRiskAssessment['suggestedActions'] = [];

  const getEmergencyHospitals = (limit = 3) =>
    getNearbyFacilities(CAMBODIA_FACILITIES, userLat, userLng, 'hospital', limit);

  // 1. NON-SYMPTOM INTENTS (Greeting, Thanks, Unknown, Facility Search) -> Urgency = NONE
  if (
    state.intent === 'greeting' ||
    state.intent === 'thanks' ||
    state.intent === 'unknown' ||
    state.intent === 'facility_search'
  ) {
    if (state.intent === 'facility_search') {
      const facilities = getNearbyFacilities(CAMBODIA_FACILITIES, userLat, userLng, undefined, 5);
      suggestedActions.push({
        type: 'find_facilities',
        labelKm: '🏥 បង្ហាញបញ្ជីមន្ទីរពេទ្យទាំងអស់',
        labelEn: '🏥 View All Facilities',
        link: '/facilities'
      });
      return {
        riskLevel: 'low',
        urgency: 'none',
        triageLevel: 'info',
        isEmergency: false,
        isUrgent: false,
        redFlags: [],
        possibleConditions: [],
        recommendedFacilities: facilities,
        suggestedActions,
        clinicalRationaleKm: 'ស្វែងរកព័ត៌មានមន្ទីរពេទ្យ ឬគ្លីនិក។',
        clinicalRationaleEn: 'Healthcare facility search request.'
      };
    }

    return {
      riskLevel: 'low',
      urgency: 'none',
      triageLevel: 'info',
      isEmergency: false,
      isUrgent: false,
      redFlags: [],
      possibleConditions: [],
      recommendedFacilities: [],
      suggestedActions: [],
      clinicalRationaleKm: 'ការសន្ទនាបឋម ឬសំណួរទូទៅ (គ្មានទិន្នន័យរោគសញ្ញា)។',
      clinicalRationaleEn: 'General conversational turn without active clinical evidence.'
    };
  }

  // 2. CLINICAL RISK ASSESSMENT FOR SYMPTOM CONSULTATIONS
  let riskLevel: RiskLevel = 'low';
  let urgency: UrgencyLevel = 'routine';
  let rationaleKm = '';
  let rationaleEn = '';

  const complaint = state.chiefComplaint || (state.symptoms.length > 0 ? state.symptoms[0] : '');

  // =========================================================================
  // CRITICAL EMERGENCY COMBINATIONS (Life-Threatening)
  // =========================================================================

  // A. Gastrointestinal Bleeding
  if (state.findings.vomitingBlood || state.findings.blackStool) {
    redFlags.push('gastrointestinal_hemorrhage');
    riskLevel = 'critical';
    urgency = 'emergency';
    rationaleKm = 'រកឃើញសញ្ញាធ្លាក់ឈាមក្នុងបំពង់រំលាយអាហារ (ក្អួតឈាម ឬលាមកខ្មៅ) ដែលជាសញ្ញាគ្រោះថ្នាក់បន្ទាន់។';
    rationaleEn = 'Evidence of gastrointestinal hemorrhage requiring immediate emergency intervention.';
  }

  // B. Acute Cardiac Presentation (Chest pain + dyspnea / sweating / radiation)
  else if (
    (complaint === 'chest_pain' || state.location.includes('chest_central') || state.location.includes('chest_left')) &&
    (state.findings.sweating ||
      state.findings.shortnessOfBreath ||
      state.findings.radiatingPain ||
      state.severity === 'severe')
  ) {
    redFlags.push('acute_coronary_syndrome_risk');
    riskLevel = 'critical';
    urgency = 'emergency';
    possibleConditions.push({
      nameKm: 'វិបត្តិស្ទះសរសៃឈាមបេះដូងស្រួចស្រាវ',
      nameEn: 'Acute Coronary Syndrome',
      category: 'cardiovascular',
      rationaleKm: 'ការឈឺទ្រូងរួមជាមួយការហត់ បែកញើស ឬឈឺរាល អាចបណ្តាលមកពីការស្ទះសរសៃឈាមបេះដូង។',
      rationaleEn: 'Chest pain with sweating, dyspnea, or radiating pain suggests acute cardiac ischemia.',
      urgency: 'emergency'
    });
    rationaleKm = 'សញ្ញាឈឺណែនទ្រូងរួមជាមួយការហត់ ឬបែកញើស គឺជាក្រុមរោគសញ្ញាបេះដូងគ្រោះថ្នាក់បន្ទាន់។';
    rationaleEn = 'Chest pain accompanied by dyspnea or diaphoresis warrants emergent cardiac evaluation.';
  }

  // C. Acute Stroke / Neurological Emergency
  else if (
    state.findings.facialDroop ||
    state.findings.speechDifficulty ||
    state.findings.neurologicalWeakness
  ) {
    redFlags.push('acute_stroke_risk');
    riskLevel = 'critical';
    urgency = 'emergency';
    possibleConditions.push({
      nameKm: 'ជំងឺដាច់សរសៃឈាមខួរក្បាលស្រួចស្រាវ',
      nameEn: 'Acute Cerebrovascular Event / Stroke',
      category: 'neurological',
      rationaleKm: 'វៀចមាត់ ទន់ដៃជើង ឬពិបាកនិយាយភ្លាមៗ ត្រូវការការព្យាបាលសង្គ្រោះក្នុងម៉ោងមាស។',
      rationaleEn: 'Sudden focal neurological deficits require urgent stroke protocol evaluation.',
      urgency: 'emergency'
    });
    rationaleKm = 'សញ្ញាខ្វិន វៀចមាត់ ឬពិបាកនិយាយភ្លាមៗ ជាសញ្ញាអាសន្នប្រព័ន្ធប្រសាទ។';
    rationaleEn = 'Sudden focal neurological signs indicate acute neurological emergency.';
  }

  // D. Neuro Emergency (Thunderclap or severe headache + neck stiffness)
  else if (
    (complaint === 'headache' || complaint.includes('head')) &&
    (state.onset === 'sudden' || state.findings.neckStiffness) &&
    state.severity === 'severe'
  ) {
    redFlags.push('acute_neuro_emergency');
    riskLevel = 'critical';
    urgency = 'emergency';
    possibleConditions.push({
      nameKm: 'ជំងឺរលាកស្រោមខួរ ឬហូរឈាមស្រោមខួរក្បាល',
      nameEn: 'Meningitis / Subarachnoid Hemorrhage',
      category: 'neurological',
      rationaleKm: 'ឈឺក្បាលខ្លាំងភ្លាមៗ ឬរួមជាមួយរឹងកញ្ចឹងក ត្រូវការការពិនិត្យស្កែនបន្ទាន់។',
      rationaleEn: 'Sudden severe headache or nuchal rigidity requires emergency neuro-imaging.',
      urgency: 'emergency'
    });
    rationaleKm = 'ការឈឺក្បាលខ្លាំងភ្លាមៗ ឬរួមជាមួយរឹងកញ្ចឹងក ត្រូវការការពិនិត្យបន្ទាន់។';
    rationaleEn = 'Severe acute headache with meningeal signs requires emergency evaluation.';
  }

  // E. Severe Respiratory Distress
  else if (state.findings.shortnessOfBreath && state.severity === 'severe') {
    redFlags.push('acute_respiratory_distress');
    riskLevel = 'critical';
    urgency = 'emergency';
  }

  // =========================================================================
  // HIGH-RISK PRESENTATIONS (Urgent Medical Evaluation)
  // =========================================================================
  if (urgency !== 'emergency') {
    const isRLQ = state.location.includes('right_lower_abdomen');
    const hasPeritonealSigns =
      state.findings.painOnRelease ||
      state.findings.painWithMovement ||
      state.findings.rigidAbdomen;
    const hasInfectionSigns =
      state.associatedSymptoms.includes('fever') ||
      state.associatedSymptoms.includes('nausea') ||
      state.associatedSymptoms.includes('vomiting');

    // A. High-Risk Abdominal Presentation
    if (isRLQ && (hasPeritonealSigns || (hasInfectionSigns && state.severity === 'severe'))) {
      riskLevel = 'high';
      urgency = 'urgent';
      redFlags.push('high_risk_rlq_abdomen');
      possibleConditions.push(
        {
          nameKm: 'រលាកខ្នែងពោះវៀនស្រួចស្រាវ',
          nameEn: 'Acute Appendicitis',
          category: 'gastrointestinal_surgical',
          rationaleKm: 'ការឈឺពោះខាងស្តាំក្រោមរួមជាមួយក្តៅខ្លួន ចង្អោរ ឬឈឺពេលបញ្ចេញដៃ គឺជាមូលហេតុមួយដែលគ្រូពេទ្យត្រូវពិនិត្យដំបូង។',
          rationaleEn: 'Right lower abdominal tenderness with fever or rebound sign is a key differential requiring surgical evaluation.',
          urgency: 'urgent'
        },
        {
          nameKm: 'រលាកក្រពេញទឹករងៃពោះវៀន ឬការរលាកពោះវៀន',
          nameEn: 'Mesenteric Adenitis / Enteritis',
          category: 'gastrointestinal',
          rationaleKm: 'ការឆ្លងមេរោគក្នុងពោះវៀនក៏អាចបង្កឱ្យមានការឈឺពោះ និងក្តៅខ្លួនផងដែរ។',
          rationaleEn: 'Intestinal viral or bacterial infection can present with focal lower abdominal inflammation.',
          urgency: 'urgent'
        }
      );
      rationaleKm = 'រោគសញ្ញារបស់អ្នកមានសញ្ញាដែលគួរឱ្យប្រុងប្រយ័ត្ន ដូចជាការឈឺខ្លាំងនៅពោះខាងស្តាំក្រោម ក្តៅខ្លួន និងការឈឺខ្លាំងពេលចុច ឬបញ្ចេញដៃ។';
      rationaleEn = 'High-risk abdominal presentation with right lower quadrant tenderness and systemic signs.';
    }

    // B. Severe Headache with Visual Changes
    else if (
      (complaint === 'headache' || complaint.includes('head')) &&
      (state.severity === 'severe' || state.findings.visualDisturbance)
    ) {
      riskLevel = 'high';
      urgency = 'urgent';
      possibleConditions.push(
        {
          nameKm: 'ជំងឺប្រកាំងធ្ងន់ធ្ងរ',
          nameEn: 'Severe Migraine with Aura',
          category: 'neurological',
          rationaleKm: 'ការឈឺក្បាលខ្លាំងរួមជាមួយការស្រវាំងភ្នែកជាសញ្ញានៃជំងឺប្រកាំង។',
          rationaleEn: 'Severe throbbing head pain with visual disturbances characteristic of complex migraine.',
          urgency: 'urgent'
        }
      );
      rationaleKm = 'ការឈឺក្បាលកម្រិតធ្ងន់ធ្ងររួមជាមួយការស្រវាំងភ្នែក គួរទទួលបានការពិនិត្យ។';
      rationaleEn = 'Severe headache accompanied by visual disturbances warrants medical evaluation.';
    }

    // C. Respiratory Compromise
    else if (
      (complaint === 'cough' || state.symptoms.includes('cough') || state.associatedSymptoms.includes('cough')) &&
      (state.findings.shortnessOfBreath || state.associatedSymptoms.includes('shortness_of_breath'))
    ) {
      riskLevel = 'high';
      urgency = 'urgent';
      redFlags.push('respiratory_compromise');
      possibleConditions.push({
        nameKm: 'ការសង្ស័យរលាកទងសួត ឬរលាកសួត',
        nameEn: 'Acute Bronchitis / Suspected Pneumonia',
        category: 'respiratory',
        rationaleKm: 'ក្អកមានក្តៅខ្លួន និងពិបាកដកដង្ហើម អាចជាសញ្ញានៃការរលាកសួតដែលត្រូវទៅពិនិត្យផ្ទាល់។',
        rationaleEn: 'Cough with dyspnea and fever warrants clinical auscultation and evaluation.',
        urgency: 'urgent'
      });
      rationaleKm = 'ការក្អុកនិងពិបាកដកដង្ហើម ត្រូវការការពិនិត្យសួតដោយគ្រូពេទ្យ។';
      rationaleEn = 'Cough with shortness of breath requires in-person medical evaluation.';
    }

    // D. Diarrhea with Blood or High Fever
    else if (
      complaint === 'diarrhea' &&
      (state.findings.bloodInStool || state.associatedSymptoms.includes('fever'))
    ) {
      riskLevel = 'high';
      urgency = 'urgent';
      possibleConditions.push({
        nameKm: 'ជំងឺរាកមួល ឬការឆ្លងមេរោគបាក់តេរីក្នុងពោះវៀន',
        nameEn: 'Invasive Bacterial Enteritis / Dysentery',
        category: 'infectious_gastro',
        rationaleKm: 'រាករួមជាមួយក្តៅខ្លួន ឬមានឈាម អាចជាការឆ្លងមេរោគបាក់តេរី។',
        rationaleEn: 'Febrile or bloody diarrhea suggests invasive enteropathogenic infection.',
        urgency: 'urgent'
      });
    }

    // E. Limb / Extremity Pain (Arms, Legs)
    else if (
      complaint === 'limb_pain' ||
      complaint === 'joint_pain' ||
      state.location.includes('arm') ||
      state.location.includes('leg')
    ) {
      // Limb pain without focal stroke or cardiac red flags is SOON / ROUTINE
      riskLevel = state.severity === 'severe' ? 'moderate' : 'low';
      urgency = state.severity === 'severe' ? 'soon' : 'routine';
      possibleConditions.push(
        {
          nameKm: 'ការចុកស្រពន់ ឬរមួលសាច់ដុំ/សរសៃ',
          nameEn: 'Muscle Fatigue / Myalgia / Cramps',
          category: 'musculoskeletal',
          rationaleKm: 'ការចុកដៃចុកជើងភាគច្រើនបណ្តាលមកពីការធ្វើការធ្ងន់ ខ្វះជាតិរ៉ែ (អេឡិចត្រូលីត) ឬការអស់កម្លាំង។',
          rationaleEn: 'Limb and muscle aches typically stem from physical overexertion or electrolyte depletion.',
          urgency: 'soon'
        },
        {
          nameKm: 'ការរលាកសន្លាក់ ឬការឆ្លងវីរុស',
          nameEn: 'Viral Myalgia / Arthralgia',
          category: 'musculoskeletal',
          rationaleKm: 'ការឈឺចុកដៃជើងអាចកើតមានផងដែរពេលឆ្លងមេរោគផ្តាសាយ ឬគ្រុនក្តៅ។',
          rationaleEn: 'Generalized body and limb aches associated with viral syndromes.',
          urgency: 'routine'
        }
      );
      rationaleKm = 'ការចុកដៃចុកជើងកម្រិតមធ្យមទៅខ្លាំង ដែលត្រូវការការពិនិត្យមើលសញ្ញារួមផ្សំ (ដូចជា ភាពស្ពឹក ឬខ្សោយកម្លាំង)។';
      rationaleEn = 'Limb aches requiring evaluation of associated neurological and physical factors.';
    }

    // F. Moderate Epigastric Pain / Gastritis
    else if (state.location.includes('epigastric') || state.timing === 'after_eating') {
      riskLevel = 'moderate';
      urgency = 'soon';
      possibleConditions.push({
        nameKm: 'ការរលាកភ្នាសក្រពះ ឬច្រាលអាស៊ីត',
        nameEn: 'Gastritis / Gastroesophageal Reflux (GERD)',
        category: 'gastrointestinal',
        rationaleKm: 'ការឈឺចុកចុងដង្ហើមក្រោយញ៉ាំអាហារ ភាគច្រើនបណ្តាលមកពីការរលាកក្រពះ ឬអាស៊ីតច្រាល។',
        rationaleEn: 'Postprandial upper abdominal discomfort is commonly linked to gastritis or acid reflux.',
        urgency: 'soon'
      });
      rationaleKm = 'រោគសញ្ញាសមស្របនឹងការរលាកក្រពះ ឬច្រាលអាស៊ីតបឋម។';
      rationaleEn = 'Symptoms consistent with uncomplicated gastritis or acid reflux.';
    }
  }

  // =========================================================================
  // ACTIONS GENERATION
  // =========================================================================
  let facilities: HealthcareFacility[] = [];

  if (urgency === 'emergency') {
    facilities = getEmergencyHospitals(3);
    suggestedActions.push(
      {
        type: 'call_119',
        labelKm: '📞 ហៅទូរស័ព្ទសង្គ្រោះបន្ទាន់ 119',
        labelEn: '📞 Call 119 Emergency',
        link: 'tel:119'
      },
      {
        type: 'find_facilities',
        labelKm: '🏥 មន្ទីរពេទ្យសង្គ្រោះបន្ទាន់ជិតបំផុត',
        labelEn: '🏥 Nearest Emergency Hospital',
        link: '/facilities'
      }
    );
  } else if (urgency === 'urgent') {
    facilities = getEmergencyHospitals(2);
    suggestedActions.push({
      type: 'find_facilities',
      labelKm: '🏥 ស្វែងរកមន្ទីរពេទ្យពិគ្រោះបន្ទាន់',
      labelEn: '🏥 Find Hospital for Urgent Check',
      link: '/facilities'
    });
  } else if (urgency === 'soon') {
    suggestedActions.push({
      type: 'find_facilities',
      labelKm: '🏥 ស្វែងរកគ្លីនិក ឬមន្ទីរពេទ្យជិតបំផុត',
      labelEn: '🏥 Find Nearby Clinic / Hospital',
      link: '/facilities'
    });
  }

  const triageMap: Record<UrgencyLevel, 'emergency' | 'urgent' | 'routine' | 'info'> = {
    emergency: 'emergency',
    urgent: 'urgent',
    soon: 'routine',
    routine: 'routine',
    none: 'info',
    unknown: 'info'
  };

  return {
    riskLevel,
    urgency,
    triageLevel: triageMap[urgency],
    isEmergency: urgency === 'emergency',
    isUrgent: urgency === 'urgent',
    redFlags,
    possibleConditions,
    recommendedFacilities: facilities,
    suggestedActions,
    clinicalRationaleKm: rationaleKm || 'ការវាយតម្លៃសុខភាពបឋម។',
    clinicalRationaleEn: rationaleEn || 'Initial clinical risk assessment.'
  };
}

// Backward compatibility alias
export const evaluateClinicalRisk = assessClinicalRisk;
