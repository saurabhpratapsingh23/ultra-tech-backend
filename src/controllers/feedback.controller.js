const Feedback = require("../models/Feedback");
const { successResponse, validationError, notFoundError, serverError, paginatedResponse } = require("../utils/response");

// POST /api/v1/feedback (submit feedback)
exports.submitFeedback = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { subject, message } = req.body;

    if (!message || !message.trim()) {
      return validationError(res, "Message is required");
    }

    const feedback = new Feedback({
      userId,
      subject: subject || "General Feedback",
      message: message.trim(),
    });

    await feedback.save();

    return successResponse(res, feedback, 201, "Feedback submitted successfully");
  } catch (error) {
    return serverError(res, error.message);
  }
};

// GET /api/v1/feedback/me (user's feedbacks)
exports.getUserFeedback = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;
    const total = await Feedback.countDocuments({ userId });
    const feedbacks = await Feedback.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return paginatedResponse(res, feedbacks, total, page, limit);
  } catch (error) {
    return serverError(res, error.message);
  }
};

// GET /api/v1/feedback/:feedbackId (get specific feedback)
exports.getFeedbackById = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return notFoundError(res, "Feedback not found");
    }

    return successResponse(res, feedback, 200, "Feedback retrieved");
  } catch (error) {
    return serverError(res, error.message);
  }
};

// Admin: GET /api/v1/feedback (all feedbacks)
exports.getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return paginatedResponse(res, feedbacks, total, page, limit);
  } catch (error) {
    return serverError(res, error.message);
  }
};

// Admin: PATCH /api/v1/feedback/:feedbackId (update feedback status)
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    if (!status || !["SUBMITTED", "REVIEWED", "RESOLVED"].includes(status)) {
      return validationError(res, "Invalid status");
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return notFoundError(res, "Feedback not found");
    }

    return successResponse(res, feedback, 200, "Feedback status updated");
  } catch (error) {
    return serverError(res, error.message);
  }
};
