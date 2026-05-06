const otpStore = new Map();

class OTPService {
  // Generate and store OTP
  generateOTP(mobile) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10 minutes expiry
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpStore.set(mobile, { otp, expiresAt, attempts: 0 });

    console.log(`📱 OTP for ${mobile}: ${otp}`);

    // TODO: Send via SMS using Twilio, AWS SNS, or similar
    return {
      message: "OTP sent successfully",
      expiresIn: 600, // 10 minutes
    };
  }

  // Verify OTP
  verifyOTP(mobile, otp) {
    const storedData = otpStore.get(mobile);

    if (!storedData) {
      throw new Error("OTP not found or expired");
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(mobile);
      throw new Error("OTP has expired");
    }

    // Check attempt limit (max 3 attempts)
    if (storedData.attempts >= 3) {
      otpStore.delete(mobile);
      throw new Error("Maximum OTP attempts exceeded");
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      throw new Error("Invalid OTP");
    }

    // OTP verified, remove it
    otpStore.delete(mobile);

    return {
      message: "OTP verified successfully",
    };
  }

  // Clear expired OTPs (run periodically)
  clearExpiredOTPs() {
    const now = Date.now();
    for (const [mobile, data] of otpStore.entries()) {
      if (now > data.expiresAt) {
        otpStore.delete(mobile);
      }
    }
  }
}

module.exports = new OTPService();