const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/users", { users });
  } catch (err) {
    res.status(500).send("Error fetching users");
  }
});

router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("admin/product", { products });
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});

module.exports = router;
