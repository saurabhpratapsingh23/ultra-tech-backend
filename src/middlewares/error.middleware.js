const { serverError } = require("../utils/response");

// Error handling middleware (should be last middleware)
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Multer file upload errors
  if (err.name === "MulterError") {
    if (err.code === "FILE_TOO_LARGE") {
      return res.status(413).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "File size exceeds 5MB limit",
        },
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Only one file allowed",
        },
      });
    }
  }

  // Custom file type error
  if (err.message === "Only image files are allowed (jpeg, png, gif, webp)") {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
      },
    });
  }

  // Default server error
  return serverError(res, err.message);
};

module.exports = errorHandler;
