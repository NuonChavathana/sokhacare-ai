import { GeneralizedClinicalState } from '@/types/symptomState';
import { GeneralizedRiskAssessment } from './risk-assessor';

export interface GeneratedClinicalResponse {
  content: string;
  quickReplies: string[];
}

/**
 * Context-aware clinical response synthesizer.
 * Answers: "What new information did the user just provide about the existing conversation?"
 * Acknowledges incremental facts, never repeats previous responses verbatim,
 * and formulates next actions based strictly on remaining pending questions.
 */
export function generateGeneralizedClinicalResponse(
  state: GeneralizedClinicalState,
  risk: GeneralizedRiskAssessment,
  language: 'km' | 'en' = 'km',
  latestUserText: string = ''
): GeneratedClinicalResponse {
  const isKm = language === 'km';
  const complaint = state.chiefComplaint || (state.symptoms.length > 0 ? state.symptoms[0] : '');

  // =========================================================================
  // 1. GREETING INTENT
  // =========================================================================
  if (state.intent === 'greeting') {
    return {
      content: isKm
        ? `សួស្តី! 👋 ខ្ញុំជា **SokhaCare AI** - ជំនួយការសុខភាពឆ្លាតវៃប្រចាំកម្ពុជា។

តើខ្ញុំអាចជួយអ្នកអំពីរោគសញ្ញា សុខភាព ឬស្វែងរកមន្ទីរពេទ្យបានយ៉ាងដូចម្តេចដែរនៅថ្ងៃនេះ?

លោកអ្នកអាច៖
- 📝 **រៀបរាប់ពីរោគសញ្ញា** (ឧ. "ខ្ញុំចុកពោះ", "ចុកដៃចុកជើង", "ឈឺទ្រូង", "ឈឺក្បាល"...)
- 🎙️ **និយាយជាសំឡេង** តាមរយៈប៊ូតុងមីក្រូហ្វូន
- 🏥 **ស្វែងរកមន្ទីរពេទ្យ** នៅជិតលោកអ្នក`
        : `Hello! 👋 I am **SokhaCare AI** - Your Healthcare & Navigation Assistant in Cambodia.

How can I help you today with your symptoms, general health, or hospital navigation?

Feel free to describe what you're experiencing or tap a quick topic below:`,
      quickReplies: isKm
        ? ['ខ្ញុំចុកពោះខ្លាំង', 'ខ្ញុំឈឺទ្រូងខាងឆ្វេង', 'ខ្ញុំឈឺក្បាល', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
        : ['Severe stomach pain', 'Left chest pain', 'I have a headache', 'Find nearest hospital']
    };
  }

  // =========================================================================
  // 2. THANKS / GOODBYE INTENT
  // =========================================================================
  if (state.intent === 'thanks') {
    return {
      content: isKm
        ? `រីករាយដែលបានជួយលោកអ្នក! 🙏

ប្រសិនបើលោកអ្នកមានចម្ងល់ ឬរោគសញ្ញាសុខភាពអ្វីផ្សេងទៀតនៅពេលក្រោយ ខ្ញុំត្រៀមខ្លួនជួយជានិច្ច។ សូមថែរក្សាសុខភាព!`
        : `You're very welcome! 🙏

If you have any further health questions or symptoms in the future, feel free to ask anytime. Stay healthy!`,
      quickReplies: isKm
        ? ['ស្វែងរកមន្ទីរពេទ្យ', 'ពិនិត្យរោគសញ្ញាថ្មី']
        : ['Find hospitals', 'Check new symptom']
    };
  }

  // =========================================================================
  // 3. FACILITY SEARCH INTENT
  // =========================================================================
  if (state.intent === 'facility_search') {
    return {
      content: isKm
        ? `🏥 **ការស្វែងរកមន្ទីរពេទ្យ និងគ្លីនិកឯកទេសនៅកម្ពុជា**

ខ្ញុំអាចជួយណែនាំមន្ទីរពេទ្យរដ្ឋ ឯកជន និងមណ្ឌលសុខភាពទូទាំង ២៥ រាជធានី-ខេត្ត។

ខាងក្រោមនេះជាមន្ទីរពេទ្យធំៗ និងជម្រើសសេវាសុខាភិបាលដែលនៅជិតលោកអ្នក៖`
        : `🏥 **Healthcare Facility Navigation in Cambodia**

I can help locate public referral hospitals, private centers, and health posts across all 25 provinces.

Here are major hospital options near your location:`,
      quickReplies: isKm
        ? ['🏥 មន្ទីរពេទ្យកាល់ម៉ែត', '🏥 មន្ទីរពេទ្យមិត្តភាពខ្មែរ-សូវៀត', '🏥 មន្ទីរពេទ្យគន្ធបុប្ផា']
        : ['🏥 Calmette Hospital', '🏥 Khmer-Soviet Hospital', '🏥 Kantha Bopha Hospital']
    };
  }

  // =========================================================================
  // 4. UNKNOWN / AMBIGUOUS INTENT
  // =========================================================================
  if (state.intent === 'unknown') {
    return {
      content: isKm
        ? `ខ្ញុំមិនទាន់យល់សំណួររបស់អ្នកទេ។

លោកអ្នកអាចប្រាប់ខ្ញុំអំពីរោគសញ្ញា ឬសំណួរសុខភាពដែលអ្នកចង់សួរបាន ដូចជា៖
- *"ខ្ញុំឈឺទ្រូងខាងឆ្វេង"*
- *"ខ្ញុំឈឺក្បាល ២ ថ្ងៃហើយ"*
- *"ខ្ញុំចុកដៃចុកជើងខ្លាំង"*
- *"ស្វែងរកមន្ទីរពេទ្យជិតខ្ញុំ"*`
        : `I didn't quite understand your message.

You can describe your symptoms or ask a health question, for example:
- *"I have left chest pain"*
- *"I have a headache for 2 days"*
- *"My arms and legs are aching severely"*
- *"Find the nearest hospital"*`,
      quickReplies: isKm
        ? ['ខ្ញុំឈឺទ្រូងខាងឆ្វេង', 'ខ្ញុំចុកពោះ', 'ខ្ញុំឈឺក្បាល', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
        : ['Left chest pain', 'Stomach pain', 'Headache', 'Find nearest hospital']
    };
  }

  // =========================================================================
  // 5. EMERGENCY RED FLAG PRESENTATIONS (Highest Priority)
  // =========================================================================
  if (risk.isEmergency) {
    if (state.findings.vomitingBlood || state.findings.blackStool) {
      return {
        content: isKm
          ? `🚨 **ការវាយតម្លៃសញ្ញាអាសន្នធ្លាក់ឈាម (EMERGENCY GI HEMORRHAGE ALERT)**

រោគសញ្ញារបស់អ្នកបង្ហាញពីសញ្ញាគ្រោះថ្នាក់បន្ទាន់ គឺការឈឺពោះរួមជាមួយ**ក្អួតមានឈាម ឬបន្ទោរបង់ពណ៌ខ្មៅ**។ សញ្ញាទាំងនេះអាចបណ្តាលមកពីការធ្លាក់ឈាមក្នុងក្រពះ ឬពោះវៀន ដែលត្រូវការការសង្គ្រោះបន្ទាន់ភ្លាមៗ។

**វិធានការបន្ទាន់ដែលត្រូវអនុវត្តភ្លាមៗ៖**
1. 📞 **ទូរស័ព្ទទៅកាន់ 119 (សេវាសង្គ្រោះបន្ទាន់កម្ពុជា)** ឬឱ្យអ្នកនៅក្បែរដឹកបញ្ជូនទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់នៃមន្ទីរពេទ្យធំដែលនៅជិតបំផុត។
2. 🚫 **ហាមពិសារអាហារ ទឹក ឬលេបថ្នាំអ្វីទាំងអស់**។
3. 눕 ឱ្យអ្នកជំងឺគេងសម្រាកស្ងៀម កុំធ្វើចលនាខ្លាំង។`
          : `🚨 **EMERGENCY GASTROINTESTINAL HEMORRHAGE ALERT**

Your reported symptoms indicate an acute emergency: abdominal pain with **vomiting blood or passing black, tarry stools**, suggesting active gastrointestinal bleeding.

**Immediate Actions:**
1. 📞 **Call 119 immediately** or proceed to the nearest 24/7 hospital emergency room.
2. 🚫 **Do not consume food, water, or oral medications**.
3. 눕 Rest flat and avoid physical movement.`,
        quickReplies: isKm
          ? ['📞 ហៅ 119 ឥឡូវនេះ', '🏥 មន្ទីរពេទ្យកាល់ម៉ែត', '🏥 មន្ទីរពេទ្យរុស្ស៊ី']
          : ['📞 Call 119 Now', '🏥 Calmette Hospital', '🏥 Khmer-Soviet Hospital']
      };
    }

    if (complaint === 'chest_pain' || state.findings.radiatingPain) {
      return {
        content: isKm
          ? `🚨 **ការវាយតម្លៃសញ្ញាអាសន្នបេះដូងធ្ងន់ធ្ងរ (CRITICAL CARDIAC EVALUATION)**

រោគសញ្ញារបស់អ្នកបង្ហាញពីសញ្ញាគ្រោះថ្នាក់បេះដូងបន្ទាន់ គឺការឈឺណែនទ្រូង${state.location.includes('chest_left') ? 'ខាងឆ្វេង' : ''}${state.findings.shortnessOfBreath ? ' រួមជាមួយការហត់ពិបាកដកដង្ហើម' : ''}${state.findings.sweating ? ' និងបែកញើសត្រជាក់' : ''}។ រោគសញ្ញាទាំងនេះអាចបណ្តាលមកពីវិបត្តិស្ទះសរសៃឈាមបេះដូងស្រួចស្រាវ។

**សកម្មភាពបន្ទាន់៖**
1. 📞 **ទូរស័ព្ទទៅ 119 ជាបន្ទាន់** ឬទៅកាន់បន្ទប់សង្គ្រោះបន្ទាន់ដែលនៅជិតបំផុត។
2. 🧘 **អង្គុយសម្រាកស្ងប់ស្ងាត់** ក្នុងបន្ទប់ត្រជាក់ កុំធ្វើចលនាខ្លាំង។
3. 👔 **ដោះបន្ធូរសម្លៀកបំពាក់** ជុំវិញក និងទ្រូង។
4. 🚫 **កុំបើកបរដោយខ្លួនឯងជាដាច់ខាត។**`
          : `🚨 **CRITICAL CARDIAC EMERGENCY EVALUATION**

Your symptoms indicate a high-risk cardiac presentation: chest tightness${state.location.includes('chest_left') ? ' on the left side' : ''}${state.findings.shortnessOfBreath ? ' with shortness of breath' : ''}${state.findings.sweating ? ' and diaphoresis' : ''}, which can result from acute coronary ischemia.

**Immediate Actions:**
1. 📞 **Call 119 immediately** or proceed to the nearest emergency room.
2. 🧘 **Sit upright and rest in a cool space**.
3. 👔 **Loosen tight clothing** around neck and chest.
4. 🚫 **DO NOT drive yourself**.`,
        quickReplies: isKm
          ? ['📞 ហៅ 119 ឥឡូវនេះ', '🏥 មន្ទីរពេទ្យកាល់ម៉ែត', '🩺 ពិនិត្យហានិភ័យបេះដូង AI']
          : ['📞 Call 119 Now', '🏥 Calmette Hospital', '🩺 AI Cardio Risk Model']
      };
    }
  }

  // =========================================================================
  // 6. CHEST PAIN PRESENTATION (Cardiovascular & Respiratory Triage Screening)
  // =========================================================================
  const isChest =
    complaint === 'chest_pain' ||
    state.location.includes('chest_left') ||
    state.location.includes('chest_central') ||
    state.symptoms.includes('chest_pain');

  const hasHeadacheAsWell = state.symptoms.includes('headache');

  if (isChest && hasHeadacheAsWell) {
    const isLeft = state.location.includes('chest_left');
    const durStrKm = state.duration ? (state.duration === '2_3_days' ? 'ប្រហែល ៣ ថ្ងៃ' : 'ប្រហែល ១ ថ្ងៃ') : '';

    return {
      content: isKm
        ? `⚠️ **ការវាយតម្លៃរោគសញ្ញារួមផ្សំ៖ ឈឺទ្រូង និងឈឺក្បាល (COMBINED EVALUATION)**

យល់ហើយ។ អ្នកមានអាការៈ**ឈឺទ្រូង${isLeft ? 'ខាងឆ្វេង' : ''}** រួមផ្សំជាមួយ**ការឈឺក្បាល${durStrKm ? ` (${durStrKm})` : ''}**។

ការមានរោគសញ្ញាឈឺទ្រូង និងឈឺក្បាលដំណាលគ្នា អាចបណ្តាលមកពីការឡើងសម្ពាធឈាមខ្ពស់ (Hypertension), ភាពតានតឹងសរសៃប្រសាទខ្លាំង, ឬបញ្ហាសរសៃឈាមបេះដូង។

**សំណួរពិនិត្យសុវត្ថិភាពសំខាន់៖**
1. 🩺 **តើអ្នកធ្លាប់មានប្រវត្តិឡើងសម្ពាធឈាម (លើសឈាម) ឬបានវាស់សម្ពាធឈាមថ្មីៗនេះដែរទេ?**
2. 🚨 **តើការឈឺទ្រូងមានសភាពណែនសង្កត់ ហត់ វិលមុខ ឬបែកញើសត្រជាក់ដែរឬទេ?**
3. 👁️ **តើមានស្រវាំងភ្នែក ឬស្ពឹកទន់ដៃជើងមួយចំហៀងដែរទេ?**`
        : `⚠️ **COMBINED SYMPTOM EVALUATION: CHEST PAIN & HEADACHE**

Understood. You are experiencing **${isLeft ? 'left ' : ''}chest pain** combined with **headache${durStrKm ? ` (for ~3 days)` : ''}**.

Experiencing chest discomfort alongside a headache can point to hypertensive blood pressure spikes, intense autonomic stress, or cardiovascular factors.

**Important Safety Questions:**
1. 🩺 **Do you have a history of hypertension, or have you checked your blood pressure recently?**
2. 🚨 **Is the chest pain crushing/tight, accompanied by shortness of breath, dizziness, or cold sweating?**
3. 👁️ **Do you have blurry vision or one-sided limb weakness?**`,
      quickReplies: isKm
        ? ['មានវាស់សម្ពាធឈាមឃើញខ្ពស់', 'មានហត់ និងបែកញើស', 'គ្មានហត់ ឬបែកញើសទេ', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
        : ['High BP recorded', 'Short of breath & sweating', 'No dyspnea or sweating', 'Find nearest hospital']
    };
  }

  if (isChest) {
    const isLeft = state.location.includes('chest_left');
    const locationStrKm = isLeft ? 'ខាងឆ្វេង' : '';
    const locationStrEn = isLeft ? 'on the left side' : '';

    return {
      content: isKm
        ? `⚠️ **ការវាយតម្លៃរោគសញ្ញាឈឺទ្រូង (CHEST PAIN EVALUATION)**

យល់ហើយ។ អ្នកមានអាការៈ**ឈឺទ្រូង${locationStrKm ? `${locationStrKm}` : ''}**${state.severity === 'severe' ? ' កម្រិតខ្លាំង' : ''}។

ដោយសារការឈឺទ្រូងជាសញ្ញាវេជ្ជសាស្ត្រសំខាន់ដែលត្រូវប្រុងប្រយ័ត្នខ្ពស់ សូមជម្រាបបន្ថែមដើម្បីវាយតម្លៃកម្រិតសុវត្ថិភាព៖
1. 🚨 **តើមានចុកណែនសង្កត់ទ្រូងខ្លាំង ពិបាកដកដង្ហើម (ហត់) ឬបែកញើសត្រជាក់ដែរឬទេ?**
2. ⚡ **តើការឈឺនេះរាលទៅកាន់ស្មាឆ្វេង ដៃឆ្វេង ថ្គាម ឬខ្នងដែរឬទេ?**
3. ⏳ **តើអាការៈនេះកើតឡើងប៉ុន្មាននាទី ឬប៉ុន្មានថ្ងៃហើយ និងឈឺខ្លាំងពេលប្រឹងធ្វើការ ឬពេលសម្រាក?**

🚨 *ចំណាំ៖ ប្រសិនបើមានការឈឺណែនសង្កត់ខ្លាំងរួមជាមួយការហត់ ឬបែកញើស សូមទូរស័ព្ទទៅ **119** ឬទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់ជាបន្ទាន់។*`
        : `⚠️ **CHEST PAIN CLINICAL EVALUATION**

Understood. You are experiencing **chest pain${locationStrEn ? ` ${locationStrEn}` : ''}**${state.severity === 'severe' ? ' (severe intensity)' : ''}.

Because chest symptoms warrant clinical vigilance, please clarify the following safety questions:
1. 🚨 **Do you feel severe crushing pressure, shortness of breath, or cold sweating?**
2. ⚡ **Does the pain radiate to your left shoulder, left arm, jaw, or back?**
3. ⏳ **How long has this lasted, and does it worsen during exertion or at rest?**

🚨 *Note: If you feel crushing tightness with breathlessness or diaphoresis, call **119** or seek emergency medical care immediately.*`,
      quickReplies: isKm
        ? ['មានហត់ និងបែកញើស', 'ឈឺរាលទៅដៃឆ្វេង', 'មិនមានហត់ ឬបែកញើសទេ', 'ឈឺពេលដកដង្ហើមចូលជ្រៅ']
        : ['Shortness of breath & sweating', 'Radiates to left arm', 'No dyspnea or sweating', 'Pain on deep breath']
    };
  }

  // =========================================================================
  // 7. HEADACHE CONVERSATION (Progressive Multi-Turn State Updates)
  // =========================================================================
  if (complaint === 'headache' || complaint.includes('head') || state.symptoms.includes('headache')) {
    const hasVisual = state.findings.visualDisturbance;
    const deniedVisual = state.negativeSymptoms.includes('visual_disturbance');
    const hasFever = state.associatedSymptoms.includes('fever');
    const deniedFever = state.negativeSymptoms.includes('fever');
    const isVeryUnwell = state.overallCondition === 'very_unwell' || state.severity === 'severe';
    const isWorsening = state.worsening;
    const durStrKm = state.duration ? (state.duration === '2_3_days' ? ' (រយៈពេលប្រហែល ៣ ថ្ងៃ)' : ' (រយៈពេល ១ ថ្ងៃ)') : '';
    const durStrEn = state.duration ? (state.duration === '2_3_days' ? ' (for ~3 days)' : ' (for 1 day)') : '';

    // A. Multi-fact acknowledgement (e.g. Severe headache + visual changes + no fever)
    if (hasVisual && (deniedFever || hasFever)) {
      return {
        content: isKm
          ? `⚠️ **ការវាយតម្លៃរោគសញ្ញាឈឺក្បាល (HEADACHE EVALUATION)**

យល់ហើយ។ អ្នកមានការឈឺក្បាល${state.severity === 'severe' ? 'កម្រិតខ្លាំង ' : ' '}${durStrKm} រួមជាមួយ**ការស្រវាំងភ្នែក**${deniedFever ? ' (មិនមានក្តៅខ្លួនទេ)' : ' និងមានក្តៅខ្លួន'}។

រោគសញ្ញានេះសមស្របនឹងជំងឺប្រកាំង (Migraine with aura) ឬការប្រែប្រួលសម្ពាធឈាម។

**វិធីថែទាំបឋម៖**
1. 🌙 **សម្រាកក្នុងបន្ទប់ស្ងាត់ និងងងឹត** បិទភ្លើង និងចៀសវាងអេក្រង់ទូរស័ព្ទ។
2. 💧 **ផឹកទឹកស្អាត ១-២ កែវធំ**។
3. 💆 **ស្អំកន្សែងត្រជាក់** លើថ្ងាស។

❓ **ដើម្បីសុវត្ថិភាព តើការឈឺក្បាលនេះចាប់ផ្តើមភ្លាមៗខ្លាំងដូចរន្ទះបាញ់ ឬមានរឹងកញ្ចឹងកដែរឬទេ?**`
          : `⚠️ **HEADACHE CLINICAL EVALUATION**

Understood. You are experiencing ${state.severity === 'severe' ? 'severe ' : ''}headache${durStrEn} accompanied by **visual disturbances**${deniedFever ? ' (without fever)' : ' and fever'}.

This presentation is consistent with migraine with aura or neurovascular changes.

**Supportive Care:**
1. 🌙 **Rest in a quiet, dark room** away from bright lights and screens.
2. 💧 **Hydrate:** Drink 1-2 glasses of water.
3. 💆 **Cold compress** to your forehead.

❓ **For clinical safety, did this headache start abruptly (thunderclap), or do you have any neck stiffness?**`,
        quickReplies: isKm
          ? ['មិនមានរឹងកទេ', 'មានរឹងកញ្ចឹងក', 'ឈឺក្បាល ២ ថ្ងៃហើយ', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
          : ['No neck stiffness', 'Stiff neck present', 'Headache for 2 days', 'Find nearest hospital']
      };
    }

    // B. User just reported "very very sick" or worsening condition
    if (isVeryUnwell || isWorsening) {
      return {
        content: isKm
          ? `យល់ហើយ។ អ្នកមានអារម្មណ៍មិនស្រួលខ្លួនខ្លាំង (ការឈឺក្បាលកម្រិតធ្ងន់${durStrKm}${isWorsening ? ' និងកាន់តែឈឺជាងមុន' : ''})។

ដើម្បីជួយវាយតម្លៃកម្រិតសុវត្ថិភាព និងណែនាំដំណោះស្រាយឱ្យបានច្បាស់លាស់ សូមប្រាប់ខ្ញុំបន្ថែម៖
1. ⚡ **តើការឈឺក្បាលនេះចាប់ផ្តើមឡើងភ្លាមៗខ្លាំងបំផុត (ដូចរន្ទះបាញ់) ឬកើនឡើងបន្តិចម្តងៗ?**
2. 👁️ **តើមានស្រវាំងភ្នែក ក្តៅខ្លួន ឬរឹងកញ្ចឹងកដែរឬទេ?**
3. ⏳ **តើអាការៈនេះកើតឡើងប៉ុន្មានថ្ងៃ ឬប៉ុន្មានម៉ោងហើយ?**`
          : `Understood. You are feeling very unwell (${isWorsening ? 'your headache is worsening ' : ''}with severe intensity${durStrEn}).

To evaluate clinical safety and provide precise guidance, please clarify:
1. ⚡ **Did the headache reach peak intensity abruptly within seconds (thunderclap) or develop gradually?**
2. 👁️ **Are you experiencing blurry vision, fever, or a stiff neck?**
3. ⏳ **How long ago (hours or days) did this headache start?**`,
        quickReplies: isKm
          ? ['មានស្រវាំងភ្នែក', 'មិនមានស្រវាំងភ្នែក ឬក្តៅខ្លួនទេ', 'ឈឺក្បាល ២ ថ្ងៃហើយ', 'មានក្តៅខ្លួនខ្លាំង']
          : ['Blurry vision present', 'No blurry vision or fever', 'Headache for 2 days', 'High fever present']
      };
    }

    // C. User reported visual disturbance alone
    if (hasVisual) {
      return {
        content: isKm
          ? `យល់ហើយ។ អ្នកមានអាការៈ**ឈឺក្បាលរួមជាមួយការស្រវាំងភ្នែក**${durStrKm}។

រោគសញ្ញានេះច្រើនជួបប្រទះក្នុងជំងឺប្រកាំង (Migraine with aura) ឬការឡើងសម្ពាធឈាម។

❓ **តើអ្នកមានក្តៅខ្លួន រឹងកញ្ចឹងក ឬកើតឡើងប៉ុន្មានថ្ងៃហើយដែរ?**`
          : `Understood. You are experiencing **headache accompanied by blurry vision / visual changes**${durStrEn}.

This is commonly seen in migraines with aura or blood pressure changes.

❓ **Do you have any fever, stiff neck, and how many days has this lasted?**`,
        quickReplies: isKm
          ? ['មិនមានក្តៅខ្លួន ឬរឹងកទេ', 'មានក្តៅខ្លួន', 'ឈឺក្បាល ២ ថ្ងៃហើយ']
          : ['No fever or stiff neck', 'Fever present', 'Headache for 2 days']
      };
    }

    // D. User denied fever ("មិនមានក្តៅខ្លួនទេ")
    if (deniedFever) {
      return {
        content: isKm
          ? `យល់ហើយ។ អ្នកមានអាការៈ**ឈឺក្បាលដោយមិនមានក្តៅខ្លួនទេ**${durStrKm}។

**វិធីថែទាំបឋម៖**
1. 💧 ផឹកទឹកស្អាត ១-២ កែវធំ (ការខ្វះជាតិទឹកជាមូលហេតុញឹកញាប់)។
2. 🌙 សម្រាកក្នុងបន្ទប់ស្ងាត់ ២០-៣០ នាទី។
3. 💊 អាចប្រើប្រាស់ថ្នាំ Paracetamol (៥០០ មីលីក្រាម) បើចាំបាច់។

❓ **តើអ្នកមានស្រវាំងភ្នែក រឹងកញ្ចឹងក ឬពិបាកគេងដែរឬទេ?**`
          : `Understood. You have a **headache without fever**${durStrEn}.

**Initial Supportive Steps:**
1. 💧 Drink 1-2 glasses of water.
2. 🌙 Rest in a quiet space for 20-30 minutes.
3. 💊 Take Paracetamol (500mg) if relief is needed.

❓ **Do you have any blurry vision, stiff neck, or trouble sleeping?**`,
        quickReplies: isKm
          ? ['មានស្រវាំងភ្នែក', 'មិនមានស្រវាំងភ្នែកទេ', 'ឈឺដោយសារស្ត្រេស']
          : ['Blurry vision present', 'No blurry vision', 'Stress / screen fatigue']
      };
    }

    // E. Initial headache consultation
    return {
      content: isKm
        ? `យល់ហើយ។ អ្នកមានអាការៈ**ឈឺក្បាល**${durStrKm}${state.location.includes('head_one_sided') ? ' នៅមួយចំហៀង' : ''}។

**វិធីសម្រួលការឈឺក្បាលបឋម៖**
1. 💧 ផឹកទឹកស្អាត ១-២ កែវធំ (ការខ្វះជាតិទឹកជាមូលហេតុញឹកញាប់)។
2. 🌙 សម្រាកក្នុងបន្ទប់ស្ងាត់ និងត្រជាក់ ២០-៣០ នាទី។
3. 💊 អាចប្រើប្រាស់ថ្នាំ Paracetamol (៥០០ មីលីក្រាម) បើចាំបាច់។

❓ **តើអ្នកមានស្រវាំងភ្នែក ក្តៅខ្លួន ឬរឹងកញ្ចឹងកដែរឬទេ?**`
        : `Understood. You are experiencing a **headache**${durStrEn}${state.location.includes('head_one_sided') ? ' on one side' : ''}.

**Initial Supportive Steps:**
1. 💧 Drink 1-2 large glasses of water (hydration is crucial).
2. 🌙 Rest in a quiet, cool space for 20-30 minutes.
3. 💊 Take Paracetamol (500mg) if relief is needed.

❓ **Are you experiencing any blurry vision, fever, or neck stiffness?**`,
      quickReplies: isKm
        ? ['មានស្រវាំងភ្នែក', 'មិនមានស្រវាំងភ្នែក ឬក្តៅខ្លួនទេ', 'ឈឺខ្លាំងណាស់', 'ឈឺដោយសារស្ត្រេស/ធ្វើការ']
        : ['Blurry vision present', 'No blurry vision or fever', 'Very very sick', 'Stress / screen fatigue']
    };
  }

  // =========================================================================
  // 8. LIMB & MUSCULOSKELETAL PRESENTATION (Arms, Legs, Joints)
  // =========================================================================
  const isLimbPain =
    complaint === 'limb_pain' ||
    complaint === 'joint_pain' ||
    complaint === 'back_pain' ||
    state.location.includes('arm') ||
    state.location.includes('leg') ||
    state.location.includes('joints');

  if (isLimbPain) {
    const hasArm = state.location.includes('arm');
    const hasLeg = state.location.includes('leg');
    const locationStrKm = hasArm && hasLeg ? 'ដៃ និងជើង' : hasArm ? 'ដៃ' : hasLeg ? 'ជើង' : 'សន្លាក់';
    const locationStrEn = hasArm && hasLeg ? 'arms and legs' : hasArm ? 'arms' : hasLeg ? 'legs' : 'joints';

    return {
      content: isKm
        ? `យល់ហើយ។ អ្នកមានអាការៈ**${state.severity === 'severe' ? `ចុក${locationStrKm}ខ្លាំង` : `ចុក${locationStrKm}`}**។

ដើម្បីជួយវាយតម្លៃកម្រិតសុវត្ថិភាព និងណែនាំវិធីថែទាំបានត្រឹមត្រូវ សូមជម្រាបបន្ថែម៖
1. ⏳ **តើអាការៈនេះកើតឡើងប៉ុន្មានថ្ងៃហើយ និងឈឺទាំងសងខាង ឬតែមួយចំហៀង?**
2. 🖐️ **តើមានស្ពឹក ទន់ដៃជើង ឬពិបាកដើរ/កម្រើកដែរឬទេ?**
3. 🏋️ **តើមានការប៉ះទង្គិច លើករបស់ធ្ងន់ ឬហាត់ប្រាណខ្លាំងថ្មីៗនេះទេ?**
4. 🚨 **តើមានចុកណែនទ្រូង ឬពិបាកដកដង្ហើមរួមផ្សំដែរទេ?**`
        : `Understood. You are experiencing **${state.severity === 'severe' ? 'severe ' : ''}aches in your ${locationStrEn}**.

To assess safety and recommend proper care, please clarify:
1. ⏳ **How many days ago did this start, and is it on both sides or only one side?**
2. 🖐️ **Do you have any numbness, limb weakness, or difficulty walking/moving?**
3. 🏋️ **Did you have any recent physical injury, heavy lifting, or intense exercise?**
4. 🚨 **Are you experiencing any chest tightness or shortness of breath?**`,
      quickReplies: isKm
        ? ['ឈឺទាំងសងខាង (អស់កម្លាំង)', 'មានស្ពឹកស្រពន់បន្តិច', 'គ្មានចុកទ្រូង ឬហត់ទេ', 'ឈឺក្រោយលើករបស់ធ្ងន់']
        : ['Both sides (fatigue)', 'Mild numbness present', 'No chest pain or dyspnea', 'After heavy physical work']
    };
  }

  // =========================================================================
  // 9. ABDOMINAL CLINICAL PRESENTATIONS
  // =========================================================================
  if (complaint === 'abdominal_pain' || complaint.includes('stomach')) {
    const isRLQ = state.location.includes('right_lower_abdomen');
    const isEpigastric = state.location.includes('epigastric');

    if (isRLQ) {
      const hasRebound = state.findings.painOnRelease || state.findings.painOnPressure;
      const hasFever = state.associatedSymptoms.includes('fever');
      const hasNausea = state.associatedSymptoms.includes('nausea') || state.associatedSymptoms.includes('vomiting');

      if (hasRebound || (hasFever && hasNausea) || state.severity === 'severe') {
        return {
          content: isKm
            ? `⚠️ **ការវាយតម្លៃរោគសញ្ញាពោះកម្រិតហានិភ័យខ្ពស់ (HIGH-RISK ABDOMINAL EVALUATION)**

រោគសញ្ញារបស់អ្នកមានសញ្ញាដែលគួរឱ្យប្រុងប្រយ័ត្ន ដូចជាការឈឺ${state.severity === 'severe' ? 'ខ្លាំង' : ''}នៅពោះខាងស្តាំក្រោម${hasFever ? ' រួមជាមួយក្តៅខ្លួន' : ''}${hasNausea ? ' និងចង្អោរ' : ''}${state.findings.painOnRelease ? ' និងការឈឺខ្លាំងពេលបញ្ចេញដៃបន្ទាប់ពីចុច' : ''}។

រោគសញ្ញាទាំងនេះអាចកើតឡើងពីមូលហេតុជាច្រើន រួមទាំងជំងឺដែលត្រូវការការពិនិត្យបន្ទាន់ (ដូចជា ការរលាកខ្នែងពោះវៀន ឬការរលាកពោះវៀនស្រួចស្រាវ) ប៉ុន្តែមិនអាចធ្វើរោគវិនិច្ឆ័យបញ្ជាក់តាមការជជែកតែមួយនេះបានទេ។

**ការណែនាំវេជ្ជសាស្ត្រសំខាន់៖**
1. 🏥 **សូមទៅកាន់មន្ទីរពេទ្យ ឬផ្នែកសង្គ្រោះបន្ទាន់** ដើម្បីឱ្យគ្រូពេទ្យពិនិត្យផ្ទាល់ ធ្វើអេកូពោះ (Ultrasound) និងពិនិត្យឈាម។
2. 🚫 **ហាមលេបថ្នាំបំបាត់ការឈឺចាប់ខ្លាំង** ព្រោះវាបិទបាំងរោគសញ្ញាសំខាន់ៗក្នុងការពិនិត្យ។
3. 🚫 **ហាមស្អំកម្តៅលើពោះ និងហាមលេបថ្នាំបញ្ចុះលាមក**។
4. 🚫 **កុំទាន់ញ៉ាំអាហាររឹង ឬទឹកច្រើន** ក្នុងករណីដែលគ្រូពេទ្យត្រូវធ្វើអន្តរាគមន៍បន្ទាន់។`
            : `⚠️ **HIGH-RISK ABDOMINAL PRESENTATION EVALUATION**

Your reported symptoms show concerning clinical findings: ${state.severity === 'severe' ? 'severe ' : ''}right lower quadrant abdominal pain${hasFever ? ' with fever' : ''}${hasNausea ? ' and nausea' : ''}${state.findings.painOnRelease ? ' with tenderness upon release of pressure' : ''}.

These symptoms can arise from multiple conditions, including conditions requiring urgent surgical evaluation (such as acute appendicitis or acute enteritis), which cannot be confirmed through chat alone.

**Crucial Medical Advice:**
1. 🏥 **Proceed to a hospital emergency/surgical department** for an in-person physical exam, ultrasound imaging, and blood tests.
2. 🚫 **DO NOT take strong painkillers** — masking tenderness signs impedes clinical diagnosis.
3. 🚫 **DO NOT apply heat pads or take laxatives**.
4. 🚫 **Refrain from heavy food or fluids** in case urgent medical intervention is required.`,
          quickReplies: isKm
            ? ['🏥 ស្វែងរកមន្ទីរពេទ្យវះកាត់ជិតបំផុត', '📞 ហៅទូរស័ព្ទសង្គ្រោះបន្ទាន់ 119', 'ឈឺខ្លាំងឡើងៗ']
            : ['🏥 Find Nearest Surgical Hospital', '📞 Call 119 Emergency', 'Pain is worsening']
        };
      }

      return {
        content: isKm
          ? `យល់ហើយ។ ការឈឺចាប់ស្ថិតនៅ**ពោះខាងស្តាំក្រោម**។

ដើម្បីជួយវាយតម្លៃកម្រិតសុវត្ថិភាព តើការឈឺចាប់កាន់តែខ្លាំងពេលដើរ ក្អក ឬឈឺចាក់ខ្លាំងពេលចុចហើយលែងដៃដែរឬទេ? ហើយមានក្តៅខ្លួន ចង្អោរ ឬក្អួតដែរទេ?`
          : `Understood. The pain is localized to the **right lower abdomen**.

To assess clinical safety, does the pain worsen when walking, coughing, or when releasing hand pressure after pressing? Do you also have a fever, nausea, or vomiting?`,
        quickReplies: isKm
          ? ['មានក្តៅខ្លួន និងចង្អោរ', 'ឈឺចាក់ខ្លាំងពេលចុចហើយលែង', 'មិនមានក្តៅខ្លួនទេ', 'ឈឺពេលដើរ ឬក្អក']
          : ['Has fever and nausea', 'Sharp pain on releasing pressure', 'No fever present', 'Worse with walking/coughing']
      };
    }

    if (isEpigastric) {
      if (state.timing === 'after_eating') {
        return {
          content: isKm
            ? `យល់ហើយ។ អ្នកមានអាការៈ**${state.severity === 'severe' ? 'ឈឺចុកខ្លាំង' : 'ឈឺចុក'}នៅតំបន់ចុងដង្ហើម (ក្រពះ) ដែលកើតឡើងក្រោយពេលញ៉ាំអាហារ**។

រោគសញ្ញានេះសមស្របនឹងការរលាកភ្នាសក្រពះ (Gastritis), អាស៊ីតច្រាល (GERD), ឬការពិបាករំលាយអាហារ។

**វិធីថែទាំ និងសម្រាលអាការៈបឋម៖**
1. 🧍 **កុំគេងរាបស្មើភ្លាមៗក្រោយញ៉ាំអាហារ** (អង្គុយ ឬផ្អែកឱ្យខ្ពស់ ២-៣ ម៉ោង)។
2. 🥛 **ក្រេបទឹកក្តៅឧណ្ហៗបន្តិចម្តងៗ** ដើម្បីជួយបន្សាបអាស៊ីត។
3. 🥣 **ញ៉ាំបបរខាប់ក្តៅៗ** ចៀសវាងអាហារហឹរ ជាតិជូរខ្លាំង ខ្លាញ់ច្រើន កាហ្វេ និងស្រា។
4. 💊 អាចប្រើប្រាស់ថ្នាំបន្សាបអាស៊ីតក្រពះ (Antacids / Omeprazole) តាមការណែនាំរបស់ឱសថការី។

❓ **ដើម្បីសុវត្ថិភាព តើអ្នកមានក្អួត ក្តៅខ្លួន លាមកខ្មៅ ឬការឈឺនេះរាលឡើងមកទ្រូង/ស្មាដែរឬទេ?**`
            : `Understood. You are experiencing **${state.severity === 'severe' ? 'severe ' : ''}epigastric pain occurring after meals**.

This clinical presentation is consistent with acute gastritis, acid reflux (GERD), or functional dyspepsia.

**Supportive Care Guidance:**
1. 🧍 **Remain upright for at least 2-3 hours after eating** — avoid lying flat immediately.
2. 🥛 **Sip warm water** to help buffer gastric acidity.
3. 🥣 **Eat small, bland meals (porridge)**. Avoid spicy, acidic, greasy foods, coffee, and alcohol.
4. 💊 Antacids or acid reducers (Omeprazole) under pharmacist guidance.

❓ **For clinical safety, are you experiencing any vomiting, fever, black stools, or pain radiating up to your chest/shoulder?**`,
          quickReplies: isKm
            ? ['គ្មានក្អួត ឬលាមកខ្មៅទេ', 'មានក្អួតចង្អោរ', 'ឈឺរាលឡើងមកទ្រូង', 'ស្វែងរកគ្លីនិកជិតបំផុត']
            : ['No vomiting or black stool', 'Nausea and vomiting present', 'Radiates to chest', 'Find nearby clinic']
        };
      }

      return {
        content: isKm
          ? `យល់ហើយ។ អ្នកមានការ**${state.severity === 'severe' ? 'ឈឺចុកខ្លាំង' : 'ឈឺចុក'}នៅតំបន់ចុងដង្ហើម (ក្រពះ)**។

តើការឈឺចុកនេះកើតឡើងមុន ឬក្រោយពេលញ៉ាំអាហារ ហើយមានក្អួត ក្តៅខ្លួន ឬលាមកខ្មៅដែរឬទេ?`
          : `Understood. You are experiencing **${state.severity === 'severe' ? 'severe ' : ''}epigastric / upper stomach discomfort**.

Does this pain occur before or after eating meals, and do you have any vomiting, fever, or black stools?`,
        quickReplies: isKm
          ? ['ឈឺក្រោយញ៉ាំអាហាររួច', 'ឈឺពេលឃ្លាន/ពោះទទេ', 'ឈឺជាប់រហូតមិនបាត់', 'មានក្អួតចង្អោរ']
          : ['Pain after eating', 'Pain on empty stomach', 'Constant pain', 'With nausea/vomiting']
      };
    }

    return {
      content: isKm
        ? `យល់ហើយ។ អ្នកមានការ**${state.severity === 'severe' ? 'ឈឺពោះខ្លាំង' : 'ឈឺពោះ'}**។

តើការឈឺចាប់នេះស្ថិតនៅតំបន់ណា (ដូចជា ចុងដង្ហើម ពោះខាងស្តាំក្រោម ឬពោះផ្នែកខាងក្រោម) ហើយចាប់ផ្តើមតាំងពីពេលណា?`
        : `Understood. You have reported **${state.severity === 'severe' ? 'severe ' : ''}abdominal pain**.

Where is the pain primarily located (such as epigastric, right lower abdomen, or lower abdomen), and when did it begin?`,
      quickReplies: isKm
        ? ['ខាងស្តាំក្រោម', 'ចុងដង្ហើម (ក្រពះ)', 'ពោះផ្នែកខាងក្រោម', 'មានរាក និងក្អួត']
        : ['Right lower abdomen', 'Epigastric / Upper stomach', 'Lower abdomen', 'With diarrhea & vomiting']
    };
  }

  // =========================================================================
  // 10. GENERAL SICKNESS / UNWELL / FALLBACK
  // =========================================================================
  if (state.overallCondition === 'unwell' || state.overallCondition === 'very_unwell') {
    return {
      content: isKm
        ? `យល់ហើយ។ ខ្ញុំបានកត់ត្រាថាអ្នកកំពុងមានអារម្មណ៍មិនស្រួលខ្លួន (Sick/Unwell)។

ដើម្បីជួយពិគ្រោះយោបល់ និងវាយតម្លៃសុខភាពបានត្រឹមត្រូវ សូមជម្រាបបន្ថែម៖
1. 📍 **តើអ្នកមានរោគសញ្ញាសំខាន់នៅត្រង់ណា?** (ឧ. ឈឺទ្រូង, ឈឺក្បាល, ចុកពោះ, ក្តៅខ្លួន ឬចុកដៃចុកជើង)
2. ⏳ **តើអាការៈនេះកើតឡើងប៉ុន្មានថ្ងៃហើយ?**
3. 🌡️ **តើមានក្តៅខ្លួន ឬសញ្ញាធ្ងន់ធ្ងរអ្វីផ្សេងទៀតទេ?**`
        : `Understood. I have recorded that you are feeling sick or unwell.

To assist with accurate health consultation, please clarify:
1. 📍 **Where is your primary symptom located?** (e.g. chest pain, headache, stomachache, fever, limb pain)
2. ⏳ **How many days have you had these symptoms?**
3. 🌡️ **Do you have a fever or any concerning warning signs?**`,
      quickReplies: isKm
        ? ['ខ្ញុំឈឺទ្រូងខាងឆ្វេង', 'ខ្ញុំឈឺក្បាល', 'ខ្ញុំចុកពោះ', 'ខ្ញុំក្តៅខ្លួន']
        : ['Left chest pain', 'Headache', 'Stomach pain', 'Fever']
    };
  }

  return {
    content: isKm
      ? `🩺 **ខ្ញុំបានកត់ត្រារោគសញ្ញារបស់អ្នក៖ "${latestUserText}"**

ដើម្បីជួយពិគ្រោះយោបល់ និងផ្តល់ការណែនាំសុខភាពឱ្យកាន់តែសុក្រឹត សូមជម្រាបបន្ថែមអំពី៖
- 📍 **ទីតាំងឈឺជាក់លាក់** (ក្បាល ទ្រូង ពោះ ដៃ ជើង...)
- ⏳ **រយៈពេលដែលកើតមាន** (១ ថ្ងៃ, ៣ ថ្ងៃ, ឬលើសពី ១ សប្តាហ៍)
- 🌡️ **កម្រិតកម្តៅ ឬសញ្ញារួមផ្សំផ្សេងទៀត**`
      : `🩺 **I recorded your symptom details: "${latestUserText}"**

To assist with accurate triage, please provide:
- 📍 **Exact location of discomfort** (head, chest, stomach, arm, leg...)
- ⏳ **Duration of symptoms** (1 day, 3 days, over a week)
- 🌡️ **Temperature or accompanying symptoms**`,
    quickReplies: isKm
      ? ['ខ្ញុំឈឺទ្រូងខាងឆ្វេង', 'ខ្ញុំចុកពោះ', 'ខ្ញុំឈឺក្បាល', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត']
      : ['Left chest pain', 'Abdominal pain', 'Headache', 'Find nearest hospital']
  };
}

// Backward compatibility alias
export const generateContextAwareResponse = generateGeneralizedClinicalResponse;
