import { HealthcareFacility } from '@/types/triage';

export const CAMBODIA_FACILITIES: HealthcareFacility[] = [
  // PHNOM PENH
  {
    id: 'pp-calmette',
    name_km: 'មន្ទីរពេទ្យកាល់ម៉ែត',
    name_en: 'Calmette Hospital',
    type: 'hospital',
    province: 'Phnom Penh',
    district: 'Daun Penh',
    address_km: 'មហាវិថីព្រះមុនីវង្ស សង្កាត់ស្រះចក ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
    address_en: '3 Monivong Blvd, Srah Chak, Daun Penh, Phnom Penh',
    latitude: 11.5835,
    longitude: 104.9189,
    phone: '+855 23 426 948',
    emergency_phone: '119 / +855 23 426 948',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'ផ្នែកសង្គ្រោះបន្ទាន់ (Emergency Care)',
      'ផ្នែកបេះដូង (Cardiology)',
      'ផ្នែកវះកាត់ (Surgery)',
      'ផ្នែកជំងឺទូទៅ (General Medicine)',
      'ផ្នែកថែទាំទារក និងកុមារ (Pediatrics)'
    ]
  },
  {
    id: 'pp-khmer-soviet',
    name_km: 'មន្ទីរពេទ្យមិត្តភាពខ្មែរ-សូវៀត',
    name_en: 'Khmer-Soviet Friendship Hospital (Russian Hospital)',
    type: 'hospital',
    province: 'Phnom Penh',
    district: 'Chamkar Mon',
    address_km: 'ផ្លូវយោធពលខេមរភូមិន្ទ (ផ្លូវ ២៧១) សង្កាត់ទំនប់ទឹក ខណ្ឌបឹងកេងកង រាជធានីភ្នំពេញ',
    address_en: 'St 271, Yothapol Khemarak Phouminh, Boeng Keng Kang, Phnom Penh',
    latitude: 11.5432,
    longitude: 104.9085,
    phone: '+855 23 217 064',
    emergency_phone: '115 / +855 23 217 064',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'សង្គ្រោះបន្ទាន់កម្រិតធ្ងន់ (ICU & Trauma)',
      'ជំងឺឆ្លង (Infectious Diseases)',
      'វះកាត់ឆ្អឹង (Orthopedics)',
      'ស្កែន CT/MRI (Advanced Imaging)'
    ]
  },
  {
    id: 'pp-kantha-bopha',
    name_km: 'មន្ទីរពេទ្យគន្ធបុប្ផា ភ្នំពេញ',
    name_en: 'Kantha Bopha Children Hospital',
    type: 'hospital',
    province: 'Phnom Penh',
    district: 'Daun Penh',
    address_km: 'ផ្លូវលេខ ៤៧ សង្កាត់វត្តភ្នំ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
    address_en: 'Street 47, Wat Phnom, Daun Penh, Phnom Penh',
    latitude: 11.5768,
    longitude: 104.9221,
    phone: '+855 23 722 031',
    emergency_phone: '+855 23 722 031',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'ព្យាបាលកុមារឥតគិតថ្លៃ (Free Pediatric Care)',
      'សង្គ្រោះបន្ទាន់កុមារ (Pediatric ICU)',
      'វះកាត់បេះដូងកុមារ (Pediatric Cardiac Surgery)',
      'ចាក់វ៉ាក់សាំង (Immunization)'
    ]
  },
  {
    id: 'pp-national-pediatric',
    name_km: 'មន្ទីរពេទ្យកុមារជាតិ',
    name_en: 'National Pediatric Hospital',
    type: 'referral_hospital',
    province: 'Phnom Penh',
    district: 'Tuol Kouk',
    address_km: 'មហាវិថីសហព័ន្ធរុស្ស៊ី សង្កាត់ទឹកល្អក់ទី១ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
    address_en: 'Russian Federation Blvd, Tuek La\'ak 1, Tuol Kouk, Phnom Penh',
    latitude: 11.5694,
    longitude: 104.8964,
    phone: '+855 23 880 475',
    emergency_phone: '+855 23 880 475',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'ជំងឺកុមារទូទៅ (General Pediatrics)',
      'ផ្នែកអាហាររូបត្ថម្ភ (Child Nutrition)',
      'ពិនិត្យសុខភាពកុមារ (Child Checkups)'
    ]
  },
  {
    id: 'pp-tuol-kouk-hc',
    name_km: 'មណ្ឌលសុខភាពទួលគោក',
    name_en: 'Tuol Kouk Health Centre',
    type: 'health_centre',
    province: 'Phnom Penh',
    district: 'Tuol Kouk',
    address_km: 'ផ្លូវ ៥៩៨ សង្កាត់បឹងកក់ទី២ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
    address_en: 'Street 598, Boeng Kak 2, Tuol Kouk, Phnom Penh',
    latitude: 11.5781,
    longitude: 104.8988,
    phone: '+855 12 345 678',
    opening_hours: '07:30 - 17:00 (ច័ន្ទ - សុក្រ)',
    emergency_available: false,
    services: [
      'ពិនិត្យជំងឺទូទៅ (Routine Consultation)',
      'ថែទាំមាតា និងទារក (Maternal & Child Health)',
      'ចាក់វ៉ាក់សាំងការពារជំងឺ (Vaccinations)',
      'ផ្តល់ប្រឹក្សាសុខភាព (Health Counseling)'
    ]
  },
  {
    id: 'pp-sensok-clinic',
    name_km: 'គ្លីនិក និងសម្ភពសែនសុខ',
    name_en: 'Sen Sok Polyclinic & Maternity',
    type: 'clinic',
    province: 'Phnom Penh',
    district: 'Sen Sok',
    address_km: 'ផ្លូវ ១៩៨៦ សង្កាត់ភ្នំពេញថ្មី ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ',
    address_en: 'Street 1986, Phnom Penh Thmei, Sen Sok, Phnom Penh',
    latitude: 11.5912,
    longitude: 104.8775,
    phone: '+855 23 883 712',
    opening_hours: '07:00 - 21:00',
    emergency_available: true,
    services: [
      'ពិនិត្យជំងឺទូទៅ (General Checkups)',
      'ពិនិត្យឈាម (Lab Tests)',
      'សម្ភព និងរោគស្ត្រី (Maternity & Gynecology)',
      'ថ្នាំពេទ្យទូទៅ (Pharmacy)'
    ]
  },

  // SIEM REAP
  {
    id: 'sr-provincial-hospital',
    name_km: 'មន្ទីរពេទ្យបង្អែកខេត្តសៀមរាប',
    name_en: 'Siem Reap Provincial Referral Hospital',
    type: 'referral_hospital',
    province: 'Siem Reap',
    district: 'Siem Reap Town',
    address_km: 'ផ្លូវជាតិលេខ ៦ សង្កាត់ស្វាយដង្គំ ក្រុងសៀមរាប ខេត្តសៀមរាប',
    address_en: 'National Road 6, Svay Dangkum, Siem Reap Town',
    latitude: 13.3618,
    longitude: 103.8584,
    phone: '+855 63 760 311',
    emergency_phone: '119 / +855 63 760 311',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'សង្គ្រោះបន្ទាន់ 24/7 (Emergency Response)',
      'វះកាត់ទូទៅ (General Surgery)',
      'ផ្នែកសម្រាលកូន (Maternity Ward)',
      'ពិនិត្យស្កែនអេកូ (Ultrasound & X-Ray)'
    ]
  },
  {
    id: 'sr-jayavarman-vii',
    name_km: 'មន្ទីរពេទ្យជ័យវរ្ម័នទី៧ (គន្ធបុប្ផាទី៣ សៀមរាប)',
    name_en: 'Jayavarman VII Children Hospital',
    type: 'hospital',
    province: 'Siem Reap',
    district: 'Siem Reap Town',
    address_km: 'ផ្លូវឆ្ពោះទៅអង្គរវត្ត សង្កាត់គោកចក ក្រុងសៀមរាប',
    address_en: 'Angkor Wat Road, Kouk Chak, Siem Reap Town',
    latitude: 13.3764,
    longitude: 103.8612,
    phone: '+855 63 963 409',
    emergency_phone: '+855 63 963 409',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'ព្យាបាលកុមារ និងស្ត្រីមានផ្ទៃពោះឥតគិតថ្លៃ (Free Pediatric & Maternity)',
      'សង្គ្រោះបន្ទាន់កុមារ (Pediatric ICU)',
      'ផ្នែកជំងឺគ្រុនឈាម (Dengue Care Unit)'
    ]
  },
  {
    id: 'sr-center-hc',
    name_km: 'មណ្ឌលសុខភាពក្រុងសៀមរាប',
    name_en: 'Siem Reap Central Health Centre',
    type: 'health_centre',
    province: 'Siem Reap',
    district: 'Siem Reap Town',
    address_km: 'ភូមិវត្តបូព៌ សង្កាត់សាលាកំរើក ក្រុងសៀមរាប',
    address_en: 'Wat Bo Village, Sala Kamreuk, Siem Reap Town',
    latitude: 13.3541,
    longitude: 103.8631,
    phone: '+855 63 964 112',
    opening_hours: '07:30 - 17:00',
    emergency_available: false,
    services: [
      'ពិនិត្យសុខភាពបឋម (Primary Care)',
      'ថែទាំមុន និងក្រោយសម្រាល (Prenatal & Postnatal Care)',
      'ផ្តល់ថ្នាំ និងពិគ្រោះយោបល់ (Pharmacy & Advisory)'
    ]
  },

  // BATTAMBANG
  {
    id: 'bb-provincial-hospital',
    name_km: 'មន្ទីរពេទ្យបង្អែកខេត្តបាត់ដំបង',
    name_en: 'Battambang Provincial Referral Hospital',
    type: 'referral_hospital',
    province: 'Battambang',
    district: 'Battambang Town',
    address_km: 'ផ្លូវលេខ ៣ ភូមិរតនៈ សង្កាត់រតនៈ ក្រុងបាត់ដំបង',
    address_en: 'Street 3, Rotanak, Battambang Town',
    latitude: 13.0957,
    longitude: 103.2022,
    phone: '+855 53 952 118',
    emergency_phone: '119 / +855 53 952 118',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'សង្គ្រោះបន្ទាន់ (Emergency Unit)',
      'ផ្នែកវះកាត់ និងឆ្អឹង (Surgery & Orthopedics)',
      'ផ្នែកមន្ទីរពិសោធន៍ (Laboratory)'
    ]
  },
  {
    id: 'bb-sangke-hc',
    name_km: 'មណ្ឌលសុខភាពសង្កែ',
    name_en: 'Sangke Health Centre',
    type: 'health_centre',
    province: 'Battambang',
    district: 'Sangke',
    address_km: 'ឃុំកំពង់ព្រៀង ស្រុកសង្កែ ខេត្តបាត់ដំបង',
    address_en: 'Kampong Prieng, Sangke District, Battambang',
    latitude: 13.0612,
    longitude: 103.2451,
    phone: '+855 53 730 445',
    opening_hours: '07:30 - 17:00',
    emergency_available: false,
    services: [
      'ព្យាបាលជំងឺគ្រុន និងផ្តាសាយ (Fever & Cold Treatment)',
      'ចាក់វ៉ាក់សាំងកុមារ (Child Immunization)',
      'ពិនិត្យជំងឺលើសឈាម (Hypertension Monitoring)'
    ]
  },

  // KAMPOT
  {
    id: 'kp-referral-hospital',
    name_km: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពត',
    name_en: 'Kampot Provincial Referral Hospital',
    type: 'referral_hospital',
    province: 'Kampot',
    district: 'Kampot Town',
    address_km: 'ផ្លូវ ៧៣៥ ភូមិ១ មករា ក្រុងកំពត ខេត្តកំពត',
    address_en: 'Street 735, 1 Makara, Kampot Town',
    latitude: 10.6104,
    longitude: 104.1812,
    phone: '+855 33 932 881',
    emergency_phone: '119 / +855 33 932 881',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'សង្គ្រោះបន្ទាន់ 24 ម៉ោង (24h Emergency)',
      'ព្យាបាលជំងឺទូទៅ (General Medicine)',
      'ផ្នែកសម្ភព (Maternity)'
    ]
  },
  {
    id: 'kp-town-hc',
    name_km: 'មណ្ឌលសុខភាពក្រុងកំពត',
    name_en: 'Kampot Town Health Centre',
    type: 'health_centre',
    province: 'Kampot',
    district: 'Kampot Town',
    address_km: 'សង្កាត់កំពង់កណ្ដាល ក្រុងកំពត ខេត្តកំពត',
    address_en: 'Kampong Kandal, Kampot Town',
    latitude: 10.6051,
    longitude: 104.1788,
    phone: '+855 33 932 102',
    opening_hours: '07:30 - 17:00',
    emergency_available: false,
    services: [
      'ពិនិត្យជំងឺបឋម (Basic Health Checkups)',
      'ផ្តល់ថ្នាំពេទ្យមូលដ្ឋាន (Essential Medicines)',
      'ការអប់រំសុខភាព (Health Education)'
    ]
  },

  // KANDAL
  {
    id: 'kd-takhmao-hospital',
    name_km: 'មន្ទីរពេទ្យបង្អែកជ័យជំនះ ក្រុងតាខ្មៅ',
    name_en: 'Chey Chumneas Referral Hospital Takhmao',
    type: 'referral_hospital',
    province: 'Kandal',
    district: 'Takhmao',
    address_km: 'ផ្លូវជាតិលេខ ២1 ភូមិដើមមៀន ក្រុងតាខ្មៅ ខេត្តកណ្តាល',
    address_en: 'National Road 21, Deum Mien, Takhmao, Kandal',
    latitude: 11.4801,
    longitude: 104.9465,
    phone: '+855 24 932 201',
    emergency_phone: '119 / +855 24 932 201',
    opening_hours: '២៤ ម៉ោង / 24 Hours',
    emergency_available: true,
    services: [
      'សង្គ្រោះបន្ទាន់ 24/7 (Emergency)',
      'ផ្នែកជំងឺកុមារ (Pediatrics)',
      'ផ្នែកសម្ភព និងរោគស្ត្រី (Maternity & Obstetrics)',
      'ផ្នែកកាំរស្មីអ៊ិច (X-Ray Services)'
    ]
  }
];

export const CAMBODIA_PROVINCES = [
  { value: 'All', label_km: 'គ្រប់ខេត្ត/ក្រុងទាំងអស់', label_en: 'All Provinces / Cities' },
  { value: 'Phnom Penh', label_km: 'រាជធានីភ្នំពេញ', label_en: 'Phnom Penh' },
  { value: 'Siem Reap', label_km: 'ខេត្តសៀមរាប', label_en: 'Siem Reap' },
  { value: 'Battambang', label_km: 'ខេត្តបាត់ដំបង', label_en: 'Battambang' },
  { value: 'Kampot', label_km: 'ខេត្តកំពត', label_en: 'Kampot' },
  { value: 'Kandal', label_km: 'ខេត្តកណ្តាល', label_en: 'Kandal' }
];

export const FACILITY_TYPE_LABELS = {
  hospital: { km: 'មន្ទីរពេទ្យធំ', en: 'Major Hospital', icon: '🏥' },
  referral_hospital: { km: 'មន្ទីរពេទ្យបង្អែក', en: 'Referral Hospital', icon: '🏥' },
  health_centre: { km: 'មណ្ឌលសុខភាព', en: 'Health Centre', icon: '🏥' },
  clinic: { km: 'គ្លីនិក / សម្ភព', en: 'Clinic / Polyclinic', icon: '⚕️' }
};
