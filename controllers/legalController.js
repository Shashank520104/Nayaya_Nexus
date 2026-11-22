/**
 * Legal Controller - Handles Citizen Rights, BNS/IPC Explorer, and Helplines
 * Controller layer in MVC
 */

const LegalModel = require('../models/legalModel');

class LegalController {
  /**
   * Render Legal Guide & BNS/IPC explorer view
   */
  static renderLegalPage(req, res) {
    const { q, category } = req.query;
    const legalItems = q ? LegalModel.search(q) : LegalModel.getAll();
    const bnsMappings = LegalModel.getBnsIpcMappings();
    const helplines = LegalModel.getHelplines(category);

    res.render('legal-guide', {
      title: 'Citizen Legal Rights & BNS/IPC Explorer – NyayaNexus',
      activePage: 'legal',
      legalItems,
      bnsMappings,
      helplines,
      searchQuery: q || '',
      selectedCategory: category || 'All'
    });
  }

  /**
   * API Endpoint: Search legal topics
   * GET /api/legal/search
   */
  static apiSearchLegal(req, res) {
    const { q } = req.query;
    const results = LegalModel.search(q);
    return res.json({ success: true, count: results.length, results });
  }

  /**
   * API Endpoint: Get BNS vs IPC side-by-side comparison
   * GET /api/legal/bns-ipc-mappings
   */
  static apiGetBnsMappings(req, res) {
    const mappings = LegalModel.getBnsIpcMappings();
    return res.json({ success: true, mappings });
  }

  /**
   * API Endpoint: Get Emergency Helplines
   * GET /api/legal/helplines
   */
  static apiGetHelplines(req, res) {
    const { category } = req.query;
    const results = LegalModel.getHelplines(category);
    return res.json({ success: true, count: results.length, helplines: results });
  }
}

module.exports = LegalController;
