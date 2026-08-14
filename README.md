# SokhaCare AI (រោគសញ្ញាសុខភាព AI)

**Khmer AI Healthcare Triage & Navigation Assistant for Cambodia**

> *"Smart Care. Khmer Voice. Better Access."*
> *"AI ជួយណែនាំការថែទាំសុខភាព សម្រាប់ប្រជាជនកម្ពុជា"*

SokhaCare AI is a full-stack MVP designed to assist Cambodian patients in evaluating medical symptoms via **Khmer text or voice**, determining triage urgency levels (🔴 Emergency, 🟠 Urgent, 🟢 Routine, 🔵 Self-Care), and navigating to suitable nearby healthcare facilities (Hospitals, Health Centres, Clinics).

---

## Key Features

1. **Khmer AI Symptom Triage**:
   - Classifies symptoms into 4 clinical urgency levels:
     - 🔴 **EMERGENCY** (Immediate hospital attention, 119 dispatch)
     - 🟠 **URGENT** (Health center or referral hospital evaluation within 24h)
     - 🟢 **ROUTINE** (Local clinic appointment)
     - 🔵 **SELF-CARE** (Home monitoring with safety boundaries)
   - Red-flag detection for chest pain, choking/breathing distress, unconsciousness, stroke, bleeding, etc.

2. **Khmer Voice & Text Interaction**:
   - Integrated Web Speech API supporting `km-KH` (Khmer) and `en-US` (English).
   - Audio recording pulse visualizer animation.

3. **Cambodian Healthcare Facilities Map**:
   - Leaflet + OpenStreetMap integration with user location marker and facility pins.
   - Filter by province (Phnom Penh, Siem Reap, Battambang, Kampot, Kandal) and facility type.
   - Direct call buttons and Google Maps directions links.

4. **Presentation Demo Mode**:
   - Operates 100% reliably out-of-the-box even without an API key or running database.
   - Includes preset test buttons for Emergency, Urgent, and Routine scenarios.

5. **Analytics Dashboard (`/dashboard`)**:
   - Interactive charts (Recharts) displaying triage distribution, symptom frequencies, facility requests, and audit logs.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Google Fonts (*Noto Sans Khmer*, *Kantumruy Pro*)
- **Map & GIS**: Leaflet, React-Leaflet, OpenStreetMap
- **Charts**: Recharts
- **Database & ORM**: Prisma ORM with PostgreSQL schema + fallback mock repository
- **AI Service**: Google Gemini API (`@google/genai`) + fallback `DemoAiEngine`

---

## Quick Start (Run Locally)

1. Clone or navigate to the project directory:
   ```bash
   cd sokhacare-ai
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. (Optional) Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
sokhacare-ai/
├── src/
│   ├── app/
│   │   ├── page.tsx               # Landing Page
│   │   ├── triage/page.tsx        # Symptom Chat Page
│   │   ├── facilities/page.tsx    # Map & Facilities Directory Page
│   │   ├── dashboard/page.tsx     # Demo Analytics Dashboard Page
│   │   ├── about/page.tsx         # About & Mission Page
│   │   ├── privacy/page.tsx       # Safety Rules & Privacy Policy Page
│   │   └── api/                   # Triage, Facilities, and Dashboard API Routes
│   ├── components/
│   │   ├── layout/                # Navbar, Footer
│   │   ├── triage/                # ChatWindow, VoiceInput, TriageCard, DemoScenarioSelector
│   │   ├── map/                   # FacilityMap & FacilityMapWrapper
│   │   └── dashboard/             # AnalyticsCharts
│   ├── lib/
│   │   ├── ai/                    # AIService, DemoAiEngine, Prompts
│   │   ├── data/                  # Cambodian Facilities Dataset
│   │   ├── location/              # Distance & Geolocation Utilities
│   │   ├── speech/                # Web Speech API Handler
│   │   └── i18n/                  # Khmer & English Translations Dictionary
│   ├── context/                   # LanguageContext
│   └── types/                     # TypeScript Interfaces
├── prisma/
│   └── schema.prisma              # PostgreSQL Prisma Database Schema
└── README.md
```

---

## Presentation Demo Scenario Workflow (3-5 Min)

1. **Step 1**: Open home page (`/`), review Khmer CTA and feature cards.
2. **Step 2**: Click **"ចាប់ផ្តើមពិនិត្យរោគសញ្ញា"** to enter `/triage`.
3. **Step 3**: Click the 🔴 Emergency preset scenario button: *"ខ្ញុំឈឺទ្រូងខ្លាំង ហើយពិបាកដកដង្ហើម"*.
4. **Step 4**: AI detects red flags and outputs 🔴 **EMERGENCY ATTENTION NEEDED**, displaying emergency contacts and nearest hospital (Calmette Hospital).
5. **Step 5**: Click **"🗺️ Get Directions"** to see Google Maps navigation.
6. **Step 6**: Click **"🟢 Routine Case"** preset scenario to demonstrate routine routing to local clinics and health centres.
7. **Step 7**: Visit `/facilities` to demonstrate the interactive Cambodian map & province filters.
8. **Step 8**: Visit `/dashboard` to showcase analytics graphs.

---

## Medical Disclaimer

SokhaCare AI is an AI-powered triage and navigation assistant and is **NOT a medical doctor**. It does not diagnose diseases or provide medical treatments. In an emergency, always call **119** or proceed directly to the nearest hospital.
