/**
 * NyayaNexus Web Server Entry Point
 * 
 * Works out of the box for:
 * - Local development: `npm run dev` or `npm start`
 * - Render Deployment: Standard Web Service (`node server.js`)
 * - Vercel Deployment: Serverless Node Function export
 * 
 * Contributors: Shashank, Shubh, Ashutosh
 */

const app = require('./app');
const config = require('./config/app.config');

const PORT = config.PORT;

// Only bind server if not running inside a serverless environment like Vercel
if (!process.env.VERCEL) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`⚖️  NyayaNexus – Multilingual Legal & Governance AI`);
    console.log(`👥  Developed by: Shashank, Shubh & Ashutosh`);
    console.log(`🚀  Server running at: http://localhost:${PORT}`);
    console.log(`🌍  Environment: ${config.NODE_ENV}`);
    console.log(`🤖  Gemini AI Status: ${config.GEMINI_API_KEY ? 'Active (API Key loaded)' : 'Offline Grounded Engine (Active)'}`);
    console.log(`====================================================`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    server.close(() => process.exit(0));
  });
}

module.exports = app;
