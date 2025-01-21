const BookModel = require("../models/book.model");
const CategoryModel = require("../models/category.model"); // Import the Category model

// Get all books
exports.getAllBooksController = (req, res, next) => {
  BookModel.getAllBooks().then((books) => {
    res.render("books", { books: books, user: req.session.user });
  });
};

// Get one book details
exports.getOneBookDetailsController = (req, res, next) => {
  let id = req.params.id;
  BookModel.getOneBookDetails(id).then((book) => {
    res.render("details", { book: book, user: req.session.user });
  });
};

// Get add book page with categories
exports.getAddBookController = (req, res, next) => {
  CategoryModel.getAllCategories() // Fetch all categories
    .then(categories => {
      res.render("addbook", {
        user: req.session.user,
        categories: categories, // Pass categories to the form
        Smessage: req.flash("Successmessage")[0],
        Emessage: req.flash("Errormessage")[0],
      });
    })
    .catch(err => {
      req.flash("Errormessage", err);
      res.redirect("/addbook");
    });
};

// Post a new book (with category)
exports.postAddBookController = (req, res, next) => {
  const { title, description, author, price, category } = req.body; // Capture category from form
  BookModel.postDataBookModel(
    title,
    description,
    author,
    price,
    req.file ? req.file.filename : null,
    req.session.user.id, // Using user ID from session
    category // Pass category ID to the model
  )
    .then((msg) => {
      req.flash("Successmessage", msg);
      res.redirect("/mybooks");
    })
    .catch((err) => {
      req.flash("Errormessage", err);
      res.redirect("/addbook");
    });
};

// Get my books page
exports.getMyBooksPage = (req, res, next) => {
  const userId = req.session.user.id; // Using user ID from session
  const searchQuery = req.query.q || ""; // Search query
  const page = parseInt(req.query.page) || 1; // Current page
  const limit = parseInt(req.query.limit) || 5; // Results per page
  
  const skip = (page - 1) * limit;

  BookModel.getMyBooks(userId, searchQuery, skip, limit).then((result) => {
    res.render("mybooks", {
      user: req.session.user,
      books: result.books,
      totalBooks: result.totalBooks,
      currentPage: page,
      limit: limit,
      searchQuery: searchQuery,
    
    });
  });
};

// Delete a book by ID
exports.deleteBookController = (req, res, next) => {
  let id = req.params.id;
  BookModel.deletebook(id)
    .then(() => {
      res.redirect("/mybooks");
    })
    .catch((err) => {
      console.log(err);
    });
};

// Get update book page with existing book data and categories
exports.getMyBookUpdatePage = (req, res, next) => {
  let id = req.params.id;
  CategoryModel.getAllCategories() // Fetch categories to update the book's category
    .then(categories => {
      BookModel.getPageUpdateBookModel(id).then((book) => {
        res.render("updateBook", {
          user: req.session.user,
          bookUpdate: book,
          categories: categories, // Pass categories to the form
          Smessage: req.flash("Successmessage")[0],
          Emessage: req.flash("Errormessage")[0],
        });
      });
    })
    .catch(err => {
      req.flash("Errormessage", err);
      res.redirect(`/mybooks/update/${req.params.id}`);
    });
};

// Post updated book data (with category)
const Book = require("../models/book.model");

exports.postUpdateBookController = (req, res) => {
  const bookId = req.params.id;
  const { title, description, author, price, category } = req.body;
  const image = req.file ? req.file.filename : req.body.oldImage;
  const userId = req.session.user._id; // Ensure this is from the session

  Book.postUpdateBookModel(bookId, title, description, author, price, image, userId, category)
    .then(() => {
      req.flash("success", "Book updated successfully!");
      res.redirect("/mybooks");
    })
    .catch((err) => {
      console.error(err);
      req.flash("error", "Failed to update the book.");
      res.redirect("/mybooks");
    });
};

