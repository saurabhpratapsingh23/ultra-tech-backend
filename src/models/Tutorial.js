const mongoose = require("mongoose");

const TutorialSchema = new mongoose.Schema(
  {
    title: {
      en: String,
      hi: String,
      mr: String,
      ta: String,
      te: String,
      kn: String,
      required: true,
    },

    categoryKey: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // in minutes
    },

    thumbnailUrl: {
      type: String,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    description: {
      en: String,
      hi: String,
      mr: String,
      ta: String,
      te: String,
      kn: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tutorial", TutorialSchema);
