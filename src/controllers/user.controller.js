const authService = require("../services/auth.service");
const { successResponse, validationError, notFoundError, serverError } = require("../utils/response");
const { isValidLanguage } = require("../utils/validators");

// GET /api/v1/users/me (user profile)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware

    const user = await authService.getUserProfile(userId);

    return successResponse(res, user, 200, "Profile retrieved successfully");
  } catch (error) {
    if (error.message.includes("not found")) {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
};

// PATCH /api/v1/users/me (update profile)
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { name, preferredLanguage } = req.body;

    // Validate language if provided
    if (preferredLanguage && !isValidLanguage(preferredLanguage)) {
      return validationError(res, "Invalid language");
    }

    const updates = {};
    if (name) updates.name = name;
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;

    if (Object.keys(updates).length === 0) {
      return validationError(res, "No valid fields to update");
    }

    const user = await authService.updateUserProfile(userId, updates);

    return successResponse(res, user, 200, "Profile updated successfully");
  } catch (error) {
    if (error.message.includes("not found")) {
      return notFoundError(res, error.message);
    }
    return serverError(res, error.message);
  }
};