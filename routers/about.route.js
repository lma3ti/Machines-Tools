const route = require('express').Router();
const aboutController = require('../controllers/about.controller');
const csrf = require('csurf');// CSRF middleware
const attachUser = require('./middleware/attachUser');
const attachCsrf = require('./middleware/attachCsrf');

const csrfProtection = csrf({ cookie: true });
route.get('/about', csrfProtection, attachUser, attachCsrf, aboutController.getPageAbout);

module.exports = route;