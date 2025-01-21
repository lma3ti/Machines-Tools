const mongoose = require("mongoose");

// Define the category schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

// Create the Category model
const Category = mongoose.model("Category", categorySchema);

// Method to create a new category
exports.createCategory = (name) => {
  const category = new Category({ name });
  return category.save(); 
};

// Method to get all categories
exports.getAllCategories = () => {
  return Category.find(); 
};
// Method to delete a category by ID
exports.deleteCategory = (id) => {
  return Category.findByIdAndDelete(id);
};

// Method to update a category by ID
exports.updateCategory = (id, name) => {
  return Category.findByIdAndUpdate(id, { name }, { new: true, runValidators: true });
};
