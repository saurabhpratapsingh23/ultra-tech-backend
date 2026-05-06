const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

  nameKey: {
    type: String,
    unique: true
  },

  displayName: {
    en: String,
    hi: String,
    mr: String,
    ta: String,
    te: String,
    kn: String
  },

  categoryKey: String,
  subCategoryKey: String,

  description: {
    en: String,
    hi: String,
    mr: String,
    ta: String,
    te: String,
    kn: String
  },

  applicationSteps: {
    en: [String],
    hi: [String],
    mr: [String],
    ta: [String],
    te: [String],
    kn: [String]
  },

  marketPrice: Number,
  buyLink: String,

  images: [String],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);