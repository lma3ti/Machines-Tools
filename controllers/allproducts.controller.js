const { Product } = require("../models/product.model");
exports.getPageallproducts = async (req, res, next) => {
  try {
    console.log('🛠️ [allproducts] Controller called');
    
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    console.log(`🔄 Pagination -> page: ${page}, skip: ${skip}, limit: ${limit}`);

    const [products, totalProducts] = await Promise.all([
      Product.find({})
        .populate('category')
        .skip(skip)
        .limit(limit)
        .then(data => {
          console.log(`📦 Retrieved ${data.length} products`);
          return data;
        }),
      Product.countDocuments().then(count => {
        console.log(`📊 Total product count: ${count}`);
        return count;
      })
    ]);

    const productsByCategory = {};
    products.forEach(product => {
      const categoryName = product.category ? product.category.name : "Uncategorized";
      if (!productsByCategory[categoryName]) {
        productsByCategory[categoryName] = [];
      }
      productsByCategory[categoryName].push(product);
    });

    console.log('✅ Grouped products by category');

    const totalPages = Math.ceil(totalProducts / limit);
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.render("allproducts", {
      user: req.session.user,
      productsByCategory,
      currentPage: page,
      totalPages,

      // SEO
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

    console.log('✅ Rendered allproducts page');

  } catch (err) {
    console.error("❌ Error in getPageallproducts:", err);
    res.status(500).send("Error loading products");
  }
};
