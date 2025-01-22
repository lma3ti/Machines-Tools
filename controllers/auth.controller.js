const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
exports.getRegisterPage = (req, res, next) => {
  res.render("register", {
    user: req.session.user, 
    message: req.flash("error")[0],
  });
};

exports.postRegisterData = (req, res, next) => {
  authModel
    .registerFunctionModel(req.body.name, req.body.email, req.body.password)
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      req.flash("error", err);
      res.redirect("/register");
    });
};

exports.getLoginPage = (req, res, next) => {
  res.render("login", {
    user: req.session.user,
    message: req.flash("error")[0],
  });
};

exports.postLoginData = (req, res, next) => {
  authModel
    .loginFunctionModel(req.body.email, req.body.password)
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

exports.logoutFunctionController = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};


// Get all users
exports.getAllUsersController = (req, res) => {
  if (req.session.user && req.session.user.isAdmin) {
    authModel
      .getAllUsers()
      .then((users) => {
        res.render("usersmanag", {
          users: users,
          user: req.session.user,
        });
      })
      .catch((err) => {
        res.status(500).send("Error fetching users");
      });
  } else {
    res.status(403).send("Unauthorized: Admin only");
  }
};

// Edit user
exports.editUserController = (req, res) => {
  const { id } = req.params;
  const { name, email, password, isAdmin } = req.body;

  const updateData = { name, email, isAdmin };

  // If a new password is provided, hash it
  if (password && password.trim() !== "") {
    bcrypt.hash(password, 10)
      .then((hashedPassword) => {
        updateData.password = hashedPassword;
        return authModel.updateUser(id, updateData);
      })
      .then(() => {
        res.redirect("/usersmanag");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating user");
      });
  } else {
    authModel
      .updateUser(id, updateData)
      .then(() => {
        res.redirect("/usersmanag");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error updating user");
      });
  }
};
// update user
exports.updateUser = (id, updatedData) => {
  return User.findByIdAndUpdate(id, updatedData, { new: true });
};

// Delete user
exports.deleteUserController = (req, res) => {
  const { id } = req.params;

  authModel
    .deleteUser(id)
    .then(() => {
      res.redirect("/usersmanag");
    })
    .catch((err) => {
      res.status(500).send("Error deleting user");
    });
};

