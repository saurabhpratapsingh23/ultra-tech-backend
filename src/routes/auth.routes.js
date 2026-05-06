const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// POST /api/v1/auth/signup
router.post("/signup", authController.signup);

// POST /api/v1/auth/login (email + password)
router.post("/login", authController.loginWithEmail);

// POST /api/v1/auth/send-otp
router.post("/send-otp", authController.sendOTP);

// POST /api/v1/auth/login/otp
router.post("/login/otp", authController.loginWithOTP);

// POST /api/v1/auth/refresh
router.post("/refresh", authController.refreshToken);

// POST /api/v1/auth/logout
router.post("/logout", authController.logout);

module.exports = router;