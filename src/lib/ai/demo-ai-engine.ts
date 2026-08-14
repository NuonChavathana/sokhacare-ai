import { TriageResult, UrgencyLevel, FacilityType } from '@/types/triage';

export function evaluateDemoTriage(message: string, language: 'km' | 'en' = 'km'): TriageResult {
  const text = message.toLowerCase();

  // 1. RED FLAG EMERGENCY PATTERNS
  const redFlagKeywordsKm = [
    'ឈឺទ្រូង', 'ពិបាកដកដង្ហើម', 'សន្លប់', 'ហូរឈាម', 'ប្រកាច់',
    'ស្ពឹកមួយចំហៀង', 'ប្រតិកម្មធ្ងន់ធ្ងរ', 'គ្រោះថ្នាក់', 'ដកដង្ហើមមិនចង់ចេញ'
  ];
  const redFlagKeywordsEn = [
    'chest pain', 'difficulty breathing', 'shortness of breath', 'unconscious',
    'severe bleeding', 'seizure', 'stroke', 'numbness', 'anaphylaxis', 'choking'
  ];

  const detectedRedFlags: string[] = [];

  redFlagKeywordsKm.forEach((kw) => {
    if (text.includes(kw)) detectedRedFlags.push(kw);
  });
  redFlagKeywordsEn.forEach((kw) => {
    if (text.includes(kw)) detectedRedFlags.push(kw);
  });

  if (detectedRedFlags.length > 0) {
    return {
      urgency: 'EMERGENCY',
      confidence: 0.95,
      summary_km: 'អាការៈរបស់អ្នកបង្ហាញពីសញ្ញាគ្រោះថ្នាក់ដែលត្រូវការការពិនិត្យសង្គ្រោះបន្ទាន់ភ្លាមៗ។',
      summary_en: 'Your symptoms present emergency red flags requiring immediate hospital care.',
      red_flags: detectedRedFlags,
      follow_up_needed: false,
      recommended_facility_type: 'hospital',
      safety_message_km: 'សូមប្រញាប់ទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់នៃមន្ទីរពេទ្យដែលនៅជិតបំផុត ឬហៅទូរស័ព្ទទៅ 119/115 ភ្លាមៗ!',
      safety_message_en: 'Please proceed immediately to the nearest hospital emergency room or call 119/115!'
    };
  }

  // 2. URGENT PATTERNS
  const urgentKeywordsKm = [
    'ក្តៅខ្លួនខ្លាំង', 'គ្រុនក្តៅខ្លាំង', 'ឈឺពោះខ្លាំង', 'អស់កម្លាំងខ្លាំង',
    'ក្អួតខ្លាំង', 'រាកខ្លាំង', 'កូនក្តៅខ្លួនខ្លាំង', 'ឈឺក្បាលខ្លាំង'
  ];
  const urgentKeywordsEn = [
    'high fever', 'severe stomach pain', 'severe abdominal pain', 'severe fatigue',
    'frequent vomiting', 'high fever in child', 'severe headache'
  ];

  const isUrgent = urgentKeywordsKm.some((kw) => text.includes(kw)) || urgentKeywordsEn.some((kw) => text.includes(kw));

  if (isUrgent) {
    return {
      urgency: 'URGENT',
      confidence: 0.88,
      summary_km: 'រោគសញ្ញារបស់អ្នកគួរតែទទួលបានការពិនិត្យ និងពិគ្រោះជាមួយគ្រូពេទ្យក្នុងពេលឆាប់ៗ។',
      summary_en: 'Your symptoms warrant medical evaluation by a healthcare professional soon.',
      red_flags: [],
      follow_up_needed: true,
      follow_up_questions_km: [
        'តើអាការៈនេះកើតឡើងរយៈពេលប៉ុន្មានថ្ងៃហើយ?',
        'តើអ្នកមានប្រើថ្នាំអ្វីខ្លះក្នុងអំឡុងពេលនេះ?'
      ],
      follow_up_questions_en: [
        'How many days have you been experiencing these symptoms?',
        'Have you taken any medications so far?'
      ],
      recommended_facility_type: 'referral_hospital',
      safety_message_km: 'សូមអញ្ជើញទៅពិនិត្យនៅមន្ទីរពេទ្យបង្អែក ឬមណ្ឌលសុខភាពដែលនៅជិតបំផុតក្នុងរយៈពេល ២៤ ម៉ោង។',
      safety_message_en: 'Please visit a referral hospital or health centre for evaluation within 24 hours.'
    };
  }

  // 3. ROUTINE PATTERNS
  const routineKeywordsKm = ['ឈឺក្បាល', 'ក្តៅខ្លួន', 'ផ្តាសាយ', 'ក្អក', 'ឈឺបំពង់ក', 'រាក', 'ឈឺពោះ'];
  const routineKeywordsEn = ['headache', 'fever', 'cold', 'cough', 'sore throat', 'stomach ache', 'diarrhea'];

  const isRoutine = routineKeywordsKm.some((kw) => text.includes(kw)) || routineKeywordsEn.some((kw) => text.includes(kw));

  if (isRoutine) {
    return {
      urgency: 'ROUTINE',
      confidence: 0.84,
      summary_km: 'រោគសញ្ញារបស់អ្នកមើលទៅមិនទាន់មានភាពបន្ទាន់ទេ ប៉ុន្តែគួរទៅពិនិត្យនៅមណ្ឌលសុខភាព ឬគ្លីនិក។',
      summary_en: 'Your symptoms appear routine and can be evaluated at a local health centre or clinic.',
      red_flags: [],
      follow_up_needed: true,
      follow_up_questions_km: [
        'តើអាការៈនេះមានភាពធ្ងន់ធ្ងរកើនឡើងដែរឬទេ?',
        'តើអ្នកមានជំងឺប្រចាំកាយអ្វីដែរឬទេ?'
      ],
      follow_up_questions_en: [
        'Are your symptoms getting progressively worse?',
        'Do you have any existing health conditions?'
      ],
      recommended_facility_type: 'health_centre',
      safety_message_km: 'លោកអ្នកអាចទៅពិគ្រោះជាមួយគ្រូពេទ្យនៅមណ្ឌលសុខភាព ឬគ្លីនិកក្នុងតំបន់តាមពេលវេលាសមស្រប។',
      safety_message_en: 'You can consult a health worker at a local health centre or clinic during regular hours.'
    };
  }

  // 4. DEFAULT SELF-CARE / MONITORING
  return {
    urgency: 'SELF_CARE',
    confidence: 0.78,
    summary_km: 'រោគសញ្ញារបស់អ្នកមានកម្រិតស្រាល។ សូមបន្តតាមដានសុខភាព និងសម្រាកឲ្យបានគ្រប់គ្រាន់។',
    summary_en: 'Your reported symptoms seem mild. Rest and continue monitoring your condition.',
    red_flags: [],
    follow_up_needed: false,
    recommended_facility_type: 'clinic',
    safety_message_km: 'ប្រសិនបើរោគសញ្ញាមិនធូរស្រាល ឬប្រែជាធ្ងន់ធ្ងរជាងមុន សូមប្រញាប់ទៅជួបគ្រូពេទ្យ។',
    safety_message_en: 'If symptoms persist or worsen, please seek guidance from a qualified healthcare facility.'
  };
}
