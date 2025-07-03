const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

exports.showRegister = (req, res) => {
  res.render("admin/register");
};

exports.registerAdmin = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists) {
      req.flash("error_msg", "Admin already exists with this email");
      return res.redirect("/admin/register");
    }

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, phone, password: hashed });
    await newAdmin.save();

    req.flash("success_msg", "Registration successful, please login");
    res.redirect("/admin/login");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Registration error");
    res.redirect("/admin/register");
  }
};

exports.showLogin = (req, res) => {
  res.render("admin/login");
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/admin/login");
    }

    // ✅ Set full admin session
    req.session.admin = {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    };

    req.flash("success_msg", "Login successful");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Login failed");
    res.redirect("/admin/login");
  }
};


exports.dashboard = (req, res) => {
  res.render("admin/dashboard", { user: req.session.admin });
};


exports.logoutAdmin = (req, res) => {
  req.session.destroy(() => {
    req.flash("success_msg", "Logged out successfully");
    res.redirect("/admin/login");
  });
};
