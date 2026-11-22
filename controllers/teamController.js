/**
 * Team Controller - Showcases Shashank, Shubh, and Ashutosh
 * Controller layer in MVC
 */

const config = require('../config/app.config');

class TeamController {
  /**
   * Render Team page
   */
  static renderTeamPage(req, res) {
    res.render('team', {
      title: 'Our Team – Shashank, Shubh & Ashutosh | NyayaNexus',
      activePage: 'team',
      team: config.TEAM,
      appName: config.APP_NAME,
      tagline: config.TAGLINE
    });
  }
}

module.exports = TeamController;
