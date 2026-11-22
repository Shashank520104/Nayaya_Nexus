/**
 * Prompt Studio Controller
 * Visualizes prompt engineering layers, anti-hallucination guardrails, and comparative benchmarks
 * Research & Design by: Shashank, Shubh, Ashutosh
 * Controller layer in MVC
 */

const PromptModel = require('../models/promptModel');
const PromptEngine = require('../services/promptEngine');
const GeminiService = require('../services/geminiService');

class PromptStudioController {
  /**
   * Render Prompt Studio view
   */
  static renderStudioPage(req, res) {
    const corePrompt = PromptModel.getSystemPrompt('core');
    const guardrails = PromptModel.getGuardrails();
    const comparisons = PromptModel.getComparisons();

    res.render('prompt-studio', {
      title: 'Prompt Engineering & Refinement Studio – NyayaNexus',
      activePage: 'studio',
      corePrompt,
      guardrails,
      comparisons
    });
  }

  /**
   * API Endpoint: Run custom comparison between Raw and Engineered prompt
   * POST /api/studio/compare
   */
  static async apiRunComparison(req, res) {
    try {
      const { query, language = 'en' } = req.body;

      if (!query || query.trim() === '') {
        return res.status(400).json({ success: false, error: 'Test query is required.' });
      }

      // 1. Raw prompt execution (simulating naive ungrounded LLM query)
      const rawPromptPayload = {
        systemInstruction: 'Answer this query directly without formatting.',
        domain: 'GENERAL_LEGAL',
        language: { code: language, name: 'Auto' },
        citations: []
      };

      // 2. Refined engineered prompt execution
      const refinedPayload = PromptEngine.buildEngineeredPrompt({
        userQuery: query,
        languageCode: language
      });

      // Execute both
      const [rawResult, refinedResult] = await Promise.all([
        GeminiService.generateResponse({
          promptPayload: rawPromptPayload,
          userQuery: query
        }),
        GeminiService.generateResponse({
          promptPayload: refinedPayload,
          userQuery: query
        })
      ]);

      return res.json({
        success: true,
        userQuery: query,
        raw: {
          output: rawResult.text,
          weaknesses: [
            'Lacks statutory citation grounding (no BNS/BNSS cross-references)',
            'No Bar Council Rule 36 disclaimer appended',
            'Missing emergency helpline triage (1930 / 112 / 15100)',
            'Higher risk of hallucinated procedural steps'
          ]
        },
        refined: {
          output: refinedResult.text,
          appliedGuardrails: refinedPayload.promptSnapshot.appliedGuardrails,
          domain: refinedPayload.domain,
          citations: refinedResult.citations,
          systemPromptUsed: refinedPayload.systemInstruction,
          improvements: [
            'Grounding injected from verified Indian legal corpus',
            'Dual BNS 2023 & IPC 1860 statutory alignment',
            'Empathetic plain-spoken language translation',
            'Mandatory NALSA / DLSA free legal aid referral and disclaimer'
          ]
        }
      });
    } catch (error) {
      console.error('[PromptStudioController] Error running prompt comparison:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to run prompt comparison.',
        details: error.message
      });
    }
  }
}

module.exports = PromptStudioController;
