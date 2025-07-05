const Product = require("../models/Product");

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subcategory", "name")
      .lean(); // make product a plain JS object

    if (!product) {
      req.flash("error_msg", "Product not found");
      return res.redirect("/");
    }

    res.render("product/detail", { product });
  } catch (err) {
    console.error("❌ Error fetching product detail:", err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/");
  }
};
// GET: Product detail by slug
exports.getProductDetailBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!product) {
      req.flash("error_msg", "Product not found");
      return res.redirect("/");
    }

    res.render("product/detail", { product });
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/");
  }
};

