module.exports = {
    // Middleware for preventing access to certain pages for logged-in users
    notAuth: (req, res, next) => {
      if (!req.session.user) {
        return next();
      }
      res.redirect('/'); // Redirect to home or dashboard if user is already logged in
    },
  
    // Middleware to ensure the user is logged in (if needed)
    isAuth: (req, res, next) => {
      if (req.session.user) {
        return next();
      }
      res.redirect('/login'); // Redirect to login page if not authenticated
    },
  
    // Middleware to ensure the user is an admin
    isAdmin: (req, res, next) => {
      if (req.session.user && req.session.user.isAdmin) {
        return next(); 
      }
      res.status(403).send("Unauthorized: Admin only"); // Deny access if not an admin
    }
  };
  