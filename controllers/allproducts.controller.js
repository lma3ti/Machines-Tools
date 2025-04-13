const Product = require("../models/product.model");

exports.getPageallproducts = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 12; // Products per page
  const skip = (page - 1) * limit;

  Product.getAllProducts(skip, limit)
    .then(products => {
      const productsByCategory = {};

      products.forEach(product => {
        const categoryName = product.category ? product.category.name : "Uncategorized";
        if (!productsByCategory[categoryName]) {
          productsByCategory[categoryName] = [];
        }
        productsByCategory[categoryName].push(product);
      });

      res.render("allproducts", {
        user: req.session.user,
        productsByCategory,
        currentPage: page
      });
    })
    .catch(err => {
      console.error("Error fetching products:", err);
      res.status(500).send("Error loading products");
    });
};
