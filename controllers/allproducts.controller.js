const { Product } = require("../models/product.model");


exports.getPageallproducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // products per page
    const skip = (page - 1) * limit;

    const [products, totalProducts] = await Promise.all([
      Product.find({})
        .populate('category')
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);

    // Group products by category
    const productsByCategory = {};
    products.forEach(product => {
      const categoryName = product.category ? product.category.name : "Uncategorized";
      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }
      productsByCategory[categoryName].push(product);
    });

    const totalPages = Math.ceil(totalProducts / limit);

    res.render("allproducts", {
      user: req.session.user,
      productsByCategory,
      currentPage: page,
      totalPages
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error loading products");
  }
};
