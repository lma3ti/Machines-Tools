const CategoryModel = require("../models/category.model");

// Fetch all categories and render them for admin
exports.getAllCategoriesController = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    CategoryModel.getAllCategories()
      .then((categories) => {
        // Render the 'add-category' view with categories and flash messages
        res.render("add-category", { 
          categories: categories, 
          csrfToken: req.csrfToken(),
          user: req.session.user.id,
          Smessage: req.flash('Successmessage')[0],  // Success message for category
          Emessage: req.flash('Errormessage')[0]    // Error message for category
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Error fetching categories.");
      });
  } else {
    res.status(403).send("Unauthorized: Admin only");
  }
};

// Controller to handle adding a new category
exports.addCategoryController = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    const { name } = req.body;

    // Check if the category name is provided
    if (!name || name.trim() === "") {
      req.flash("Errormessage", "Category name is required.");
      return res.redirect("/addcategory");
    }

    // Save category to the database
    CategoryModel.createCategory(name)
      .then(() => {
        req.flash("Successmessage", "Category added successfully!");
        res.redirect("/addcategory"); // Redirect to the add-category page
      })
      .catch((err) => {
        console.error(err);

        // Handle duplicate category name error
        if (err.code === 11000) {
          req.flash("Errormessage", "Category name must be unique.");
        } else {
          req.flash("Errormessage", "An error occurred while adding the category.");
        }
        res.redirect("/addcategory");
      });
  } else {
    res.status(403).send("error");
  }
};

// Controller to delete a category
exports.deleteCategoryController = async (req, res) => {
  const { id } = req.params;

  try {
    await CategoryModel.deleteCategory(id);
    req.flash("success", "Category deleted successfully!");
    res.redirect("/addcategory");
  } catch (err) {
    req.flash("error", "Failed to delete category.");
    res.redirect("/addcategory");
  }
};

// Controller to edit a category
exports.editCategoryController = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await CategoryModel.updateCategory(id, name);
    req.flash("success", "Category updated successfully!");
    res.redirect("/addcategory");
  } catch (err) {
    req.flash("error", "Failed to update category.");
    res.redirect("/addcategory");
  }
};

