/**
 * Draft Controller - Legal Notices, RTI Application, and Incident Complaint Generator
 * Controller layer in MVC
 */

const DraftModel = require('../models/draftModel');
const DraftGeneratorService = require('../services/draftGeneratorService');

class DraftController {
  /**
   * Render Document & Notice Generator view
   */
  static renderDraftPage(req, res) {
    const draftTypes = DraftModel.getDraftTypes();
    const selectedType = req.query.type || draftTypes[0].id;
    const currentTypeObj = DraftModel.getDraftTypeById(selectedType) || draftTypes[0];

    res.render('draft-generator', {
      title: 'Legal Notice & RTI Draft Generator – NyayaNexus',
      activePage: 'drafts',
      draftTypes,
      selectedType: currentTypeObj.id,
      currentTypeObj
    });
  }

  /**
   * API Endpoint: Get draft types
   * GET /api/drafts/types
   */
  static apiGetDraftTypes(req, res) {
    const draftTypes = DraftModel.getDraftTypes();
    return res.json({ success: true, draftTypes });
  }

  /**
   * API Endpoint: Generate Draft
   * POST /api/drafts/generate
   */
  static apiGenerateDraft(req, res) {
    try {
      const { draftType, formData } = req.body;

      if (!draftType || !formData) {
        return res.status(400).json({ success: false, error: 'Draft type and form data are required.' });
      }

      const generatedText = DraftGeneratorService.generate(draftType, formData);

      return res.json({
        success: true,
        draftType,
        generatedText
      });
    } catch (error) {
      console.error('[DraftController] Error generating draft:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to generate legal draft.',
        details: error.message
      });
    }
  }
}

module.exports = DraftController;
