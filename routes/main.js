const express = require("express");
const router = express.Router();
const { sendMail } = require("../services/mailer");
const Product = require("../models/Product");

// GET routes
router.get("/", async (req, res) => {
  try {
    const products = await Product.find(); 
    res.render("index", { products });
  } catch (err) {
    console.error("Error loading homepage products:", err);
    res.render("index", { products: [] });
  }
});
router.get("/about", (req, res) => res.render("about"));
router.get("/blog", (req, res) => res.render("blog"));
router.get("/cart", (req, res) => res.render("cart"));
router.get("/checkout", (req, res) => res.render("checkout"));
router.get("/services", (req, res) => res.render("services"));
router.get("/shop", async (req, res) => {
  try {
    const products = await Product.find(); // fetch all products from DB
    res.render("shop", { products }); // pass to EJS
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).send("Server error while fetching products");
  }
});

router.get("/thankyou", (req, res) => res.render("thankyou"));

// GET Contact page
router.get("/contact", (req, res) => {
  res.render("contact", { success: null, error: null });
});

// POST: Contact Form Handler
router.post("/contact", async (req, res) => {
  const { fname, lname, email, message } = req.body;
  const name = `${fname} ${lname}`;

  // Debug form data
  console.log("Form Data:", { name, email, message });

  // Basic validation
  if (!fname || !lname || !email || !message) {
    return res.render("contact", {
      success: null,
      error: "⚠️ All fields are required.",
    });
  }

  try {
    await sendMail({ name, email, message });

    res.render("contact", {
      success: "✅ Message sent successfully!",
      error: null,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.render("contact", {
      success: null,
      error: "❌ Something went wrong. Please try again later.",
    });
  }
});

module.exports = router;
