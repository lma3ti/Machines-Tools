const ProductModel = require("../models/product.model"); // Import the Product model
const CategoryModel = require("../models/category.model"); // Import the Category model
const AuthModel = require("../models/auth.model"); // Import the Auth model for users

exports.getDashboard = (req, res, next) => {
  const userId = req.session.user.id; // Get the user ID from the session

  // Fetch the count of products, categories, total users, and total admins
  Promise.all([
    ProductModel.getMyProducts(userId, "", 0, 0), // Fetch products for the user (no limit)
    CategoryModel.getAllCategories(), // Fetch all categories
    AuthModel.countUsers(), // Count all users
    AuthModel.countAdmins() // Count all admins
  ])
    .then(([productResult, categories, totalUsers, totalAdmins]) => {
      const totalProducts = productResult.totalProducts; // Get the total number of products

      // Render the dashboard and pass all the totals to the view
      res.render("dashboard", {
        user: req.session.user,
        totalProducts: totalProducts, // Total number of products
        categories: categories, // Categories data
        totalUsers: totalUsers, // Total number of users
        totalAdmins: totalAdmins, // Total number of admins
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
