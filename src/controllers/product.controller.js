const productService = require("../services/product.service");
const { successResponse, validationError, notFoundError, serverError, paginatedResponse } = require("../utils/response");
const { isValidPagination } = require("../utils/validators");

// GET /api/v1/products (with filters and pagination)
exports.getProducts = async (req, res) => {
  try {
    const { categoryKey, subCategoryKey, search, page = 1, limit = 20 } = req.query;

    // Validate pagination
    if (!isValidPagination(page, limit)) {
      return validationError(res, "Invalid pagination parameters");
    }

    const filters = {};
    if (categoryKey) filters.categoryKey = categoryKey;
    if (subCategoryKey) filters.subCategoryKey = subCategoryKey;
    if (search) filters.search = search;

    const result = await productService.getProducts(filters, page, limit);

    return paginatedResponse(res, result.items, result.total, result.page, result.limit);
  } catch (err) {
    return serverError(res, err.message);
  }
};

// GET /api/v1/products/:productId
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productService.getProductById(productId);

    return successResponse(res, product, 200, "Product retrieved successfully");
  } catch (err) {
    if (err.message.includes("not found")) {
      return notFoundError(res, err.message);
    }
    return serverError(res, err.message);
  }
};

// Admin: CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const data = req.body;

    const product = await productService.createProduct(data);

    return successResponse(res, product, 201, "Product created successfully");
  } catch (err) {
    if (err.message.includes("required")) {
      return validationError(res, err.message);
    }
    if (err.message.includes("already exists")) {
      return validationError(res, err.message);
    }
    return serverError(res, err.message);
  }
};

// Admin: UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const data = req.body;

    const product = await productService.updateProduct(productId, data);

    return successResponse(res, product, 200, "Product updated successfully");
  } catch (err) {
    if (err.message.includes("not found")) {
      return notFoundError(res, err.message);
    }
    return serverError(res, err.message);
  }
};

// Admin: DELETE PRODUCT (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    await productService.deleteProduct(productId);

    return successResponse(res, { message: "Product deleted successfully" }, 200);
  } catch (err) {
    if (err.message.includes("not found")) {
      return notFoundError(res, err.message);
    }
    return serverError(res, err.message);
  }
};