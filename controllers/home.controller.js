const ProductModel = require("../models/product.model");
exports.getHomePage = (req, res, next) => {
  res.render('index', {
      user: req.session.user, // Pass the user object to the view
  });
};
exports.threeProductsController = (req, res, next) => {
  ProductModel.getThreeProducts().then((products) => {
    res.render("index", { 
      products: products ,
      user:req.session.user
    });
  });
};
