const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");
const { isValidEmail, isValidPassword, isValidMobile } = require("../utils/validators");

class AuthService {
  // Signup Service
  async signup(name, email, mobile, password, preferredLanguage = "en") {
    // Validate inputs
    if (!name || !name.trim()) {
      throw new Error("Name is required");
    }

    if (!email || !isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!password || !isValidPassword(password)) {
      throw new Error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
    }

    if (mobile && !isValidMobile(mobile)) {
      throw new Error("Invalid mobile format");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("Email already registered");
      }
      if (existingUser.mobile === mobile) {
        throw new Error("Mobile already registered");
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      mobile: mobile || null,
      passwordHash,
      preferredLanguage,
      isEmailVerified: false,
      isMobileVerified: false,
    });

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id, user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        preferredLanguage: user.preferredLanguage,
      },
      accessToken,
      refreshToken,
    };
  }

  // Email + Password Login
  async loginWithEmail(email, password) {
    if (!email || !isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id, user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        preferredLanguage: user.preferredLanguage,
      },
      accessToken,
      refreshToken,
    };
  }

  // Mobile + OTP Login (OTP generation placeholder)
  async sendOTP(mobile) {
    if (!mobile || !isValidMobile(mobile)) {
      throw new Error("Invalid mobile format");
    }

    const user = await User.findOne({ mobile });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // TODO: Send OTP via SMS service (Twilio, AWS SNS, etc.)
    // For now, we'll store it in memory or Redis with 10 minutes expiry
    // This is a placeholder - implement with your SMS provider
    console.log(`📱 OTP for ${mobile}: ${otp}`);

    return {
      message: "OTP sent successfully",
      otpExpiresIn: 600, // 10 minutes in seconds
    };
  }

  // OTP Verification and Login
  async loginWithOTP(mobile, otp) {
    if (!mobile || !isValidMobile(mobile)) {
      throw new Error("Invalid mobile format");
    }

    if (!otp || otp.length !== 6) {
      throw new Error("Invalid OTP format");
    }

    // TODO: Verify OTP from Redis/memory store
    // For now, we'll accept any 6-digit OTP (implement verification logic)
    const user = await User.findOne({ mobile });

    if (!user) {
      throw new Error("User not found");
    }

    // Mark mobile as verified
    user.isMobileVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id, user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        preferredLanguage: user.preferredLanguage,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh Token
  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Refresh token is required");
    }

    const { verifyRefreshToken } = require("../utils/jwt");
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      throw new Error("Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const newAccessToken = generateAccessToken(user._id, user.email);

    return {
      accessToken: newAccessToken,
    };
  }

  // Get User Profile
  async getUserProfile(userId) {
    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Update User Profile
  async updateUserProfile(userId, updates) {
    const { name, preferredLanguage } = updates;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (name) {
      user.name = name.trim();
    }

    if (preferredLanguage) {
      const { isValidLanguage } = require("../utils/validators");
      if (!isValidLanguage(preferredLanguage)) {
        throw new Error("Invalid language");
      }
      user.preferredLanguage = preferredLanguage;
    }

    await user.save();

    return user;
  }
}

module.exports = new AuthService();
