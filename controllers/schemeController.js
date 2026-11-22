/**
 * Scheme Controller - Handles Welfare Schemes Discovery & Eligibility Evaluation
 * Controller layer in MVC
 */

const SchemeModel = require('../models/schemeModel');
const SchemeMatchingService = require('../services/schemeMatchingService');

class SchemeController {
  /**
   * Render Government Schemes explorer page
   */
  static renderSchemesPage(req, res) {
    const { category, search } = req.query;
    const schemes = SchemeModel.getAll({ category, search });
    const categories = SchemeModel.getCategories();

    res.render('schemes', {
      title: 'Government Schemes & Eligibility Evaluator – NyayaNexus',
      activePage: 'schemes',
      schemes,
      categories,
      selectedCategory: category || 'All',
      searchQuery: search || ''
    });
  }

  /**
   * API Endpoint: Get all schemes (JSON)
   * GET /api/schemes
   */
  static apiGetSchemes(req, res) {
    const { category, search } = req.query;
    const schemes = SchemeModel.getAll({ category, search });
    return res.json({ success: true, count: schemes.length, schemes });
  }

  /**
   * API Endpoint: Get single scheme by ID
   * GET /api/schemes/:id
   */
  static apiGetSchemeById(req, res) {
    const { id } = req.params;
    const scheme = SchemeModel.getById(id);

    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Scheme not found.' });
    }

    return res.json({ success: true, scheme });
  }

  /**
   * API Endpoint: Check Citizen Eligibility
   * POST /api/schemes/check-eligibility
   */
  static apiCheckEligibility(req, res) {
    try {
      const profile = req.body;
      const evaluation = SchemeMatchingService.evaluate(profile);

      return res.json({
        success: true,
        evaluation
      });
    } catch (error) {
      console.error('[SchemeController] Error checking eligibility:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process eligibility calculation.',
        details: error.message
      });
    }
  }
}

module.exports = SchemeController;
