module.exports = function (req, res, next) {
  if (req.session && req.session.admin) {
    next(); // allow access
  } else {
    req.flash("error_msg", "Please login to access admin panel");
    res.redirect("/admin/login");
  }
};
