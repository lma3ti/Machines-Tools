const route = require('express').Router();
const CategoryController = require('../controllers/category.controller'); 
const body = require('express').urlencoded({ extended: true });
const guardAuth = require('./guardAuth');

// Admin-only Category Routes
route.get('/addcategory', guardAuth.isAdmin, CategoryController.getAllCategoriesController);
route.post('/addcategory', guardAuth.isAdmin, body, CategoryController.addCategoryController);
route.post('/editcategory/:id', guardAuth.isAdmin, body, CategoryController.editCategoryController);
route.post('/deletecategory/:id', guardAuth.isAdmin, CategoryController.deleteCategoryController);

module.exports = route;
