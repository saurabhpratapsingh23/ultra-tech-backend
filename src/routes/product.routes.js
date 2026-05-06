const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/product.controller");

// Public routes
// GET /api/v1/products (with filters and pagination)
router.get("/", controller.getProducts);

// GET /api/v1/products/:productId
router.get("/:productId", controller.getProductById);

// Admin routes
// POST /api/v1/products
router.post("/", authMiddleware, controller.createProduct);

// PATCH /api/v1/products/:productId
router.patch("/:productId", authMiddleware, controller.updateProduct);

// DELETE /api/v1/products/:productId
router.delete("/:productId", authMiddleware, controller.deleteProduct);

module.exports = router;