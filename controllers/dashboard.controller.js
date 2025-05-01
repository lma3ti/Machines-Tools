const MessageModel = require('../models/message.model');
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');
const AuthModel = require('../models/auth.model');
// Dashboard table page
exports.getTableDashboard = (req, res, next) => {
  res.render("tables", { user: req.session.user });
};
// GET /dashboard
exports.getDashboard = async (req, res, next) => {
  const user = req.session.user;
  const isAdmin = user?.isAdmin;

  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const [productResult, categories, totalUsers, totalAdmins, unreadMessages] = await Promise.all([
      isAdmin
        ? ProductModel.getAllProducts(skip, limit)
        : ProductModel.getMyProducts(user.id, '', skip, limit),
      CategoryModel.getAllCategories(),
      AuthModel.countUsers(),
      AuthModel.countAdmins(),
      MessageModel.find({ isRead: false }).sort({ createdAt: -1 }).limit(5),
    ]);

    const { products, totalProducts } = productResult;

    res.render('dashboard', {
      user,
      products,
      totalProducts,
      categories,
      totalUsers,
      totalAdmins,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      unreadMessages
    });
  } catch (err) {
    console.error('Error fetching dashboard:', err);
    res.status(500).send("Dashboard load error.");
  }
};

// GET /dashboard/messages
exports.listMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 });
    res.render("partsadmin/messages", {
      user: req.session.user,
      messages
    });
  } catch (err) {
    console.error("Error listing messages:", err);
    res.status(500).send("Unable to list messages.");
  }
};

// GET /dashboard/messages/:id
exports.viewMessage = async (req, res) => {
  try {
    const message = await MessageModel.findById(req.params.id);
    if (!message) return res.status(404).send("Message not found");

    message.isRead = true;
    await message.save();

    res.render("partsadmin/message-view", {
      user: req.session.user,
      message
    });
  } catch (err) {
    console.error("Error fetching message:", err);
    res.status(500).send("Unable to fetch message.");
  }
};
