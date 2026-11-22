/**
 * API Routes (RESTful endpoints)
 */

const express = require('express');
const router = express.Router();
const rateLimiter = require('../middlewares/rateLimiter');

const ChatController = require('../controllers/chatController');
const SchemeController = require('../controllers/schemeController');
const LegalController = require('../controllers/legalController');
const DraftController = require('../controllers/draftController');
const PromptStudioController = require('../controllers/promptStudioController');

// Chat API Endpoints
router.post('/chat/message', rateLimiter({ windowMs: 60000, max: 40 }), ChatController.handleMessage);
router.get('/chat/prompt-trace/:sessionId', ChatController.getPromptTrace);
router.post('/chat/clear', ChatController.clearSession);
router.get('/chat/samples', ChatController.getSamplePrompts);

// Schemes API Endpoints
router.get('/schemes', SchemeController.apiGetSchemes);
router.get('/schemes/:id', SchemeController.apiGetSchemeById);
router.post('/schemes/check-eligibility', SchemeController.apiCheckEligibility);

// Legal & BNS API Endpoints
router.get('/legal/search', LegalController.apiSearchLegal);
router.get('/legal/bns-ipc-mappings', LegalController.apiGetBnsMappings);
router.get('/legal/helplines', LegalController.apiGetHelplines);

// Drafts API Endpoints
router.get('/drafts/types', DraftController.apiGetDraftTypes);
router.post('/drafts/generate', DraftController.apiGenerateDraft);

// Prompt Studio API Endpoints
router.post('/studio/compare', rateLimiter({ windowMs: 60000, max: 20 }), PromptStudioController.apiRunComparison);

module.exports = router;
