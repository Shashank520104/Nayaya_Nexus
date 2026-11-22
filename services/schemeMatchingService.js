/**
 * Scheme Matching Service
 * Matches user profile against Central and State government welfare schemes
 */

const SchemeModel = require('../models/schemeModel');

class SchemeMatchingService {
  /**
   * Evaluate user parameters against available schemes
   */
  static evaluate(profile) {
    if (!profile) {
      return { matches: [], totalEvaluated: 0 };
    }

    const matches = SchemeModel.evaluateEligibility(profile);
    const highlyEligible = matches.filter(m => m.score >= 80);
    const partiallyEligible = matches.filter(m => m.score >= 50 && m.score < 80);

    return {
      totalEvaluated: matches.length,
      profileSummary: {
        age: profile.age || 'Not specified',
        income: profile.income ? `₹${Number(profile.income).toLocaleString('en-IN')}` : 'Not specified',
        gender: profile.gender || 'Any',
        occupation: profile.occupation || 'Any',
        state: profile.state || 'All India'
      },
      highlyEligible,
      partiallyEligible,
      allMatches: matches
    };
  }
}

module.exports = SchemeMatchingService;
