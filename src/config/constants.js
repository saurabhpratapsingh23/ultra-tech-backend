// Supported Languages
const SUPPORTED_LANGUAGES = {
  EN: "en",
  HI: "hi",
  MR: "mr",
  TA: "ta",
  TE: "te",
  KN: "kn",
};

// User Roles
const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
};

// AI Request Status
const AI_REQUEST_STATUS = {
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

// AI Request Input Types
const AI_REQUEST_INPUT_TYPE = {
  IMAGE: "IMAGE",
  TEXT: "TEXT",
  IMAGE_TEXT: "IMAGE+TEXT",
};

// Chatbot Conversation Status
const CHATBOT_STATUS = {
  RESOLVED: "RESOLVED",
  ESCALATED: "ESCALATED",
};

// Support Ticket Status
const SUPPORT_TICKET_STATUS = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
};

// Feedback Status
const FEEDBACK_STATUS = {
  SUBMITTED: "SUBMITTED",
  REVIEWED: "REVIEWED",
  RESOLVED: "RESOLVED",
};

// Error Codes
const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  AI_PROVIDER_ERROR: "AI_PROVIDER_ERROR",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
};

// File Upload Limits
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  UPLOAD_DIR: "uploads",
  ALLOWED_MIME_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

// AI Service
const AI_SERVICE_CONFIG = {
  BASE_URL: process.env.AI_SERVICE_URL || "http://localhost:8000",
  ANALYZE_ENDPOINT: "/analyze",
  TIMEOUT: 30000, // 30 seconds
};

// Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

module.exports = {
  SUPPORTED_LANGUAGES,
  USER_ROLES,
  AI_REQUEST_STATUS,
  AI_REQUEST_INPUT_TYPE,
  CHATBOT_STATUS,
  SUPPORT_TICKET_STATUS,
  FEEDBACK_STATUS,
  ERROR_CODES,
  UPLOAD_CONFIG,
  AI_SERVICE_CONFIG,
  PAGINATION,
};
