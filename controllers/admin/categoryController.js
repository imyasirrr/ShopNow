const Category = require("../../models/Category");
const slugify = require("slugify");

// List all categories
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.render("admin/category/index", { categories });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to load categories.");
    res.redirect("/admin/dashboard");
  }
};

// Show create form
exports.showCreateForm = (req, res) => {
  res.render("admin/category/create");
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    req.flash("error_msg", "Category name is required.");
    return res.redirect("/admin/categories/create");
  }

  try {
    const slug = slugify(name, { lower: true, strict: true });
    await Category.create({ name: name.trim(), slug });
    req.flash("success_msg", "Category created successfully.");
    res.redirect("/admin/categories");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to create category.");
    res.redirect("/admin/categories");
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error_msg", "Category not found.");
      return res.redirect("/admin/categories");
    }
    res.render("admin/category/edit", { category });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Error loading edit form.");
    res.redirect("/admin/categories");
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash("error_msg", "Category not found.");
      return res.redirect("/admin/categories");
    }

    category.name = name.trim();
    category.slug = slugify(name, { lower: true, strict: true });
    await category.save();

    req.flash("success_msg", "Category updated successfully.");
    res.redirect("/admin/categories");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to update category.");
    res.redirect("/admin/categories");
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Category deleted.");
    res.redirect("/admin/categories");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to delete category.");
    res.redirect("/admin/categories");
  }
};
