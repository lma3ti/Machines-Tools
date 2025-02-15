const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model"); // Import the Category model
const Product = require("../models/product.model");
// Get all products
exports.getAllProductsController = (req, res, next) => {
  ProductModel.getAllProducts().then((products) => {
    res.render("myproducts", { products: products, user: req.session.user });
  });
};

// Get one product details

exports.getOneProductDetailsController = (req, res, next) => {
  let id = req.params.id;
  ProductModel.getOneProductDetails(id)
      .then((product) => {
          if (req.session.user) {
              // If authenticated, render the admin product details page (details.ejs)
              res.render('details', { product });
          } else {
              // If not authenticated, render the public product details page (product-details.ejs)
              res.render('product-details', { product });
          }
      })
      .catch((err) => {
          console.error("Error fetching product:", err);
          res.status(500).send("Error loading product details");
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
  const { title, description, author, price, category, manufacturer, model, condition, stock, warranty, document } = req.body; // Capture category from form
  
  // Use req.file to retrieve the uploaded image
  const image = req.file ? req.file.filename : ''; // Handle single image upload
  
  ProductModel.postDataProductModel(
    title,
    description,
    author,
    price,
    image, // Pass single image filename instead of an array
    req.session.user.id, // Using user ID from session
    category, // Pass category ID to the model
    manufacturer,
    model, 
    condition, 
    stock, 
    warranty, 
    document
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

