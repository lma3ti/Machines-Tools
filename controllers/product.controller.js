const ProductModel = require("../models/product.model");
const CategoryModel = require("../models/category.model");
const Product = require("../models/product.model");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

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
        res.render('details', { product });
      } else {
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
  CategoryModel.getAllCategories()
    .then(categories => {
      res.render("addproduct", {
        user: req.session.user,
        categories: categories,
        Smessage: req.flash("Successmessage")[0],
        Emessage: req.flash("Errormessage")[0],
      });
    })
    .catch(err => {
      req.flash("Errormessage", err);
      res.redirect("/addproduct");
    });
};

// Post a new product with image compression
exports.postAddProductController = async (req, res, next) => {
  try {
    const {
      title, description, author, price, category,
      manufacturer, model, condition, stock, warranty
    } = req.body;

    const userId = req.session.user.id;
    const compressedImageFilenames = [];

    if (req.files.images && req.files.images.length > 0) {
      for (let file of req.files.images) {
        const originalPath = file.path;
        const compressedFilename = `compressed-${Date.now()}-${file.originalname}`;
        const compressedPath = path.join("assets/uploads", compressedFilename);

        await sharp(originalPath)
          .resize({ width: 800 })
          .jpeg({ quality: 70 })
          .toFile(compressedPath);

        compressedImageFilenames.push(compressedFilename);
        fs.unlinkSync(originalPath);
      }
    }

    const document = req.files.document?.[0]?.filename || '';

    await ProductModel.postDataProductModel(
      title,
      description,
      author,
      price,
      compressedImageFilenames,
      userId,
      category,
      manufacturer,
      model,
      condition,
      stock,
      warranty,
      document
    );

    req.flash("Successmessage", "Product added successfully!");
    res.redirect("/myproducts");
  } catch (err) {
    console.error("Product Upload Error:", err);
    req.flash("Errormessage", err.message || "An error occurred.");
    res.redirect("/addproduct");
  }
};

// Get my products page
exports.getMyProductsPage = (req, res, next) => {
  const userId = req.session.user.id;
  const searchQuery = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  ProductModel.getMyProducts(userId, searchQuery, skip, limit)
    .then(([products, totalProducts]) => {
      res.render("myproducts", {
        user: req.session.user,
        products, 
        totalProducts,
        currentPage: page,
        limit,
        searchQuery
      });
    })
    .catch(err => {
      console.error("Error loading products:", err);
      res.status(500).send("Failed to load products.");
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
  CategoryModel.getAllCategories()
    .then(categories => {
      ProductModel.getPageUpdateProductModel(id).then((product) => {
        res.render("updateProduct", {
          user: req.session.user,
          productUpdate: product,
          categories: categories,
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

exports.postUpdateProductController = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title, description, author, price, category,
      manufacturer, model, condition, stock, warranty
    } = req.body;

    const compressedImageFilenames = [];

    if (req.files.images && req.files.images.length > 0) {
      for (let file of req.files.images) {
        const originalPath = file.path;
        const compressedFilename = `compressed-${Date.now()}-${file.originalname}`;
        const compressedPath = path.join("assets/uploads", compressedFilename);

        await sharp(originalPath)
          .resize({ width: 800 })
          .jpeg({ quality: 70 })
          .toFile(compressedPath);

        compressedImageFilenames.push(compressedFilename);
        fs.unlinkSync(originalPath);
      }
    } else {
      compressedImageFilenames.push(...req.body.oldImages);
    }

    const document = req.files.document?.[0]?.filename || req.body.oldDocument || '';
    const userId = req.session.user.id;

    await ProductModel.postUpdateProductModel(
      productId,
      title,
      description,
      author,
      price,
      compressedImageFilenames,
      userId,
      category,
      manufacturer,
      model,
      condition,
      stock,
      warranty,
      document
    );

    req.flash("Successmessage", "Product updated successfully!");
    res.redirect("/myproducts");
  } catch (err) {
    console.error("Product Update Error:", err);
    req.flash("Errormessage", err.message || "Failed to update the product.");
    res.redirect("/myproducts");
  }
};
