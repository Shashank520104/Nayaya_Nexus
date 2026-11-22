/**
 * Gemini AI Integration Service
 * Calls Google Generative AI with the refined prompt pipeline
 * Seamlessly falls back to Nyaya Legal Grounding Service when offline or key is omitted
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/app.config');
const LegalGroundingService = require('./legalGroundingService');

class GeminiService {
  /**
   * Send the engineered prompt to Gemini model or fallback engine
   */
  static async generateResponse({ promptPayload, userQuery }) {
    const apiKey = config.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    // Fallback if no API key is provided
    if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return LegalGroundingService.generateLocalResponse({
        query: userQuery,
        domain: promptPayload.domain,
        language: promptPayload.language,
        citations: promptPayload.citations
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: config.GEMINI_MODEL,
        systemInstruction: promptPayload.systemInstruction,
        generationConfig: {
          temperature: 0.25, // Lower temperature to minimize hallucination and enhance statutory fidelity
          topP: 0.9,
          maxOutputTokens: 1500
        }
      });

      const result = await model.generateContent(userQuery);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        citations: promptPayload.citations,
        followUpSuggestions: [
          'Can you clarify the specific documents needed?',
          'What are the state-specific variations for this rule?',
          'How can I get free legal counsel from NALSA / DLSA?'
        ],
        engineMode: 'GEMINI_AI_ONLINE'
      };
    } catch (error) {
      console.warn('[GeminiService] API call encountered an issue, transitioning to Nyaya Grounded Engine:', error.message);
      
      // Resilient fallback to ground truth local engine
      const localResult = LegalGroundingService.generateLocalResponse({
        query: userQuery,
        domain: promptPayload.domain,
        language: promptPayload.language,
        citations: promptPayload.citations
      });

      localResult.engineNotice = 'Grounded via Nyaya Knowledge Engine (Safe Fallback)';
      return localResult;
    }
  }
}

module.exports = GeminiService;
