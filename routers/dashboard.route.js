const route = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const GuardAuth = require('./guardAuth');




// Dashboard routes
route.get('/dashboard', GuardAuth.isAdmin, dashboardController.getDashboard);
route.get('/tables', GuardAuth.isAuth, dashboardController.getTableDashboard);





module.exports = route;
