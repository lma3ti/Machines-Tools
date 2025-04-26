// index.js (app.js)

// ---------- Load Environment Variables ----------
require('dotenv').config(); 
console.log(process.env);

// ---------- Module Imports ----------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");

// ---------- Route Modules ----------
const RouterHome = require("./routers/home.route");
const RouterProduct = require("./routers/product.route");
const RouterAuth = require("./routers/auth.route");
const RouterMyProducts = require("./routers/myproducts.route");
const RouterContact = require("./routers/contact.route");
const RouterAbout = require("./routers/about.route");
const RouterDashboard = require("./routers/dashboard.route");
const RouterCategory = require("./routers/category.route");
const RouterAllProducts = require("./routers/allproducts.route");

// ---------- Initialize App ----------
const app = express();

// ---------- Security Middlewares ----------
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(mongoSanitize());
app.use(hpp());
app.use(compression());
app.use(cookieParser());

// ---------- MongoDB Connection ----------
const dbUrl = process.env.MONGODB_URI;
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ---------- View Engine & Static Files ----------
app.use(express.static(path.join(__dirname, "assets")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// ---------- Session Setup ----------
const store = new MongoDbStore({
  uri: dbUrl,
  collection: "sessions",
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(flash());

// ---------- CSRF Protection ----------
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// ---------- Global Template Variables ----------
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user || null;
  next();
});

// ---------- Request Logger (Optional) ----------
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ---------- Routes ----------
app.use("/", RouterHome);
app.use("/", RouterProduct);
app.use("/", RouterAuth);
app.use("/myproducts", RouterMyProducts);
app.use("/", RouterContact);
app.use("/", RouterAbout);
app.use("/", RouterDashboard);
app.use(RouterCategory);
app.use("/", RouterAllProducts);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).render("404", { url: req.originalUrl });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).send("Form tampered with");
  }
  res.status(500).send("Something went wrong!");
});

// ---------- Start Server ----------
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
