import { GoogleGenAI } from '@google/genai';
import { TriageResult, Language } from '@/types/triage';
import { TRIAGE_SYSTEM_PROMPT } from './prompts';
import { evaluateDemoTriage } from './demo-ai-engine';
import { validateTriageResult } from '@/lib/validation/triage-schema';

export class AIService {
  private aiClient: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({ apiKey });
    }
  }

  public async evaluateSymptoms(
    message: string,
    language: Language = 'km',
    forceDemo: boolean = false
  ): Promise<TriageResult> {
    const isDemoEnv = process.env.DEMO_MODE === 'true';

    // If demo forced, demo env active, or no API key, use Demo AI Engine
    if (forceDemo || isDemoEnv || !this.aiClient) {
      return evaluateDemoTriage(message, language);
    }

    try {
      const response = await this.aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${TRIAGE_SYSTEM_PROMPT}\n\nPatient Input (${language}): "${message}"` }] }
        ],
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error('Empty AI response');
      }

      const json = JSON.parse(text);
      const validated = validateTriageResult(json);

      if (validated) {
        return validated;
      }
      throw new Error('Malformed AI JSON output');
    } catch (error) {
      console.warn('Gemini API call failed, falling back to Demo AI Engine:', error);
      return evaluateDemoTriage(message, language);
    }
  }
}

export const aiService = new AIService();
