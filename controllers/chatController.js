/**
 * Chat Controller - Handles Multilingual Legal & Governance Chat
 * Controller layer in MVC
 */

const PromptEngine = require('../services/promptEngine');
const GeminiService = require('../services/geminiService');
const ChatSessionModel = require('../models/chatSessionModel');
const sampleQueries = require('../data/sampleQueries.json');

class ChatController {
  /**
   * Render chat view page
   */
  static renderChatPage(req, res) {
    res.render('chat', {
      title: 'NyayaNexus Chat – Multilingual Legal & Scheme Assistant',
      activePage: 'chat',
      sampleQueries
    });
  }

  /**
   * API Endpoint: Send Message
   * POST /api/chat/message
   */
  static async handleMessage(req, res) {
    try {
      const { message, language = 'en', sessionId } = req.body;

      if (!message || message.trim() === '') {
        return res.status(400).json({ success: false, error: 'Query message is required.' });
      }

      // 1. Session tracking
      const session = ChatSessionModel.getOrCreate(sessionId, language);
      ChatSessionModel.addMessage(session.id, {
        role: 'user',
        text: message,
        language
      });

      // 2. Build engineered prompt pipeline
      const promptPayload = PromptEngine.buildEngineeredPrompt({
        userQuery: message,
        languageCode: language,
        sessionId: session.id
      });

      // 3. Store snapshot for prompt inspector
      ChatSessionModel.setLastContext(session.id, promptPayload.promptSnapshot);

      // 4. Generate grounded response (Gemini API or resilient local engine)
      const aiResponse = await GeminiService.generateResponse({
        promptPayload,
        userQuery: message
      });

      // 5. Save assistant reply in session
      ChatSessionModel.addMessage(session.id, {
        role: 'assistant',
        text: aiResponse.text,
        language: promptPayload.language.code,
        citations: aiResponse.citations,
        metadata: {
          engineMode: aiResponse.engineMode,
          domain: promptPayload.domain
        }
      });

      return res.json({
        success: true,
        sessionId: session.id,
        reply: aiResponse.text,
        citations: aiResponse.citations || [],
        followUpSuggestions: aiResponse.followUpSuggestions || [],
        language: promptPayload.language,
        domain: promptPayload.domain,
        engineMode: aiResponse.engineMode,
        promptSnapshot: promptPayload.promptSnapshot
      });
    } catch (error) {
      console.error('[ChatController] Error processing chat query:', error);
      return res.status(500).json({
        success: false,
        error: 'An unexpected error occurred while processing your legal query.',
        details: error.message
      });
    }
  }

  /**
   * API Endpoint: Get Prompt Inspector trace
   * GET /api/chat/prompt-trace/:sessionId
   */
  static getPromptTrace(req, res) {
    const { sessionId } = req.params;
    const context = ChatSessionModel.getLastContext(sessionId);

    if (!context) {
      return res.status(404).json({ success: false, error: 'No prompt trace found for this session.' });
    }

    return res.json({ success: true, promptTrace: context });
  }

  /**
   * API Endpoint: Clear session
   * POST /api/chat/clear
   */
  static clearSession(req, res) {
    const { sessionId } = req.body;
    ChatSessionModel.clearSession(sessionId);
    return res.json({ success: true, message: 'Chat session reset successfully.' });
  }

  /**
   * API Endpoint: Sample Prompts
   * GET /api/chat/samples
   */
  static getSamplePrompts(req, res) {
    return res.json({ success: true, sampleQueries });
  }
}

module.exports = ChatController;
