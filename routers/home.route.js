const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const HomeController = require('../controllers/home.controller');

// Reuse your helper
function attachCsrf(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

router.get('/', csrfProtection, attachCsrf, HomeController.threeProductsController);

module.exports = router;
