const productController = require('../controllers/product.controller');
const router = require('express').Router();
const GuardAuth = require('./guardAuth');
const multer = require('multer');
const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'assets/uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Use .fields() to allow multiple file fields
const upload = multer({ storage: storage }).fields([
  { name: 'images', maxCount: 5 },   // Up to 5 product images
  { name: 'document', maxCount: 1 }  // 1 technical document (optional)
]);

// Add PRODUCT routes
router.get('/addproduct', GuardAuth.isAuth, productController.getAddProductController);

router.post('/addproduct', upload, GuardAuth.isAuth, productController.postAddProductController);

router.get('/products', GuardAuth.isAuth, productController.getAllProductsController);
router.get('/product/:id', productController.getOneProductDetailsController);

module.exports = router;
