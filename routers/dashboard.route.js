const route = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const GuardAuth = require('./guardAuth');
const csrf = require('csurf');
const attachUser = require('./middleware/attachUser');
const attachCsrf = require('./middleware/attachCsrf');
const Message = require('../models/message.model'); // Assuming your Message model is in this path
const attachUnreadMessages = require('./middleware/fetchUnreadMessages')
const csrfProtection = csrf({ cookie: true });

// Dashboard route to show general statistics
route.get(
    "/dashboard",
    GuardAuth.isAdmin,    // only admins
    csrfProtection,
    attachUser,           
    attachUnreadMessages,       
    attachCsrf,           
    dashboardController.getDashboard
  );

// Dashboard table page
route.get('/tables', GuardAuth.isAdmin,    // only admins
  csrfProtection,
  attachUser,           
  attachUnreadMessages,       
  attachCsrf,            
  dashboardController.getTableDashboard
);

// Messages management (Admin only)
route.get(
  '/dashboard/messages',
  GuardAuth.isAdmin,
  csrfProtection,
  attachUser,
  attachUnreadMessages,
  attachCsrf,
  dashboardController.listMessages
);

route.get(
  '/dashboard/messages/:id',
  GuardAuth.isAdmin,
  csrfProtection,
  attachUser,
  attachUnreadMessages,
  attachCsrf,
  dashboardController.viewMessage
);

module.exports = route;
