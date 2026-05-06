const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/tutorial.controller");

// Public routes
// GET /api/v1/tutorials
router.get("/", controller.getTutorials);

// GET /api/v1/tutorials/:tutorialId
router.get("/:tutorialId", controller.getTutorialById);

// Admin routes
// POST /api/v1/tutorials
router.post("/", authMiddleware, controller.createTutorial);

// PATCH /api/v1/tutorials/:tutorialId
router.patch("/:tutorialId", authMiddleware, controller.updateTutorial);

// DELETE /api/v1/tutorials/:tutorialId
router.delete("/:tutorialId", authMiddleware, controller.deleteTutorial);

module.exports = router;
