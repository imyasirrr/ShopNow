const express = require("express");
const router = express.Router();
const { sendMail } = require("../services/mailer");

// GET routes
router.get("/", (req, res) => res.render("index"));
router.get("/about", (req, res) => res.render("about"));
router.get("/blog", (req, res) => res.render("blog"));
router.get("/cart", (req, res) => res.render("cart"));
router.get("/checkout", (req, res) => res.render("checkout"));
router.get("/services", (req, res) => res.render("services"));
router.get("/shop", (req, res) => res.render("shop"));
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
