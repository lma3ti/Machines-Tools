const ProductModel = require("../models/product.model"); // Import the Product model
const CategoryModel = require("../models/category.model"); // Import the Category model
const AuthModel = require("../models/auth.model"); // Import the Auth model for users


exports.getDashboard = (req, res, next) => {
  const userId = req.session.user.id;

  Promise.all([
    ProductModel.getMyProducts(userId, "", 0, 1000), // Safe large limit
    CategoryModel.getAllCategories(),
    AuthModel.countUsers(),
    AuthModel.countAdmins()
  ])
    .then(([productResult, categories, totalUsers, totalAdmins]) => {
      const { totalProducts } = productResult;

      res.render("dashboard", {
        user: req.session.user,
        totalProducts,
        categories,
        totalUsers,
        totalAdmins,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error fetching data for the dashboard");
    });
};

exports.getTableDashboard = (req, res, next) => {
  res.render("tables", { user: req.session.user });
};
