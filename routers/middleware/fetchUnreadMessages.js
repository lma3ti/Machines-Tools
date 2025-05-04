const Message = require('../../models/message.model');

module.exports = async (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    try {
      const unreadMessages = await Message.find({ isRead: false }).sort({ createdAt: -1 }).limit(5).lean();
      res.locals.unreadMessages = unreadMessages;
    } catch (err) {
      console.error('Error fetching unread messages:', err);
      res.locals.unreadMessages = [];
    }
  } else {
    res.locals.unreadMessages = [];
  }
  next();
};
