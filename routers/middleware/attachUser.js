// middleware/attachUser.js
module.exports = function attachUser(req, res, next) {
  console.log('🔄 [Middleware] attachUser triggered');
    res.locals.user = req.session.user || null;
    next();
  };