const mongoose = require("mongoose");
const Category = require("./category.model");  // Import the Category model

// Define the schema for the "product" collection
var schemaProduct = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // Single image field
  userId: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Add category reference
  // New fields for machines
  manufacturer: { type: String, required: true },  // Manufacturer
  model: { type: String, required: true },        // Model number or name
  condition: { type: String, enum: ['New', 'Used'], required: true },  // New or Used condition
  stock: { type: Number, required: true },        // Stock quantity
  warranty: { type: String },                     // Warranty details (optional)
  document: { type: String },                     // Path to uploaded technical document (if any)
});

// Create the Product model
var Product = mongoose.model("product", schemaProduct);

// Function to get the first three products
exports.getThreeProducts = () => {
  return new Promise((resolve, reject) => {
    Product.find({}).limit(6)
      .then(products => resolve(products))
      .catch(err => reject(err));
  });
};

// Function to get the details of a specific product by ID
exports.getOneProductDetails = (id) => {
  return new Promise((resolve, reject) => {
    Product.findById(id)
      .then(product => resolve(product))
      .catch(err => reject(err));
  });
};

// Function to get all products
exports.getAllProducts = () => {
  return new Promise((resolve, reject) => {
    Product.find({})
      .populate('category')  // Populate category info for products
      .then(products => resolve(products))
      .catch(err => reject(err));
  });
};

// Function to post a new product
exports.postDataProductModel = (title, description, author, price, image, userId, category, manufacturer, model, condition, stock, warranty, document) => {
  return new Promise((resolve, reject) => {
    let product = new Product({
      title: title,
      description: description,
      author: author,
      price: price,
      image: image, // Single image
      userId: userId,
      category: category,  // Add the category to the product
      manufacturer: manufacturer,
      model: model,
      condition: condition,
      stock: stock,
      warranty: warranty,
      document: document, 
    });

    product.save()
      .then(() => resolve('added !'))
      .catch(err => reject(err));
  });
};

// Function to get products by a specific user ID
exports.getMyProducts = (userId, searchQuery, skip, limit) => {
  return new Promise((resolve, reject) => {
    const filter = {
      userId: userId,
      title: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
    };

    Promise.all([
      Product.find(filter).skip(skip).limit(limit).populate('category'), // Paginated products with category populated
      Product.countDocuments(filter), // Total count of products matching the filter
    ])
      .then(([products, totalProducts]) => resolve({ products, totalProducts }))
      .catch((err) => reject(err));
  });
};

// Function to delete a product by its ID
exports.deleteproduct = (id) => {
  return new Promise((resolve, reject) => {
    Product.deleteOne({ _id: id })
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
};

// Function to get a specific product's data for updating
exports.getPageUpdateProductModel = (id) => {
  return new Promise((resolve, reject) => {
    Product.findById(id)
      .populate('category')  // Populate category info
      .then(product => resolve(product))
      .catch(err => reject(err));
  });
};

// Function to update a product's information
exports.postUpdateProductModel = (productId, title, description, author, price, image, userId, category, manufacturer, model, condition, stock, warranty, document) => {
  return new Promise((resolve, reject) => {
    Product.updateOne(
      { _id: productId },
      { title: title, description: description, author: author, price: price, image: image, userId: userId, category: category, manufacturer: manufacturer, model: model, condition: condition, stock: stock, warranty: warranty, document: document  }
    )
      .then(() => resolve('updated !'))
      .catch(err => reject(err));
  });
};
