import { body, param, query } from "express-validator";
import { VALIDATION } from "./constants";

// Authentication validation schemas
export const registerValidator = [
  body("username").notEmpty().withMessage("Username is required").trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: VALIDATION.PASSWORD_MIN_LENGTH })
    .withMessage(
      `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`
    ),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Book validation schemas
export const createBookValidator = [
  body("title").notEmpty().withMessage("Title is required").trim(),
  body("author").notEmpty().withMessage("Author is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
  body("publishedYear")
    .optional()
    .isInt({ min: VALIDATION.OLDEST_VALID_YEAR, max: VALIDATION.CURRENT_YEAR })
    .withMessage(
      `Year must be between ${VALIDATION.OLDEST_VALID_YEAR} and ${VALIDATION.CURRENT_YEAR}`
    ),
  body("genre").optional().isArray().withMessage("Genre must be an array"),
  body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL"),
];

export const updateBookValidator = [
  param("id").isMongoId().withMessage("Invalid book ID"),
  body("title").optional().trim(),
  body("author").optional().trim(),
  body("description").optional().trim(),
  body("publishedYear")
    .optional()
    .isInt({ min: VALIDATION.OLDEST_VALID_YEAR, max: VALIDATION.CURRENT_YEAR })
    .withMessage(
      `Year must be between ${VALIDATION.OLDEST_VALID_YEAR} and ${VALIDATION.CURRENT_YEAR}`
    ),
  body("genre").optional().isArray().withMessage("Genre must be an array"),
  body("coverImage")
    .optional()
    .isURL()
    .withMessage("Cover image must be a valid URL"),
];

// Book query validators
export const getBookValidator = [
  param("id").isMongoId().withMessage("Invalid book ID"),
];

export const getBooksValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("genre").optional().isString(),
  query("author").optional().isString(),
];

export const searchBooksValidator = [
  query("q").notEmpty().withMessage("Search query is required"),
];

// Review validation schemas
export const createReviewValidator = [
  body("bookId").isMongoId().withMessage("Invalid book ID"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5"),
  body("comment").optional().trim(),
];

export const updateReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review ID"),
  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5"),
  body("comment").optional().trim(),
];

export const getReviewValidator = [
  param("id").isMongoId().withMessage("Invalid review ID"),
];

export const getBookReviewsValidator = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// Custom validation middleware that accepts validation rules as an object
import { Request, Response, NextFunction } from "express";

export const validateRequest = (validationRules: Record<string, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get the request body
    const { body } = req;

    // Validation errors object
    const errors: Record<string, string> = {};

    // Validate each field based on the rules
    for (const [field, rules] of Object.entries(validationRules)) {
      // Check required fields
      if (
        rules.required &&
        (body[field] === undefined ||
          body[field] === null ||
          body[field] === "")
      ) {
        errors[field] = `${field} is required`;
        continue; // Skip other validations if required check fails
      }

      // If field is not provided and not required, skip other validations
      if (body[field] === undefined || body[field] === null) continue;

      // Check min length for strings
      if (
        rules.minLength !== undefined &&
        typeof body[field] === "string" &&
        body[field].length < rules.minLength
      ) {
        errors[
          field
        ] = `${field} must be at least ${rules.minLength} characters`;
      }

      // Check max length for strings
      if (
        rules.maxLength !== undefined &&
        typeof body[field] === "string" &&
        body[field].length > rules.maxLength
      ) {
        errors[
          field
        ] = `${field} must be less than ${rules.maxLength} characters`;
      }

      // Check minimum value for numbers
      if (
        rules.min !== undefined &&
        typeof body[field] === "number" &&
        body[field] < rules.min
      ) {
        errors[field] = `${field} must be at least ${rules.min}`;
      }

      // Check maximum value for numbers
      if (
        rules.max !== undefined &&
        typeof body[field] === "number" &&
        body[field] > rules.max
      ) {
        errors[field] = `${field} must be at most ${rules.max}`;
      }

      // Check if field is array
      if (rules.isArray && !Array.isArray(body[field])) {
        errors[field] = `${field} must be an array`;
      }

      // Check if array has minimum elements
      if (
        rules.isArray &&
        Array.isArray(body[field]) &&
        rules.minArrayLength !== undefined &&
        body[field].length < rules.minArrayLength
      ) {
        errors[
          field
        ] = `${field} must have at least ${rules.minArrayLength} items`;
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // If validation passes, continue to the next middleware/controller
    next();
  };
};
