import { Request, Response } from "express";
import Review from "../models/Review";
import Book from "../models/Book";
import mongoose from "mongoose";
import { sendResponse } from "../utils/apiUtils";
import AppError from "../utils/errorHandler";
import cacheManager from "../utils/cacheManager";

// @desc    Create a review for a book
// @route   POST /api/v1/books/:id/reviews
// @access  Private
export const createReview = async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const userId = req.user._id;
  const { rating, text } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("Invalid book ID", 400);
  }

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError("Book not found", 404);
  }

  // Check if user already reviewed this book
  const existingReview = await Review.findOne({
    user: userId,
    book: bookId,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this book", 400);
  }

  // Create and save review
  const review = new Review({
    book: bookId,
    user: userId,
    rating,
    text,
  });

  const savedReview = await review.save();

  // Return the populated review
  const populatedReview = await Review.findById(savedReview._id).populate(
    "user",
    "username"
  );

  // Invalidate book cache to reflect new review
  cacheManager.delete(`book:${bookId}:reviews:*`);

  sendResponse(res, 201, true, populatedReview, "Review created successfully");
};

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const userId = req.user._id;
  const { rating, text } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError("Invalid review ID", 400);
  }

  // Find review
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Check review ownership
  if (review.user.toString() !== userId.toString()) {
    throw new AppError("You can only update your own reviews", 403);
  }

  // Update review
  review.rating = rating ?? review.rating;
  review.text = text ?? review.text;

  const updatedReview = await review.save();

  // Return the populated review
  const populatedReview = await Review.findById(updatedReview._id).populate(
    "user",
    "username"
  );

  // Invalidate book cache to reflect updated review
  cacheManager.delete(`book:${review.book}:reviews:*`);

  sendResponse(res, 200, true, populatedReview, "Review updated successfully");
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  const userId = req.user._id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new AppError("Invalid review ID", 400);
  }

  // Find review
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  // Check review ownership
  if (review.user.toString() !== userId.toString()) {
    throw new AppError("You can only delete your own reviews", 403);
  }

  // Store book ID before deleting review to invalidate cache
  const bookId = review.book;

  // Delete review
  await Review.deleteOne({ _id: reviewId });

  // Invalidate book cache to reflect deleted review
  cacheManager.delete(`book:${bookId}:reviews:*`);

  sendResponse(res, 200, true, null, "Review deleted successfully");
};
