const express = require("express");
const router = express.Router();
const isAdmin = require("../../middleware/isAdmin");

const {
  listCategories,
  showCreateForm,
  createCategory,
  showEditForm,
  updateCategory,
  deleteCategory,
} = require("../../controllers/admin/categoryController");

// Routes
router.get("/", isAdmin, listCategories);
router.get("/create", isAdmin, showCreateForm);
router.post("/create", isAdmin, createCategory);
router.get("/edit/:id", isAdmin, showEditForm);
router.post("/edit/:id", isAdmin, updateCategory);
router.post("/delete/:id", isAdmin, deleteCategory);

module.exports = router;
