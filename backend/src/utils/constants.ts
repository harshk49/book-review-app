/**
 * Application-wide constants
 */
import validateEnv from "../config/env";

// API versioning
export const API = {
  VERSION: "v1",
  PREFIX: validateEnv.API_PREFIX,
  LEGACY_PREFIX: validateEnv.LEGACY_API_PREFIX,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Database related constants
export const DB = {
  SORT_DESC: -1,
  SORT_ASC: 1,
};

// Authentication related constants
export const AUTH = {
  TOKEN_EXPIRY: validateEnv.JWT_EXPIRE,
  COOKIE_EXPIRY_DAYS: 7,
  PASSWORD_MIN_LENGTH: 6,
  SALT_ROUNDS: 12,
};

// Validation constants
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  OLDEST_VALID_YEAR: 1000,
  CURRENT_YEAR: new Date().getFullYear(),
  MAX_DESCRIPTION_LENGTH: 2000,
  MIN_RATING: 1,
  MAX_RATING: 5,
};

// Rate limiting constants
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // limit each IP to 100 requests per windowMs
  MESSAGE: "Too many requests, please try again later.",
};

// Request and response limits
export const REQUEST_LIMITS = {
  JSON_BODY_LIMIT: "50kb",
  URLENCODED_LIMIT: "50kb",
};

// Server constants
export const SERVER = {
  DEFAULT_PORT: validateEnv.PORT,
  SHUTDOWN_TIMEOUT: 10000, // 10 seconds
};

// Cache constants
export const CACHE = {
  DEFAULT_TTL: 60 * 60 * 1000, // 1 hour in milliseconds
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes in milliseconds
};
