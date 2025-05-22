// Centralized error handling
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // To distinguish operational errors from programming errors

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware for Express
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import logger from "./logger";

// Define error interfaces
interface MongoError extends Error {
  code: number;
  keyPattern?: Record<string, number>;
  keyValue?: Record<string, unknown>;
}

interface CastError extends Error {
  path: string;
  value: string;
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = "Something went wrong";
  let stack = process.env.NODE_ENV === "production" ? undefined : err.stack;
  let details = undefined;

  // Log the error for server-side debugging
  logger.error(`Error: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);

  // Handle known operational errors
  if ("statusCode" in err) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle Mongoose validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.keys(err.errors).reduce((acc, key) => {
      if (err.errors[key]) {
        acc[key] = err.errors[key].message;
      }
      return acc;
    }, {} as Record<string, string>);
    // Log validation errors specifically
    logger.warn(`Validation Error: ${JSON.stringify(details)}`);
  }
  // Handle Mongoose duplicate key errors
  else if (
    (err.name === "MongoError" || err.name === "MongoServerError") &&
    (err as MongoError).code === 11000
  ) {
    statusCode = 400;
    const keyValue = (err as MongoError).keyValue || {};
    const duplicateKey = Object.keys(keyValue)[0] || "field";
    const duplicateValue = keyValue[duplicateKey];
    message = `Duplicate value entered for ${duplicateKey}: ${duplicateValue}`;
    // Log duplicate key errors
    logger.warn(`Duplicate Key Error: ${message}`);
  }
  // Handle cast errors (e.g., invalid ObjectId)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${(err as CastError).path}: ${(err as CastError).value}`;
    // Log cast errors
    logger.warn(`Cast Error: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    details,
    stack: process.env.NODE_ENV === "development" ? stack : undefined,
    timestamp: new Date().toISOString(),
  });
};

export default AppError;
