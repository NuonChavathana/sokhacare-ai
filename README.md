# SokhaCare AI (រោគសញ្ញាសុខភាព & ទស្សន៍ទាយហានិភ័យបេះដូង AI)

**Khmer AI Health & Heart Disease Prediction Platform for Cambodia**

> *"Smart Care. Khmer First. Better Health for Everyone."*  
> *"AI ជួយវាយតម្លៃហានិភ័យបេះដូង និងពិនិត្យរោគសញ្ញាជំងឺទូទៅ សម្រាប់ប្រជាជនកម្ពុជា"*

🌐 **Live Application**: [https://sokhacare-ai.vercel.app](https://sokhacare-ai.vercel.app)  
📦 **GitHub Repository**: [https://github.com/NuonChavathana/sokhacare-ai](https://github.com/NuonChavathana/sokhacare-ai)

---

## 🌟 Overview

SokhaCare AI is a full-stack digital health platform designed to assist Cambodian patients and healthcare professionals with **Cardiovascular Disease Risk Prediction** and **General Disease Symptom Triage**, featuring **Khmer & English Voice-to-Text** input, **Text-to-Speech (TTS) Result Audio Reader**, rule-based Southeast Asian disease matching, and instant emergency hospital navigation.

---

## 🚀 Key Features & The Three Modes (`/predict`)

### 1. Patient at Home Mode (Heart Disease ML)
- Plain-language questions in Khmer & English for non-clinicians.
- Intelligent clinical defaults for lab-only tests (ECG, Fluoroscopy, Thalassemia).
- Voice-enabled symptom description that automatically parses and fills clinical inputs.
- Quick test presets: Healthy, Moderate, and High Risk.

### 2. Doctor Mode (Heart Disease ML Clinical)
- Comprehensive clinical form with all 16 model parameters, units, and ranges.
- Real-time display of engineered metrics: `Risk_Score`, `symptom_severity`, and `age_thalach_ratio`.
- Advanced custom risk score and symptom severity overrides.

### 3. General Disease Mode (Deterministic Symptom Checker)
- Rule-based, deterministic clinical matching engine (no external ML dependency).
- Knowledge base tailored for Cambodia and Southeast Asia:
  - **Dengue Fever**, **Malaria**, **Typhoid Fever**, **Acute Gastroenteritis / Food Poisoning**, **Pneumonia**, **Influenza / Flu**, **Common Cold**, **Urinary Tract Infection (UTI)**, **Hypertension / Hypertensive Urgency**, **Migraine**, **Allergic Rhinitis**, **Acute Appendicitis**.
- Red-flag detection for immediate medical emergencies (spiking fevers, bleeding gums, severe right lower quadrant pain, respiratory distress).
- Integrated with Cambodian hospital database (`CAMBODIA_FACILITIES`) for high-urgency cases.

### 4. Bilingual Voice-to-Text (`VoiceInputButton`)
- Built on the browser Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- Dynamic language switching: `km-KH` (Khmer) and `en-US` (English).
- Visual pulse recording state, live interim speech transcript, and graceful error handling.

### 5. Text-to-Speech Result Reader (`TextToSpeechButton`)
- Reads clinical summaries aloud in Khmer (`km-KH`) and English (`en-US`) using `window.speechSynthesis`.
- Automatically generated summaries for heart risk percentages, urgency levels, red flags, and emergency advice.
- Play/Stop toggle with real-time state indicator and accessibility support.

### 6. Multi-Mode History & Analytics Dashboard (`/history`, `/dashboard`)
- Local and Prisma database persistence with `PredictionRecord` model (`mode: "patient_heart" | "doctor_heart" | "general_disease"`).
- Filterable history with integrated TTS playback for every saved record.
- Analytics charts showing evaluations by mode, heart risk distribution, and general disease urgency breakdown.

---

## 🛠️ Tech Stack & Model Inference

- **Frontend**: Next.js 16.3.1 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons, Google Fonts (*Noto Sans Khmer*, *Kantumruy Pro*)
- **Speech Engine**: Web Speech API (`SpeechRecognition` for Voice Input & `SpeechSynthesis` for Audio Reader)
- **ML / AI Engine**:
  - Model: Scikit-learn Logistic Regression (`src/lib/data/logistic_regression.pkl`)
  - Inference Wrapper: Python 3 (`src/lib/data/predict.py`)
  - Serverless Fallback: Built-in TypeScript logistic regression engine
  - General Disease Engine: Deterministic rule-based scoring engine (`src/lib/generalDisease/scoringEngine.ts`)
- **Map & GIS**: Leaflet, React-Leaflet, OpenStreetMap
- **Database & ORM**: Prisma ORM v7 with `PredictionRecord` model

---

## 🐍 Python Inference Service Setup

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```
*(Packages: `scikit-learn>=1.3.0`, `numpy>=1.24.0`, `joblib>=1.3.0`)*

### 2. Run Self-Test
```bash
python src/lib/data/predict.py --test
```

### 3. (Optional) External FastAPI Microservice
If hosting inference as a separate external microservice, set the environment variable:
```env
PREDICTION_API_URL=https://your-python-inference-service.com/predict
```

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
   pip install -r requirements.txt
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000/predict](http://localhost:3000/predict) in your browser.

---

## ⚠️ Medical Disclaimer

SokhaCare AI is an AI-powered risk assessment and healthcare navigation assistant and is **NOT a medical doctor**. It does not provide official medical diagnoses or clinical prescriptions. In an emergency, always call **119** or proceed directly to the nearest hospital.
