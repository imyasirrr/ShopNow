const express = require("express");
const router = express.Router();
const { sendMail } = require("../services/mailer");

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.render("contact", { error: "All fields are required" });
  }

  try {
    await sendMail({ name, email, message });
    res.render("contact", { success: "Message sent successfully!" });
  } catch (err) {
    console.error(err);
    res.render("contact", { error: "Failed to send message." });
  }
});

module.exports = router;
