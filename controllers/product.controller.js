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
// controllers/product.controller.js

// controllers/product.controller.js
// Get one product details
exports.getOneProductDetailsController = (req, res, next) => {
  const id = req.params.id;

  ProductModel.getOneProductDetails(id)
    .then(product => {
      // build the full URL (works on localhost & in production)
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

      // SEO meta variables
      const seoTitle = `${product.title} - OULAD ABDERRAHMAN`;
      const seoDescription = product.description.slice(0, 150) + '...';
      const seoKeywords = `${product.title}, CNC machines, industrial equipment, ${product.category.name || product.category}, precision tools, milling machines`;

      // Open Graph and Twitter meta tags
      const ogTitle = seoTitle;
      const ogDescription = seoDescription;
      const ogImage = `/uploads/${ Array.isArray(product.image) ? product.image[0] : product.image }`;
      const ogUrl = fullUrl;

      const twitterTitle = seoTitle;
      const twitterDescription = seoDescription;
      const twitterImage = ogImage;
      const twitterUrl = ogUrl;

      // choose view based on user session
      const viewName = req.session.user ? 'details' : 'product-details';

      // render with SEO variables
      res.render(viewName, {
        product,
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        twitterTitle,
        twitterDescription,
        twitterImage,
        twitterUrl,
        fullUrl,
        user: req.session.user
      });
    })
    .catch(err => {
      console.error("Error fetching product:", err);
      res.status(500).send("Error loading product details");
    });
};




// Get add product page with categories
exports.getAddProductController = (req, res, next) => {
  CategoryModel.getAllCategories()
    .then(categories => {
      res.render('addproduct', {
        user:      req.session.user,
        categories:categories,
        Smessage:  req.flash('Successmessage')[0],
        Emessage:  req.flash('Errormessage')[0],
        csrfToken: req.csrfToken()      // <-- include CSRF token here
      });
    })
    .catch(err => {
      req.flash('Errormessage', err);
      res.redirect('/addproduct');
    });
};


// Post a new product with image compression
exports.postAddProductController = async (req, res, next) => {
  try {
    // Destructure form fields from req.body
    const {
      title,
      description,
      author,
      price,
      manufacturer,
      model,
      condition,
      stock,
      warranty,
      category
    } = req.body;

    // Log incoming data for debugging
    console.log('Form Data:', req.body);
    console.log('Uploaded Files:', req.files);

    // Validate required fields
    if (!title || !author || !price || !category || !req.files || req.files.length === 0) {
      req.flash("Errormessage", "All required fields must be filled and at least one image must be uploaded.");
      return res.redirect("/addproduct");
    }

    // Extract image file names
    const imagePaths = req.files.images.map(file => file.filename);

    // If using logged-in user ID
    const userId = req.session.user.id;

    // Optional document upload — if you allow a separate document upload field
    const document = req.files.document ? req.files.document[0].filename : "";

    // Call model function to save product
    await ProductModel.postDataProductModel(
      title,
      description,
      author,
      parseFloat(price),
      imagePaths,
      userId,
      category, // This should be the ObjectId string from the select
      manufacturer,
      model,
      condition,
      parseInt(stock),
      warranty,
      document
    );

    req.flash("Successmessage", "Product added successfully!");
    res.redirect("/myproducts");

  } catch (err) {
    console.error("Error adding product:", err);
    req.flash("Errormessage", "An error occurred while adding the product.");
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
  .then(({ products, totalProducts }) => {
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
          csrfToken: req.csrfToken()
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
    console.log('Form Data:', req.body);
    console.log('Uploaded Files:', req.files);

    const compressedImageFilenames = [];

    // Handle multiple image uploads (req.files.images should be an array)
    if (req.files && req.files.images) {
      // Compress new images and add them to the array
      for (let file of req.files.images) {
        const originalPath = file.path;
        const compressedFilename = `compressed-${Date.now()}-${file.originalname}`;
        const compressedPath = path.join("assets/uploads", compressedFilename);

        await sharp(originalPath)
          .resize({ width: 800 })
          .jpeg({ quality: 70 })
          .toFile(compressedPath);

        compressedImageFilenames.push(compressedFilename);
        fs.unlinkSync(originalPath); // delete the original file after compression
      }
    }

    // If no new images are uploaded but old images are passed
    const allImages = compressedImageFilenames.length > 0
      ? compressedImageFilenames
      : req.body.oldImages ? req.body.oldImages.split(',') : [];

    // Ensure allImages is an array and remove duplicates if any
    const finalImages = [...new Set(allImages)];

    // Optional document upload handling
    const document = req.files && req.files.document ? req.files.document[0].filename : req.body.oldDocument || '';

    const userId = req.session.user.id;

    // Update the product in the database with the final list of images
    await ProductModel.postUpdateProductModel(
      productId,
      title,
      description,
      author,
      price,
      finalImages,
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




