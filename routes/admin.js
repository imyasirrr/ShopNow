const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const isAdmin = require("../middleware/isAdmin");


// Dashboard (protected)
router.get("/dashboard", isAdmin, (req, res) => {
  res.render("admin/dashboard", { user: req.session.admin });
});

// Users page (protected)
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/users", { users });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

// Products page (protected)
router.get("/product", isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/product", { products });
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});

module.exports = router;
