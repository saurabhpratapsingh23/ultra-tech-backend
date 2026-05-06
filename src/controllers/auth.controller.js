const authService = require("../services/auth.service");
const otpService = require("../services/otp.service");
const { successResponse, errorResponse, validationError, conflictError, unauthorizedError, serverError } = require("../utils/response");
const { isValidEmail, isValidMobile, isValidLanguage } = require("../utils/validators");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile, password, preferredLanguage = "en" } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return validationError(res, "Name is required");
    }

    if (!email || !isValidEmail(email)) {
      return validationError(res, "Invalid email format");
    }

    if (!password) {
      return validationError(res, "Password is required");
    }

    if (mobile && !isValidMobile(mobile)) {
      return validationError(res, "Invalid mobile format");
    }

    if (!isValidLanguage(preferredLanguage)) {
      return validationError(res, "Invalid language");
    }

    const result = await authService.signup(name, email, mobile, password, preferredLanguage);
    return successResponse(res, result, 201, "User registered successfully");

  } catch (err) {
    if (err.message.includes("already") || err.message.includes("registered")) {
      return conflictError(res, err.message);
    }
    return serverError(res, err.message);
  }
};

// LOGIN WITH EMAIL
exports.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !isValidEmail(email)) {
      return validationError(res, "Invalid email format");
    }

    if (!password) {
      return validationError(res, "Password is required");
    }

    const result = await authService.loginWithEmail(email, password);
    return successResponse(res, result, 200, "Login successful");

  } catch (err) {
    if (err.message.includes("not found")) {
      return unauthorizedError(res, "Invalid credentials");
    }
    if (err.message.includes("Invalid password")) {
      return unauthorizedError(res, "Invalid credentials");
    }
    return serverError(res, err.message);
  }
};

// SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
      return validationError(res, "Invalid mobile format");
    }

    const result = otpService.generateOTP(mobile);
    return successResponse(res, result, 200, "OTP sent successfully");

  } catch (err) {
    return serverError(res, err.message);
  }
};

// LOGIN WITH OTP
exports.loginWithOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !isValidMobile(mobile)) {
      return validationError(res, "Invalid mobile format");
    }

    if (!otp || otp.length !== 6) {
      return validationError(res, "Invalid OTP format");
    }

    // Verify OTP first
    otpService.verifyOTP(mobile, otp);

    // Login with OTP
    const result = await authService.loginWithOTP(mobile, otp);
    return successResponse(res, result, 200, "Login successful");

  } catch (err) {
    if (err.message.includes("Invalid OTP") || err.message.includes("expired")) {
      return unauthorizedError(res, err.message);
    }
    if (err.message.includes("not found")) {
      return unauthorizedError(res, "User not found");
    }
    return serverError(res, err.message);
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return validationError(res, "Refresh token is required");
    }

    const result = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, result, 200, "Token refreshed");

  } catch (err) {
    if (err.message.includes("Invalid") || err.message.includes("expired")) {
      return unauthorizedError(res, err.message);
    }
    return serverError(res, err.message);
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    // Token is invalidated on client side
    // No server-side session to destroy
    return successResponse(res, { message: "Logged out successfully" }, 200, "Logout successful");
  } catch (err) {
    return serverError(res, err.message);
  }
};