const BookController = require("../controllers/book.controller"); // Import the bookController
const categoryController = require("../controllers/category.controller");
const BookModel = require("../models/book.model"); // Import the Book model
const CategoryModel = require("../models/category.model");

exports.getDashboard = (req, res, next) => {
  const userId = req.session.user.id; // Get the user ID from the session
  
  // Fetch the count of books and categories simultaneously
  Promise.all([
    BookModel.getMyBooks(userId, "", 0, 0), // No limit, just count books
    CategoryModel.getAllCategories() // Fetch all categories
  ])
    .then(([bookResult, categories]) => {
      const totalBooks = bookResult.totalBooks; // Get the total number of books

      // Render the dashboard and pass the total number of books and categories
      res.render("dashboard", {
        user: req.session.user,
        totalBooks: totalBooks, // Pass total number of books to the view
        categories: categories, // Pass categories to the view
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
