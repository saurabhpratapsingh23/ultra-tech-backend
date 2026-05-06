const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/category.controller");

// Public routes
// GET /api/v1/categories
router.get("/", controller.getCategories);

// GET /api/v1/categories/:categoryId
router.get("/:categoryId", controller.getCategoryById);

// GET /api/v1/categories/:categoryId/subcategories
router.get("/:categoryId/subcategories", controller.getSubcategories);

// Admin routes (protected - add admin check as needed)
// POST /api/v1/categories
router.post("/", authMiddleware, controller.createCategory);

// PATCH /api/v1/categories/:categoryId
router.patch("/:categoryId", authMiddleware, controller.updateCategory);

module.exports = router;