const mongoose = require("mongoose");

const OAuthSchema = new mongoose.Schema(
  {
    provider: {
      type: String, // "google", "microsoft"
    },
    providerId: {
      type: String,
    },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    oauthProviders: [OAuthSchema],

    preferredLanguage: {
      type: String,
      default: "en", // en, hi, mr, ta etc.
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Optional index (good practice)
UserSchema.index({ email: 1 });
UserSchema.index({ mobile: 1 });

module.exports = mongoose.model("User", UserSchema);