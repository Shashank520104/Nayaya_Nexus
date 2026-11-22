/**
 * Legal Model - Encapsulates Indian Statutory Provisions & BNS/IPC Mappings
 * Model layer in MVC
 */

const legalCorpus = require('../data/legalCorpus.json');
const helplines = require('../data/helplines.json');

class LegalModel {
  /**
   * Return all legal topics
   */
  static getAll() {
    return legalCorpus;
  }

  /**
   * Find legal topic by ID
   */
  static getById(id) {
    if (!id) return null;
    return legalCorpus.find(item => item.id.toLowerCase() === id.toLowerCase()) || null;
  }

  /**
   * Search legal corpus by keyword or statute
   */
  static search(keyword) {
    if (!keyword) return legalCorpus;
    const q = keyword.toLowerCase().trim();

    return legalCorpus.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.simplifiedExplanation.toLowerCase().includes(q) ||
      (item.bnsSection && item.bnsSection.toLowerCase().includes(q)) ||
      (item.ipcSection && item.ipcSection.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  /**
   * Get BNS vs IPC side-by-side transition table
   */
  static getBnsIpcMappings() {
    return legalCorpus.map(item => ({
      id: item.id,
      title: item.title,
      bnsSection: item.bnsSection,
      ipcSection: item.ipcSection,
      category: item.category,
      summary: item.summary
    }));
  }

  /**
   * Return emergency and statutory helplines
   */
  static getHelplines(category) {
    if (!category || category === 'All') {
      return helplines;
    }
    return helplines.filter(h => h.category.toLowerCase().includes(category.toLowerCase()));
  }
}

module.exports = LegalModel;
