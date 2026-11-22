/**
 * Chat Session Model
 * Manages active user conversation threads, context history, and prompt inspector traces
 */

const sessions = new Map();

class ChatSessionModel {
  static getOrCreate(sessionId, defaultLang = 'en') {
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substring(2, 10);
    }

    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        id: sessionId,
        language: defaultLang,
        messages: [],
        lastContext: null,
        createdAt: new Date()
      });
    }

    return sessions.get(sessionId);
  }

  static addMessage(sessionId, message) {
    const session = this.getOrCreate(sessionId);
    session.messages.push({
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      role: message.role, // 'user' or 'assistant'
      text: message.text,
      language: message.language || session.language,
      citations: message.citations || [],
      metadata: message.metadata || {},
      timestamp: new Date()
    });

    // Keep last 30 messages to avoid memory bloat
    if (session.messages.length > 30) {
      session.messages.shift();
    }

    return session;
  }

  static setLastContext(sessionId, contextSnapshot) {
    const session = this.getOrCreate(sessionId);
    session.lastContext = contextSnapshot;
  }

  static getLastContext(sessionId) {
    const session = this.getOrCreate(sessionId);
    return session.lastContext || null;
  }

  static clearSession(sessionId) {
    if (sessions.has(sessionId)) {
      sessions.delete(sessionId);
      return true;
    }
    return false;
  }
}

module.exports = ChatSessionModel;
