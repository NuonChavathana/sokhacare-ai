import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { evaluateChatIntent } from '@/lib/ai/chat-nlp-engine';
import { buildClinicalStateFromHistory } from '@/lib/ai/symptom-state-manager';
import { assessClinicalRisk } from '@/lib/ai/risk-assessor';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  intent?: string;
  urgency?: string;
  triageLevel?: 'emergency' | 'urgent' | 'routine' | 'info';
  quickReplies?: string[];
  suggestedActions?: {
    type: 'call_119' | 'call_115' | 'find_facilities' | 'symptoms_triage' | 'rehydrate';
    labelKm: string;
    labelEn: string;
    link?: string;
  }[];
  facilities?: any[];
  engine?: 'gemini_live' | 'offline_fallback' | 'offline_deterministic';
  quotaExceeded?: boolean;
  notice?: string;
}

const CHAT_SYSTEM_PROMPT = `You are SokhaCare AI, an intelligent health-support conversational assistant designed for users in Cambodia.

Your primary purpose is to:
- understand health concerns expressed in Khmer or English,
- maintain accurate multi-turn conversation context,
- extract structured medical information,
- identify potentially concerning symptoms,
- ask targeted follow-up questions,
- provide safe preliminary health guidance,
- and recommend appropriate healthcare facilities when necessary.

You are NOT a doctor and must never claim to provide a definitive diagnosis.

==================================================
1. CORE PRINCIPLE: CONTINUOUS CONVERSATION
==================================================

You MUST behave as a continuous conversational assistant.
NEVER treat the latest user message as an isolated message.

Every new user message must be interpreted using:
1. Conversation history
2. Current medical state
3. Previous assistant response
4. Last question asked by the assistant
5. Pending unanswered questions
6. Information already provided by the user

The user may be answering a previous question even when they do not explicitly reference it.
For example:
Assistant: "តើអ្នកមានស្ពឹក ឬខ្សោយដៃជើងដែរឬទេ?"
User: "មានស្ពឹកបន្តិច"
Interpret this as: numbness = true, numbness_severity = mild. DO NOT treat it as a new unrelated medical request.

==================================================
2. ALWAYS UPDATE THE EXISTING STATE
==================================================

For every user message:
STEP 1: Understand the message in context.
STEP 2: Identify NEW information.
STEP 3: Identify whether the user is answering a previous question.
STEP 4: Extract medical facts.
STEP 5: Merge the new facts into the existing medical state.
STEP 6: Preserve all previously known facts.
STEP 7: Reassess risk using the UPDATED state.
STEP 8: Determine what information is still missing.
STEP 9: Ask only the next useful question OR provide guidance.

Never reset the medical state simply because a new user message arrived.

==================================================
3. MEDICAL STATE
==================================================

Maintain and reason over a structured state containing, when available:
- intent
- chief_complaint
- symptoms
- body_location
- laterality
- severity
- onset
- duration
- timing
- triggers
- relieving_factors
- associated_symptoms
- negative_findings
- medications
- relevant_history
- risk_factors
- red_flags
- urgency
- pending_questions

When new information arrives, UPDATE this state instead of creating a new one.

==================================================
4. NEVER ASK FOR INFORMATION ALREADY KNOWN
==================================================

If information has already been provided, do not ask for it again.
- User: "ឈឺទាំងសងខាង" -> laterality = bilateral. Do NOT ask: "ឈឺទាំងសងខាងឬតែមួយ?"
- User: "មិនមានក្តៅខ្លួនទេ" -> fever = false. Do NOT ask: "តើមានក្តៅខ្លួនទេ?"
- User: "មានស្ពឹកបន្តិច" -> numbness = true. Do NOT ask: "តើមានស្ពឹកទេ?"

==================================================
5. UNDERSTAND NATURAL ANSWERS
==================================================

Users will not always answer questions directly or in numbered form.
Extract ALL useful information from a single message (e.g. duration, severity, visual changes, timing, fever denial).

==================================================
6. UNDERSTAND NEGATIVE INFORMATION
==================================================

Negative statements are clinically important. Preserve negative findings in the conversation state:
- "គ្មានក្តៅខ្លួន" -> fever = false
- "មិនមានស្ពឹកទេ" -> numbness = false
- "អត់ក្អួត" -> vomiting = false
- "គ្មានចុកទ្រូង ឬហត់ទេ" -> chest_pain = false, shortness_of_breath = false

==================================================
7. HANDLE VAGUE STATEMENTS CONTEXTUALLY
==================================================

Interpret vague statements using the existing conversation:
- "very sick", "very very sick", "really bad", "getting worse", "I feel terrible"
- "ឈឺខ្លាំងណាស់", "ឈឺកាន់តែខ្លាំង", "មិនស្រួលខ្លួនខ្លាំង", "អស់កម្លាំងខ្លាំង", "ធ្ងន់ណាស់"
Update severity = severe / overall_condition = very_unwell. Do NOT automatically classify the user as having an emergency. Severity and urgency are DIFFERENT concepts.

==================================================
8. INTENT CLASSIFICATION
==================================================

Supported intents: greeting, symptom_consultation, health_question, medication_question, facility_search, thanks, goodbye, unknown.
Unknown messages must NOT automatically become symptom consultations.

==================================================
9. URGENCY IS SEPARATE FROM INTENT
==================================================

Never assume symptom_consultation = urgent.
Never assume severe = emergency.
Urgency values: none, unknown, routine, soon, urgent, emergency.
If there is not enough information to determine urgency: urgency = unknown.

==================================================
10. RED FLAG ASSESSMENT
==================================================

Look for clinically important warning signs relevant to the complaint without diagnosing definitively.
When emergency warning signs are present (crushing chest pain + shortness of breath/sweating, stroke signs, GI bleeding), clearly recommend urgent medical evaluation and calling 119.
Do not invent red flags that the user did not report.

==================================================
11. DIALOGUE STATE TRACKING
==================================================

Track last_question, pending_questions, answered_questions, and unanswered_questions.
When a pending question is answered, remove it from pending questions. Do NOT repeat the same question.

==================================================
12. ASK THE NEXT BEST QUESTION
==================================================

Do not repeatedly ask a fixed questionnaire. Choose the next question dynamically based on current state (1–2 questions at a time).

==================================================
13. DO NOT REPEAT THE PREVIOUS RESPONSE
==================================================

Before responding, check if the state changed and if you are repeating your previous response.
Acknowledge the new information and continue from the updated state.

==================================================
14. LANGUAGE HANDLING
==================================================

Support Khmer, English, mixed Khmer-English, informal Khmer, speech-to-text errors, and spelling mistakes.
Understand semantic meaning rather than relying only on exact keyword matching.

==================================================
15. RESPONSE STYLE & OUTPUT FORMAT
==================================================

Responses must be concise, empathetic, conversational, clear, and medically cautious.
Acknowledge new info -> summarize updated understanding briefly -> ask next useful question OR give appropriate guidance.

OUTPUT SPECIFICATION:
You MUST respond with a single valid JSON object containing:
{
  "content": "Markdown formatted empathetic response in user language (Khmer or English)",
  "intent": "greeting" | "symptom_consultation" | "facility_search" | "health_question" | "medication_question" | "thanks" | "unknown",
  "urgency": "none" | "unknown" | "routine" | "soon" | "urgent" | "emergency",
  "triageLevel": "emergency" | "urgent" | "routine" | "info",
  "quickReplies": ["3 to 4 helpful contextual suggestions in the same language"]
}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], language = 'km', userLat, userLng } = body;

    const isKm = language === 'km';
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user');
    const userQuery = (lastUserMessage?.content || '').trim();

    if (!userQuery) {
      return NextResponse.json(
        {
          success: false,
          error: isKm ? 'សូមបញ្ចូលសាររបស់អ្នក' : 'Please provide a message'
        },
        { status: 400 }
      );
    }

    // 1. Build accumulated multi-turn GeneralizedClinicalState from message history
    const clinicalState = buildClinicalStateFromHistory(messages);
    const risk = assessClinicalRisk(clinicalState, userLat, userLng);

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const isDemoMode = process.env.DEMO_MODE === 'true';

    let quotaExceeded = false;

    // 2. Try Live High-Performance Gemini LLM (with full conversation context)
    if (apiKey && !isDemoMode) {
      const candidateModels = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

      for (const model of candidateModels) {
        try {
          const aiClient = new GoogleGenAI({ apiKey });

          // Format recent conversation turns cleanly for multi-turn context
          const recent = messages.slice(-10);
          const contents = recent.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || '' }]
          }));

          // Ensure contents start with user turn if required
          if (contents.length > 0 && contents[0].role === 'model') {
            contents.shift();
          }

          if (contents.length === 0 || contents[contents.length - 1].role !== 'user') {
            contents.push({ role: 'user', parts: [{ text: userQuery }] });
          }

          const response = await aiClient.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: CHAT_SYSTEM_PROMPT,
              responseMimeType: 'application/json'
            }
          });

          const textOutput = response.text;
          if (textOutput) {
            const parsed = JSON.parse(textOutput);
            if (parsed && typeof parsed.content === 'string') {
              const triageLevel = parsed.triageLevel || risk.triageLevel || 'info';
              const urgency = parsed.urgency || risk.urgency || (triageLevel === 'emergency' ? 'emergency' : 'routine');
              const quickReplies = Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [];

              return NextResponse.json({
                success: true,
                message: {
                  id: `bot-${Date.now()}`,
                  role: 'assistant',
                  content: parsed.content,
                  timestamp: new Date().toISOString(),
                  intent: parsed.intent || clinicalState.intent,
                  urgency,
                  confidence: 0.96,
                  triageLevel,
                  response_type: urgency === 'emergency' ? 'emergency_alert' : 'clinical_guidance',
                  symptom_state: clinicalState,
                  missing_information: clinicalState.missingInformation,
                  quickReplies,
                  suggestedActions: risk.suggestedActions,
                  facilities: risk.recommendedFacilities,
                  engine: 'gemini_live'
                }
              });
            }
          }
        } catch (modelError: any) {
          const errMsg = modelError?.message || '';
          if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
            quotaExceeded = true;
            console.warn(`[QUOTA ALERT] Gemini API quota reached for ${model}:`, errMsg);
          } else {
            console.warn(`Model ${model} failed, trying next candidate:`, errMsg);
          }
        }
      }
    }

    // 3. High-Accuracy Generalized Clinical NLP Engine (Deterministic Fallback)
    const nlpResult = evaluateChatIntent(userQuery, language, userLat, userLng, messages);

    const quotaNotice = quotaExceeded
      ? (isKm
          ? '⚡ កូតា Gemini API បានពេញ (Quota Limit Reached) — ប្រព័ន្ធកំពុងដំណើរការដោយស្វ័យប្រវត្តិតាមម៉ាស៊ីន AI ក្នុងស្រុក'
          : '⚡ Gemini API quota limit reached — Operating seamlessly via offline clinical engine.')
      : undefined;

    return NextResponse.json({
      success: true,
      quotaExceeded,
      notice: quotaNotice,
      message: {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: nlpResult.content,
        timestamp: new Date().toISOString(),
        intent: nlpResult.intent,
        urgency: nlpResult.urgency,
        confidence: nlpResult.confidence,
        triageLevel: nlpResult.triageLevel,
        response_type: nlpResult.response_type,
        symptom_state: nlpResult.symptom_state,
        missing_information: nlpResult.missing_information,
        quickReplies: nlpResult.quickReplies,
        suggestedActions: nlpResult.suggestedActions || [],
        facilities: nlpResult.facilities || [],
        engine: quotaExceeded ? 'offline_fallback' : 'offline_deterministic',
        quotaExceeded,
        notice: quotaNotice
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
