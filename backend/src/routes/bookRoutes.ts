import express from "express";
import {
  createBook,
  getBooks,
  getBookById,
  searchBooks,
} from "../controllers/bookController";
import { createReview } from "../controllers/reviewController";
import protect from "../middleware/authMiddleware";
import { createBookValidator, createReviewValidator } from "../utils/validator";
import { validate, catchAsync } from "../utils/apiUtils";

const router = express.Router();

// @route   POST /api/books
// @desc    Create a new book
// @access  Private
router.post(
  "/",
  protect,
  validate(createBookValidator),
  catchAsync(createBook)
);

// @route   GET /api/books
// @desc    Get all books with pagination and optional filters
// @access  Public
router.get("/", catchAsync(getBooks));

// @route   GET /api/books/search
// @desc    Search books by title or author
// @access  Public
router.get("/search", catchAsync(searchBooks));

// @route   GET /api/books/:id
// @desc    Get book details by ID including average rating and reviews
// @access  Public
router.get("/:id", catchAsync(getBookById));

// @route   POST /api/books/:id/reviews
// @desc    Create a review for a book
// @access  Private
router.post(
  "/:id/reviews",
  protect,
  validate(createReviewValidator),
  catchAsync(createReview)
);

export default router;
