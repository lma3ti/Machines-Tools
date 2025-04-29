const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const GuardAuth = require('./guardAuth');
const multer = require('multer');
const csrf = require('csurf');

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

// Routes
router.get('/', GuardAuth.isAuth, productController.getMyProductsPage);
router.get('/delete/:id', GuardAuth.isAuth, csrfProtection, productController.deleteProductController);


// ✅ CSRF protection added to update form GET route
router.get(
  '/update/:id',
  GuardAuth.isAuth,
  csrfProtection,
  productController.getMyProductUpdatePage
);

// ✅ POST update route with CSRF check
router.post(
  "/update/:id",
  GuardAuth.isAuth,
  upload,
  csrfProtection,
  productController.postUpdateProductController
);

module.exports = router;
