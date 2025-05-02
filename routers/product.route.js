const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const GuardAuth = require('./guardAuth');
const multer = require('multer');
const csrf = require('csurf');
const  attachUnreadMessages = require('./middleware/fetchUnreadMessages');
// Initialize CSRF protection
const csrfProtection = csrf({ cookie: true });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'assets/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage }).fields([
  { name: 'images', maxCount: 5 },
  { name: 'document', maxCount: 1 }
]);

// GET: render "Add Product" page with CSRF token
router.get(
  '/addproduct',
  GuardAuth.isAuth,
  csrfProtection,
  attachUnreadMessages,
  productController.getAddProductController
);

// POST: handle the form submission (Multer parses files, then CSRF validates)
router.post(
  '/addproduct',
  GuardAuth.isAuth,
  upload,
  csrfProtection,
  productController.postAddProductController
);

// Other product routes
router.get(
  '/products',
  GuardAuth.isAuth,
  
  productController.getAllProductsController
);
router.get(
  '/product/:id',
  attachUnreadMessages,
  productController.getOneProductDetailsController
);

module.exports = router;