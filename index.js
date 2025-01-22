const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

// Routes
const RouterHome = require("./routers/home.route");
const RouterProduct = require("./routers/product.route");
const RouterAuth = require("./routers/auth.route");
const RouterMyProducts = require("./routers/myproducts.route");
const RouterContact = require("./routers/contact.route");
const RouterAbout = require("./routers/about.route");
const RouterDashboard = require("./routers/dashboard.route");
const RouterCategory = require("./routers/category.route");

// MongoDB Connection Setup
const dbUrl =
  "mongodb+srv://wepadisign:7HRcyHKldhLC0TN9@website.6eqfj.mongodb.net/?retryWrites=true&w=majority&appName=website";

mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();

// Setup static files and views
app.use(express.static(path.join(__dirname, "assets")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// Setup MongoDB Store for Sessions
const store = new MongoDbStore({
  uri: dbUrl,
  collection: "sessions",
});

app.use(
  session({
    secret: "This is a secret",
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

// Middleware to pass session data to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; 
  next();
});


app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});
// Define routes
app.use("/", RouterHome);
app.use("/", RouterProduct);
app.use("/", RouterAuth);
app.use("/myproducts", RouterMyProducts);
app.use("/", RouterContact);
app.use("/", RouterAbout);
app.use("/", RouterDashboard);
app.use(RouterCategory);
// Start the server
app.listen(3000, () => console.log("khaddam"));