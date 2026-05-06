const { verifyAccessToken } = require("../utils/jwt");
const { unauthorizedError } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return unauthorizedError(res, "Access token is required");
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix

    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return unauthorizedError(res, "Invalid or expired token");
    }

    // Attach user info to request
    req.userId = decoded.userId;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    return unauthorizedError(res, "Token verification failed");
  }
};

module.exports = authMiddleware;