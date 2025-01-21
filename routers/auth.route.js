const route = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const body = require('express').urlencoded({ extended: true });
const guardAuth = require('./guardAuth');

// Authentication Routes
route.get('/register', guardAuth.notAuth, AuthController.getRegisterPage);
route.post('/register', body, AuthController.postRegisterData);

route.get('/login', guardAuth.notAuth, AuthController.getLoginPage);
route.post('/login', body, AuthController.postLoginData);

route.post('/logout', AuthController.logoutFunctionController);
// Admin User Management Routes
route.get('/usersmanag', guardAuth.isAdmin, AuthController.getAllUsersController);
route.post('/usersmanag/edit/:id', guardAuth.isAdmin, body, AuthController.editUserController);
route.post('/usersmanag/delete/:id', guardAuth.isAdmin, AuthController.deleteUserController);



module.exports = route;
