const mongoose = require("mongoose");
const Category = require("./category.model");

// Define the schema for the "product" collection
var schemaProduct = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: [{ type: String, required: true }], // Array of images
  userId: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  condition: { type: String, enum: ['New', 'Used'], required: true },
  stock: { type: Number, required: true },
  warranty: { type: String },
  document: { type: String },
});

// Create the Product model
var Product = mongoose.model("product", schemaProduct);

// Get first three products
exports.getThreeProducts = () => {
  return Product.find({}).limit(6);
};

// Get one product details
exports.getOneProductDetails = (id) => {
  return Product.findById(id);
};

// Get all products (with optional skip and limit)
exports.getAllProducts = (skip = 0, limit = 12) => {
  return Product.find({})
    .populate('category')
    .skip(skip)
    .limit(limit);
};

// Post new product
exports.postDataProductModel = (title, description, author, price, image, userId, category, manufacturer, model, condition, stock, warranty, document) => {
  const product = new Product({
    title,
    description,
    author,
    price,
    image,
    userId,
    category,
    manufacturer,
    model,
    condition,
    stock,
    warranty,
    document
  });
  return product.save();
};

// Get user's products
exports.getMyProducts = (userId, searchQuery, skip, limit) => {
  const filter = {
    userId,
    title: { $regex: searchQuery, $options: "i" },
  };

  return Promise.all([
    Product.find(filter).skip(skip).limit(limit).populate('category'),
    Product.countDocuments(filter)
  ]);
};

// Delete product
exports.deleteproduct = (id) => {
  return Product.deleteOne({ _id: id });
};

// Get product for update
exports.getPageUpdateProductModel = (id) => {
  return Product.findById(id).populate('category');
};

// Update product
exports.postUpdateProductModel = (productId, title, description, author, price, image, userId, category, manufacturer, model, condition, stock, warranty, document) => {
  return Product.updateOne(
    { _id: productId },
    { title, description, author, price, image, userId, category, manufacturer, model, condition, stock, warranty, document }
  );
};
