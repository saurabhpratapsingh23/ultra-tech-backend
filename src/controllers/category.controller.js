const IssueCategory = require("../models/IssueCategory");
const { successResponse, errorResponse, notFoundError, serverError } = require("../utils/response");

// GET /api/v1/categories (all active categories)
exports.getCategories = async (req, res) => {
  try {
    const categories = await IssueCategory.find({ isActive: true });

    return successResponse(res, { categories }, 200, "Categories retrieved successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// GET /api/v1/categories/:categoryId
exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await IssueCategory.findById(categoryId);

    if (!category || !category.isActive) {
      return notFoundError(res, "Category not found");
    }

    return successResponse(res, category, 200, "Category retrieved successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// GET /api/v1/categories/:categoryId/subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await IssueCategory.findById(categoryId);

    if (!category || !category.isActive) {
      return notFoundError(res, "Category not found");
    }

    return successResponse(
      res,
      { subcategories: category.subCategories },
      200,
      "Subcategories retrieved successfully"
    );
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Admin: CREATE CATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { key, displayName, subCategories } = req.body;

    if (!key || !displayName) {
      return errorResponse(res, "VALIDATION_ERROR", "Key and displayName are required", 400);
    }

    const existingCategory = await IssueCategory.findOne({ key });

    if (existingCategory) {
      return errorResponse(res, "CONFLICT", "Category already exists", 409);
    }

    const category = new IssueCategory({
      key,
      displayName,
      subCategories: subCategories || [],
    });

    await category.save();

    return successResponse(res, category, 201, "Category created successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};

// Admin: UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { displayName, subCategories, isActive } = req.body;

    const category = await IssueCategory.findByIdAndUpdate(
      categoryId,
      { displayName, subCategories, isActive },
      { new: true, runValidators: true }
    );

    if (!category) {
      return notFoundError(res, "Category not found");
    }

    return successResponse(res, category, 200, "Category updated successfully");
  } catch (err) {
    return serverError(res, err.message);
  }
};
};