// routers/auth.route.js

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const bodyParser = express.urlencoded({ extended: true });
const csrf = require('csurf');
const guardAuth = require('./guardAuth');
const  attachUnreadMessages = require('./middleware/fetchUnreadMessages');
// init csurf
const csrfProtection = csrf({ cookie: true });

// helper to expose csrfToken to res.locals
function attachCsrf(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

// === AUTH ROUTES ===

// GET: Registration page
router.get(
  '/register',
  guardAuth.notAuth,
  csrfProtection,
  attachCsrf,
  AuthController.getRegisterPage
);

// POST: Registration submission
router.post(
  '/register',
  guardAuth.notAuth,
  bodyParser,
  csrfProtection,
  AuthController.postRegisterData
);

// GET: Login page
router.get(
  '/login',
  guardAuth.notAuth,
  csrfProtection,
  attachCsrf,
  AuthController.getLoginPage
);

// POST: Login submission
router.post(
  '/login',
  guardAuth.notAuth,
  bodyParser,
  csrfProtection,
  AuthController.postLoginData
);

// POST: Logout
router.post(
  '/logout',
  csrfProtection,
  AuthController.logoutFunctionController
);

// === ADMIN ROUTES ===

// GET: Admin user management page
router.get(
  '/usersmanag',
  guardAuth.isAdmin,
  csrfProtection,
  attachCsrf,
   attachUnreadMessages,  
  AuthController.getAllUsersController
);

// POST: Edit user
router.post(
  '/usersmanag/edit/:id',
  guardAuth.isAdmin,
  bodyParser,
  csrfProtection,
  AuthController.editUserController
);

// POST: Delete user
router.post(
  '/usersmanag/delete/:id',
  guardAuth.isAdmin,
  bodyParser,
  csrfProtection,
  AuthController.deleteUserController
);

module.exports = router;
