const Product = require("../models/product.model");

exports.getPageallproducts = (req, res, next) => {
    Product.getAllProducts()
        .then(products => {
            // Group products by category
            const productsByCategory = {};
            products.forEach(product => {
                const categoryName = product.category ? product.category.name : "Uncategorized";
                if (!productsByCategory[categoryName]) {
                    productsByCategory[categoryName] = [];
                }
                productsByCategory[categoryName].push(product);
            });

            res.render("allproducts", { user: req.session.user, productsByCategory });
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            res.status(500).send("Error loading products");
        });
};
