const { SUPPORTED_LANGUAGES } = require("../config/constants");

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Mobile validation (Indian mobile format + international)
const isValidMobile = (mobile) => {
  const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return mobileRegex.test(mobile.replace(/\D/g, ""));
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Language validation
const isValidLanguage = (language) => {
  return Object.values(SUPPORTED_LANGUAGES).includes(language);
};

// MongoDB ObjectId validation
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Pagination validation
const isValidPagination = (page, limit) => {
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  return pageNum > 0 && limitNum > 0 && limitNum <= 100;
};

module.exports = {
  isValidEmail,
  isValidMobile,
  isValidPassword,
  isValidLanguage,
  isValidObjectId,
  isValidUrl,
  isValidPagination,
};
