const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/user.controller");

// GET /api/v1/users/me (get profile)
router.get("/me", authMiddleware, controller.getProfile);

// PATCH /api/v1/users/me (update profile)
router.patch("/me", authMiddleware, controller.updateProfile);

module.exports = router;
