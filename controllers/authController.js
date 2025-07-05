const User = require("../models/User");
const bcrypt = require("bcrypt");

// GET: Login Page
exports.getLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

// POST: Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("auth/login", { error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("auth/login", { error: "Invalid password" });
    }

    // Save user session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // ✅ Required for admin check
    };

    // ✅ Redirect based on role
    if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.render("auth/login", { error: "Something went wrong" });
  }
};

// GET: Register Page
exports.getRegister = (req, res) => {
  res.render("auth/register", { error: null });
};

// POST: Register
exports.postRegister = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render("auth/register", { error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user", // ✅ Default role
    });

    await newUser.save();
    // ✅ Store session immediately after registration
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.render("auth/register", { error: "Something went wrong" });
  }
};

// GET: Logout (User)
exports.logout = (req, res) => {
  delete req.session.user; // Remove only user session
  req.flash("success_msg", "You have been logged out successfully.");
  res.redirect("/login");
};
