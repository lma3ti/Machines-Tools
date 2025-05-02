// models/product.model.js

const mongoose = require("mongoose");

// Define the schema for the "product" collection
const schemaProduct = new mongoose.Schema({
  title:         { type: String, required: true },
  description:   { type: String },
  author:        { type: String, required: true },
  price:         { type: Number, required: true },
  image:         [{ type: String, required: true }], // Array of image filenames
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // creator
  updatedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },                  // last modifier
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  manufacturer:  { type: String, required: true },
  model:         { type: String, required: true },
  condition:     { type: String, enum: ['New', 'Used'], required: true },
  stock:         { type: Number, required: true },
  warranty:      { type: String },
  document:      { type: String }
}, {
  timestamps: true  // adds createdAt and updatedAt
});

const Product = mongoose.model("product", schemaProduct);

// Exported API

// Get first six products (for homepage)
exports.getThreeProducts = () => {
  return Product.find({}).limit(6);
};

// Get one product by ID
exports.getOneProductDetails = (id) => {
  return Product.findById(id).populate('category');
};

// Get all products with pagination
exports.getAllProducts = async (searchQuery = '', skip = 0, limit = 10) => {
  const query = searchQuery
    ? { title: { $regex: searchQuery, $options: 'i' } }
    : {};

  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .populate('category')
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  return { products, totalProducts };
};

// Create a new product
exports.postDataProductModel = (
  title, description, author, price,
  image, userId, category, manufacturer,
  model, condition, stock, warranty, document
) => {
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

// Get products belonging to a specific user
exports.getMyProducts = (userId, searchQuery = "", skip = 0, limit = 10) => {
  const filter = {
    userId,
    title: { $regex: searchQuery, $options: "i" },
  };
  return Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(limit > 0 ? limit : 1000)
      .populate('category'),
    Product.countDocuments(filter)
  ]).then(([products, count]) => ({
    products,
    totalProducts: count
  }));
};

// Delete a product by ID
exports.deleteproduct = (id) => {
  return Product.deleteOne({ _id: id });
};

// Get a single product (for update form)
exports.getPageUpdateProductModel = (id) => {
  return Product.findById(id).populate('category');
};

// Update a product (recording who updated it)
exports.postUpdateProductModel = (
  productId, title, description, author, price,
  image, userId, category, manufacturer,
  model, condition, stock, warranty,
  document, updatedBy
) => {
  return Product.updateOne(
    { _id: productId },
    {
      title,
      description,
      author,
      price,
      image,
      userId,
      updatedBy,
      category,
      manufacturer,
      model,
      condition,
      stock,
      warranty,
      document
    }
  );
};

exports.Product = Product;
