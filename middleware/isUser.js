module.exports = function (req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash("error_msg", "Please login to continue");
  res.redirect("/login");
};
