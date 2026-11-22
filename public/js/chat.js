/**
 * Chatbot Client Controller
 * Powers the interactive multilingual legal and governance assistant
 */

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatLangSelect = document.getElementById('chatLanguageSelect');
  const typingIndicator = document.getElementById('typingIndicator');
  const voiceMicBtn = document.getElementById('voiceMicBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const openInspectorBtn = document.getElementById('openInspectorBtn');
  const closeInspectorBtn = document.getElementById('closeInspectorBtn');
  const promptInspectorDrawer = document.getElementById('promptInspectorDrawer');

  // Inspector Elements
  const inspLanguage = document.getElementById('inspLanguage');
  const inspDomain = document.getElementById('inspDomain');
  const inspGuardrails = document.getElementById('inspGuardrails');
  const inspCitations = document.getElementById('inspCitations');
  const inspSystemPrompt = document.getElementById('inspSystemPrompt');
  const engineStatusBadge = document.getElementById('engineStatusBadge');

  // Session ID
  let sessionId = localStorage.getItem('nyaya_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('nyaya_session_id', sessionId);
  }

  // Auto-grow textarea
  if (chatInput) {
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  }

  // Voice Mic Button
  if (voiceMicBtn) {
    voiceMicBtn.addEventListener('click', () => {
      const lang = chatLangSelect ? chatLangSelect.value : 'en';
      window.nyayaSpeech.toggleListening(lang, (transcript, isFinal) => {
        chatInput.value = transcript;
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
        if (isFinal) {
          // Optional auto-submit on clear final speech pause
        }
      });
    });
  }

  // Starter Chip Clicks
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.starter-chip');
    if (chip) {
      const query = chip.getAttribute('data-query');
      if (query && chatInput) {
        chatInput.value = query;
        chatForm.dispatchEvent(new Event('submit'));
      }
    }
  });

  // Prompt Inspector Drawer Toggle
  if (openInspectorBtn && promptInspectorDrawer) {
    openInspectorBtn.addEventListener('click', () => {
      promptInspectorDrawer.classList.toggle('open');
    });
  }
  if (closeInspectorBtn && promptInspectorDrawer) {
    closeInspectorBtn.addEventListener('click', () => {
      promptInspectorDrawer.classList.remove('open');
    });
  }

  // Reset Chat
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset this chat conversation?')) {
        try {
          await fetch('/api/chat/clear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
        } catch (e) {}

        localStorage.removeItem('nyaya_session_id');
        window.location.reload();
      }
    });
  }

  // Helper: Append User Message
  function appendUserMessage(text) {
    const msgEl = document.createElement('div');
    msgEl.className = 'message user-message';
    msgEl.innerHTML = `
      <div class="message-avatar">
        <i class="fa-solid fa-user"></i>
      </div>
      <div class="message-body">
        <div class="message-meta">
          <span class="sender-name">You</span>
          <span class="message-time">Just now</span>
        </div>
        <div class="message-text">
          <p>${escapeHtml(text)}</p>
        </div>
      </div>
    `;
    chatMessages.appendChild(msgEl);
    scrollToBottom();
  }

  // Helper: Append Assistant Message
  function appendAssistantMessage(data) {
    const msgEl = document.createElement('div');
    msgEl.className = 'message assistant-message';

    // Parse markdown if marked is loaded
    let renderedContent = '';
    if (window.marked && typeof window.marked.parse === 'function') {
      renderedContent = window.marked.parse(data.reply);
    } else {
      renderedContent = `<p>${escapeHtml(data.reply).replace(/\n/g, '<br>')}</p>`;
    }

    // Citations tags
    let citationsHtml = '';
    if (data.citations && data.citations.length > 0) {
      citationsHtml = `
        <div class="message-citations">
          <span class="citations-label"><i class="fa-solid fa-book-bookmark"></i> Citations:</span>
          ${data.citations.map(c => `
            <span class="cite-pill">
              ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.title} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : c.title}
              ${c.code ? ` &bull; <code>${c.code}</code>` : ''}
            </span>
          `).join('')}
        </div>
      `;
    }

    // Follow-up Suggestions
    let followUpsHtml = '';
    if (data.followUpSuggestions && data.followUpSuggestions.length > 0) {
      followUpsHtml = `
        <div class="quick-starters" style="margin-top: 0.85rem;">
          ${data.followUpSuggestions.map(s => `
            <button type="button" class="starter-chip" data-query="${escapeHtml(s)}">
              <i class="fa-solid fa-circle-question"></i> ${escapeHtml(s)}
            </button>
          `).join('')}
        </div>
      `;
    }

    msgEl.innerHTML = `
      <div class="message-avatar">
        <i class="fa-solid fa-scale-balanced"></i>
      </div>
      <div class="message-body">
        <div class="message-meta">
          <span class="sender-name">NyayaNexus Assistant</span>
          <span class="message-time">Just now</span>
          <span class="engine-badge-sub" style="margin-left: auto; font-size: 0.72rem; color: var(--accent);">
            ${data.engineMode === 'GEMINI_AI_ONLINE' ? '⚡ Gemini 1.5 Flash' : '⚖️ Nyaya Grounded Engine'}
          </span>
        </div>
        <div class="message-text">
          ${renderedContent}
        </div>
        ${citationsHtml}
        ${followUpsHtml}
        <div class="message-actions-bar">
          <button type="button" class="btn-msg-action copy-msg-btn" title="Copy text">
            <i class="fa-solid fa-copy"></i> <span>Copy</span>
          </button>
          <button type="button" class="btn-msg-action speak-msg-btn" title="Listen to text">
            <i class="fa-solid fa-volume-high"></i> <span>Speak</span>
          </button>
        </div>
      </div>
    `;

    chatMessages.appendChild(msgEl);
    scrollToBottom();

    // Attach copy & speak events
    const copyBtn = msgEl.querySelector('.copy-msg-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(data.reply);
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> <span>Copy</span>';
        }, 2000);
      });
    }

    const speakBtn = msgEl.querySelector('.speak-msg-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        window.nyayaSpeech.speak(data.reply, data.language ? data.language.code : 'en');
      });
    }

    // Update Prompt Inspector with this turn's snapshot
    if (data.promptSnapshot) {
      updatePromptInspector(data.promptSnapshot);
    }
  }

  // Update Prompt Inspector Drawer Content
  function updatePromptInspector(snap) {
    if (inspLanguage) inspLanguage.textContent = snap.detectedLanguage || 'English';
    if (inspDomain) inspDomain.textContent = snap.domain || 'GENERAL_LEGAL';

    if (inspGuardrails && snap.appliedGuardrails) {
      inspGuardrails.innerHTML = snap.appliedGuardrails.map(g => `
        <li><i class="fa-solid fa-circle-check"></i> [${g}] Active Verification</li>
      `).join('');
    }

    if (inspCitations && snap.citations) {
      inspCitations.innerHTML = snap.citations.length > 0 
        ? snap.citations.map(c => `
          <div class="cite-item" style="font-size: 0.8rem; margin-bottom: 0.4rem; padding: 0.3rem 0.5rem; background: var(--bg-subtle); border-radius: var(--radius-sm);">
            <strong>${c.title}</strong> ${c.code ? `<code>${c.code}</code>` : ''}
          </div>
        `).join('')
        : '<p class="empty-state-text">No external statutes needed for this general query.</p>';
    }

    if (inspSystemPrompt && snap.systemPromptPreview) {
      inspSystemPrompt.textContent = snap.systemPromptPreview;
    }
  }

  // Handle Form Submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = chatInput.value.trim();
    if (!query) return;

    const selectedLang = chatLangSelect ? chatLangSelect.value : 'en';

    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // 1. Render User Message
    appendUserMessage(query);

    // 2. Show Typing Indicator
    if (typingIndicator) typingIndicator.style.display = 'flex';
    scrollToBottom();

    // 3. Send API Request
    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: selectedLang,
          sessionId
        })
      });

      const data = await response.json();

      if (typingIndicator) typingIndicator.style.display = 'none';

      if (data.success) {
        appendAssistantMessage(data);
      } else {
        appendErrorMessage(data.error || 'Failed to generate guidance. Please try again.');
      }
    } catch (err) {
      console.error('[Chat Error]', err);
      if (typingIndicator) typingIndicator.style.display = 'none';
      appendErrorMessage('Network issue or connection error. Please check your internet connection.');
    }
  });

  function appendErrorMessage(errText) {
    const msgEl = document.createElement('div');
    msgEl.className = 'message assistant-message';
    msgEl.innerHTML = `
      <div class="message-avatar" style="background: var(--danger);">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div class="message-body" style="border-color: var(--danger);">
        <p style="color: var(--danger); font-size: 0.9rem;">
          <strong>Error:</strong> ${escapeHtml(errText)}
        </p>
      </div>
    `;
    chatMessages.appendChild(msgEl);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Check URL Query Parameters for instant launch from Hero or Home page chips
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  const initialLang = urlParams.get('lang');

  if (initialLang && chatLangSelect) {
    chatLangSelect.value = initialLang;
  }

  if (initialQuery && chatInput) {
    chatInput.value = initialQuery;
    setTimeout(() => {
      chatForm.dispatchEvent(new Event('submit'));
    }, 400);
  }
});
