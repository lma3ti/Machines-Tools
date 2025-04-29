const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");

// ---------- Render Register Page ----------
exports.getRegisterPage = (req, res) => {
  res.render("register", {
    user: req.session.user,
    message: req.flash("error")[0],
    csrfToken: res.locals.csrfToken 
  });
};

// ---------- Handle Register Form Submission ----------
exports.postRegisterData = (req, res) => {
  const { name, email, password } = req.body;

  authModel
    .registerFunctionModel(name, email, password)
    .then(() => res.redirect("/login"))
    .catch((err) => {
      console.error(err);
      req.flash("error", err);
      res.redirect("/register");
    });
};

// ---------- Render Login Page ----------
exports.getLoginPage = (req, res) => {
  res.render("login", {
    user: req.session.user,
    message: req.flash("error")[0],
    csrfToken: res.locals.csrfToken
  });
};

// ---------- Handle Login Form Submission ----------
exports.postLoginData = (req, res) => {
  const { email, password } = req.body;

  authModel
    .loginFunctionModel(email, password)
    .then((user) => {
      req.session.user = {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
      };
      res.redirect("/");
    })
    .catch((err) => {
      req.flash("error", err);
      res.redirect("/login");
    });
};

// ---------- Logout ----------
exports.logoutFunctionController = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); // clear session cookie
    res.redirect('/');
  });
};

// ---------- Get All Users (Admin Only) ----------
exports.getAllUsersController = (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    authModel
      .getAllUsers()
      .then((users) => {
        res.render("usersmanag", {
          users,
          user: req.session.user,
          csrfToken: res.locals.csrfToken // <-- Needed if you have forms on the page
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error fetching users");
      });
  } else {
    res.status(403).send("Unauthorized: Admin only");
  }
};
// ---------- Edit User ----------
exports.editUserController = (req, res) => {
  const { id } = req.params;
  const { name, email, password, isAdmin } = req.body;

  const updateData = { name, email, isAdmin };

  // If password provided, hash and update
  if (password && password.trim() !== "") {
    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        updateData.password = hashedPassword;
        return authModel.updateUser(id, updateData);
      })
      .then(() => res.redirect("/usersmanag"))
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating user");
      });
  } else {
    authModel
      .updateUser(id, updateData)
      .then(() => res.redirect("/usersmanag"))
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating user");
      });
  }
};

// ---------- Delete User ----------
exports.deleteUserController = (req, res) => {
  const { id } = req.params;

  authModel
    .deleteUser(id)
    .then(() => res.redirect("/usersmanag"))
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting user");
    });
};
