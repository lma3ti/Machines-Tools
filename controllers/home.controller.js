const BookModel = require("../models/book.model");
exports.getHomePage = (req, res, next) => {
  res.render('index', {
      user: req.session.user, // Pass the user object to the view
  });
};
exports.threeBooksController = (req, res, next) => {
  BookModel.getThreeBooks().then((books) => {
    res.render("index", { 
      books: books ,
      user:req.session.user
    });
  });
};
