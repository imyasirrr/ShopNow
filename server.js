const express = require("express");
const path = require("path");
const session = require("express-session");
const mongoose = require("mongoose");
require("dotenv").config();
const flash = require("connect-flash");

const app = express();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "ShopNow",
    family: 4,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "your-secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Make user session data available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const adminAuthRoutes = require("./routes/adminAuthRoutes"); 
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);


app.use("/", mainRoutes);
app.use(authRoutes);
app.use(adminAuthRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
