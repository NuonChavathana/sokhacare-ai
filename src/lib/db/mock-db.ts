import { DashboardStats, UrgencyLevel, Language } from '@/types/triage';
import { CAMBODIA_FACILITIES } from '@/lib/data/facilities';

interface LogItem {
  id: string;
  timestamp: string;
  symptomSummary: string;
  urgency: UrgencyLevel;
  facilityRecommended: string;
  language: Language;
}

const mockLogs: LogItem[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-14 13:10',
    symptomSummary: 'ឈឺទ្រូងខ្លាំង និងពិបាកដកដង្ហើម',
    urgency: 'EMERGENCY',
    facilityRecommended: ' Calmette Hospital (មន្ទីរពេទ្យកាល់ម៉ែត)',
    language: 'km'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-14 12:45',
    symptomSummary: 'ក្តៅខ្លួនខ្លាំង និងមានអាការៈអស់កម្លាំង (High Fever & Fatigue)',
    urgency: 'URGENT',
    facilityRecommended: ' Siem Reap Provincial Referral Hospital',
    language: 'en'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-14 11:30',
    symptomSummary: 'ឈឺក្បាលបន្តិចពីព្រឹក',
    urgency: 'ROUTINE',
    facilityRecommended: ' Tuol Kouk Health Centre (មណ្ឌលសុខភាពទួលគោក)',
    language: 'km'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-14 10:15',
    symptomSummary: 'ផ្តាសាយ និងឈឺបំពង់កស្រាល',
    urgency: 'SELF_CARE',
    facilityRecommended: ' Sensok Polyclinic & Maternity',
    language: 'km'
  },
  {
    id: 'log-105',
    timestamp: '2026-08-14 09:00',
    symptomSummary: 'កូនក្តៅខ្លួន និងក្អកពីរថ្ងៃ',
    urgency: 'URGENT',
    facilityRecommended: ' Kantha Bopha Children Hospital',
    language: 'km'
  }
];

export function getMockDashboardStats(): DashboardStats {
  const total = 1284;
  const emergencyCount = 103; // ~8%
  const urgentCount = 282; // ~22%
  const routineCount = 616; // ~48%
  const selfCareCount = 283; // ~22%

  return {
    totalConsultations: total,
    emergencyCount,
    urgentCount,
    routineCount,
    selfCareCount,
    emergencyPercentage: 8,
    urgentPercentage: 22,
    routinePercentage: 48,
    selfCarePercentage: 22,
    avgConversationLength: 2.4,
    commonSymptoms: [
      { symptom: 'ឈឺក្បាល (Headache)', count: 342, category: 'Neurological' },
      { symptom: 'ក្តៅខ្លួន (Fever)', count: 298, category: 'Systemic' },
      { symptom: 'ពិបាកដកដង្ហើម (Breathing Issue)', count: 185, category: 'Respiratory' },
      { symptom: 'ឈឺពោះ (Stomach Ache)', count: 164, category: 'Gastrointestinal' },
      { symptom: 'ឈឺទ្រូង (Chest Pain)', count: 120, category: 'Cardiovascular' },
      { symptom: 'ផ្តាសាយ & ក្អក (Cold & Cough)', count: 175, category: 'ENT' }
    ],
    facilityTypeRequests: [
      { type: 'hospital', label_km: 'មន្ទីរពេទ្យធំ (Major Hospitals)', label_en: 'Hospitals', count: 480 },
      { type: 'referral_hospital', label_km: 'មន្ទីរពេទ្យបង្អែក (Referral Hospitals)', label_en: 'Referral Hospitals', count: 390 },
      { type: 'health_centre', label_km: 'មណ្ឌលសុខភាព (Health Centres)', label_en: 'Health Centres', count: 260 },
      { type: 'clinic', label_km: 'គ្លីនិក / សម្ភព (Clinics)', label_en: 'Clinics', count: 154 }
    ],
    recentLogs: mockLogs
  };
}

export function logNewTriage(symptomSummary: string, urgency: UrgencyLevel, facilityName: string, language: Language) {
  const newLog: LogItem = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString('sv').slice(0, 16),
    symptomSummary,
    urgency,
    facilityRecommended: facilityName,
    language
  };
  mockLogs.unshift(newLog);
  if (mockLogs.length > 20) mockLogs.pop();
}
