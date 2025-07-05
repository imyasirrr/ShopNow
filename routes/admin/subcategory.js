const express = require("express");
const router = express.Router();
const isAdmin = require("../../middleware/isAdmin");

const {
  listSubcategories,
  showCreateForm,
  createSubcategory,
  showEditForm,
  updateSubcategory,
  deleteSubcategory,
  getSubcategoriesByCategory,
} = require("../../controllers/admin/subcategoryController");

// Routes
router.get("/", isAdmin, listSubcategories);
router.get("/create", isAdmin, showCreateForm);
router.post("/create", isAdmin, createSubcategory);
router.get("/edit/:id", isAdmin, showEditForm);
router.post("/edit/:id", isAdmin, updateSubcategory);
router.post("/delete/:id", isAdmin, deleteSubcategory);

// AJAX route
router.get("/by-category/:categoryId", isAdmin, getSubcategoriesByCategory);

module.exports = router;
