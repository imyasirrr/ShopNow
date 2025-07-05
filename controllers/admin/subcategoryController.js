const Subcategory = require("../../models/Subcategory");
const Category = require("../../models/Category");
const slugify = require("slugify");

// List all subcategories
exports.listSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.render("admin/subcategory/index", { subcategories });
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to load subcategories.");
    res.redirect("/admin/dashboard");
  }
};

// Show create form
exports.showCreateForm = async (req, res) => {
  const categories = await Category.find();
  res.render("admin/subcategory/create", { categories });
};

// Create a subcategory
exports.createSubcategory = async (req, res) => {
  const { name, category } = req.body;
  const slug = slugify(name, { lower: true });

  try {
    await Subcategory.create({ name, slug, category });
    req.flash("success_msg", "Subcategory created successfully.");
    res.redirect("/admin/subcategories");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to create subcategory.");
    res.redirect("/admin/subcategories");
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  const subcategory = await Subcategory.findById(req.params.id);
  const categories = await Category.find();
  res.render("admin/subcategory/edit", { subcategory, categories });
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  const { name, category } = req.body;
  const slug = slugify(name, { lower: true });

  try {
    const subcategory = await Subcategory.findById(req.params.id);
    subcategory.name = name;
    subcategory.slug = slug;
    subcategory.category = category;

    await subcategory.save();
    req.flash("success_msg", "Subcategory updated successfully.");
    res.redirect("/admin/subcategories");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to update subcategory.");
    res.redirect("/admin/subcategories");
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    await Subcategory.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Subcategory deleted.");
    res.redirect("/admin/subcategories");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Failed to delete subcategory.");
    res.redirect("/admin/subcategories");
  }
};

// Get subcategories by category (AJAX)
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      category: req.params.categoryId,
    }).select("name _id");
    res.json(subcategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};
