const express = require("express");
const router = express.Router();
const {
  showLogin,
  showRegister,
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  dashboard
} = require("../controllers/adminAuthController");

const isAdmin = require("../middleware/isAdmin");

router.get("/admin/register", showRegister);
router.post("/admin/register", registerAdmin);

router.get("/admin/login", showLogin);
router.post("/admin/login", loginAdmin);

// router.get("/admin/dashboard", isAdmin, dashboard);
// Dashboard route
router.get("/admin/dashboard", (req, res) => {
  const user = req.session.user;
  res.render("admin/dashboard", { user });
});

router.get("/admin/logout", logoutAdmin);

module.exports = router;
