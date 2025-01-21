const bookController = require('../controllers/book.controller');
const router = require('express').Router();
const GuardAuth = require('./guardAuth');
const multer = require('multer');


// Add Book routes
router.get('/addbook', GuardAuth.isAuth, bookController.getAddBookController);
// route.post('/addbook', GuardAuth.isAuth, upload, bookController.postAddBookController);
// Route to handle book update with image upload
router.post('/addbook', multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'assets/uploads');
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
}).single(['image']), GuardAuth.isAuth, bookController.postAddBookController);

router.get('/books', GuardAuth.isAuth, bookController.getAllBooksController);
router.get('/books/:id', GuardAuth.isAuth, bookController.getOneBookDetailsController);

module.exports = router;
