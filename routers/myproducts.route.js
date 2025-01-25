const route = require('express').Router();
const productController = require('../controllers/product.controller');
const multer = require('multer');
const GuardAuth = require('./guardAuth');

// Route to fetch and display user's products
route.get('/', GuardAuth.isAuth, productController.getMyProductsPage);

// Route to delete a product
route.get('/delete/:id', GuardAuth.isAuth, productController.deleteProductController);

// Route to get the update page for a product
route.get('/update/:id', GuardAuth.isAuth, productController.getMyProductUpdatePage);

// Route to handle product update with image upload
route.post(
    "/update/:id",
    multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "assets/uploads");
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
        },
      }),
    }).single("image"),
    GuardAuth.isAuth,
    productController.postUpdateProductController
  );
  

module.exports = route;
