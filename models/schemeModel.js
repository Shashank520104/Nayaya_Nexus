/**
 * Scheme Model - Encapsulates Welfare Schemes Data and Eligibility Logic
 * Model layer in MVC
 */

const schemesData = require('../data/schemes.json');

class SchemeModel {
  /**
   * Return all schemes with optional filters
   */
  static getAll(filters = {}) {
    let result = [...schemesData];

    if (filters.category && filters.category !== 'All') {
      result = result.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.hindiName && s.hindiName.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        s.targetGroup.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return result;
  }

  /**
   * Find scheme by unique ID
   */
  static getById(id) {
    if (!id) return null;
    return schemesData.find(s => s.id.toLowerCase() === id.toLowerCase()) || null;
  }

  /**
   * Get unique scheme categories
   */
  static getCategories() {
    const cats = new Set(schemesData.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }

  /**
   * Evaluate user profile against scheme rules
   * Returns matching schemes with status and match reasons
   */
  static evaluateEligibility(profile) {
    const age = parseInt(profile.age, 10) || 0;
    const income = parseFloat(profile.income) || 0;
    const gender = (profile.gender || 'Any').toLowerCase();
    const occupation = (profile.occupation || 'Any').toLowerCase();
    const state = (profile.state || 'All India').toLowerCase();

    return schemesData.map(scheme => {
      const el = scheme.eligibility;
      let score = 100;
      let reasons = [];
      let warnings = [];

      // Age check
      if (el.minAge !== undefined && age < el.minAge) {
        score -= 40;
        reasons.push(`Minimum age required is ${el.minAge} years (provided: ${age}).`);
      } else if (el.maxAge !== undefined && age > el.maxAge) {
        score -= 40;
        reasons.push(`Maximum age limit is ${el.maxAge} years (provided: ${age}).`);
      } else {
        reasons.push(`Age (${age} yrs) fulfills criterion.`);
      }

      // Gender check
      if (el.gender && el.gender.toLowerCase() !== 'any') {
        const reqGender = el.gender.toLowerCase();
        if (reqGender.includes('female') && gender !== 'female') {
          score -= 50;
          reasons.push(`This scheme is exclusively designated for female beneficiaries.`);
        } else {
          reasons.push(`Gender criterion satisfied.`);
        }
      }

      // Income check
      if (el.maxIncomeAnnual && income > el.maxIncomeAnnual) {
        score -= 40;
        reasons.push(`Annual income exceeds ceiling of ₹${el.maxIncomeAnnual.toLocaleString('en-IN')}.`);
      } else if (el.maxIncomeAnnual) {
        reasons.push(`Annual income falls within eligibility threshold.`);
      }

      // Occupation check
      if (el.occupation && el.occupation.toLowerCase() !== 'any') {
        const reqOcc = el.occupation.toLowerCase();
        if (occupation !== 'any' && !reqOcc.includes(occupation) && !occupation.includes(reqOcc)) {
          warnings.push(`Targeted specifically for: ${el.occupation}.`);
        }
      }

      // Final score normalize
      score = Math.max(0, Math.min(100, score));

      return {
        scheme,
        score,
        eligible: score >= 60,
        reasons,
        warnings
      };
    }).sort((a, b) => b.score - a.score);
  }
}

module.exports = SchemeModel;
