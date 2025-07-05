const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/product/:slug", productController.getProductDetailBySlug);


module.exports = router;
