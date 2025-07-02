const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res) => {
  res.render("auth/login", { error: null });
};

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

 
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };


    // ✅ Redirect after login
    res.redirect("/");

  } catch (error) {
    console.error(error);
    res.render("auth/login", { error: "Something went wrong" });
  }
};


// Register Page
exports.getRegister = (req, res) => {
  res.render("auth/register", { error: null });
};

// Register Handler
exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth/register", { error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    req.session.user = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email
    };

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("auth/register", { error: "Registration failed" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
