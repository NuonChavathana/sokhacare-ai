import { evaluateChatIntent } from '../chat-nlp-engine';
import { extractClinicalEntities } from '../entity-extractor';
import { buildClinicalStateFromHistory } from '../symptom-state-manager';

export function runGeneralizedClinicalTests() {
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string, details?: any) {
    totalCount++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testName}`, details || '');
    }
  }

  console.log('==============================================================');
  console.log('🧪 RUNNING SOKHACARE CONTEXT-AWARE CLINICAL TESTS');
  console.log('==============================================================\n');

  // -------------------------------------------------------------------------
  // Test 1: Left Chest Pain ("ខ្ញុំឈឺទ្រូងខាងឆ្វេង")
  // -------------------------------------------------------------------------
  console.log('--- Test 1: Left Chest Pain ("ខ្ញុំឈឺទ្រូងខាងឆ្វេង") ---');
  const resLeftChest = evaluateChatIntent('ខ្ញុំឈឺទ្រូងខាងឆ្វេង', 'km');
  assert(
    resLeftChest.intent === 'symptom_consultation' &&
      resLeftChest.symptom_state.chiefComplaint === 'chest_pain' &&
      resLeftChest.symptom_state.location.includes('chest_left') &&
      resLeftChest.content.includes('ឈឺទ្រូងខាងឆ្វេង') &&
      !resLeftChest.content.includes('ទីតាំងឈឺជាក់លាក់ (ក្បាល ទ្រូង ពោះ ដៃ ជើង...)'),
    '"ខ្ញុំឈឺទ្រូងខាងឆ្វេង" extracts chest_pain at chest_left and does NOT ask for symptom location',
    resLeftChest
  );

  // -------------------------------------------------------------------------
  // Test 2: Combined Multi-Symptom: Left Chest Pain + Headache (3 Days)
  // -------------------------------------------------------------------------
  console.log('\n--- Test 2: Combined Multi-Symptom: Left Chest Pain + Headache (3 Days) ---');
  const historyCombined = [
    { role: 'user', content: 'ខ្ញុំឈឺទ្រូងខាងឆ្វេង' },
    { role: 'assistant', content: resLeftChest.content }
  ];
  const resCombined = evaluateChatIntent('ឈឺក្បាលដែរ ៣ថ្ងៃហើយ', 'km', undefined, undefined, historyCombined);
  assert(
    resCombined.symptom_state.symptoms.includes('chest_pain') &&
      resCombined.symptom_state.symptoms.includes('headache') &&
      resCombined.symptom_state.duration === '2_3_days' &&
      resCombined.content.includes('ឈឺទ្រូងខាងឆ្វេង') &&
      resCombined.content.includes('ឈឺក្បាល'),
    'Merges left chest pain + headache + 3 days duration and returns combined clinical evaluation',
    resCombined
  );

  // -------------------------------------------------------------------------
  // Test 3: Typo Correction ("i am sich" -> "i am sick")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 3: Typo Correction ("i am sich") ---');
  const resSich = evaluateChatIntent('i am sich', 'km');
  assert(
    resSich.intent === 'symptom_consultation' &&
      resSich.symptom_state.overallCondition === 'unwell',
    '"i am sich" normalizes typo and enters symptom consultation pipeline',
    resSich
  );

  // -------------------------------------------------------------------------
  // Test 4: Vague Severity Update ("i have a headache" -> "very very sick")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 4: Vague Severity Update ("i have a headache" -> "very very sick") ---');
  const history4 = [
    { role: 'user', content: 'i have a headache' },
    { role: 'assistant', content: 'Understood. You are experiencing a headache. Are you experiencing any blurry vision, fever, or neck stiffness?' }
  ];
  const resTurn4_1 = evaluateChatIntent('i have a headache', 'en');
  const resTurn4_2 = evaluateChatIntent('very very sick', 'en', undefined, undefined, history4);

  assert(
    resTurn4_2.symptom_state.chiefComplaint === 'headache' &&
      resTurn4_2.symptom_state.severity === 'severe' &&
      resTurn4_2.symptom_state.overallCondition === 'very_unwell' &&
      resTurn4_2.content !== resTurn4_1.content,
    'Turn 2: "very very sick" updates severity=severe without repeating Turn 1 response',
    resTurn4_2
  );

  // -------------------------------------------------------------------------
  // Test 5: Worsening Condition ("ខ្ញុំឈឺក្បាល" -> "កាន់តែឈឺ")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 5: Worsening Condition ("ខ្ញុំឈឺក្បាល" -> "កាន់តែឈឺ") ---');
  const history5 = [
    { role: 'user', content: 'ខ្ញុំឈឺក្បាល' },
    { role: 'assistant', content: 'យល់ហើយ។ អ្នកមានអាការៈឈឺក្បាល។' }
  ];
  const resWorsening = evaluateChatIntent('កាន់តែឈឺ', 'km', undefined, undefined, history5);
  assert(
    resWorsening.symptom_state.worsening === true &&
      resWorsening.symptom_state.severity === 'severe' &&
      resWorsening.symptom_state.chiefComplaint === 'headache',
    'Turn 2: "កាន់តែឈឺ" updates worsening=true and severity=severe on existing headache',
    resWorsening.symptom_state
  );

  // -------------------------------------------------------------------------
  // Test 6: Positive Finding Update ("ខ្ញុំឈឺក្បាល" -> "មានស្រវាំងភ្នែក")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 6: Positive Finding Update ("ខ្ញុំឈឺក្បាល" -> "មានស្រវាំងភ្នែក") ---');
  const history6 = [
    { role: 'user', content: 'ខ្ញុំឈឺក្បាល' },
    { role: 'assistant', content: 'យល់ហើយ។ អ្នកមានអាការៈឈឺក្បាល។' }
  ];
  const resVisual = evaluateChatIntent('មានស្រវាំងភ្នែក', 'km', undefined, undefined, history6);
  assert(
    resVisual.symptom_state.findings.visualDisturbance === true &&
      resVisual.symptom_state.associatedSymptoms.includes('visual_disturbance'),
    'Turn 2: "មានស្រវាំងភ្នែក" sets visualDisturbance=true in state',
    resVisual.symptom_state
  );

  // -------------------------------------------------------------------------
  // Test 7: Negative Finding Denial ("ខ្ញុំឈឺក្បាល" -> "មិនមានក្តៅខ្លួនទេ")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 7: Negative Finding Denial ("ខ្ញុំឈឺក្បាល" -> "មិនមានក្តៅខ្លួនទេ") ---');
  const history7 = [
    { role: 'user', content: 'ខ្ញុំឈឺក្បាល' },
    { role: 'assistant', content: 'យល់ហើយ។ អ្នកមានអាការៈឈឺក្បាល។' }
  ];
  const resNoFever = evaluateChatIntent('មិនមានក្តៅខ្លួនទេ', 'km', undefined, undefined, history7);
  assert(
    resNoFever.symptom_state.negativeSymptoms.includes('fever') &&
      !resNoFever.symptom_state.associatedSymptoms.includes('fever'),
    'Turn 2: "មិនមានក្តៅខ្លួនទេ" persists fever in negativeSymptoms',
    resNoFever.symptom_state
  );

  // -------------------------------------------------------------------------
  // Test 8: English & Khmer Greetings (urgency = none)
  // -------------------------------------------------------------------------
  console.log('\n--- Test 8: Greetings (urgency = none) ---');
  const resHi = evaluateChatIntent('hi', 'en');
  const resSousdey = evaluateChatIntent('សួស្តី', 'km');
  assert(
    resHi.intent === 'greeting' &&
      resHi.urgency === 'none' &&
      resSousdey.intent === 'greeting' &&
      resSousdey.urgency === 'none' &&
      !resHi.content.includes('Urgent') &&
      !resSousdey.content.includes('⚠️ បន្ទាន់'),
    'Greetings classify as intent=greeting, urgency=none without medical/urgent badges',
    { resHi, resSousdey }
  );

  // -------------------------------------------------------------------------
  // Test 9: Limb Pain Entity & Question Guard ("ខ្ញុំចុកដៃចុកជើងខ្លាំង")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 9: Limb Pain Entity & Question Guard ---');
  const resLimb = evaluateChatIntent('ខ្ញុំចុកដៃចុកជើងខ្លាំង', 'km');
  const hasArm = resLimb.symptom_state.location.includes('arm');
  const hasLeg = resLimb.symptom_state.location.includes('leg');
  assert(
    resLimb.intent === 'symptom_consultation' &&
      hasArm &&
      hasLeg &&
      resLimb.symptom_state.severity === 'severe' &&
      !resLimb.content.includes('តើអ្នកឈឺ ឬមិនស្រួលនៅត្រង់ណា? (ឧ. ក្បាល ទ្រូង ពោះ បំពង់ក...)') &&
      resLimb.content.includes('ចុកដៃ និងជើងខ្លាំង'),
    'Extracts body_parts=[arm, leg], severity=severe and avoids asking where it hurts',
    resLimb
  );

  // -------------------------------------------------------------------------
  // Test 10: Unknown / Gibberish ("asdfgh")
  // -------------------------------------------------------------------------
  console.log('\n--- Test 10: Unknown / Gibberish ("asdfgh") ---');
  const resUnknown = evaluateChatIntent('asdfgh', 'km');
  assert(
    resUnknown.intent === 'unknown' &&
      resUnknown.urgency === 'none' &&
      resUnknown.triageLevel === 'info' &&
      !resUnknown.content.includes('⚠️ បន្ទាន់') &&
      resUnknown.content.includes('ខ្ញុំមិនទាន់យល់សំណួររបស់អ្នកទេ'),
    '"asdfgh" classifies as intent=unknown, urgency=none and returns clarification',
    resUnknown
  );

  console.log('\n==============================================================');
  console.log(`📊 RESULTS: ${passedCount} / ${totalCount} TESTS PASSED (${((passedCount / totalCount) * 100).toFixed(1)}%)`);
  console.log('==============================================================\n');

  return { passedCount, totalCount, allPassed: passedCount === totalCount };
}
