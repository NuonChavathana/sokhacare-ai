import { NextRequest, NextResponse } from 'next/server';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';
import { getNearbyFacilities } from '@/lib/location/geo-utils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  triageLevel?: 'emergency' | 'urgent' | 'routine' | 'info';
  quickReplies?: string[];
  suggestedActions?: {
    type: 'call_119' | 'call_115' | 'find_facilities' | 'symptoms_triage' | 'rehydrate';
    labelKm: string;
    labelEn: string;
    link?: string;
  }[];
  facilities?: any[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], language = 'km', userLat, userLng } = body;

    const isKm = language === 'km';
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
    const userText = (lastUserMessage?.content || '').trim().toLowerCase();

    if (!userText) {
      return NextResponse.json(
        {
          success: false,
          error: isKm ? 'សូមបញ្ចូលសាររបស់អ្នក' : 'Please provide a message'
        },
        { status: 400 }
      );
    }

    // 1. Check for Critical Red-Flag Emergencies
    const isCardiacEmergency =
      userText.includes('ណែនទ្រូង') ||
      userText.includes('ចាក់ទ្រូង') ||
      userText.includes('ចុកទ្រូង') ||
      userText.includes('សង្កត់ទ្រូង') ||
      userText.includes('chest pain') ||
      userText.includes('crushing chest') ||
      userText.includes('pressure on chest') ||
      (userText.includes('បេះដូង') && (userText.includes('ហត់') || userText.includes('ដង្ហើម') || userText.includes('ញ័រខ្លាំង')));

    const isBreathingEmergency =
      userText.includes('ពិបាកដកដង្ហើម') ||
      userText.includes('ស្ទះដង្ហើម') ||
      userText.includes('ខ្យល់មិនចូល') ||
      userText.includes('severe shortness of breath') ||
      userText.includes('cannot breathe') ||
      userText.includes('asphyxia');

    const isStrokeEmergency =
      userText.includes('វៀចមាត់') ||
      userText.includes('ទន់ដៃជើង') ||
      userText.includes('ខ្វិន') ||
      userText.includes('និយាយមិនច្បាស់ភ្លាមៗ') ||
      userText.includes('facial drooping') ||
      userText.includes('slurred speech') ||
      userText.includes('arm weakness');

    const isBleedingEmergency =
      userText.includes('ធ្លាក់ឈាម') ||
      userText.includes('ក្អួតឈាម') ||
      userText.includes('ឈាមមិនឈប់') ||
      userText.includes('bleeding heavily') ||
      userText.includes('vomiting blood');

    if (isCardiacEmergency || isBreathingEmergency || isStrokeEmergency || isBleedingEmergency) {
      const emergencyFacilities = getNearbyFacilities(CAMBODIA_FACILITIES, userLat, userLng, 'hospital', 3);

      let emergencyReply = '';
      if (isCardiacEmergency) {
        emergencyReply = isKm
          ? `🚨 **សញ្ញាអាសន្នបេះដូងធ្ងន់ធ្ងរ (CRITICAL CARDIAC EMERGENCY)**\n\nអាការៈឈឺណែនទ្រូង ឬសង្កត់ទ្រូងរួមជាមួយការពិបាកដកដង្ហើម អាចជាសញ្ញានៃវិបត្តិស្ទះសរសៃឈាមបេះដូងស្រួចស្រាវ (Acute Coronary Syndrome)។\n\n**សកម្មភាពបន្ទាន់ដែលត្រូវធ្វើភ្លាមៗ៖**\n1. **ទូរស័ព្ទទៅកាន់ 119 (សេវាសង្គ្រោះបន្ទាន់កម្ពុជា)** ឬឱ្យអ្នកនៅក្បែរដឹកបញ្ជូនទៅកាន់ផ្នែកសង្គ្រោះបន្ទាន់នៃមន្ទីរពេទ្យធំដែលនៅជិតបំផុតភ្លាមៗ។\n2. ឱ្យអ្នកជំងឺអង្គុយសម្រាកស្ងៀម កុំធ្វើចលនាខ្លាំង ឬដើរទៅមក។\n3. ដោះបន្ធូរសម្លៀកបំពាក់ជុំវិញក និងទ្រូងឱ្យមានខ្យល់ចេញចូលស្រួល។\n4. កុំបើកបរដោយខ្លួនឯងជាដាច់ខាត។`
          : `🚨 **CRITICAL CARDIAC EMERGENCY ALERT**\n\nChest pressure, tightness, or radiating discomfort with breathing difficulty can indicate an Acute Coronary Syndrome or heart attack.\n\n**Immediate Emergency Actions:**\n1. **Call 119 (Cambodian Ambulance Emergency)** immediately or have someone transport you to the nearest 24/7 hospital emergency room.\n2. Sit down, rest in a comfortable upright position, and avoid physical exertion.\n3. Loosen tight clothing around the neck and chest.\n4. DO NOT drive yourself to the hospital.`;
      } else if (isStrokeEmergency) {
        emergencyReply = isKm
          ? `🚨 **សញ្ញាអាសន្នដាច់សរសៃឈាមខួរក្បាល (STROKE / FAST ALERT)**\n\nអាការៈវៀចមាត់ ទន់ដៃជើង ឬពិបាកនិយាយភ្លាមៗ គឺជាសញ្ញាគ្រោះថ្នាក់នៃជំងឺដាច់សរសៃឈាមខួរក្បាល (Stroke) ដែលត្រូវការការសង្គ្រោះក្នុង "ម៉ោងមាស" (Golden Hour)។\n\n**សកម្មភាពបន្ទាន់៖**\n1. **ទូរស័ព្ទទៅ 119 ជាបន្ទាន់** ដើម្បីបញ្ជូនទៅមន្ទីរពេទ្យដែលមានផ្នែកប្រព័ន្ធប្រសាទ (ដូចជា មន្ទីរពេទ្យកាល់ម៉ែត ឬមន្ទីរពេទ្យមិត្តភាពខ្មែរ-សូវៀត)។\n2. ចងចាំម៉ោងដែលរោគសញ្ញាចាប់ផ្តើមដំបូងយ៉ាងជាក់លាក់។\n3. កុំឱ្យអ្នកជំងឺញ៉ាំទឹក ឬអាហារព្រោះអាចស្លាក់។`
          : `🚨 **ACUTE STROKE / FAST EMERGENCY**\n\nSudden facial weakness, arm/leg numbness, or slurred speech are critical indicators of a stroke requiring urgent intervention within the golden hour window.\n\n**Immediate Actions:**\n1. **Call 119 immediately** for ambulance dispatch to a hospital equipped with stroke/neurology care.\n2. Note the exact time symptoms began.\n3. Do not offer food, water, or medication due to aspiration risk.`;
      } else {
        emergencyReply = isKm
          ? `🚨 **ស្ថានភាពសង្គ្រោះបន្ទាន់ផ្នែកវេជ្ជសាស្ត្រ (MEDICAL EMERGENCY)**\n\nរោគសញ្ញារបស់អ្នកត្រូវការការពិនិត្យ និងសង្គ្រោះបន្ទាន់ពីក្រុមគ្រូពេទ្យជំនាញជាបន្ទាន់បំផុត។\n\n**សូមអនុវត្ត៖**\n- ទូរស័ព្ទទៅកាន់លេខ **119** ឬទៅកាន់បន្ទប់សង្គ្រោះបន្ទាន់ (Emergency Room) ដែលនៅជិតបំផុត។\n- ប្រសិនបើមានហូរឈាម សូមសង្កត់ដោយក្រណាត់ស្អាតផ្ទាល់លើមុខរបួស។`
          : `🚨 **CRITICAL MEDICAL EMERGENCY**\n\nYour symptoms indicate a severe condition requiring immediate professional medical attention.\n\n**Action Steps:**\n- Call **119** immediately or proceed to the nearest emergency room.\n- If severe bleeding is present, apply direct firm pressure with a clean cloth.`;
      }

      return NextResponse.json({
        success: true,
        message: {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: emergencyReply,
          timestamp: new Date().toISOString(),
          triageLevel: 'emergency',
          quickReplies: isKm
            ? ['ហៅ 119 ឥឡូវនេះ', 'ស្វែងរកមន្ទីរពេទ្យជិតបំផុត', 'ពិនិត្យហានិភ័យបេះដូងលម្អិត']
            : ['Call 119 Now', 'Find Nearest Hospitals', 'Detailed Heart Triage'],
          suggestedActions: [
            {
              type: 'call_119',
              labelKm: '📞 ហៅទូរស័ព្ទសង្គ្រោះបន្ទាន់ 119',
              labelEn: '📞 Call 119 Ambulance',
              link: 'tel:119'
            },
            {
              type: 'find_facilities',
              labelKm: '🏥 មន្ទីរពេទ្យសង្គ្រោះបន្ទាន់ជិតបំផុត',
              labelEn: '🏥 Nearest Emergency Hospitals',
              link: '/facilities'
            },
            {
              type: 'symptoms_triage',
              labelKm: '🩺 ពិនិត្យរោគសញ្ញាលម្អិត',
              labelEn: '🩺 Full Symptoms Triage',
              link: '/predict'
            }
          ],
          facilities: emergencyFacilities
        }
      });
    }

    // 2. Check for Specific Health Conditions
    const isDengue =
      userText.includes('គ្រុនឈាម') ||
      userText.includes('dengue') ||
      (userText.includes('ក្តៅខ្លួន') && (userText.includes('ចុកភ្នែក') || userText.includes('កន្ទួល') || userText.includes('ឈឺសន្លាក់')));

    const isFluOrCold =
      userText.includes('ផ្តាសាយ') ||
      userText.includes('ក្អក') ||
      userText.includes('ឈឺក') ||
      userText.includes('flu') ||
      userText.includes('cold') ||
      userText.includes('cough') ||
      userText.includes('sore throat');

    const isGastro =
      userText.includes('រាក') ||
      userText.includes('ក្អួត') ||
      userText.includes('ពុលចំណី') ||
      userText.includes('diarrhea') ||
      userText.includes('vomiting') ||
      userText.includes('food poisoning') ||
      userText.includes('stomach ache');

    const isAppendicitis =
      userText.includes('ចុកពោះខាងស្តាំ') ||
      userText.includes('រលាកខ្នែងពោះវៀន') ||
      userText.includes('right lower abdomen') ||
      userText.includes('appendicitis');

    const isBP =
      userText.includes('លើសឈាម') ||
      userText.includes('សម្ពាធឈាម') ||
      userText.includes('blood pressure') ||
      userText.includes('hypertension') ||
      userText.includes('វិលមុខ');

    let botResponse = '';
    let triageLevel: 'emergency' | 'urgent' | 'routine' | 'info' = 'routine';
    let quickReplies: string[] = [];

    if (isDengue) {
      triageLevel = 'urgent';
      botResponse = isKm
        ? `🦟 **ការវាយតម្លៃរោគសញ្ញាសង្ស័យជំងឺគ្រុនឈាម (Dengue Fever Assessment)**\n\nរោគសញ្ញាក្តៅខ្លួនខ្លាំង រួមជាមួយការឈឺចុកគ្រាប់ភ្នែក ឈឺសន្លាក់ ឬឡើងកន្ទួលក្រហម អាចជាសញ្ញានៃជំងឺគ្រុនឈាម ដែលជាជំងឺឧស្សាហ៍ជួបប្រទះនៅកម្ពុជា។\n\n**ការណែនាំថែទាំបឋម៖**\n- 💧 **ផឹកទឹកឱ្យបានច្រើន** ជាពិសេសទឹកអូរ៉ាលីត (ORS) ទឹកដូង ឬទឹកផ្លែឈើស្រស់ ដើម្បីការពារការខ្វះជាតិទឹក។\n- 💊 **ប្រើតែថ្នាំ Paracetamol (ប៉ារ៉ាសេតាម៉ុល)** តាមកម្រិតត្រឹមត្រូវ ដើម្បីបញ្ចុះកម្តៅ។ **ហាមប្រើថ្នាំ Aspirin ឬ Ibuprofen ជាដាច់ខាត** ព្រោះអាចបណ្តាលឱ្យធ្លាក់ឈាមក្នុងក្រពះ។\n- 🏥 **សញ្ញាគ្រោះថ្នាក់ដែលត្រូវទៅពេទ្យជាបន្ទាន់៖** ក្អួតមិនបាត់ ឈឺពោះខ្លាំង ហូរឈាមតាមអញ្ចាញធ្មេញ ឬច្រមុះ អស់កម្លាំងល្ហិតល្ហៃខ្លាំង ឬត្រជាក់ចុងដៃចុងជើង។\n\n*តើអ្នកមានអាការៈក្តៅខ្លួននេះប៉ុន្មានថ្ងៃហើយដែរ?*`
        : `🦟 **Suspected Dengue Fever Assessment**\n\nHigh fever accompanied by eye ache, body pain, or skin rash warrants careful monitoring for Dengue, common in Southeast Asia.\n\n**Home Care Guidance:**\n- 💧 **Hydrate aggressively** with Oral Rehydration Salts (ORS), coconut water, or clean fluids.\n- 💊 **Use only Paracetamol** for fever. **NEVER use Aspirin or Ibuprofen**, as they drastically increase hemorrhage risk.\n- 🏥 **Warning Signs for Immediate Hospitalization:** Persistent vomiting, severe abdominal pain, bleeding gums/nose, extreme lethargy, or cold clammy extremities.\n\n*How many days have you had the fever, and what is your current temperature?*`;
      quickReplies = isKm
        ? ['ក្តៅខ្លួន ១-២ ថ្ងៃហើយ', 'មានសញ្ញាកន្ទួលក្រហម', 'តើគួរទៅធ្វើតេស្តឈាមនៅណា?']
        : ['Fever for 1-2 days', 'Has skin rash', 'Where to get blood tested?'];
    } else if (isGastro) {
      triageLevel = 'routine';
      botResponse = isKm
        ? `💧 **ការវាយតម្លៃរោគសញ្ញារាករូស និងពុលចំណី (Gastroenteritis / Food Poisoning)**\n\nការរាក និងក្អួតអាចបណ្តាលមកពីការឆ្លងមេរោគក្នុងអាហារ ឬទឹក (Food poisoning/Infection)។ អ្វីដែលសំខាន់បំផុតគឺការការពារកុំឱ្យរាងកាយខ្វះជាតិទឹក និងជាតិរ៉ែ។\n\n**វិធានការថែទាំ៖**\n1. **ផឹកសូលុយស្យុងអូរ៉ាលីត (ORS)** ញឹកញាប់ម្តងបន្តិចៗ (១ កែវរាល់ពេលបន្ទោរបង់ម្តង)។\n2. ញ៉ាំអាហារទន់ៗ ងាយរំលាយ ដូចជាបបរខាប់ក្តៅៗ ស៊ុបមាន់ ឬចេកណាំវ៉ា។ ចៀសវាងអាហារហឹរ ខ្លាញ់ ទឹកដោះគោ និងគ្រឿងស្រវឹង។\n3. សម្រាកឱ្យបានច្រើន។\n\n⚠️ **ត្រូវទៅមន្ទីរពេទ្យភ្លាម ប្រសិនបើ៖** បន្ទោរបង់មានឈាម ក្តៅខ្លួនលើសពី 38.5°C មិនអាចញ៉ាំទឹកបានទាល់តែសោះ ឬមានសញ្ញាខ្សោះជាតិទឹកខ្លាំង (ភ្នែកខូង បបូរមាត់ស្ងួតខ្លាំង មិននោមលើសពី ៦ ម៉ោង)។`
        : `💧 **Gastroenteritis & Food Poisoning Assessment**\n\nDiarrhea and vomiting often stem from foodborne bacteria or viruses. Preventing dehydration is the paramount priority.\n\n**Actionable Care:**\n1. **Drink Oral Rehydration Salts (ORS)** continuously in small, frequent sips.\n2. Eat bland, easily digestible foods (rice porridge/congee, bananas, broths). Avoid spicy, oily foods and dairy.\n3. Rest thoroughly.\n\n⚠️ **Seek Medical Care If:** Stools contain blood, fever exceeds 38.5°C, unable to keep liquids down, or severe dehydration occurs (sunken eyes, no urination for 6+ hours).`;
      quickReplies = isKm
        ? ['រាកលើសពី ៥ ដងហើយ', 'មានក្តៅខ្លួនតិចតួច', 'ស្វែងរកមណ្ឌលសុខភាពជិតបំផុត']
        : ['Diarrhea > 5 times', 'Mild fever present', 'Find nearby clinic'];
    } else if (isAppendicitis) {
      triageLevel = 'urgent';
      botResponse = isKm
        ? `⚠️ **ការសង្ស័យរលាកខ្នែងពោះវៀន (Possible Appendicitis Alert)**\n\nការឈឺចុកចាប់នៅផ្នែកពោះខាងស្តាំក្រោម (Right Lower Quadrant) រួមជាមួយអាការៈចង្អោរ ឬក្តៅខ្លួន អាចជាសញ្ញានៃជំងឺរលាកខ្នែងពោះវៀនស្រួចស្រាវ។\n\n**ការណែនាំសំខាន់បំផុត៖**\n1. **សូមកុំលេបថ្នាំបំបាត់ការឈឺចាប់ខ្លាំង ឬថ្នាំបញ្ចុះលាមក** ព្រោះអាចធ្វើឱ្យពិបាកធ្វើរោគវិនិច្ឆ័យ ឬអាចបណ្តាលឱ្យបែកខ្នែងពោះវៀន។\n2. **កុំដាក់ស្អំកម្តៅលើពោះ។**\n3. **ត្រូវទៅកាន់មន្ទីរពេទ្យដែលមានផ្នែកវះកាត់ជាបន្ទាន់** ដើម្បីធ្វើការពិនិត្យអេកូ (Ultrasound) ឬពិនិត្យឈាម។`
        : `⚠️ **Suspected Acute Appendicitis Alert**\n\nSharp or worsening localized pain in the right lower abdomen with nausea or low fever can indicate appendicitis.\n\n**Critical Precautions:**\n1. **DO NOT take strong painkillers or laxatives**, as they mask diagnostic peritoneal signs or risk perforation.\n2. **DO NOT apply heat pads to the abdomen.**\n3. **Proceed to a surgical hospital promptly** for ultrasound and white blood cell evaluation.`;
      quickReplies = isKm
        ? ['ឈឺចាក់ខ្លាំងពេលចុចលែង', 'ស្វែងរកមន្ទីរពេទ្យវះកាត់ជិតបំផុត']
        : ['Rebound tenderness present', 'Find surgical hospital'];
    } else if (isBP) {
      triageLevel = 'urgent';
      botResponse = isKm
        ? `🩺 **ការវាយតម្លៃសម្ពាធឈាម និងសុខភាពសរសៃឈាមបេះដូង (Blood Pressure & Vascular Assessment)**\n\nសម្ពាធឈាមធម្មតាគឺស្ថិតនៅក្រោម 120/80 mmHg។ ប្រសិនបើសម្ពាធឈាមឡើងខ្ពស់ (លើសពី 140/90 mmHg) ឬមានអាការៈវិលមុខ ធ្ងន់កញ្ចឹងក និងព្រិលភ្នែក៖\n\n1. **អង្គុយសម្រាកស្ងប់ស្ងាត់** ក្នុងបន្ទប់ត្រជាក់ប្រហែល ១៥ នាទី រួចវាស់សម្ពាធឈាមម្តងទៀត។\n2. ប្រសិនបើសម្ពាធឈាមលើសពី **180/120 mmHg** (Hypertensive Crisis) ឬមានឈឺក្បាលខ្លាំង ណែនទ្រូង សូមទៅកាន់មន្ទីរពេទ្យភ្លាមៗ។\n3. កាត់បន្ថយការញ៉ាំប្រៃ ជៀសវាងបារី និងកាត់បន្ថយភាពតានតឹង។\n\n*តើអ្នកបានវាស់សម្ពាធឈាមឃើញប៉ុន្មានដែរ ឬមានប្រវត្តិប្រើថ្នាំលើសឈាមជាប្រចាំទេ?*`
        : `🩺 **Hypertension & Blood Pressure Assessment**\n\nNormal blood pressure is below 120/80 mmHg. If your readings exceed 140/90 mmHg or you experience dizziness and neck stiffness:\n\n1. **Sit and rest calmly** in a cool area for 15 minutes before re-measuring.\n2. If systolic exceeds **180 mmHg** or diastolic exceeds **120 mmHg** (Crisis range), or if accompanied by chest pain or severe headache, seek immediate emergency care.\n3. Reduce sodium intake and avoid smoking.\n\n*What was your latest blood pressure reading, and do you currently take antihypertensive medication?*`;
      quickReplies = isKm
        ? ['សម្ពាធឈាម ១៤០/៩០', 'មានប្រវត្តិលើសឈាម', 'ពិនិត្យហានិភ័យបេះដូង AI']
        : ['BP is 140/90', 'History of hypertension', 'Run AI Heart Triage'];
    } else if (isFluOrCold) {
      triageLevel = 'routine';
      botResponse = isKm
        ? `🧣 **ការណែនាំថែទាំជំងឺផ្តាសាយ និងរលាកផ្លូវដង្ហើម (Common Cold / Upper Respiratory Infection)**\n\nជំងឺផ្តាសាយភាគច្រើនបណ្តាលមកពីវីរុសផ្លូវដង្ហើម ហើយជាទូទៅអាចជាសះស្បើយក្នុងរយៈពេល ៥ ទៅ ៧ ថ្ងៃ។\n\n**ការថែទាំសុខភាព៖**\n- 🫖 **ផឹកទឹកក្តៅឧណ្ហៗ ទឹកក្រូចឆ្មារទឹកឃ្មុំ** និងស៊ុបក្តៅ ដើម្បីសម្រួលបំពង់ក។\n- 🧂 **ខ្ពុរមាត់ជាមួយទឹកអំបិលក្តៅឧណ្ហៗ** ២-៣ ដងក្នុងមួយថ្ងៃ។\n- 😴 **គេងសម្រាកឱ្យបានគ្រប់គ្រាន់** (៧-៨ ម៉ោង) និងពាក់ម៉ាស់ដើម្បីការពារការឆ្លងដល់សមាជិកគ្រួសារ។\n- 💊 ប្រើថ្នាំបំបាត់ការឈឺក្បាល ឬកាត់បន្ថយការតឹងច្រមុះតាមការណែនាំរបស់ឱសថការី។\n\n*តើអ្នកមានអាការៈក្តៅខ្លួនខ្លាំង ឬពិបាកដកដង្ហើមដែរទេ?*`
        : `🧣 **Cold & Respiratory Infection Guidance**\n\nMost common cold symptoms are viral and resolve naturally within 5 to 7 days with supportive care.\n\n**Self-Care Actions:**\n- 🫖 **Drink warm fluids, lemon honey tea**, and nourishing broths to soothe throat irritation.\n- 🧂 **Gargle with warm salt water** 2-3 times daily.\n- 😴 **Prioritize deep rest** and wear a mask around household members.\n- 💊 Use pharmacist-recommended decongestants or antipyretics if needed.\n\n*Are you experiencing high fevers or shortness of breath?*`;
      quickReplies = isKm
        ? ['ផ្តាសាយ ៣ ថ្ងៃហើយ', 'មានក្អកស្ងួត', 'តើគួរញ៉ាំថ្នាំអ្វី?']
        : ['Cold for 3 days', 'Dry cough present', 'Recommended medications?'];
    } else {
      // General Conversational Health Response
      triageLevel = 'info';
      botResponse = isKm
        ? `👋 **សូមស្វាគមន៍មកកាន់ SokhaCare AI!**\n\nខ្ញុំជាជំនួយការ AI វេជ្ជសាស្ត្រឆ្លាតវៃសម្រាប់ប្រជាជនកម្ពុជា។ ខ្ញុំអាចជួយលោកអ្នក៖\n- 🔍 **វិភាគរោគសញ្ញាបឋម** (ជំងឺបេះដូង គ្រុនឈាម ផ្តាសាយ ពុលចំណី រលាកសួត...)\n- 🚨 **ស្វែងរកសញ្ញាអាសន្ន** ដែលត្រូវទៅពេទ្យបន្ទាន់\n- 🏥 **ណែនាំមន្ទីរពេទ្យ និងមណ្ឌលសុខភាពឯកទេស** នៅទូទាំង ២៥ រាជធានី-ខេត្ត\n- 🎙️ **និយាយពិគ្រោះជាសំឡេងខ្មែរ** ដោយផ្ទាល់\n\nសូមរៀបរាប់ពីអាការៈ ឬសំណួរសុខភាពរបស់លោកអ្នកដោយសេរី។`
        : `👋 **Welcome to SokhaCare AI Health Assistant!**\n\nI am your interactive digital health companion in Cambodia. I can assist you with:\n- 🔍 **Preliminary symptom assessment** (Cardiovascular risks, Dengue, Flu, Gastro, Pneumonia)\n- 🚨 **Red-flag emergency detection** for urgent hospital routing\n- 🏥 **Specialized hospital directory** across all 25 Cambodian provinces\n- 🎙️ **Bilingual voice interaction** in Khmer and English\n\nFeel free to describe your symptoms or ask any health question.`;
      quickReplies = isKm
        ? ['ខ្ញុំឈឺណែនទ្រូង', 'កូនខ្ញុំក្តៅខ្លួនខ្លាំង', 'ស្វែងរកមន្ទីរពេទ្យកាល់ម៉ែត', 'ពិនិត្យរោគសញ្ញាជំងឺទូទៅ']
        : ['I have chest discomfort', 'Child has high fever', 'Find nearby hospitals', 'General Disease Triage'];
    }

    return NextResponse.json({
      success: true,
      message: {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botResponse,
        timestamp: new Date().toISOString(),
        triageLevel,
        quickReplies,
        suggestedActions: [
          {
            type: 'symptoms_triage',
            labelKm: '🩺 ពិនិត្យរោគសញ្ញា & ហានិភ័យ',
            labelEn: '🩺 Full Symptoms Triage',
            link: '/predict'
          },
          {
            type: 'find_facilities',
            labelKm: '🏥 ស្វែងរកមន្ទីរពេទ្យជិតបំផុត',
            labelEn: '🏥 Find Nearby Hospitals',
            link: '/facilities'
          }
        ]
      }
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process chat message',
        message: error?.message || 'Unexpected server error'
      },
      { status: 500 }
    );
  }
}
