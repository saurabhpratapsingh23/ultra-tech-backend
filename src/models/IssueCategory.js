const mongoose = require("mongoose");

const SubCategorySchema = new mongoose.Schema({
  key: String,
  displayName: {
    en: String,
    hi: String,
    mr: String,
    ta: String,
    te: String,
    kn: String
  }
}, { _id: false });

const IssueCategorySchema = new mongoose.Schema({
  key: {
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

  subCategories: [SubCategorySchema],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("IssueCategory", IssueCategorySchema);