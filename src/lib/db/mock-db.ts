import { DashboardStats, UrgencyLevel, Language } from '@/types/triage';

interface PredictionLogItem {
  id: string;
  timestamp: string;
  symptomSummary: string;
  urgency: UrgencyLevel;
  facilityRecommended: string;
  language: Language;
}

const mockLogs: PredictionLogItem[] = [
  {
    id: 'pred-log-101',
    timestamp: '2026-08-16 10:15',
    symptomSummary: 'Age 65, Male • Typical Angina, BP 162/95, Chol 275 (Prob: 91%)',
    urgency: 'EMERGENCY',
    facilityRecommended: 'Calmette Hospital - Cardiology ICU (មន្ទីរពេទ្យកាល់ម៉ែត)',
    language: 'km'
  },
  {
    id: 'pred-log-102',
    timestamp: '2026-08-16 09:40',
    symptomSummary: 'Age 52, Female • Atypical Angina, BP 142/88, Chol 235 (Prob: 54%)',
    urgency: 'URGENT',
    facilityRecommended: 'Khmer-Soviet Friendship Hospital (មន្ទីរពេទ្យមិត្តភាពខ្មែរ-សូវៀត)',
    language: 'km'
  },
  {
    id: 'pred-log-103',
    timestamp: '2026-08-16 09:10',
    symptomSummary: 'Age 48, Male • Moderate Chest Discomfort, BP 138/85 (Prob: 42%)',
    urgency: 'URGENT',
    facilityRecommended: 'Siem Reap Provincial Referral Hospital',
    language: 'en'
  },
  {
    id: 'pred-log-104',
    timestamp: '2026-08-16 08:30',
    symptomSummary: 'Age 34, Female • Routine Heart Checkup, BP 118/75 (Prob: 12%)',
    urgency: 'ROUTINE',
    facilityRecommended: 'Tuol Kouk Health Centre (មណ្ឌលសុខភាពទួលគោក)',
    language: 'km'
  },
  {
    id: 'pred-log-105',
    timestamp: '2026-08-15 17:20',
    symptomSummary: 'Age 26, Male • Active Runner Checkup, BP 115/70 (Prob: 5%)',
    urgency: 'SELF_CARE',
    facilityRecommended: 'General Health Centre / Wellness',
    language: 'km'
  }
];

export function getMockDashboardStats(): DashboardStats {
  const total = 1450;
  const emergencyCount = 261; // ~18% High Risk
  const urgentCount = 493;    // ~34% Moderate Risk
  const routineCount = 522;   // ~36% Low Risk
  const selfCareCount = 174;  // ~12% Lifestyle Wellness

  return {
    totalConsultations: total,
    emergencyCount,
    urgentCount,
    routineCount,
    selfCareCount,
    emergencyPercentage: 18,
    urgentPercentage: 34,
    routinePercentage: 36,
    selfCarePercentage: 12,
    avgConversationLength: 2.1,
    commonSymptoms: [
      { symptom: 'លើសសម្ពាធឈាម (Hypertension)', count: 520, category: 'Vascular' },
      { symptom: 'ជាតិខ្លាញ់ខ្ពស់ (High Cholesterol)', count: 440, category: 'Metabolic' },
      { symptom: 'ឈឺណែនទ្រូង (Typical Angina)', count: 310, category: 'Cardiovascular' },
      { symptom: 'ពិបាកដកដង្ហើមពេលហាត់ (Exertional Dyspnea)', count: 260, category: 'Respiratory' },
      { symptom: 'រលកបេះដូង ST ចុះទាប (ST Depression)', count: 180, category: 'Diagnostics' },
      { symptom: 'ជំងឺទឹកនោមផ្អែម (Diabetes / FBS > 120)', count: 195, category: 'Metabolic' }
    ],
    facilityTypeRequests: [
      { type: 'hospital', label_km: 'មន្ទីរពេទ្យបេះដូងធំ (Major Cardiac Hospitals)', label_en: 'Cardiac Hospitals', count: 580 },
      { type: 'referral_hospital', label_km: 'មន្ទីរពេទ្យបង្អែកខេត្ត (Referral Hospitals)', label_en: 'Referral Hospitals', count: 420 },
      { type: 'health_centre', label_km: 'មណ្ឌលសុខភាព (Health Centres)', label_en: 'Health Centres', count: 310 },
      { type: 'clinic', label_km: 'គ្លីនិកឯកទេស (Specialist Clinics)', label_en: 'Cardiology Clinics', count: 140 }
    ],
    recentLogs: mockLogs
  };
}

export function logNewTriage(
  symptomSummary: string,
  urgency: UrgencyLevel,
  facilityName: string,
  language: Language
) {
  const newLog: PredictionLogItem = {
    id: `pred-log-${Date.now()}`,
    timestamp: new Date().toLocaleString('sv').slice(0, 16),
    symptomSummary,
    urgency,
    facilityRecommended: facilityName,
    language
  };
  mockLogs.unshift(newLog);
  if (mockLogs.length > 20) mockLogs.pop();
}
