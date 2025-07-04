const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");
const path = require("path");

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });


// GET: List all products
router.get("/", isAdmin, async (req, res) => {
  const products = await Product.find();
  res.render("admin/product/index", { products });
});

// GET: Show create form
router.get("/create", isAdmin, (req, res) => {
  res.render("admin/product/create");
});

// POST: Create new product
router.post("/create", isAdmin, upload.single("image"), async (req, res) => {
  const { title, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    await Product.create({ title, description, price, image });
    req.flash("success_msg", "Product created successfully.");
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Error creating product.");
    res.redirect("/admin/products");
  }
});

// GET: Show edit form
router.get("/edit/:id", isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/product/edit", { product });
});

// POST: Update product
router.post("/edit/:id", isAdmin, upload.single("image"), async (req, res) => {
  const { title, description, price } = req.body;
  const product = await Product.findById(req.params.id);

  product.title = title;
  product.description = description;
  product.price = price;

  if (req.file) {
    product.image = req.file.filename;
  }

  await product.save();
  req.flash("success_msg", "Product updated successfully.");
  res.redirect("/admin/products");
});

// POST: Delete product
router.post("/delete/:id", isAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Product deleted.");
  res.redirect("/admin/products");
});

module.exports = router;
    