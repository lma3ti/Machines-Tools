const route = require('express').Router();
const bookController = require('../controllers/book.controller');
const multer = require('multer');
const GuardAuth = require('./guardAuth');

// Route to fetch and display user's books
route.get('/', GuardAuth.isAuth, bookController.getMyBooksPage);

// Route to delete a book
route.get('/delete/:id', GuardAuth.isAuth, bookController.deleteBookController);

// Route to get the update page for a book
route.get('/update/:id', GuardAuth.isAuth, bookController.getMyBookUpdatePage);

// Route to handle book update with image upload
route.post(
    "/update/:id",
    multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "assets/uploads");
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + "-" + file.originalname);
        },
      }),
    }).single("image"),
    GuardAuth.isAuth,
    bookController.postUpdateBookController
  );
  

module.exports = route;
