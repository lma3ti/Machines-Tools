const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schemaAuth = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("user", schemaAuth);

// Register user
exports.registerFunctionModel = (name, email, password) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          reject("Email is already used");
        } else {
          return bcrypt.hash(password, 10);
        }
      })
      .then((hashedPassword) => {
        const isAdmin = email === "admin@example.com"; 
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
          isAdmin: isAdmin,
        });
        return user.save();
      })
      .then(() => {
        resolve("User registered!");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Login user
exports.loginFunctionModel = (email, password) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
              const userData = {
                id: user.id.toString(),
                isAdmin: user.isAdmin,
                name: user.name,
              };
              resolve(userData);
            } else {
              reject("Invalid password");
            }
          });
        } else {
          reject("We don't have this user in our database");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Get all users
exports.getAllUsers = () => {
  return User.find(); 
};

// Update user data
exports.updateUser = (userId, data) => {
  return User.updateOne({ _id: userId }, data); 
};

// Delete user
exports.deleteUser = (userId) => {
  return User.deleteOne({ _id: userId });
};
// Count users
exports.countUsers = () => {
  return User.countDocuments({});
};
// Count Admins
exports.countAdmins = () => {
  return User.countDocuments({ isAdmin: true }).exec(); // Count all users with `isAdmin: true`
};