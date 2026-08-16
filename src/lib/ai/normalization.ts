/**
 * Language & Text Normalization for SokhaCare AI.
 * Handles Khmer, English, Code-Switching, Typos, and Speech-to-Text / ASR inaccuracies.
 */

const TYPO_MAP: Record<string, string> = {
  // English typos & phonetic variations
  sich: 'sick',
  sik: 'sick',
  sic: 'sick',
  ches: 'chest',
  chect: 'chest',
  chset: 'chest',
  stomachace: 'stomachache',
  stomack: 'stomach',
  stomackache: 'stomachache',
  stomache: 'stomachache',
  stomuch: 'stomach',
  bellyache: 'stomachache',
  headach: 'headache',
  headeache: 'headache',
  hedache: 'headache',
  hedake: 'headache',
  feever: 'fever',
  fevr: 'fever',
  diareah: 'diarrhea',
  diaria: 'diarrhea',
  diarea: 'diarrhea',
  diarhea: 'diarrhea',
  vomitng: 'vomiting',
  vomitting: 'vomiting',
  caugh: 'cough',
  coff: 'cough',
  dengu: 'dengue',
  dengie: 'dengue',
  bp: 'blood pressure',
  hypertention: 'hypertension',
  dizzy: 'dizziness',
  dizy: 'dizziness',
  shorness: 'shortness',
  breathe: 'breathing',
  breth: 'breathing',
  asphixia: 'asphyxia',
  infact: 'infant',
  pains: 'pain'
};

const KHMER_NORMALIZATIONS: [RegExp, string][] = [
  [/[\u200B-\u200D\uFEFF]/g, ''], // Zero-width spaces
  [/សួស្ដី/g, 'សួស្តី'],
  [/ជម្រាបសួរ/g, 'ជំរាបសួរ'],
  [/ញាំ/g, 'ញ៉ាំ'],
  [/ញាំបាយ/g, 'ញ៉ាំអាហារ'],
  [/ញ៉ាំបាយ/g, 'ញ៉ាំអាហារ'],
  [/ញ៉ាំហើយ/g, 'ក្រោយញ៉ាំអាហារ'],
  [/ក្រោយញាំ/g, 'ក្រោយញ៉ាំអាហារ'],
  [/ក្រោយញ៉ាំ/g, 'ក្រោយញ៉ាំអាហារ'],
  [/ចុកពោះខ្លាំងណាស់/g, 'ចុកពោះខ្លាំង'],
  [/ឈឺពោះខ្លាំងណាស់/g, 'ឈឺពោះខ្លាំង'],
  [/ឈឺក្បាលខ្លាំងណាស់/g, 'ឈឺក្បាលខ្លាំង'],
  [/ក្អួតឈាម/g, 'ក្អួតមានឈាម'],
  [/លាមកខ្មៅ/g, 'បន្ទោរបង់ពណ៌ខ្មៅ']
];

export function normalizeMedicalText(input: string): string {
  if (!input) return '';

  let normalized = input.trim();

  // 1. Khmer specific character cleaning
  for (const [pattern, replacement] of KHMER_NORMALIZATIONS) {
    normalized = normalized.replace(pattern, replacement);
  }

  // 2. English lowercase & typo correction
  const words = normalized.split(/\s+/);
  const correctedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (TYPO_MAP[cleanWord]) {
      return TYPO_MAP[cleanWord];
    }
    return w;
  });

  return correctedWords.join(' ');
}
