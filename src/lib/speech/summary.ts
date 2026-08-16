import { HeartDiseasePredictionResult } from '@/types/prediction';
import { GeneralDiseaseResponse } from '@/types/generalDisease';

/**
 * Generate human-friendly spoken summary for Heart Disease Prediction
 */
export function generateHeartSpokenSummary(
  result: HeartDiseasePredictionResult,
  language: 'en' | 'km' = 'km'
): string {
  const pct = Math.round(result.probability * 100);
  const isKm = language === 'km';
  const risk = result.riskLevel;

  if (isKm) {
    let riskKm = 'កម្រិតទាប';
    let advice = 'សូមបន្តរក្សារបៀបរស់នៅប្រកបដោយសុខភាពល្អ និងហាត់ប្រាណជាប្រចាំ។';

    if (risk === 'High') {
      riskKm = 'កម្រិតខ្ពស់';
      advice = 'សញ្ញាបង្ហាញហានិភ័យខ្ពស់នៃជំងឺបេះដូង។ សូមប្រញាប់ទៅជួបវេជ្ជបណ្ឌិតឯកទេសបេះដូង ឬហៅទូរស័ព្ទទៅ 119 ជាបន្ទាន់!';
    } else if (risk === 'Moderate') {
      riskKm = 'កម្រិតមធ្យម';
      advice = 'សូមណាត់ជួបវេជ្ជបណ្ឌិតដើម្បីតាមដានសម្ពាធឈាម និងជាតិខ្លាញ់ក្នុងឈាម។';
    }

    return `ហានិភ័យជំងឺបេះដូងរបស់អ្នកគឺ ${pct} ភាគរយ ដែលស្ថិតក្នុង${riskKm}។ ${advice}`;
  } else {
    let advice = 'It is recommended to maintain a heart-healthy lifestyle and regular exercise.';

    if (risk === 'High') {
      advice = 'High risk of coronary artery disease detected. Please consult a cardiologist immediately or call emergency 119 if experiencing acute chest pain!';
    } else if (risk === 'Moderate') {
      advice = 'Consider scheduling a consultation with a physician to monitor blood pressure and cholesterol.';
    }

    return `Your heart disease risk is ${pct} percent, which is categorized as ${risk} risk. ${advice}`;
  }
}

/**
 * Generate human-friendly spoken summary for General Disease Triage
 */
export function generateGeneralDiseaseSpokenSummary(
  result: GeneralDiseaseResponse,
  language: 'en' | 'km' = 'km'
): string {
  const isKm = language === 'km';
  const topConditions = result.possibleConditions.slice(0, 2);
  const conditionNames = isKm
    ? topConditions.map((c) => c.nameKm).join(' ឬ ')
    : topConditions.map((c) => c.nameEn).join(' or ');

  const hasRedFlags = result.redFlags && result.redFlags.length > 0;

  if (isKm) {
    let urgencyKm = 'ថែទាំខ្លួនឯងនៅផ្ទះ';
    let nextStep = 'សូមសម្រាក និងពិសាទឹកឱ្យបានគ្រប់គ្រាន់។';

    if (result.overallUrgency === 'emergency') {
      urgencyKm = 'ស្ថានភាពអាសន្នបន្ទាន់';
      nextStep = 'សូមប្រញាប់ទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់នៃមន្ទីរពេទ្យដែលនៅជិតបំផុត ឬហៅ 119 ភ្លាមៗ!';
    } else if (result.overallUrgency === 'urgent') {
      urgencyKm = 'គួរទៅពិនិត្យសុខភាពឆាប់ៗ';
      nextStep = 'សូមទៅជួបវេជ្ជបណ្ឌិតនៅមន្ទីរពេទ្យ ឬមណ្ឌលសុខភាពក្នុងរយៈពេល ២៤ ម៉ោង។';
    } else if (result.overallUrgency === 'see_doctor') {
      urgencyKm = 'គួរជួបពិគ្រោះជាមួយគ្រូពេទ្យ';
      nextStep = 'សូមណាត់ជួបពិគ្រោះជាមួយគ្រូពេទ្យដើម្បីធ្វើតេស្ត និងព្យាបាលត្រឹមត្រូវ។';
    }

    let summary = `ផ្អែកលើរោគសញ្ញារបស់អ្នក ជំងឺដែលអាចកើតមានរួមមាន ${conditionNames || 'រោគសញ្ញាទូទៅ'}។ កម្រិតបន្ទាន់សរុបគឺ ${urgencyKm}។ ${nextStep}`;
    if (hasRedFlags) {
      summary += ' មានសញ្ញាគ្រោះថ្នាក់ក្រើនរំលឹក សូមប្រុងប្រយ័ត្នខ្ពស់។';
    }
    return summary;
  } else {
    let urgencyEn = 'self-care and home monitoring';
    let nextStep = 'Please rest at home, hydrate well, and monitor your symptoms.';

    if (result.overallUrgency === 'emergency') {
      urgencyEn = 'emergency attention required';
      nextStep = 'Please proceed immediately to the nearest emergency room or call 119!';
    } else if (result.overallUrgency === 'urgent') {
      urgencyEn = 'urgent medical evaluation needed';
      nextStep = 'Please see a doctor at a clinic or health center within 24 hours.';
    } else if (result.overallUrgency === 'see_doctor') {
      urgencyEn = 'schedule a doctor consultation';
      nextStep = 'Please consult a physician for proper diagnostic testing and treatment.';
    }

    let summary = `Based on your symptoms, possible conditions include ${conditionNames || 'general viral syndrome'}. Overall urgency is ${urgencyEn}. ${nextStep}`;
    if (hasRedFlags) {
      summary += ' Red flag warnings were detected. If symptoms worsen, seek emergency care immediately.';
    }
    return summary;
  }
}
