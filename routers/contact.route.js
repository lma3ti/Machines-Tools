const route = require('express').Router();
const contactController = require('../controllers/contact.controller');
const csrf = require('csurf');
const attachUser = require('./middleware/attachUser');
const attachCsrf = require('./middleware/attachCsrf');

const csrfProtection = csrf({ cookie: true });

route.get(
  '/contact',
  csrfProtection,
  attachUser,
  attachCsrf,
  contactController.getPageContact
);



// If you have a POST form on the contact page
// route.post('/contact', csrfProtection, contactController.postPageContact);

module.exports = route;
