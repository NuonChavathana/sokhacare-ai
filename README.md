# SokhaCare AI (រោគសញ្ញាសុខភាព AI)

**Khmer AI Healthcare Triage & Navigation Platform for Cambodia**

> *"Smart Care. Khmer Voice. Better Access."*  
> *"AI ជួយណែនាំការថែទាំសុខភាព សម្រាប់ប្រជាជនកម្ពុជា"*

🌐 **Live Application**: [https://sokhacare-ai.vercel.app](https://sokhacare-ai.vercel.app)  
📦 **GitHub Repository**: [https://github.com/NuonChavathana/sokhacare-ai](https://github.com/NuonChavathana/sokhacare-ai)

---

## 🌟 Overview

SokhaCare AI is a full-stack digital health platform designed to assist Cambodian patients in evaluating medical symptoms using **Khmer text or voice**, determining triage urgency levels (🔴 Emergency, 🟠 Urgent, 🟢 Routine, 🔵 Self-Care), and navigating to appropriate nearby healthcare facilities across Cambodian provinces.

---

## 🚀 Key Features

1. **Khmer AI Symptom Triage**:
   - Classifies symptoms into 4 clinical urgency levels:
     - 🔴 **EMERGENCY** (Immediate hospital attention, 119 call dispatch)
     - 🟠 **URGENT** (Health center or referral hospital evaluation within 24h)
     - 🟢 **ROUTINE** (Local clinic appointment)
     - 🔵 **SELF-CARE** (Home monitoring with safety boundaries)
   - Red-flag detection for chest pain, choking/breathing distress, unconsciousness, stroke, bleeding, etc.

2. **Smart Health Navigation & Facility Scoring Engine**:
   - Scores nearby healthcare facilities using: `Distance + Urgency Compatibility + Services + Open Status + Emergency Capability`.
   - Displays transparent **Explainable Recommendation Badges**:
     - `✓ Suitable facility type`
     - `✓ Nearby (< 2 km)`
     - `✓ 24/7 Emergency service available`
     - `✓ Currently open`

3. **Khmer Voice & Interactive Triage UX**:
   - Integrated Web Speech API supporting `km-KH` (Khmer) and `en-US` (English) with pulse recording visualizer.
   - **Triage Progress Steps**: Step 1 (Symptoms) → Step 2 (Warning signs) → Step 3 (Care Recommendation).
   - **Severity Scale**: Interactive 1 (Mild) to 5 (Severe) rating.
   - **Uncertainty Chips**: *"Not sure"*, *"I don't know"*, *"Started recently"*, *"I'm worried"*.
   - **Pre-Triage Information Summary**: Confirmation modal before final classification.

4. **Emergency Accessibility Mode & Action Cards**:
   - High-contrast simplified view for emergency red flags with extra-large **CALL 119** and **GET DIRECTIONS** buttons for stressed users.
   - **"What should I do now?"** action guidance cards across all urgency levels.

5. **Cambodian Healthcare Directory & OpenStreetMap**:
   - Leaflet + OpenStreetMap integration with user location markers and facility pins.
   - Province filter (Phnom Penh, Siem Reap, Battambang, Kampot, Kandal) & facility type filter.

6. **Low-Bandwidth Data Saver Mode**:
   - Toggle in header to reduce heavy graphics, disable map tile preloading, and optimize for low-speed rural Cambodian networks.
   - Offline detection banner with automatic fallback to `Demo AI Engine`.

7. **Trust Center (`/trust`)**:
   - Transparency page detailing AI scope, location consent, data safety guardrails, and non-diagnosis rules.

8. **AI Safety & Model Evaluation Bench (`/evaluation`)**:
   - Automated test suite executing predefined test scenarios (Emergency, Urgent, Routine, Ambiguous) with live Pass/Fail execution logs.

9. **Facility Admin Portal (`/admin/facilities`)**:
   - Demo administration portal to manage facility directory metadata, services, and 24/7 emergency availability.

10. **Platform Expansion Roadmap (`/roadmap`)**:
    - Strategic development phases from hackathon MVP to national digital health integration.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16.3.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Google Fonts (*Noto Sans Khmer*, *Kantumruy Pro*)
- **Map & GIS**: Leaflet, React-Leaflet, OpenStreetMap
- **Charts**: Recharts
- **Database & ORM**: Prisma ORM v7 with PostgreSQL schema (`prisma/schema.prisma` & `prisma/seed.ts`) + fallback mock database repository
- **AI Service**: Google Gemini API (`@google/genai`) + fallback `DemoAiEngine`
- **Deployment**: Vercel (`https://sokhacare-ai.vercel.app`)

---

## 📦 Quick Start (Run Locally)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NuonChavathana/sokhacare-ai.git
   cd sokhacare-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
sokhacare-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing Page & "How It Works" Flow
│   │   ├── triage/page.tsx        # Symptom Chat & Progress Steps Page
│   │   ├── family/page.tsx        # Family Health Care Mode Page
│   │   ├── facilities/page.tsx    # Interactive OpenStreetMap Directory Page
│   │   ├── facilities/[id]/       # Facility Detail Pages
│   │   ├── history/page.tsx       # Triage Check History Page
│   │   ├── dashboard/page.tsx     # Analytics Dashboard Page
│   │   ├── trust/page.tsx         # Trust Center & Privacy Policy Page
│   │   ├── evaluation/page.tsx    # AI Model Evaluation Bench Page
│   │   ├── admin/facilities/      # Facility Admin Portal Page
│   │   ├── roadmap/page.tsx       # Platform Expansion Roadmap Page
│   │   ├── demo/page.tsx          # Guided Pitch Presentation Page
│   │   ├── about/page.tsx         # About & Mission Page
│   │   ├── privacy/page.tsx       # Safety Rules & Data Policy Page
│   │   └── api/                   # Triage, Facilities, Dashboard API Routes
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, MobileNav
│   │   ├── triage/                # ChatWindow, VoiceInput, TriageCard, TriageProgress, SeveritySelector, EmergencyAccessibilityCard
│   │   ├── map/                   # FacilityMap & FacilityMapWrapper
│   │   ├── onboarding/            # OnboardingModal
│   │   └── dashboard/             # AnalyticsCharts
│   ├── lib/
│   │   ├── ai/                    # AIService, DemoAiEngine, Prompts
│   │   ├── data/                  # Cambodian Facilities Dataset
│   │   ├── facilities/            # Smart Facility Scoring Engine
│   │   ├── location/              # Geolocation & Distance Utilities
│   │   ├── validation/            # Triage Output JSON Schema Validation
│   │   └── i18n/                  # Khmer & English Dictionary
│   ├── context/                   # LanguageContext & DataSaverContext
│   └── types/                     # TypeScript Interfaces
├── prisma/
│   ├── schema.prisma              # PostgreSQL Prisma Database Schema
│   └── seed.ts                    # Cambodian Facilities Database Seed Script
└── README.md
```

---

## 🎯 Presentation Pitch Demo Workflow (3-5 Min)

1. **Step 1**: Open homepage (`/`), review Khmer header, CTAs, and 5-step visual workflow.
2. **Step 2**: Click **"ចាប់ផ្តើមពិនិត្យរោគសញ្ញា"** to enter `/triage`.
3. **Step 3**: Select the 🔴 Emergency preset scenario button: *"ខ្ញុំឈឺទ្រូងខ្លាំង ហើយពិបាកដកដង្ហើម"*.
4. **Step 4**: System triggers **🔴 EMERGENCY MODE**, displaying oversized emergency contact 119 and nearest hospital (Calmette Hospital).
5. **Step 5**: Click **"🗺️ Get Directions"** to launch Google Maps navigation.
6. **Step 6**: Test routine scenario (*"ខ្ញុំឈឺក្បាលបន្តិចពីព្រឹក"*) using severity slider and progress steps.
7. **Step 7**: Visit `/facilities` to demonstrate the interactive Cambodian map & province filters.
8. **Step 8**: Visit `/trust` and `/evaluation` to demonstrate AI safety guardrails and evaluation metrics.
9. **Step 9**: Visit `/dashboard` to showcase analytics graphs.

---

## ⚠️ Medical Disclaimer

SokhaCare AI is an AI-powered triage and healthcare navigation assistant and is **NOT a medical doctor**. It does not diagnose diseases or provide medical treatments. In an emergency, always call **119** or proceed directly to the nearest hospital.
