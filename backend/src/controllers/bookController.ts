import { Request, Response } from "express";
import Book, { IBook } from "../models/Book";
import Review from "../models/Review";
import mongoose from "mongoose";
import { sendResponse } from "../utils/apiUtils";
import AppError from "../utils/errorHandler";
import { API } from "../utils/constants";
import cacheManager from "../utils/cacheManager";

// Define interfaces for book filters
interface BookFilter {
  author?: {
    $regex: string | undefined;
    $options: string;
  };
  genre?: {
    $in: string[];
  };
}

// @desc    Create a new book
// @route   POST /api/v1/books
// @access  Private
export const createBook = async (req: Request, res: Response) => {
  const { title, author, description, coverImage, genre, publishedYear } =
    req.body;

  const book = new Book({
    title,
    author,
    description,
    coverImage,
    genre: genre ? (Array.isArray(genre) ? genre : [genre]) : undefined,
    publishedYear,
  });

  const savedBook = await book.save();
  sendResponse(res, 201, true, savedBook, "Book created successfully");
};

// @desc    Get all books with pagination and optional filters
// @route   GET /api/v1/books
// @access  Public
export const getBooks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || API.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: BookFilter = {};

  if (req.query.author) {
    filter.author = { $regex: req.query.author as string, $options: "i" };
  }

  if (req.query.genre) {
    filter.genre = { $in: [req.query.genre] };
  }

  // Create a cache key based on the request parameters
  const cacheKey = `books:${JSON.stringify(filter)}:${page}:${limit}`;

  // Try to get from cache first
  const cachedData = cacheManager.get<{
    books: IBook[];
    page: number;
    pages: number;
    totalBooks: number;
  }>(cacheKey);

  if (cachedData) {
    return sendResponse(
      res,
      200,
      true,
      cachedData,
      "Books retrieved from cache"
    );
  }

  // Get books
  const books = await Book.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalBooks = await Book.countDocuments(filter);

  const responseData = {
    books,
    page,
    pages: Math.ceil(totalBooks / limit),
    totalBooks,
  };

  // Cache the result for future requests
  cacheManager.set(cacheKey, responseData);

  sendResponse(res, 200, true, responseData, "Books retrieved successfully");
};

// @desc    Get book details by ID including average rating and reviews
// @route   GET /api/v1/books/:id
// @access  Public
export const getBookById = async (req: Request, res: Response) => {
  const bookId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    throw new AppError("Invalid book ID", 400);
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError("Book not found", 404);
  }

  // Get reviews with pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || API.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  // Create a cache key for the reviews
  const cacheKey = `book:${bookId}:reviews:${page}:${limit}`;
  let reviews;
  let totalReviews;
  let averageRating;

  // Try to get from cache first
  const cachedData = cacheManager.get<{
    reviews: any[];
    totalReviews: number;
    averageRating: number;
  }>(cacheKey);

  if (cachedData) {
    reviews = cachedData.reviews;
    totalReviews = cachedData.totalReviews;
    averageRating = cachedData.averageRating;
  } else {
    // If not in cache, fetch from database
    reviews = await Review.find({ book: bookId })
      .populate("user", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total reviews
    totalReviews = await Review.countDocuments({ book: bookId });

    // Calculate average rating
    const ratingResult = await Review.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);

    averageRating =
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0;

    // Cache the results
    cacheManager.set(cacheKey, { reviews, totalReviews, averageRating });
  }

  const responseData = {
    ...book.toJSON(),
    averageRating,
    reviews,
    totalReviews,
    page,
    pages: Math.ceil(totalReviews / limit),
  };

  sendResponse(
    res,
    200,
    true,
    responseData,
    "Book details retrieved successfully"
  );
};

// @desc    Search books by title or author
// @route   GET /api/v1/books/search
// @access  Public
export const searchBooks = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  if (!query) {
    throw new AppError("Search query is required", 400);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || API.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  // Create cache key based on search parameters
  const cacheKey = `books:search:${query}:${page}:${limit}`;

  // Try to get from cache first
  const cachedResults = cacheManager.get<{
    books: IBook[];
    page: number;
    pages: number;
    totalBooks: number;
  }>(cacheKey);

  if (cachedResults) {
    return sendResponse(
      res,
      200,
      true,
      cachedResults,
      "Search results retrieved from cache"
    );
  }

  // Search using text index
  const books = await Book.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .skip(skip)
    .limit(limit);

  // If text search doesn't return results, try regex search
  let totalBooks = await Book.countDocuments({ $text: { $search: query } });
  let searchResults;

  if (books.length === 0) {
    const regexBooks = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);

    totalBooks = await Book.countDocuments({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    });

    searchResults = {
      books: regexBooks,
      page,
      pages: Math.ceil(totalBooks / limit),
      totalBooks,
      searchMethod: "regex",
    };
  } else {
    searchResults = {
      books,
      page,
      pages: Math.ceil(totalBooks / limit),
      totalBooks,
      searchMethod: "text",
    };
  }

  // Cache the search results
  cacheManager.set(cacheKey, searchResults);

  sendResponse(
    res,
    200,
    true,
    searchResults,
    "Search results retrieved successfully"
  );
};
