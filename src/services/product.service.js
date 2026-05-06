const Product = require("../models/Product");
const { PAGINATION } = require("../config/constants");

class ProductService {
  // Get all products with filters and pagination
  async getProducts(filters = {}, page = 1, limit = PAGINATION.DEFAULT_LIMIT) {
    const query = { isActive: true };

    // Filter by category
    if (filters.categoryKey) {
      query.categoryKey = filters.categoryKey;
    }

    // Filter by subcategory
    if (filters.subCategoryKey) {
      query.subCategoryKey = filters.subCategoryKey;
    }

    // Search by name or description
    if (filters.search) {
      query.$or = [
        { "displayName.en": { $regex: filters.search, $options: "i" } },
        { "displayName.hi": { $regex: filters.search, $options: "i" } },
        { "description.en": { $regex: filters.search, $options: "i" } },
        { "description.hi": { $regex: filters.search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      items: products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    };
  }

  // Get product by ID
  async getProductById(productId) {
    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      throw new Error("Product not found");
    }

    return product;
  }

  // Create product (admin)
  async createProduct(data) {
    const { nameKey, displayName, categoryKey, subCategoryKey, description, applicationSteps, marketPrice, buyLink, images } = data;

    if (!nameKey || !displayName) {
      throw new Error("Name key and display name are required");
    }

    const existingProduct = await Product.findOne({ nameKey });

    if (existingProduct) {
      throw new Error("Product with this name key already exists");
    }

    const product = new Product({
      nameKey,
      displayName,
      categoryKey,
      subCategoryKey,
      description,
      applicationSteps,
      marketPrice,
      buyLink,
      images: images || [],
    });

    await product.save();

    return product;
  }

  // Update product (admin)
  async updateProduct(productId, data) {
    const product = await Product.findByIdAndUpdate(productId, data, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  // Delete product (soft delete)
  async deleteProduct(productId) {
    const product = await Product.findByIdAndUpdate(
      productId,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }
}

module.exports = new ProductService();
