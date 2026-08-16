import { GeneralDiseaseProfile, GeneralDiseaseSymptom } from '@/types/generalDisease';

/**
 * Standard Predefined Symptoms Catalog (Bilingual Khmer & English)
 */
export const GENERAL_SYMPTOMS_CATALOG: GeneralDiseaseSymptom[] = [
  // Fever & Systemic
  { id: 'fever', nameEn: 'Fever / High Body Temperature', nameKm: 'ក្តៅខ្លួន / ឡើងកម្តៅ', category: 'fever' },
  { id: 'high_fever_spiking', nameEn: 'Sudden High Fever (>39°C)', nameKm: 'ក្តៅខ្លួនខ្លាំងភ្លាមៗ (>39°C)', category: 'fever', isRedFlag: true },
  { id: 'chills_shivering', nameEn: 'Chills & Rigors / Shivering', nameKm: 'រងាក់រងើ / ញាក់', category: 'fever' },
  { id: 'sweating_night_sweats', nameEn: 'Profuse Sweating', nameKm: 'បែកញើសខ្លាំង', category: 'fever' },
  { id: 'fatigue_weakness', nameEn: 'Severe Fatigue & Weakness', nameKm: 'អស់កម្លាំងខ្លាំង / ល្ហិតល្ហៃ', category: 'systemic' },
  { id: 'muscle_joint_aches', nameEn: 'Muscle & Body Aches (Myalgia)', nameKm: 'ឈឺសាច់ដុំ និងសន្លាក់ឆ្អឹង', category: 'systemic' },
  { id: 'weight_loss', nameEn: 'Unexplained Weight Loss', nameKm: 'ស្រកទម្ងន់ខុសប្រក្រតី', category: 'systemic' },

  // Respiratory & ENT
  { id: 'cough_dry', nameEn: 'Dry Cough', nameKm: 'ក្អកស្ងួត', category: 'respiratory' },
  { id: 'cough_productive', nameEn: 'Productive Cough with Phlegm', nameKm: 'ក្អកមានស្លេស្ម', category: 'respiratory' },
  { id: 'cough_blood', nameEn: 'Coughing up Blood (Hemoptysis)', nameKm: 'ក្អកធ្លាក់ឈាម', category: 'respiratory', isRedFlag: true },
  { id: 'shortness_of_breath', nameEn: 'Shortness of Breath / Wheezing', nameKm: 'ពិបាកដកដង្ហើម / ហត់ដង្ហក់', category: 'respiratory', isRedFlag: true },
  { id: 'chest_pain_breathing', nameEn: 'Chest Pain When Breathing/Coughing', nameKm: 'ឈឺចាក់ទ្រូងពេលដកដង្ហើម ឬក្អក', category: 'respiratory', isRedFlag: true },
  { id: 'sore_throat', nameEn: 'Sore Throat / Painful Swallowing', nameKm: 'ឈឺបំពង់ក / ពិបាកលេបទឹកមាត់', category: 'respiratory' },
  { id: 'runny_nose_congestion', nameEn: 'Runny Nose / Nasal Congestion', nameKm: 'ហៀរសំបោរ / តឹងច្រមុះ', category: 'respiratory' },
  { id: 'sneezing', nameEn: 'Frequent Sneezing', nameKm: 'កណ្តាស់ញឹកញាប់', category: 'respiratory' },
  { id: 'loss_of_smell_taste', nameEn: 'Loss of Smell or Taste', nameKm: 'បាត់បង់ក្លិន ឬរសជាតិ', category: 'respiratory' },

  // Gastrointestinal
  { id: 'nausea_vomiting', nameEn: 'Nausea & Vomiting', nameKm: 'ចង្អោរ និងក្អួត', category: 'gastrointestinal' },
  { id: 'vomiting_persistent', nameEn: 'Persistent Vomiting / Inability to drink', nameKm: 'ក្អួតញឹកញាប់ / មិនអាចញ៉ាំទឹកបាន', category: 'gastrointestinal', isRedFlag: true },
  { id: 'vomiting_blood', nameEn: 'Vomiting Blood or Dark Coffee-ground', nameKm: 'ក្អួតមានឈាម ឬពណ៌ក្រម៉ៅ', category: 'gastrointestinal', isRedFlag: true },
  { id: 'watery_diarrhea', nameEn: 'Watery Diarrhea', nameKm: 'រាករូសទឹក / រាកញឹកញាប់', category: 'gastrointestinal' },
  { id: 'bloody_stool', nameEn: 'Bloody or Black Stools', nameKm: 'បត់ជើងធំមានឈាម ឬលាមកខ្មៅ', category: 'gastrointestinal', isRedFlag: true },
  { id: 'abdominal_cramps', nameEn: 'Abdominal Pain & Cramps', nameKm: 'ចុកពោះ / ឈឺពោះរមួល', category: 'gastrointestinal' },
  { id: 'severe_rlq_pain', nameEn: 'Severe Sharp Pain in Right Lower Belly', nameKm: 'ឈឺចុកខ្លាំងពោះផ្នែកខាងស្តាំក្រោម', category: 'gastrointestinal', isRedFlag: true },
  { id: 'loss_of_appetite', nameEn: 'Loss of Appetite', nameKm: 'មិនឃ្លានបាយ / ញ៉ាំមិនចូល', category: 'gastrointestinal' },

  // Neurological & Head
  { id: 'headache_mild_mod', nameEn: 'Mild to Moderate Headache', nameKm: 'ឈឺក្បាលកម្រិតស្រាលទៅមធ្យម', category: 'neurological' },
  { id: 'severe_sudden_headache', nameEn: 'Worst Sudden Severe Headache', nameKm: 'ឈឺក្បាលធ្ងន់ធ្ងរខ្លាំងភ្លាមៗ', category: 'neurological', isRedFlag: true },
  { id: 'retro_orbital_pain', nameEn: 'Pain Behind the Eyes', nameKm: 'ឈឺចុកគ្រាប់ភ្នែក / ខាងក្រោយភ្នែក', category: 'neurological' },
  { id: 'stiff_neck', nameEn: 'Stiff Neck (Cannot touch chin to chest)', nameKm: 'រឹងកញ្ចឹងក', category: 'neurological', isRedFlag: true },
  { id: 'confusion_altered_mental', nameEn: 'Confusion, Drowsiness, or Hallucinations', nameKm: 'វង្វេងស្មារតី / ងងុយដេកខុសធម្មតា', category: 'neurological', isRedFlag: true },
  { id: 'dizziness_lightheaded', nameEn: 'Dizziness or Lightheadedness', nameKm: 'វិលមុខ ឬស្រាលក្បាល', category: 'neurological' },
  { id: 'seizures_convulsions', nameEn: 'Seizures or Convulsions', nameKm: 'ប្រកាច់', category: 'neurological', isRedFlag: true },

  // Urinary & Metabolic
  { id: 'burning_urination', nameEn: 'Burning Pain During Urination (Dysuria)', nameKm: 'ផ្សាក្តៅ ឬឈឺពេលបត់ជើងតូច', category: 'urinary' },
  { id: 'frequent_urination', nameEn: 'Frequent Urination / Urgency', nameKm: 'នោមញឹកញាប់ / ទប់មិនបាន', category: 'urinary' },
  { id: 'cloudy_foul_urine', nameEn: 'Cloudy or Foul-Smelling Urine', nameKm: 'ទឹកនោមល្អក់ ឬមានក្លិនខុសប្រក្រតី', category: 'urinary' },
  { id: 'excessive_thirst', nameEn: 'Excessive Thirst & Frequent Urination', nameKm: 'ស្រេកទឹកខ្លាំង និងនោមច្រើន', category: 'systemic' },

  // Skin & Bleeding Signs
  { id: 'skin_rash_petechiae', nameEn: 'Skin Rash or Tiny Red Spots (Petechiae)', nameKm: 'កន្ទួលរមាស់ ឬស្នាមអុជក្រហមលើស្បែក', category: 'skin' },
  { id: 'bleeding_gums_nose', nameEn: 'Bleeding Gums or Nosebleeds (Epistaxis)', nameKm: 'ហូរឈាមតាមអញ្ចាញធ្មេញ ឬច្រមុះ', category: 'skin', isRedFlag: true },
  { id: 'itchy_watery_eyes', nameEn: 'Itchy, Red, or Watery Eyes', nameKm: 'រមាស់ភ្នែក / ហៀរទឹកភ្នែក', category: 'skin' }
];

/**
 * Knowledge Base of Common Diseases in Cambodia & Southeast Asia
 */
export const GENERAL_DISEASES_KB: GeneralDiseaseProfile[] = [
  {
    id: 'dengue_fever',
    nameEn: 'Dengue Fever',
    nameKm: 'ជំងឺគ្រុនឈាម',
    category: 'Vector-borne Viral Infection',
    descriptionEn: 'A mosquito-borne viral infection endemic to Cambodia, causing high fever, intense retro-orbital pain, severe body aches, and potential plasma leakage.',
    descriptionKm: 'ជំងឺឆ្លងបង្កដោយមេរោគវីរុសឆ្លងតាមរយៈមូសខ្លាខាំ កើតមានញឹកញាប់នៅកម្ពុជា បង្កឱ្យក្តៅខ្លួនខ្លាំង ឈឺចុកគ្រាប់ភ្នែក និងឈឺសន្លាក់ឆ្អឹងខ្លាំង។',
    urgency: 'urgent',
    primarySymptoms: [
      { symptomId: 'high_fever_spiking', weight: 5 },
      { symptomId: 'retro_orbital_pain', weight: 5 },
      { symptomId: 'muscle_joint_aches', weight: 4 },
      { symptomId: 'skin_rash_petechiae', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'fever', weight: 3 },
      { symptomId: 'nausea_vomiting', weight: 3 },
      { symptomId: 'fatigue_weakness', weight: 3 },
      { symptomId: 'headache_mild_mod', weight: 3 }
    ],
    redFlags: [
      { id: 'rf_dengue_bleed', descEn: 'Bleeding gums, nosebleeds, or blood in vomit/stool', descKm: 'ហូរឈាមតាមអញ្ចាញធ្មេញ ច្រមុះ ឬក្អួត/លាមកមានឈាម' },
      { id: 'rf_dengue_vomit', descEn: 'Persistent vomiting and intense abdominal pain (Warning signs for Dengue Shock)', descKm: 'ក្អួតញឹកញាប់ និងឈឺពោះខ្លាំង (សញ្ញាគ្រោះថ្នាក់គ្រុនឈាមធ្ងន់ធ្ងរ)' }
    ],
    typicalDuration: '3-7 days',
    feverCharacteristic: 'high_continuous',
    recommendationsEn: [
      'Seek prompt medical evaluation at a hospital or health center for a complete blood count (CBC/Platelet test).',
      'Drink plenty of oral rehydration solutions (ORS), coconut water, or clean fluids.',
      'Take Paracetamol for fever; DO NOT take Aspirin or Ibuprofen as they increase bleeding risks.',
      'Monitor closely for warning signs when fever begins to drop around Day 3-5.'
    ],
    recommendationsKm: [
      'សូមប្រញាប់ទៅមន្ទីរពេទ្យ ឬមណ្ឌលសុខភាពដើម្បីពិនិត្យឈាម (ប្លាកែត) ឱ្យបានទាន់ពេលវេលា។',
      'ពិសាទឹកឱ្យបានច្រើន រួមមានទឹកអូរ៉ាលីត (ORS) ទឹកដូង ឬទឹកស្អាត។',
      'ប្រើថ្នាំប៉ារ៉ាសេតាមុលដើម្បីបញ្ចុះកម្តៅ។ ហាមដាច់ខាតមិនត្រូវប្រើ Aspirin ឬ Ibuprofen ឡើយ ព្រោះអាចបង្កឱ្យហូរឈាម។',
      'តាមដានសញ្ញាគ្រោះថ្នាក់ឱ្យបានម៉ត់ចត់នៅពេលកម្តៅចាប់ផ្តើមចុះនៅថ្ងៃទី ៣ ដល់ ៥។'
    ]
  },
  {
    id: 'malaria',
    nameEn: 'Malaria',
    nameKm: 'ជំងឺគ្រុនចាញ់',
    category: 'Vector-borne Parasitic Infection',
    descriptionEn: 'A parasite-borne infection transmitted by Anopheles mosquitoes in forested/rural areas of Cambodia, presenting with cyclical fever, violent shivering chills, and sweats.',
    descriptionKm: 'ជំងឺបង្កដោយប៉ារ៉ាស៊ីតឆ្លងតាមមូសដែកគោលខាំ ជាពិសេសនៅតំបន់ព្រៃភ្នំ បង្កជារោគសញ្ញាក្តៅខ្លួន ញាក់ញ័រ និងបែកញើសជាវដ្ត។',
    urgency: 'urgent',
    primarySymptoms: [
      { symptomId: 'chills_shivering', weight: 5 },
      { symptomId: 'sweating_night_sweats', weight: 4 },
      { symptomId: 'fever', weight: 4 },
      { symptomId: 'headache_mild_mod', weight: 3 }
    ],
    secondarySymptoms: [
      { symptomId: 'muscle_joint_aches', weight: 3 },
      { symptomId: 'fatigue_weakness', weight: 3 },
      { symptomId: 'nausea_vomiting', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_malaria_mental', descEn: 'Confusion, loss of consciousness, or seizures (Cerebral Malaria)', descKm: 'វង្វេងស្មារតី សន្លប់ ឬប្រកាច់ (គ្រុនចាញ់ឡើងខួរក្បាល)' }
    ],
    typicalDuration: '1-2 weeks',
    feverCharacteristic: 'spiking',
    recommendationsEn: [
      'Get an immediate Rapid Diagnostic Test (RDT) or blood smear for malaria at the nearest health center.',
      'If confirmed, complete the full prescribed course of Artemisinin-based Combination Therapy (ACT).',
      'Sleep under insecticide-treated bed nets to prevent transmission.'
    ],
    recommendationsKm: [
      'សូមទៅធ្វើតេស្តឈាមរហ័ស (RDT) រកមេរោគគ្រុនចាញ់នៅមណ្ឌលសុខភាពដែលនៅជិតបំផុតជាបន្ទាន់។',
      'ប្រសិនបើមានមេរោគ សូមលេបថ្នាំព្យាបាលគ្រុនចាញ់ឱ្យបានគ្រប់ចំនួន និងទៀងទាត់តាមវេជ្ជបញ្ជា។',
      'គេងក្នុងមុងជ្រលក់ថ្នាំដើម្បីការពារមូសខាំ។'
    ]
  },
  {
    id: 'typhoid_fever',
    nameEn: 'Typhoid Fever',
    nameKm: 'ជំងឺគ្រុនពោះវៀន',
    category: 'Bacterial Infection',
    descriptionEn: 'A bacterial infection caused by Salmonella typhi through contaminated food or water, causing gradual step-ladder fever, stomach pain, and profound weakness.',
    descriptionKm: 'ជំងឺឆ្លងបាក់តេរីតាមរយៈចំណីអាហារ ឬទឹកមិនស្អាត បណ្តាលឱ្យក្តៅខ្លួនកើនឡើងជាលំដាប់ ឈឺពោះ និងអស់កម្លាំងខ្លាំង។',
    urgency: 'urgent',
    primarySymptoms: [
      { symptomId: 'fever', weight: 4 },
      { symptomId: 'abdominal_cramps', weight: 4 },
      { symptomId: 'fatigue_weakness', weight: 4 },
      { symptomId: 'loss_of_appetite', weight: 3 }
    ],
    secondarySymptoms: [
      { symptomId: 'headache_mild_mod', weight: 3 },
      { symptomId: 'watery_diarrhea', weight: 3 },
      { symptomId: 'muscle_joint_aches', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_typhoid_perf', descEn: 'Severe sharp sudden abdominal pain with rigid belly (Perforation)', descKm: 'ឈឺពោះខ្លាំងភ្លាមៗ និងតឹងរឹងពោះ (សង្ស័យធ្លាយពោះវៀន)' }
    ],
    typicalDuration: '1-3 weeks',
    feverCharacteristic: 'high_continuous',
    recommendationsEn: [
      'Consult a physician for blood or stool culture tests and targeted antibiotic treatment.',
      'Drink only boiled or bottled water and consume thoroughly cooked hot meals.',
      'Maintain strict handwashing hygiene before eating and after using the toilet.'
    ],
    recommendationsKm: [
      'សូមពិគ្រោះជាមួយគ្រូពេទ្យដើម្បីធ្វើតេស្តឈាម ឬលាមក និងទទួលថ្នាំអង់ទីប៊ីយ៉ូទិកត្រឹមត្រូវ។',
      'ពិសាទឹកដាំពុះ ឬទឹកបរិសុទ្ធ និងទទួលទានអាហារឆ្អិនល្អ។',
      'លាងដៃជាមួយសាប៊ូឱ្យបានស្អាតមុនពេលញ៉ាំអាហារ និងក្រោយពេលចេញពីបន្ទប់ទឹក។'
    ]
  },
  {
    id: 'gastroenteritis',
    nameEn: 'Acute Gastroenteritis / Food Poisoning',
    nameKm: 'រលាកក្រពះពោះវៀន / ពុលចំណីអាហារ',
    category: 'Gastrointestinal',
    descriptionEn: 'Inflammation of the digestive tract commonly caused by contaminated food, bacteria, or viruses, presenting with diarrhea, cramps, and vomiting.',
    descriptionKm: 'ការរលាកបំពង់រំលាយអាហារដោយសារមេរោគ ឬពុលចំណីអាហារ បណ្តាលឱ្យរាករូស ក្អួតចង្អោរ និងចុកពោះ។',
    urgency: 'see_doctor',
    primarySymptoms: [
      { symptomId: 'watery_diarrhea', weight: 5 },
      { symptomId: 'nausea_vomiting', weight: 4 },
      { symptomId: 'abdominal_cramps', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'fever', weight: 2 },
      { symptomId: 'fatigue_weakness', weight: 3 },
      { symptomId: 'loss_of_appetite', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_gastro_dehydr', descEn: 'Signs of severe dehydration (sunken eyes, no urine for 8h, extreme thirst, lethargy)', descKm: 'សញ្ញានៃការខ្សោះជាតិទឹកធ្ងន់ធ្ងរ (ភ្នែកខូង អត់បត់ជើងតូចលើស ៨ ម៉ោង ស្រេកទឹកខ្លាំង)' },
      { id: 'rf_gastro_blood', descEn: 'Bloody or black stool, or uncontrolled vomiting', descKm: 'បត់ជើងធំមានឈាម ឬក្អួតខ្លាំងមិនបាត់' }
    ],
    typicalDuration: '1-4 days',
    recommendationsEn: [
      'Drink Oral Rehydration Salts (ORS) packet dissolved in clean water after every loose stool.',
      'Eat bland, soft foods (rice porridge/Bobor, bananas, toast) when vomiting subsides.',
      'Avoid fatty, spicy foods and dairy products until fully recovered.',
      'Seek medical care if diarrhea persists beyond 48 hours or if dehydration signs appear.'
    ],
    recommendationsKm: [
      'ពិសាទឹកអូរ៉ាលីត (ORS) លាយជាមួយទឹកស្អាតបន្ទាប់ពីបត់ជើងរាករាល់លើក ដើម្បីទប់ស្កាត់ការខ្សោះជាតិទឹក។',
      'ទទួលទានបបររាវៗ អាហារទន់ៗងាយរំលាយ។',
      'ចៀសវាងអាហារហឹរ ខ្លាញ់ច្រើន ឬទឹកដោះគោរហូតដល់ជាសះស្បើយ។',
      'ទៅជួបគ្រូពេទ្យប្រសិនបើរាកលើសពី ២ ថ្ងៃ ឬមានសញ្ញាខ្សោះជាតិទឹក។'
    ]
  },
  {
    id: 'pneumonia',
    nameEn: 'Acute Pneumonia',
    nameKm: 'ជំងឺរលាកសួតស្រួចស្រាវ',
    category: 'Respiratory Infection',
    descriptionEn: 'A serious lung infection causing inflammation in the alveoli, characterized by high fever, productive cough, sharp chest pain with breathing, and dyspnea.',
    descriptionKm: 'ការឆ្លងមេរោគធ្ងន់ធ្ងរក្នុងសួត បង្កឱ្យក្តៅខ្លួនខ្លាំង ក្អួតស្លេស្ម ឈឺទ្រូងពេលដកដង្ហើម និងពិបាកដកដង្ហើម។',
    urgency: 'urgent',
    primarySymptoms: [
      { symptomId: 'cough_productive', weight: 5 },
      { symptomId: 'shortness_of_breath', weight: 5 },
      { symptomId: 'fever', weight: 4 },
      { symptomId: 'chest_pain_breathing', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'chills_shivering', weight: 3 },
      { symptomId: 'fatigue_weakness', weight: 3 },
      { symptomId: 'loss_of_appetite', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_pneu_oxygen', descEn: 'Severe respiratory distress, cyanosis (blue lips/fingers), or coughing blood', descKm: 'ពិបាកដកដង្ហើមខ្លាំង ស្បែកឬបបូរមាត់ឡើងពណ៌ស្វាយ ឬក្អកធ្លាក់ឈាម' }
    ],
    typicalDuration: '1-3 weeks',
    feverCharacteristic: 'high_continuous',
    recommendationsEn: [
      'Urgent medical consultation required for chest X-ray and prescription antibiotic/antiviral therapy.',
      'Monitor blood oxygen saturation (SpO2) if a pulse oximeter is available.',
      'Rest in an upright or slightly elevated position to ease breathing.'
    ],
    recommendationsKm: [
      'សូមប្រញាប់ទៅមន្ទីរពេទ្យដើម្បីថតកាំរស្មីអ៊ិច (X-Ray) សួត និងទទួលការព្យាបាលវេជ្ជសាស្ត្រត្រឹមត្រូវ។',
      'សម្រាកក្នុងបន្ទប់មានខ្យល់ចេញចូលល្អ និងគេងកល់ខ្នើយខ្ពស់បន្តិចដើម្បីងាយស្រួលដកដង្ហើម។'
    ]
  },
  {
    id: 'influenza',
    nameEn: 'Influenza (Flu)',
    nameKm: 'ជំងឺផ្តាសាយធំ (Flu)',
    category: 'Viral Respiratory Infection',
    descriptionEn: 'A contagious respiratory illness caused by influenza viruses, with rapid onset of high fever, full-body muscle aches, chills, and cough.',
    descriptionKm: 'ជំងឺឆ្លងផ្លូវដង្ហើមបង្កដោយវីរុសផ្តាសាយធំ បង្កឱ្យក្តៅខ្លួនខ្លាំងភ្លាមៗ ឈឺសាច់ដុំពេញរាងកាយ ញាក់ និងក្អក។',
    urgency: 'see_doctor',
    primarySymptoms: [
      { symptomId: 'fever', weight: 5 },
      { symptomId: 'muscle_joint_aches', weight: 5 },
      { symptomId: 'cough_dry', weight: 4 },
      { symptomId: 'chills_shivering', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'headache_mild_mod', weight: 3 },
      { symptomId: 'sore_throat', weight: 3 },
      { symptomId: 'fatigue_weakness', weight: 4 },
      { symptomId: 'runny_nose_congestion', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_flu_breath', descEn: 'Difficulty breathing or sudden chest tightness', descKm: 'ពិបាកដកដង្ហើម ឬណែនទ្រូងខ្លាំង' }
    ],
    typicalDuration: '5-10 days',
    recommendationsEn: [
      'Get ample bed rest and hydrate with warm water, teas, or broth.',
      'Use fever-reducing medications (Paracetamol) as directed.',
      'Wear a surgical mask to prevent spreading the infection to family members.'
    ],
    recommendationsKm: [
      'សម្រាកឱ្យបានច្រើន និងពិសាទឹកក្តៅឧណ្ហៗឱ្យបានទៀងទាត់។',
      'ប្រើថ្នាំបញ្ចុះកម្តៅតាមការណែនាំ។',
      'ពាក់ម៉ាស់ដើម្បីការពារកុំឱ្យឆ្លងទៅសមាជិកគ្រួសារ។'
    ]
  },
  {
    id: 'common_cold',
    nameEn: 'Common Cold',
    nameKm: 'ជំងឺផ្តាសាយធម្មតា',
    category: 'Upper Respiratory Infection',
    descriptionEn: 'A mild viral infection of the upper respiratory tract causing runny nose, nasal congestion, sneezing, and sore throat.',
    descriptionKm: 'ជំងឺឆ្លងស្រាលនៃផ្លូវដង្ហើមផ្នែកខាងលើ បង្កឱ្យហៀរសំបោរ តឹងច្រមុះ កណ្តាស់ និងឈឺបំពង់កស្រាល។',
    urgency: 'self_care',
    primarySymptoms: [
      { symptomId: 'runny_nose_congestion', weight: 5 },
      { symptomId: 'sneezing', weight: 4 },
      { symptomId: 'sore_throat', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'cough_dry', weight: 3 },
      { symptomId: 'headache_mild_mod', weight: 2 },
      { symptomId: 'fatigue_weakness', weight: 2 }
    ],
    redFlags: [],
    typicalDuration: '3-7 days',
    recommendationsEn: [
      'Rest at home and drink plenty of warm fluids.',
      'Steam inhalation or saline nasal spray can help relieve nasal congestion.',
      'Warm salt water gargle for throat soreness.'
    ],
    recommendationsKm: [
      'សម្រាកនៅផ្ទះ និងពិសាទឹកក្តៅឧណ្ហៗឱ្យបានច្រើន។',
      'លាងច្រមុះជាមួយទឹកអំបិលសេរ៉ូមដើម្បីកាត់បន្ថយការតឹងច្រមុះ។',
      'ខ្ពុរមាត់ជាមួយទឹកអំបិលក្តៅឧណ្ហៗដើម្បីបំបាត់ការឈឺបំពង់ក។'
    ]
  },
  {
    id: 'urinary_tract_infection',
    nameEn: 'Urinary Tract Infection (UTI)',
    nameKm: 'ជំងឺរលាកផ្លូវបង្ហូរនោម (UTI)',
    category: 'Urological Infection',
    descriptionEn: 'A bacterial infection in the urinary system causing burning sensation during urination, pelvic discomfort, and increased urinary frequency.',
    descriptionKm: 'ការឆ្លងបាក់តេរីក្នុងប្រព័ន្ធទឹកនោម បង្កឱ្យផ្សាក្តៅពេលបត់ជើងតូច នោមញឹក និងឈឺចុកក្រោមពោះ។',
    urgency: 'see_doctor',
    primarySymptoms: [
      { symptomId: 'burning_urination', weight: 5 },
      { symptomId: 'frequent_urination', weight: 4 },
      { symptomId: 'cloudy_foul_urine', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'fever', weight: 2 },
      { symptomId: 'abdominal_cramps', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_uti_kidney', descEn: 'High fever, severe flank/back pain, and vomiting (Upper UTI / Pyelonephritis)', descKm: 'ក្តៅខ្លួនខ្លាំង ឈឺចង្កេះចំហៀងខ្លាំង និងក្អួត (សង្ស័យរលាកតម្រងនោម)' }
    ],
    typicalDuration: '3-7 days with antibiotics',
    recommendationsEn: [
      'Visit a clinic or health center for a urinalysis and appropriate antibiotic course.',
      'Drink 2 to 3 liters of water daily to flush bacteria from the urinary tract.',
      'Do not delay urination when the urge arises.'
    ],
    recommendationsKm: [
      'សូមទៅពិនិត្យទឹកនោមនៅគ្លីនិក ឬមណ្ឌលសុខភាព ដើម្បីទទួលថ្នាំព្យាបាលត្រឹមត្រូវ។',
      'ពិសាទឹកស្អាតឱ្យបាន ២ ទៅ ៣ លីត្រក្នុងមួយថ្ងៃ។',
      'ចៀសវាងការទប់នោមយូរ។'
    ]
  },
  {
    id: 'hypertension_urgency',
    nameEn: 'Hypertension / Hypertensive Urgency',
    nameKm: 'ជំងឺលើសសម្ពាធឈាម (លើសឈាមធ្ងន់ធ្ងរ)',
    category: 'Cardiovascular',
    descriptionEn: 'A chronic or acute elevation of blood pressure that can cause headaches, dizziness, and strain on the heart and brain.',
    descriptionKm: 'ការឡើងសម្ពាធឈាមខ្ពស់ខ្លាំង ដែលអាចបណ្តាលឱ្យឈឺក្បាល វិលមុខ និងប៉ះពាល់ដល់បេះដូង និងខួរក្បាល។',
    urgency: 'see_doctor',
    primarySymptoms: [
      { symptomId: 'headache_mild_mod', weight: 4 },
      { symptomId: 'dizziness_lightheaded', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'fatigue_weakness', weight: 2 },
      { symptomId: 'shortness_of_breath', weight: 3 }
    ],
    redFlags: [
      { id: 'rf_htn_crisis', descEn: 'Sudden worst headache, vision changes, chest pain, or weakness on one side of body (Stroke warning)', descKm: 'ឈឺក្បាលខ្លាំងភ្លាមៗ ស្រវាំងភ្នែក ឈឺទ្រូង ឬទន់ដៃជើងមួយចំហៀង (សញ្ញាដាច់សរសៃឈាមខួរក្បាល)' }
    ],
    recommendationsEn: [
      'Check blood pressure immediately with a calibrated cuff.',
      'If systolic BP is above 180 mmHg or diastolic above 120 mmHg without symptoms, contact a doctor promptly.',
      'Reduce dietary salt intake and avoid tobacco/alcohol.'
    ],
    recommendationsKm: [
      'សូមវាស់សម្ពាធឈាមភ្លាមៗ។',
      'ប្រសិនបើសម្ពាធឈាមលើសពី 180/120 mmHg សូមទៅជួបវេជ្ជបណ្ឌិតជាបន្ទាន់។',
      'កាត់បន្ថយការញ៉ាំប្រៃ និងចៀសវាងបារី/គ្រឿងស្រវឹង។'
    ]
  },
  {
    id: 'migraine_headache',
    nameEn: 'Migraine / Severe Headache',
    nameKm: 'ជំងឺឈឺក្បាលប្រកាំង (Migraine)',
    category: 'Neurological',
    descriptionEn: 'A neurological condition causing throbbing headache often on one side, heightened sensitivity to light and sound, and nausea.',
    descriptionKm: 'ជំងឺប្រព័ន្ធប្រសាទបង្កឱ្យឈឺក្បាលញាក់ៗមួយចំហៀង រំខានដោយពន្លឺ និងសំឡេង ព្រមទាំងចង្អោរ។',
    urgency: 'see_doctor',
    primarySymptoms: [
      { symptomId: 'headache_mild_mod', weight: 5 },
      { symptomId: 'nausea_vomiting', weight: 3 },
      { symptomId: 'dizziness_lightheaded', weight: 3 }
    ],
    secondarySymptoms: [
      { symptomId: 'fatigue_weakness', weight: 2 }
    ],
    redFlags: [
      { id: 'rf_migraine_thunder', descEn: 'Thunderclap sudden onset "worst headache of life" or associated with fever and stiff neck', descKm: 'ឈឺក្បាលខ្លាំងភ្លាមៗដូចរន្ទះបាញ់ ឬមានគ្រុនក្តៅនិងរឹងកញ្ចឹងក' }
    ],
    typicalDuration: '4-72 hours',
    recommendationsEn: [
      'Rest in a quiet, dark room with a cool compress on the forehead.',
      'Stay hydrated and avoid known triggers (stress, irregular sleep, bright screens).',
      'Consult a doctor for migraine-specific medications if symptoms recur.'
    ],
    recommendationsKm: [
      'សម្រាកក្នុងបន្ទប់ស្ងាត់ និងងងឹត ដោយស្អំកន្សែងត្រជាក់លើថ្ងាស។',
      'ពិសាទឹកឱ្យបានគ្រប់គ្រាន់ និងចៀសវាងការសម្លឹងអេក្រង់យូរ។',
      'ពិគ្រោះជាមួយគ្រូពេទ្យប្រសិនបើមានអាការៈឈឺក្បាលញឹកញាប់។'
    ]
  },
  {
    id: 'allergic_rhinitis',
    nameEn: 'Allergic Rhinitis',
    nameKm: 'រលាកច្រមុះប្រតិកម្មអាលែហ្ស៊ី',
    category: 'Allergic Condition',
    descriptionEn: 'An allergic response causing sneezing, itchy watery eyes, clear runny nose, and nasal congestion triggered by dust, pollen, or environmental allergens.',
    descriptionKm: 'ប្រតិកម្មអាលែហ្ស៊ីបណ្តាលឱ្យកណ្តាស់ រមាស់ភ្នែក ហៀរសំបោរថ្លាៗ និងតឹងច្រមុះពេលត្រូវធូលី ឬខ្យល់ត្រជាក់។',
    urgency: 'self_care',
    primarySymptoms: [
      { symptomId: 'sneezing', weight: 5 },
      { symptomId: 'itchy_watery_eyes', weight: 5 },
      { symptomId: 'runny_nose_congestion', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'sore_throat', weight: 2 },
      { symptomId: 'headache_mild_mod', weight: 2 }
    ],
    redFlags: [],
    typicalDuration: 'Ongoing or seasonal',
    recommendationsEn: [
      'Identify and minimize exposure to environmental allergens (dust, pet dander, pollen).',
      'Over-the-counter non-drowsy antihistamines or saline nasal rinses can provide relief.',
      'Keep indoor living spaces well-ventilated and clean.'
    ],
    recommendationsKm: [
      'ចៀសវាងកត្តាបង្កអាលែហ្ស៊ី ដូចជាធូលីដី លម្អងផ្កា ឬរោមសត្វ។',
      'ប្រើទឹកអំបិលលាងច្រមុះ ឬថ្នាំប្រឆាំងអាលែហ្ស៊ីតាមការណែនាំរបស់ឱសថការី។',
      'សម្អាតបន្ទប់គេង និងផ្ទះឱ្យមានអនាម័យល្អ។'
    ]
  },
  {
    id: 'appendicitis',
    nameEn: 'Acute Appendicitis',
    nameKm: 'ជំងឺរលាកខ្នែងពោះវៀនស្រួចស្រាវ',
    category: 'Surgical Emergency',
    descriptionEn: 'Acute inflammation of the vermiform appendix presenting with pain starting around the navel and migrating to the right lower abdomen.',
    descriptionKm: 'ការរលាកស្រួចស្រាវនៃខ្នែងពោះវៀន ចាប់ផ្តើមឈឺជុំវិញផ្ចិត រួចរាលដាលទៅពោះខាងស្តាំផ្នែកខាងក្រោម ត្រូវការការវះកាត់បន្ទាន់។',
    urgency: 'emergency',
    primarySymptoms: [
      { symptomId: 'severe_rlq_pain', weight: 5 },
      { symptomId: 'nausea_vomiting', weight: 4 },
      { symptomId: 'loss_of_appetite', weight: 4 }
    ],
    secondarySymptoms: [
      { symptomId: 'fever', weight: 3 },
      { symptomId: 'abdominal_cramps', weight: 3 }
    ],
    redFlags: [
      { id: 'rf_app_rupture', descEn: 'Severe sharp worsening pain in right lower quadrant with high fever and vomiting', descKm: 'ឈឺចុកខ្លាំងនៅពោះផ្នែកខាងស្តាំក្រោម ក្តៅខ្លួនខ្លាំង និងក្អួត (សញ្ញាខ្នែងពោះវៀនបែក)' }
    ],
    typicalDuration: '12-48 hours',
    recommendationsEn: [
      'EMERGENCY: Proceed to the nearest hospital surgical emergency room immediately.',
      'DO NOT eat, drink, or take laxatives/painkillers before being evaluated by a surgeon.'
    ],
    recommendationsKm: [
      'ស្ថានភាពបន្ទាន់៖ សូមប្រញាប់ទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់នៃមន្ទីរពេទ្យជាបន្ទាន់។',
      'ហាមបរិភោគអាហារ ទឹក ឬលេបថ្នាំបំបាត់ការឈឺចាប់មុនពេលជួបគ្រូពេទ្យវះកាត់។'
    ]
  }
];
