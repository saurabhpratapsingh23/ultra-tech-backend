const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/feedback.controller");

// POST /api/v1/feedback (submit feedback)
router.post("/", authMiddleware, controller.submitFeedback);

// GET /api/v1/feedback/me (user's feedbacks)
router.get("/me", authMiddleware, controller.getUserFeedback);

// GET /api/v1/feedback/:feedbackId
router.get("/:feedbackId", authMiddleware, controller.getFeedbackById);

// Admin routes
// GET /api/v1/feedback (all feedbacks - admin only)
router.get("/", authMiddleware, controller.getAllFeedback);

// PATCH /api/v1/feedback/:feedbackId (update status - admin only)
router.patch("/:feedbackId", authMiddleware, controller.updateFeedbackStatus);

module.exports = router;
