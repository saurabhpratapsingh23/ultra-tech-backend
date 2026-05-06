const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const controller = require("../controllers/ai.controller");

// POST /api/v1/ai/diagnostics (with image upload)
router.post(
  "/diagnostics",
  authMiddleware,
  upload.single("image"),
  controller.analyzeDiagnostics
);

// GET /api/v1/ai/diagnostics/:diagnosticId
router.get("/diagnostics/:diagnosticId", authMiddleware, controller.getDiagnostic);

// GET /api/v1/ai/history (user's diagnostic history)
router.get("/history", authMiddleware, controller.getDiagnosticHistory);

module.exports = router;
