/**
 * Express Application Setup
 * NyayaNexus – Multilingual Governance & Legal-Assistance Chatbot
 * Team: Shashank, Shubh, Ashutosh
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const config = require('./config/app.config');
const { SUPPORTED_LANGUAGES } = require('./config/languages.config');
const viewRoutes = require('./routes/viewRoutes');
const apiRoutes = require('./routes/apiRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

const app = express();

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Global View Context
app.use((req, res, next) => {
  res.locals.appName = config.APP_NAME;
  res.locals.tagline = config.TAGLINE;
  res.locals.team = config.TEAM;
  res.locals.disclaimer = config.LEGAL_DISCLAIMER;
  res.locals.supportedLanguages = SUPPORTED_LANGUAGES;
  res.locals.currentYear = new Date().getFullYear();
  res.locals.activePath = req.path;
  next();
});

// Mount Routes
app.use('/', viewRoutes);
app.use('/api', apiRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
