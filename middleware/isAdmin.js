module.exports = (req, res, next) => {
  if (req.session.adminId) {
    next();
  } else {
    req.flash("error_msg", "Please login as admin to continue");
    res.redirect("/admin/login");
  }
};
