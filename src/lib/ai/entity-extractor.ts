import {
  GeneralizedClinicalState,
  UserIntent,
  ClinicalFindings,
  ClinicalMeasurements
} from '@/types/symptomState';
import { normalizeMedicalText } from './normalization';

export interface ExtractedClinicalEntities {
  rawText: string;
  intent: UserIntent;
  confidence: number;
  chiefComplaint?: string;
  symptoms: string[];
  location: string[];
  severity?: 'mild' | 'moderate' | 'severe' | 'critical';
  worsening?: boolean;
  overallCondition?: string;
  onset?: 'sudden' | 'gradual';
  duration?: string;
  timing?: string;
  triggers: string[];
  relievingFactors: string[];
  positiveSymptoms: string[];
  negativeSymptoms: string[];
  findings: ClinicalFindings;
  measurements: ClinicalMeasurements;
  isPediatric?: boolean;
  isPregnant?: boolean;
}

export function extractClinicalEntities(
  rawMessage: string,
  existingState?: GeneralizedClinicalState
): ExtractedClinicalEntities {
  const normalized = normalizeMedicalText(rawMessage);
  const text = normalized.toLowerCase().trim();

  const extracted: ExtractedClinicalEntities = {
    rawText: rawMessage,
    intent: 'unknown',
    confidence: 0.9,
    symptoms: [],
    location: [],
    triggers: [],
    relievingFactors: [],
    positiveSymptoms: [],
    negativeSymptoms: [],
    findings: {},
    measurements: {}
  };

  // =========================================================================
  // 1. EXPLICIT INTENT CLASSIFICATION
  // =========================================================================
  const isGreetingWord =
    text === 'hi' ||
    text === 'hello' ||
    text === 'hey' ||
    text === 'good morning' ||
    text === 'good afternoon' ||
    text === 'good evening' ||
    text === 'សួស្តី' ||
    text === 'ជំរាបសួរ' ||
    text === 'ជម្រាបសួរ' ||
    text === 'សួស្ដី' ||
    text === 'សួស្តីបាទ' ||
    text === 'សួស្តីចាស' ||
    text === 'who are you' ||
    text === 'តើអ្នកជានរណា';

  const isThanksWord =
    text === 'thanks' ||
    text === 'thank you' ||
    text === 'bye' ||
    text === 'goodbye' ||
    text === 'ok thanks' ||
    text === 'ok thank you' ||
    text === 'អរគុណ' ||
    text === 'អរគុណច្រើន' ||
    text === 'លាហើយ' ||
    text === 'អរគុណបាទ' ||
    text === 'អរគុណចាស';

  const isFacilitySearchWord =
    (text.includes('ពេទ្យ') || text.includes('មន្ទីរពេទ្យ') || text.includes('hospital') || text.includes('clinic') || text.includes('គ្លីនិក')) &&
    (text.includes('រក') || text.includes('នៅណា') || text.includes('ជិត') || text.includes('find') || text.includes('where') || text.includes('near') || text.includes('ស្វែងរក'));

  const isMedicationQuestion =
    (text.includes('ថ្នាំ') || text.includes('medicine') || text.includes('pill') || text.includes('drug')) &&
    (text.includes('របៀបលេប') || text.includes('លេបយ៉ាងម៉េច') || text.includes('how to take') || text.includes('dosage') || text.includes('កម្រិត'));

  const isHealthQuestion =
    (text.startsWith('តើ') && (text.includes('ជាអ្វី') || text.includes('របៀប') || text.includes('ការពារ'))) ||
    text.startsWith('what is') ||
    text.startsWith('how to prevent');

  const containsConditionOrSymptomMarkers =
    text.includes('sick') ||
    text.includes('unwell') ||
    text.includes('terrible') ||
    text.includes('awful') ||
    text.includes('worse') ||
    text.includes('worsening') ||
    text.includes('better') ||
    text.includes('improving') ||
    text.includes('bad') ||
    text.includes('pain') ||
    text.includes('ache') ||
    text.includes('fever') ||
    text.includes('cough') ||
    text.includes('chest') ||
    text.includes('heart') ||
    text.includes('stomach') ||
    text.includes('head') ||
    text.includes('arm') ||
    text.includes('leg') ||
    text.includes('throat') ||
    text.includes('ឈឺ') ||
    text.includes('ចុក') ||
    text.includes('ណែន') ||
    text.includes('ទ្រូង') ||
    text.includes('ក្បាល') ||
    text.includes('ពោះ') ||
    text.includes('ដៃ') ||
    text.includes('ជើង') ||
    text.includes('មិនស្រួល') ||
    text.includes('កាន់តែ') ||
    text.includes('ជាងមុន') ||
    text.includes('ខ្លាំង') ||
    text.includes('ធ្ងន់') ||
    text.includes('ស្រវាំង') ||
    text.includes('រឹងក') ||
    text.includes('ស្ពឹក') ||
    text.includes('ក្តៅ') ||
    text.includes('ថ្ងៃ') ||
    text.includes('day') ||
    text.includes('yes') ||
    text.includes('no') ||
    text.includes('បាទ') ||
    text.includes('ចាស') ||
    text.includes('មាន') ||
    text.includes('គ្មាន') ||
    text.includes('មិនមាន') ||
    text.includes('អត់');

  if (isGreetingWord) {
    extracted.intent = 'greeting';
    extracted.confidence = 0.98;
    return extracted;
  }

  if (isThanksWord) {
    extracted.intent = 'thanks';
    extracted.confidence = 0.98;
    return extracted;
  }

  if (isFacilitySearchWord) {
    extracted.intent = 'facility_search';
    extracted.confidence = 0.95;
    return extracted;
  }

  if (isMedicationQuestion) {
    extracted.intent = 'medication_question';
    extracted.confidence = 0.9;
  } else if (isHealthQuestion) {
    extracted.intent = 'health_question';
    extracted.confidence = 0.88;
  } else if (existingState && existingState.chiefComplaint && containsConditionOrSymptomMarkers) {
    extracted.intent = 'follow_up_symptom';
    extracted.confidence = 0.95;
  } else if (containsConditionOrSymptomMarkers) {
    extracted.intent = 'symptom_consultation';
    extracted.confidence = 0.92;
  } else if (existingState && existingState.chiefComplaint) {
    extracted.intent = 'follow_up_symptom';
    extracted.confidence = 0.8;
  } else {
    extracted.intent = 'unknown';
    extracted.confidence = 0.5;
    return extracted;
  }

  // =========================================================================
  // 2. SEVERITY, WORSENING & OVERALL CONDITION EXTRACTION
  // =========================================================================
  if (
    text.includes('ខ្លាំង') ||
    text.includes('severe') ||
    text.includes('very very sick') ||
    text.includes('very sick') ||
    text.includes('extremely') ||
    text.includes('terrible') ||
    text.includes('awful') ||
    text.includes('really bad') ||
    text.includes('unbearable') ||
    text.includes('so bad') ||
    text.includes('feel bad') ||
    text.includes('feel terrible') ||
    text.includes('feel awful') ||
    text.includes('មិនស្រួលខ្លួនខ្លាំង') ||
    text.includes('អស់កម្លាំងខ្លាំង') ||
    text.includes('ធ្ងន់ណាស់') ||
    text.includes('ទ្រាំមិនបាន') ||
    text.includes('ធ្ងន់')
  ) {
    extracted.severity = 'severe';
    if (
      text.includes('sick') ||
      text.includes('មិនស្រួល') ||
      text.includes('terrible') ||
      text.includes('awful') ||
      text.includes('feel') ||
      text.includes('bad')
    ) {
      extracted.overallCondition = 'very_unwell';
    }
  } else if (
    text.includes('sick') ||
    text.includes('unwell') ||
    text.includes('មិនស្រួលខ្លួន') ||
    text.includes('មិនសូវស្រួល') ||
    text.includes('ស្រៀវស្រាញ')
  ) {
    extracted.overallCondition = 'unwell';
  }

  if (
    text.includes('getting worse') ||
    text.includes('worsening') ||
    text.includes('worse') ||
    text.includes('កាន់តែឈឺ') ||
    text.includes('ឈឺជាងមុន') ||
    text.includes('កាន់តែខ្លាំង') ||
    text.includes('កាន់តែមិនស្រួល')
  ) {
    extracted.severity = 'severe';
    extracted.worsening = true;
    extracted.overallCondition = 'very_unwell';
  } else if (
    text.includes('better') ||
    text.includes('improving') ||
    text.includes('ធូរស្រាល') ||
    text.includes('បានធូរ') ||
    text.includes('ស្រាលជាងមុន')
  ) {
    extracted.severity = 'mild';
    extracted.overallCondition = 'improving';
  } else if (
    text.includes('មធ្យម') ||
    text.includes('moderate') ||
    text.includes('ល្មម')
  ) {
    extracted.severity = 'moderate';
    extracted.overallCondition = 'unwell';
  } else if (
    text.includes('តិចតួច') ||
    text.includes('ស្រាល') ||
    text.includes('mild') ||
    text.includes('slight') ||
    text.includes('a little')
  ) {
    extracted.severity = 'mild';
    extracted.overallCondition = 'mild_discomfort';
  }

  // =========================================================================
  // 3. NEGATIVE FINDINGS (Denials: "មិនមាន...", "អត់...", "no...", "denies...")
  // =========================================================================
  const checkNegative = (termKm: string[], termEn: string[]): boolean => {
    return (
      termKm.some((t) =>
        text.includes(`មិន${t}`) ||
        text.includes(`មិនមាន${t}`) ||
        text.includes(`អត់${t}`) ||
        text.includes(`គ្មាន${t}`) ||
        text.includes(`មិនសូវ${t}`) ||
        text.includes(`តែមិន${t}`)
      ) ||
      termEn.some((t) =>
        text.includes(`no ${t}`) ||
        text.includes(`without ${t}`) ||
        text.includes(`not have ${t}`) ||
        text.includes(`denies ${t}`) ||
        text.includes(`no severe ${t}`) ||
        text.includes(`dont have ${t}`) ||
        text.includes(`don't have ${t}`)
      )
    );
  };

  if (checkNegative(['ក្តៅខ្លួន', 'គ្រុន', 'ក្តៅ'], ['fever', 'high fever', 'hot'])) {
    extracted.negativeSymptoms.push('fever');
  }
  if (checkNegative(['ស្រវាំងភ្នែក', 'ព្រិលភ្នែក', 'ស្រវាំង'], ['blurry vision', 'visual changes', 'blurred vision', 'aura'])) {
    extracted.negativeSymptoms.push('visual_disturbance');
  }
  if (checkNegative(['រឹងក', 'រឹងកញ្ចឹងក'], ['stiff neck', 'neck stiffness'])) {
    extracted.negativeSymptoms.push('stiff_neck');
  }
  if (checkNegative(['ក្អួត', 'ក្អួតចង្អោរ', 'ក្អួតខ្លាំង'], ['vomiting', 'severe vomiting', 'vomit'])) {
    extracted.negativeSymptoms.push('vomiting');
  }
  if (checkNegative(['រាក', 'រាករូស'], ['diarrhea', 'loose stools'])) {
    extracted.negativeSymptoms.push('diarrhea');
  }
  if (checkNegative(['ក្អួតឈាម', 'ក្អួតមានឈាម'], ['vomiting blood', 'blood in vomit'])) {
    extracted.negativeSymptoms.push('vomiting_blood');
  }
  if (checkNegative(['លាមកខ្មៅ', 'បន្ទោរបង់ពណ៌ខ្មៅ'], ['black stool', 'tarry stool', 'melena'])) {
    extracted.negativeSymptoms.push('black_stool');
  }
  if (checkNegative(['ឈាមក្នុងលាមក', 'លាមកមានឈាម'], ['blood in stool', 'rectal bleeding'])) {
    extracted.negativeSymptoms.push('blood_in_stool');
  }
  if (checkNegative(['ណែនទ្រូង', 'ឈឺទ្រូង', 'ចុកទ្រូង'], ['chest pain', 'chest tightness'])) {
    extracted.negativeSymptoms.push('chest_pain');
  }
  if (checkNegative(['ពិបាកដកដង្ហើម', 'ហត់'], ['shortness of breath', 'breathlessness'])) {
    extracted.negativeSymptoms.push('shortness_of_breath');
  }
  if (checkNegative(['ស្ពឹក', 'ទន់ដៃជើង'], ['numbness', 'weakness'])) {
    extracted.negativeSymptoms.push('weakness_numbness');
  }

  // =========================================================================
  // 4. POSITIVE ASSOCIATED SYMPTOMS & CLINICAL FINDINGS
  // =========================================================================
  if (!extracted.negativeSymptoms.includes('visual_disturbance')) {
    if (
      text.includes('ស្រវាំងភ្នែក') ||
      text.includes('ព្រិលភ្នែក') ||
      text.includes('ស្រវាំង') ||
      text.includes('blurry vision') ||
      text.includes('visual changes') ||
      text.includes('blurred vision') ||
      text.includes('aura')
    ) {
      extracted.positiveSymptoms.push('visual_disturbance');
      extracted.findings.visualDisturbance = true;
    }
  }

  if (!extracted.negativeSymptoms.includes('fever')) {
    if (
      text.includes('ក្តៅខ្លួន') ||
      text.includes('គ្រុន') ||
      text.includes('fever') ||
      text.includes('temperature') ||
      text.includes('៣៨') ||
      text.includes('38') ||
      text.includes('39')
    ) {
      extracted.positiveSymptoms.push('fever');
      extracted.symptoms.push('fever');
      if (!extracted.chiefComplaint) extracted.chiefComplaint = 'fever';
    }
  }

  if (!extracted.negativeSymptoms.includes('stiff_neck')) {
    if (
      text.includes('រឹងក') ||
      text.includes('រឹងកញ្ចឹងក') ||
      text.includes('stiff neck') ||
      text.includes('neck stiffness')
    ) {
      extracted.positiveSymptoms.push('stiff_neck');
      extracted.findings.neckStiffness = true;
    }
  }

  if (!extracted.negativeSymptoms.includes('vomiting')) {
    if (text.includes('ចង្អោរ') || text.includes('nausea')) {
      extracted.positiveSymptoms.push('nausea');
    }
    if (text.includes('ក្អួត') || text.includes('vomiting') || text.includes('vomit')) {
      extracted.positiveSymptoms.push('vomiting');
      extracted.symptoms.push('vomiting');
    }
  }

  if (!extracted.negativeSymptoms.includes('shortness_of_breath')) {
    if (
      text.includes('ហត់') ||
      text.includes('ពិបាកដកដង្ហើម') ||
      text.includes('shortness of breath') ||
      text.includes('breathless') ||
      text.includes('cannot breathe')
    ) {
      extracted.positiveSymptoms.push('shortness_of_breath');
      extracted.findings.shortnessOfBreath = true;
    }
  }

  if (
    text.includes('បែកញើស') ||
    text.includes('ញើសត្រជាក់') ||
    text.includes('ញើសច្រើន') ||
    text.includes('sweating') ||
    text.includes('sweaty') ||
    text.includes('diaphoresis')
  ) {
    extracted.findings.sweating = true;
    extracted.positiveSymptoms.push('sweating');
  }

  if (
    text.includes('ចុចហើយលែង') ||
    text.includes('បញ្ចេញដៃ') ||
    text.includes('លែងដៃ') ||
    text.includes('rebound') ||
    text.includes('pain on release')
  ) {
    extracted.findings.painOnRelease = true;
    extracted.findings.painOnPressure = true;
  }

  // =========================================================================
  // 5. BODY PARTS & LOCATIONS EXTRACTION
  // =========================================================================
  // Chest
  if (
    text.includes('ឈឺទ្រូង') ||
    text.includes('ចុកទ្រូង') ||
    text.includes('ណែនទ្រូង') ||
    text.includes('សង្កត់ទ្រូង') ||
    text.includes('ទ្រូង') ||
    text.includes('chest') ||
    text.includes('heart pain')
  ) {
    const isLeft = text.includes('ឆ្វេង') || text.includes('left');
    const loc = isLeft ? 'chest_left' : 'chest_central';
    extracted.location.push(loc);
    extracted.chiefComplaint = 'chest_pain';
    extracted.symptoms.push('chest_pain');
  }

  // Head
  if (text.includes('មួយចំហៀង') || text.includes('one side') || text.includes('one sided') || text.includes('unilateral')) {
    extracted.location.push('head_one_sided');
  }
  if (
    text.includes('ឈឺក្បាល') ||
    text.includes('ប្រកាំង') ||
    text.includes('headache') ||
    text.includes('migraine') ||
    text.includes('head pain')
  ) {
    if (!extracted.chiefComplaint) extracted.chiefComplaint = 'headache';
    extracted.symptoms.push('headache');
  }

  // Abdomen
  if (
    text.includes('ស្តាំក្រោម') ||
    text.includes('ក្រោមស្តាំ') ||
    text.includes('ខាងស្តាំក្រោម') ||
    text.includes('ខាងស្តាំ') ||
    text.includes('ពោះស្តាំ') ||
    text.includes('right lower')
  ) {
    extracted.location.push('right_lower_abdomen');
    if (!extracted.chiefComplaint) extracted.chiefComplaint = 'abdominal_pain';
  }

  if (
    text.includes('ចុងដង្ហើម') ||
    text.includes('epigastric') ||
    text.includes('upper stomach') ||
    text.includes('ក្រហាយចុងដង្ហើម')
  ) {
    extracted.location.push('epigastric');
    if (!extracted.chiefComplaint) extracted.chiefComplaint = 'abdominal_pain';
  }

  if (
    text.includes('ចុកពោះ') ||
    text.includes('ឈឺពោះ') ||
    text.includes('stomachache') ||
    text.includes('stomach pain') ||
    text.includes('abdominal pain')
  ) {
    if (!extracted.chiefComplaint) extracted.chiefComplaint = 'abdominal_pain';
    extracted.symptoms.push('abdominal_pain');
  }

  // Limbs
  if (text.includes('ចុកដៃ') || text.includes('ឈឺដៃ') || text.includes('ដៃ') || text.includes('arm')) {
    extracted.location.push('arm');
    if (!extracted.chiefComplaint) extracted.chiefComplaint = 'limb_pain';
    extracted.symptoms.push('arm_pain');
  }
  if (text.includes('ចុកជើង') || text.includes('ឈឺជើង') || text.includes('ជើង') || text.includes('leg')) {
    extracted.location.push('leg');
    if (!extracted.chiefComplaint) extracted.chiefComplaint = 'limb_pain';
    extracted.symptoms.push('leg_pain');
  }

  // Onset & Duration (Supporting spaced & unspaced formats like "៣ថ្ងៃ", "3ថ្ងៃ", "3 ថ្ងៃ", "3 days")
  if (text.includes('ភ្លាមៗ') || text.includes('sudden') || text.includes('thunderclap')) {
    extracted.onset = 'sudden';
  } else if (text.includes('បន្តិចម្តងៗ') || text.includes('gradual')) {
    extracted.onset = 'gradual';
  }

  if (text.includes('១ ថ្ងៃ') || text.includes('1 ថ្ងៃ') || text.includes('១ថ្ងៃ') || text.includes('1ថ្ងៃ') || text.includes('1 day') || text.includes('1day')) {
    extracted.duration = '1_day';
  } else if (
    text.includes('២ ថ្ងៃ') ||
    text.includes('2 ថ្ងៃ') ||
    text.includes('២ថ្ងៃ') ||
    text.includes('2ថ្ងៃ') ||
    text.includes('៣ ថ្ងៃ') ||
    text.includes('3 ថ្ងៃ') ||
    text.includes('៣ថ្ងៃ') ||
    text.includes('3ថ្ងៃ') ||
    text.includes('2 days') ||
    text.includes('3 days') ||
    text.includes('2-3 days')
  ) {
    extracted.duration = '2_3_days';
  } else if (text.includes('សប្តាហ៍') || text.includes('week') || text.includes('weeks')) {
    extracted.duration = 'over_a_week';
  }

  return extracted;
}
