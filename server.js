const express = require("express");
const path = require("path");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

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

//middleware
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "your-secret",
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// Route file include
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);
app.use(authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
    