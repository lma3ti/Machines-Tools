// const router = require('express').Router();
// const productController = require('../controllers/product.controller');
// const allProductController = require('../controllers/allproducts.controller');
// const GuardAuth = require('./guardAuth');
// const multer = require('multer');
// const path = require('path');

// // Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'assets/uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Upload handlers
// const upload = multer({ storage: storage }).fields([
//   { name: 'images', maxCount: 5 },
//   { name: 'document', maxCount: 1 }
// ]);

// const uploadSingle = multer({ storage: storage }).single("image");

// // ---------------------------
// // PUBLIC ROUTES (Home Catalog)
// // ---------------------------

// // Show all products grouped by category (home)
// router.get('/allproducts', allProductController.getPageallproducts);

// // Show single product (dynamic for guest or user)
// router.get('/product/:id', productController.getOneProductDetailsController);


// // ---------------------------
// // ADMIN ROUTES (Dashboard)
// // ---------------------------

// // Add product (form + submit)
// router.get('/addproduct', GuardAuth.isAuth, productController.getAddProductController);
// router.post('/addproduct', GuardAuth.isAuth, upload, productController.postAddProductController);

// // View my products
// router.get('/myproducts', GuardAuth.isAuth, productController.getMyProductsPage);

// // Delete product
// router.get('/myproducts/delete/:id', GuardAuth.isAuth, productController.deleteProductController);

// // Update product (form + submit)
// router.get('/myproducts/update/:id', GuardAuth.isAuth, productController.getMyProductUpdatePage);
// router.post('/myproducts/update/:id', GuardAuth.isAuth, uploadSingle, productController.postUpdateProductController);


// module.exports = router;
