/**
 * Application Configuration
 * Project: NyayaNexus – Multilingual Governance & Legal-Assistance Chatbot
 * Contributors: Shashank, Shubh, Ashutosh
 */

require('dotenv').config();

module.exports = {
  APP_NAME: 'NyayaNexus',
  TAGLINE: 'Empowering Citizens with Simplified Legal & Governance Guidance',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Gemini AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-1.5-flash',

  // Project Team
  TEAM: [
    {
      name: 'Shashank',
      role: 'Lead Architect & Backend Systems',
      focus: 'MVC Architecture, Gemini AI Orchestration, API Routing, Data Modeling',
      github: 'https://github.com/shashank-nyayanexus'
    },
    {
      name: 'Shubh',
      role: 'Prompt Engineer & Legal Domain Specialist',
      focus: 'System Prompts, Context Grounding, BNS/IPC Mapping, Anti-Hallucination Guardrails',
      github: 'https://github.com/shubh-nyayanexus'
    },
    {
      name: 'Ashutosh',
      role: 'Frontend Architect & UX Specialist',
      focus: 'Multilingual UI, Web Speech Integration, Scheme Wizard, Document Generator',
      github: 'https://github.com/ashutosh-nyayanexus'
    }
  ],

  // Statutory Disclaimers
  LEGAL_DISCLAIMER: 'NyayaNexus is an AI-powered legal information and governance awareness tool designed to simplify public legal knowledge and welfare schemes. It does NOT constitute formal legal advice or create an attorney-client relationship. In accordance with Bar Council of India guidelines, for legal proceedings or urgent matters, consult a licensed advocate or contact the National Legal Services Authority (NALSA) at helpline 15100.'
};
