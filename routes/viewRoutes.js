/**
 * View Routes (MVC View Layer Dispatcher)
 */

const express = require('express');
const router = express.Router();

const ChatController = require('../controllers/chatController');
const SchemeController = require('../controllers/schemeController');
const LegalController = require('../controllers/legalController');
const DraftController = require('../controllers/draftController');
const PromptStudioController = require('../controllers/promptStudioController');
const TeamController = require('../controllers/teamController');
const SchemeModel = require('../models/schemeModel');
const LegalModel = require('../models/legalModel');
const sampleQueries = require('../data/sampleQueries.json');

// Home Landing Page
router.get('/', (req, res) => {
  const featuredSchemes = SchemeModel.getAll().slice(0, 3);
  const featuredLegal = LegalModel.getAll().slice(0, 3);
  const helplines = LegalModel.getHelplines().slice(0, 4);

  res.render('index', {
    title: 'NyayaNexus – Multilingual Governance & Legal Assistance',
    activePage: 'home',
    featuredSchemes,
    featuredLegal,
    helplines,
    sampleQueries
  });
});

// Main Chat Page
router.get('/chat', ChatController.renderChatPage);

// Government Schemes & Eligibility
router.get('/schemes', SchemeController.renderSchemesPage);

// Legal Rights, BNS/IPC Explorer, & Helplines
router.get('/legal', LegalController.renderLegalPage);

// Legal Draft & RTI Generator
router.get('/drafts', DraftController.renderDraftPage);

// Prompt Engineering & Evaluation Studio
router.get('/prompt-studio', PromptStudioController.renderStudioPage);

// Team Page (Shashank, Shubh, Ashutosh)
router.get('/team', TeamController.renderTeamPage);

module.exports = router;
