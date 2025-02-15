const productController = require('../controllers/product.controller');
const router = require('express').Router();
const GuardAuth = require('./guardAuth');
const multer = require('multer');

// Add PRODUCT routes
router.get('/addproduct', GuardAuth.isAuth, productController.getAddProductController);
// Route to handle product update with image upload
router.post('/addproduct', multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        cb(null, 'assets/uploads');
      },
      filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
    })
  }).single('image'), GuardAuth.isAuth, productController.postAddProductController);
  

router.get('/products', GuardAuth.isAuth, productController.getAllProductsController);

router.get('/product/:id', productController.getOneProductDetailsController);

module.exports = router;
