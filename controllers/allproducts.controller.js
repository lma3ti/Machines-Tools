const { Product } = require("../models/product.model");
const CategoryModel = require('../models/category.model');

exports.getPageallproducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const categoryFilter = req.query.category || null;
  const productQuery = {};

  if (categoryFilter) {
    productQuery.category = categoryFilter;
  }

  const [products, totalProducts, allCategories] = await Promise.all([
    Product.find(productQuery)
      .populate('category')
      .skip(skip)
      .limit(limit),
    Product.countDocuments(productQuery),
    CategoryModel.getAllCategories()
  ]);

  // Group by category name
  const productsByCategory = {};
  products.forEach((product) => {
    const catName = product.category?.name || 'Uncategorized';
    if (!productsByCategory[catName]) {
      productsByCategory[catName] = [];
    }
    productsByCategory[catName].push(product);
  });
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.render('allproducts', {
    productsByCategory,
    allCategories,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
    activeCategory: categoryFilter,
     // SEO metadata
     title: "All Products - OULAD ABDERRAHMAN",
     description: "Explore our full range of CNC machines...",
     keywords: "CNC machines, industrial tools, ...",
     ogTitle: "All Products - OULAD ABDERRAHMAN",
     ogDescription: "Browse our complete catalog...",
     ogImage: "/images/seo-image.jpg",
     ogUrl: fullUrl,
     twitterTitle: "All Products at OULAD ABDERRAHMAN",
     twitterDescription: "From CNC machines to precision tools...",
     twitterImage: "/images/seo-image.jpg",
     twitterUrl: fullUrl,
     fullUrl
  });
};
