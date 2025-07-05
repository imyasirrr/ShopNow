// routes/admin/product.js
const express = require("express");
const router = express.Router();
const isAdmin = require("../../middleware/isAdmin");
const multer = require("multer");
const path = require("path");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Controller
const productController = require("../../controllers/admin/productController");

// Routes
router.get("/", isAdmin, productController.listProducts);
router.get("/create", isAdmin, productController.showCreateForm);
router.post("/create", isAdmin, upload.single("image"), productController.createProduct);
router.get("/edit/:id", isAdmin, productController.showEditForm);
router.post("/edit/:id", isAdmin, upload.single("image"), productController.updateProduct);
router.post("/delete/:id", isAdmin, productController.deleteProduct);

module.exports = router;
