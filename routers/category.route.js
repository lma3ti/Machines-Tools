const route = require('express').Router();
const CategoryController = require('../controllers/category.controller'); 
const body = require('express').urlencoded({ extended: true });
const guardAuth = require('./guardAuth');
const csrf = require('csurf');
const attachUnreadMessages= require('./middleware/fetchUnreadMessages');  
// Initialize CSRF protection
const csrfProtection = csrf({ cookie: true });
// Admin-only Category Routes
route.get('/addcategory', guardAuth.isAdmin, csrfProtection,attachUnreadMessages, CategoryController.getAllCategoriesController);
route.post('/addcategory', guardAuth.isAdmin, body, csrfProtection, CategoryController.addCategoryController);
route.post('/editcategory/:id', guardAuth.isAdmin, body, csrfProtection, CategoryController.editCategoryController);
route.post('/deletecategory/:id', guardAuth.isAdmin, csrfProtection, CategoryController.deleteCategoryController);
    
module.exports = route;
