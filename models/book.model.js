const mongoose = require("mongoose");
const Category = require("./category.model");  // Import the Category model

// Define the schema for the "book" collection
var schemaBook = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  userId: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Add category reference
});

// Create the Book model
var Book = mongoose.model("book", schemaBook);

// Function to get the first three books
exports.getThreeBooks = () => {
  return new Promise((resolve, reject) => {
    Book.find({}).limit(3)
      .then(books => resolve(books))
      .catch(err => reject(err));
  });
};

// Function to get the details of a specific book by ID
exports.getOneBookDetails = (id) => {
  return new Promise((resolve, reject) => {
    Book.findById(id)
      .then(book => resolve(book))
      .catch(err => reject(err));
  });
};

// Function to get all books
exports.getAllBooks = () => {
  return new Promise((resolve, reject) => {
    Book.find({})
      .populate('category')  // Populate category info for books
      .then(books => resolve(books))
      .catch(err => reject(err));
  });
};

// Function to post a new book
exports.postDataBookModel = (title, description, author, price, image, userId, category) => {
  return new Promise((resolve, reject) => {
    let book = new Book({
      title: title,
      description: description,
      author: author,
      price: price,
      image: image,
      userId: userId,
      category: category  // Add the category to the book
    });

    book.save()
      .then(() => resolve('added !'))
      .catch(err => reject(err));
  });
};

// Function to get books by a specific user ID
exports.getMyBooks = (userId, searchQuery, skip, limit) => {
  return new Promise((resolve, reject) => {
    const filter = {
      userId: userId,
      title: { $regex: searchQuery, $options: "i" }, // Case-insensitive search
    };

    Promise.all([
      Book.find(filter).skip(skip).limit(limit).populate('category'), // Paginated books with category populated
      Book.countDocuments(filter), // Total count of books matching the filter
    ])
      .then(([books, totalBooks]) => resolve({ books, totalBooks }))
      .catch((err) => reject(err));
  });
};

// Function to delete a book by its ID
exports.deletebook = (id) => {
  return new Promise((resolve, reject) => {
    Book.deleteOne({ _id: id })
      .then(() => resolve(true))
      .catch(err => reject(err));
  });
};

// Function to get a specific book's data for updating
exports.getPageUpdateBookModel = (id) => {
  return new Promise((resolve, reject) => {
    Book.findById(id)
      .populate('category')  // Populate category info
      .then(book => resolve(book))
      .catch(err => reject(err));
  });
};

// Function to update a book's information
exports.postUpdateBookModel = (bookId, title, description, author, price, image, userId, category) => {
  return new Promise((resolve, reject) => {
    Book.updateOne(
      { _id: bookId },
      { title: title, description: description, author: author, price: price, image: image, userId: userId, category: category }
    )
      .then(() => resolve('updated !'))
      .catch(err => reject(err));
  });
};
