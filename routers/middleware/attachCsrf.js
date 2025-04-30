module.exports = function attachCsrf(req, res, next) {
  console.log('🔄 [Middleware] attachCSRF triggered');
    res.locals.csrfToken = req.csrfToken();
    next();
  };