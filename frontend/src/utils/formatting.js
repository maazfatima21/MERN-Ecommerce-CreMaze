// Utility functions for consistent formatting across the application

/**
 * Format currency in Indian Rupees
 * @param {number} value - The amount to format
 * @returns {string} Formatted currency string (e.g., "₹1,234.50")
 */
export const formatCurrency = (value) => {
  if (!value && value !== 0) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(value));
};

/**
 * Format date consistently
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date (e.g., "4 February 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format date with time
 * @param {string|Date} dateString - The date to format
 * @returns {string} Formatted date with time
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Get user-friendly error message from API error
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyError = (error) => {
  // Check for custom error message from backend
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Handle specific HTTP status codes
  if (error?.response?.status === 401) {
    return "Session expired. Please login again.";
  }
  if (error?.response?.status === 403) {
    return "You don't have permission to perform this action.";
  }
  if (error?.response?.status === 404) {
    return "The requested resource was not found.";
  }
  if (error?.response?.status === 400) {
    return "Invalid request. Please check your input.";
  }
  if (error?.response?.status >= 500) {
    return "Server error. Please try again later.";
  }

  // Check for network error
  if (error?.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  // Default fallback
  return "Something went wrong. Please try again.";
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits for India)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};
