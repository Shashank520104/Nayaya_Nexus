/**
 * Error Handling Middleware
 */

function notFoundHandler(req, res, next) {
  res.status(404).render('404', {
    title: '404 - Page Not Found | NyayaNexus',
    activePage: '',
    url: req.originalUrl
  });
}

function globalErrorHandler(err, req, res, next) {
  console.error('[Global Error]', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (req.xhr || req.headers.accept && req.headers.accept.includes('json')) {
    return res.status(statusCode).json({
      success: false,
      error: message
    });
  }

  res.status(statusCode).render('404', {
    title: `${statusCode} - Error | NyayaNexus`,
    activePage: '',
    url: req.originalUrl,
    customMessage: message
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
