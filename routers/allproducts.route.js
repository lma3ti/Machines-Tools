const route = require('express').Router();
const productController = require('../controllers/allproducts.controller');
const csrf = require('csurf'); // ✅ Your CSRF middleware
const attachUser = require('./middleware/attachUser');         // ✅ Optional: For `res.locals.user`
const attachCsrf = require('./middleware/attachCsrf');         // ✅ Adds `res.locals.csrfToken`
const csrfProtection = csrf({ cookie: true });
route.get('/allproducts', csrfProtection, attachUser, attachCsrf, productController.getPageallproducts);

module.exports = route;
