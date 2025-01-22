const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model"); // Import the Category model
const Product = require("../models/product.model");
// Get all products
exports.getAllProductsController = (req, res, next) => {
  ProductModel.getAllProducts().then((products) => {
    res.render("dashboard", { products: products, user: req.session.user });
  });
};

// Get one product details
exports.getOneProductDetailsController = (req, res, next) => {
  let id = req.params.id;
  ProductModel.getOneProductDetails(id).then((product) => {
    res.render("details", { product: product, user: req.session.user });
  });
};

// Get add product page with categories
exports.getAddProductController = (req, res, next) => {
  CategoryModel.getAllCategories() // Fetch all categories
    .then(categories => {
      res.render("addproduct", {
        user: req.session.user,
        categories: categories, // Pass categories to the form
        Smessage: req.flash("Successmessage")[0],
        Emessage: req.flash("Errormessage")[0],
      });
    })
    .catch(err => {
      req.flash("Errormessage", err);
      res.redirect("/addproduct");
    });
};

// Post a new product (with category)
exports.postAddProductController = (req, res, next) => {
  const { title, description, author, price, category } = req.body; // Capture category from form
  ProductModel.postDataProductModel(
    title,
    description,
    author,
    price,
    req.file ? req.file.filename : null,
    req.session.user.id, // Using user ID from session
    category // Pass category ID to the model
  )
    .then((msg) => {
      req.flash("Successmessage", msg);
      res.redirect("/myproducts");
    })
    .catch((err) => {
      req.flash("Errormessage", err);
      res.redirect("/addproduct");
    });
};

// Get my products page
exports.getMyProductsPage = (req, res, next) => {
  const userId = req.session.user.id; // Using user ID from session
  const searchQuery = req.query.q || ""; // Search query
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 5; // Results per page
  
  const skip = (page - 1) * limit;

  ProductModel.getMyProducts(userId, searchQuery, skip, limit).then((result) => {
    res.render("myproducts", {
      user: req.session.user,
      products: result.products,
      totalProducts: result.totalProducts,
      currentPage: page,
      limit: limit,
      searchQuery: searchQuery,
    
    });
  });
};

// Delete a product by ID
exports.deleteProductController = (req, res, next) => {
  let id = req.params.id;
  ProductModel.deleteproduct(id)
    .then(() => {
      res.redirect("/myproducts");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get update product page with existing product data and categories
exports.getMyProductUpdatePage = (req, res, next) => {
  let id = req.params.id;
  CategoryModel.getAllCategories() // Fetch categories to update the product's category
    .then(categories => {
      ProductModel.getPageUpdateProductModel(id).then((product) => {
        res.render("updateProduct", {
          user: req.session.user,
          productUpdate: product,
          categories: categories, // Pass categories to the form
          Smessage: req.flash("Successmessage")[0],
          Emessage: req.flash("Errormessage")[0],
        });
      });
    })
    .catch(err => {
      req.flash("Errormessage", err);
      res.redirect(`/myproducts/update/${req.params.id}`);
    });
};



exports.postUpdateProductController = (req, res) => {
  const productId = req.params.id;
  const { title, description, author, price, category } = req.body;
  const image = req.file ? req.file.filename : req.body.oldImage;
  const userId = req.session.user._id; // Ensure this is from the session

  Product.postUpdateProductModel(productId, title, description, author, price, image, userId, category)
    .then(() => {
      req.flash("success", "Product updated successfully!");
      res.redirect("/myproducts");
    })
    .catch((err) => {
      console.error(err);
      req.flash("error", "Failed to update the product.");
      res.redirect("/myproducts");
    });
};

