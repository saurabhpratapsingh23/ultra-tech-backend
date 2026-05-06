const { ERROR_CODES } = require("../config/constants");

// Standardized Success Response
const successResponse = (res, data, statusCode = 200, message = "Success") => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Standardized Error Response
const errorResponse = (res, errorCode, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
};

// Validation Error
const validationError = (res, message) => {
  return errorResponse(res, ERROR_CODES.VALIDATION_ERROR, message, 400);
};

// Not Found Error
const notFoundError = (res, message = "Resource not found") => {
  return errorResponse(res, ERROR_CODES.NOT_FOUND, message, 404);
};

// Conflict Error
const conflictError = (res, message) => {
  return errorResponse(res, ERROR_CODES.CONFLICT, message, 409);
};

// Unauthorized Error
const unauthorizedError = (res, message = "Unauthorized") => {
  return errorResponse(res, ERROR_CODES.UNAUTHORIZED, message, 401);
};

// Forbidden Error
const forbiddenError = (res, message = "Forbidden") => {
  return errorResponse(res, ERROR_CODES.FORBIDDEN, message, 403);
};

// AI Provider Error
const aiProviderError = (res, message = "AI service error") => {
  return errorResponse(res, ERROR_CODES.AI_PROVIDER_ERROR, message, 503);
};

// Server Error
const serverError = (res, message = "Internal server error") => {
  return errorResponse(res, ERROR_CODES.INTERNAL_SERVER_ERROR, message, 500);
};

// Pagination Response
const paginatedResponse = (res, items, total, page, limit, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    items,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationError,
  notFoundError,
  conflictError,
  unauthorizedError,
  forbiddenError,
  aiProviderError,
  serverError,
  paginatedResponse,
};
