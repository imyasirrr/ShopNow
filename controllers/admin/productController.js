const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Subcategory = require("../../models/Subcategory");
const slugify = require("slugify");


// List all products
exports.listProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .populate("subcategory", "name")
    .sort({ createdAt: -1 });

  res.render("admin/product/index", {
    products,
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
};

// Show create form
exports.showCreateForm = async (req, res) => {
  const categories = await Category.find();
  const subcategories = await Subcategory.find();

  res.render("admin/product/create", {
    categories,
    subcategories,
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
};

// Create product
exports.createProduct = async (req, res) => {
  const { title, description, price, category, subcategory } = req.body;
  const image = req.file ? req.file.filename : null;
  const slug = slugify(title, { lower: true, strict: true });

  try {
    await Product.create({
      title,
      slug,
      description,
      price,
      image,
      category,
      subcategory,
    });
    req.flash("success_msg", "Product created successfully.");
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to create product.");
    res.redirect("/admin/products/create");
  }
};


// Show edit form
exports.showEditForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const categories = await Category.find();
  const subcategories = await Subcategory.find();

  res.render("admin/product/edit", {
    product,
    categories,
    subcategories,
    success_msg: req.flash("success_msg"),
    error_msg: req.flash("error_msg"),
  });
};

// Update product
exports.updateProduct = async (req, res) => {
  const { title, description, price, category, subcategory } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error_msg", "Product not found.");
      return res.redirect("/admin/products");
    }

    product.title = title;
    product.slug = slugify(title, { lower: true, strict: true });
    product.description = description;
    product.price = price;
    product.category = category;
    product.subcategory = subcategory;

    if (req.file) {
      product.image = req.file.filename;
    }

    await product.save();
    req.flash("success_msg", "Product updated successfully.");
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to update product.");
    res.redirect("/admin/products");
  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Product deleted.");
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Failed to delete product.");
    res.redirect("/admin/products");
  }
};
