/**
 * Prompt Engineering & Refinement Engine
 * Core Research Component: Designing and refining prompts to understand multilingual queries,
 * simplify legal information, explain schemes, and minimize inaccurate responses.
 * 
 * Developed by: Shashank, Shubh, Ashutosh
 */

const PromptModel = require('../models/promptModel');
const LegalModel = require('../models/legalModel');
const SchemeModel = require('../models/schemeModel');
const { SUPPORTED_LANGUAGES } = require('../config/languages.config');

class PromptEngine {
  /**
   * Detect or match language from text or explicit code
   */
  static detectLanguage(text, requestedLang = 'en') {
    if (requestedLang && requestedLang !== 'auto') {
      const match = SUPPORTED_LANGUAGES.find(l => l.code === requestedLang);
      if (match) return match;
    }

    if (!text) return SUPPORTED_LANGUAGES[0];

    // Unicode block heuristics for Indic scripts
    if (/[\u0900-\u097F]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'hi') || SUPPORTED_LANGUAGES[1]; // Devanagari (Hindi/Marathi)
    if (/[\u0980-\u09FF]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'bn'); // Bengali
    if (/[\u0C00-\u0C7F]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'te'); // Telugu
    if (/[\u0B80-\u0BFF]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'ta'); // Tamil
    if (/[\u0A80-\u0AFF]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'gu'); // Gujarati
    if (/[\u0C80-\u0CFF]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'kn'); // Kannada
    if (/[\u0A00-\u0A7F]/.test(text)) return SUPPORTED_LANGUAGES.find(l => l.code === 'pa'); // Punjabi

    return SUPPORTED_LANGUAGES.find(l => l.code === 'en') || SUPPORTED_LANGUAGES[0];
  }

  /**
   * Classify domain of the query to inject relevant context
   */
  static classifyDomain(query) {
    const q = query.toLowerCase();

    if (/cyber|fraud|otp|upi|scam|hack|bank transfer|phishing|धोखा|पैसा कट|1930/.test(q)) {
      return 'CYBER_FRAUD';
    }
    if (/fir|police|arrest|thana|chori|theft|assault|marpeet|marpit|zero fir|थाना|एफआईआर|गिरफ्तारी/.test(q)) {
      return 'CRIMINAL_JUSTICE';
    }
    if (/kisan|pm kisan|ayushman|yojana|scheme|pension|awas|sukanya|mudra|ration|राशन|योजना|किस्त|सब्सिडी/.test(q)) {
      return 'GOVERNMENT_SCHEME';
    }
    if (/consumer|refund|defective|amazon|flipkart|warranty|grahak|ग्राहक|वारंटी|खराब सामान/.test(q)) {
      return 'CONSUMER_RIGHTS';
    }
    if (/rti|information|soochana|appeal|pio|सूचना का अधिकार/.test(q)) {
      return 'RTI_TRANSPARENCY';
    }
    if (/cheque|bounce|138|dishonour|चेक बाउंस/.test(q)) {
      return 'COMMERCIAL_BANKING';
    }
    if (/domestic violence|patni|wife|dowry|dahej|maintenance|घरेलू हिंसा|दहेज|गुजारा भत्ता/.test(q)) {
      return 'WOMEN_RIGHTS';
    }

    return 'GENERAL_LEGAL';
  }

  /**
   * Retrieve grounded legal and scheme context relevant to the user query
   */
  static retrieveGroundingContext(query, domain) {
    const q = query.toLowerCase();
    const relevantLegal = LegalModel.search(q);
    const relevantSchemes = SchemeModel.getAll({ search: q });
    const allHelplines = LegalModel.getHelplines();

    let contextSnippets = [];
    let citations = [];

    // Prioritize domain-specific knowledge
    if (domain === 'CYBER_FRAUD') {
      const cyberHelpline = allHelplines.find(h => h.number === '1930');
      if (cyberHelpline) {
        contextSnippets.push(`CRITICAL HELPLINE: Dial 1930 immediately or log on to https://cybercrime.gov.in. Golden Hour is the first 2-4 hours to freeze money in recipient accounts.`);
        citations.push({ title: 'National Cyber Crime Portal & Helpline 1930', url: 'https://cybercrime.gov.in' });
      }
      const bnsCheating = relevantLegal.find(l => l.id === 'bns-cheating-fraud');
      if (bnsCheating) {
        contextSnippets.push(`STATUTE: Section 318 BNS 2023 (formerly Section 420 IPC) covers Cheating and Fraud. Section 66D IT Act covers cheating using computer resource.`);
        citations.push({ title: bnsCheating.title, code: `${bnsCheating.bnsSection} / ${bnsCheating.ipcSection}` });
      }
    } else if (domain === 'CRIMINAL_JUSTICE') {
      const firTopic = relevantLegal.find(l => l.id === 'fir-registration');
      if (firTopic) {
        contextSnippets.push(`STATUTE: Section 173 BNSS 2023 (formerly Section 154 CrPC 1973) - Mandatory registration of FIR. Zero FIR is a statutory right at ANY police station regardless of jurisdiction.`);
        contextSnippets.push(`REMEDY: If SHO refuses, send registered post to Superintendent of Police (BNSS 173(4)), or apply before Judicial Magistrate under BNSS Section 175(3) (formerly CrPC 156(3)).`);
        citations.push({ title: firTopic.title, code: `${firTopic.bnsSection} / ${firTopic.ipcSection}` });
      }
    } else if (domain === 'GOVERNMENT_SCHEME') {
      if (relevantSchemes.length > 0) {
        const top = relevantSchemes.slice(0, 2);
        top.forEach(s => {
          contextSnippets.push(`SCHEME: ${s.name} (${s.hindiName || ''}) - Ministry: ${s.ministry}. Benefits: ${s.benefit}. Official Portal: ${s.officialUrl}. Eligibility: Max Income: ₹${s.eligibility.maxIncomeAnnual || 'N/A'}, Target: ${s.targetGroup}.`);
          citations.push({ title: s.name, url: s.officialUrl, benefit: s.benefit });
        });
      }
    } else if (domain === 'CONSUMER_RIGHTS') {
      const c = relevantLegal.find(l => l.id === 'consumer-protection');
      if (c) {
        contextSnippets.push(`STATUTE: Consumer Protection Act 2019 (Section 35 & 47). Free e-filing via e-Daakhil (edaakhil.nic.in). National Consumer Helpline: 1915.`);
        citations.push({ title: 'Consumer Protection Act 2019 / e-Daakhil', url: 'https://edaakhil.nic.in' });
      }
    } else if (domain === 'RTI_TRANSPARENCY') {
      const rti = relevantLegal.find(l => l.id === 'rti-act');
      if (rti) {
        contextSnippets.push(`STATUTE: RTI Act 2005. 30-day statutory response timeline. First appeal under Sec 19(1). Nominal fee ₹10 (free for BPL). Online portal: rtionline.gov.in.`);
        citations.push({ title: 'Right to Information Act 2005', url: 'https://rtionline.gov.in' });
      }
    }

    // Always include free legal aid reference
    contextSnippets.push(`FREE LEGAL AID: NALSA (National Legal Services Authority) Helpline 15100 provides free lawyers under Section 12 of LSA Act 1987.`);

    return { contextSnippets, citations };
  }

  /**
   * Refines and constructs the complete engineered prompt payload
   */
  static buildEngineeredPrompt({ userQuery, languageCode = 'en', sessionId = null }) {
    const langObj = this.detectLanguage(userQuery, languageCode);
    const domain = this.classifyDomain(userQuery);
    const { contextSnippets, citations } = this.retrieveGroundingContext(userQuery, domain);
    const coreSystemPrompt = PromptModel.getSystemPrompt('core');
    const guardrails = PromptModel.getGuardrails();

    // Guardrail directives to append
    let guardrailDirectives = guardrails.map(g => `- [${g.ruleId}]: ${g.name} (${g.action})`).join('\n');

    // Language directive
    const languageDirective = `CRITICAL LANGUAGE INSTRUCTION: The user is communicating in ${langObj.name} (${langObj.nativeName}). You MUST answer fully and naturally in ${langObj.name} (${langObj.nativeName}) using clear, empathetic, and simplified vocabulary.`;

    // Grounding payload
    const groundingBlock = contextSnippets.length > 0 
      ? `### VERIFIED LEGAL & GOVERNANCE GROUNDING CONTEXT:\n${contextSnippets.join('\n\n')}\n(Strict rule: Rely on these verified statutory provisions. Never hallucinate section numbers.)`
      : 'Rely on verified Indian statutory laws (BNS 2023, BNSS 2023, IPC, CrPC, Consumer Protection Act 2019, RTI Act 2005).';

    const fullSystemInstruction = `${coreSystemPrompt}

${languageDirective}

### ACTIVE PROMPT GUARDRAILS:
${guardrailDirectives}

${groundingBlock}
`;

    // Snapshot for the Prompt Studio / Prompt Inspector
    const promptSnapshot = {
      timestamp: new Date().toISOString(),
      userQuery,
      detectedLanguage: langObj.name,
      domain,
      appliedGuardrails: guardrails.map(g => g.ruleId),
      groundingSnippetsCount: contextSnippets.length,
      citations,
      systemPromptPreview: fullSystemInstruction
    };

    return {
      systemInstruction: fullSystemInstruction,
      userMessage: userQuery,
      citations,
      language: langObj,
      domain,
      promptSnapshot
    };
  }
}

module.exports = PromptEngine;
