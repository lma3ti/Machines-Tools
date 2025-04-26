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
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.render("allproducts", {
      user: req.session.user,
      productsByCategory,
      currentPage: page,
      totalPages,

      // ✅ SEO meta variables
      title: "All Products - OULAD ABDERRAHMAN",
      description: "Explore our full range of CNC machines, industrial tools, and equipment. Find the perfect products for your business needs at OULAD ABDERRAHMAN.",
      keywords: "CNC machines, industrial tools, CNC milling, turning machines, industrial equipment, machinery, precision tools, milling equipment, all products",

      ogTitle: "All Products - OULAD ABDERRAHMAN",
      ogDescription: "Browse our complete catalog of industrial machines and tools. High performance, reliability, and precision await.",
      ogImage: "/images/seo-image.jpg",
      ogUrl: fullUrl,

      twitterTitle: "All Products at OULAD ABDERRAHMAN",
      twitterDescription: "From CNC machines to precision tools, explore our entire product line.",
      twitterImage: "/images/seo-image.jpg",
      twitterUrl: fullUrl,

      fullUrl
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Error loading products");
  }
};
