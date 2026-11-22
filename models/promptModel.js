/**
 * Prompt Model - Prompt Engineering Templates, Guardrails, and Evaluation Benchmarks
 * Model layer in MVC
 */

const promptData = require('../data/promptTemplates.json');

class PromptModel {
  /**
   * Get core system prompt
   */
  static getSystemPrompt(type = 'core') {
    return promptData.systemPrompts[type] || promptData.systemPrompts.core;
  }

  /**
   * Get all active guardrails
   */
  static getGuardrails() {
    return promptData.guardrails || [];
  }

  /**
   * Get comparison studies for prompt engineering evaluation
   */
  static getComparisons() {
    return promptData.promptStudioComparisons || [];
  }

  /**
   * Get comparison study by ID
   */
  static getComparisonById(id) {
    if (!id) return null;
    return (promptData.promptStudioComparisons || []).find(c => c.id === id) || null;
  }
}

module.exports = PromptModel;
