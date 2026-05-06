const mongoose = require("mongoose");

const AIRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  inputType: {
    type: String,
    enum: ["IMAGE", "TEXT", "IMAGE+TEXT"]
  },

  imageUrl: String,
  userProblemText: String,

  detectedCategory: String,
  detectedSubCategory: String,
  detectedIssueType: String,

  confidenceScore: Number,
  aiModelVersion: String,

  matchFound: Boolean,

  status: {
    type: String,
    enum: ["PROCESSING", "COMPLETED", "FAILED"],
    default: "PROCESSING"
  }

}, { timestamps: true });

module.exports = mongoose.model("AIRequest", AIRequestSchema);