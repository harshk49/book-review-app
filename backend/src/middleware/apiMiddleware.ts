import { RateLimiterMemory } from "rate-limiter-flexible";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/errorHandler";
import { RATE_LIMIT } from "../utils/constants";

// Create a rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: RATE_LIMIT.MAX_REQUESTS, // Number of points
  duration: RATE_LIMIT.WINDOW_MS / 1000, // Per X seconds (converted from ms)
});

// Rate limiting middleware
export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Use IP as a key, or user ID if user is authenticated
    const key = req.ip;
    await rateLimiter.consume(key);
    next();
  } catch (error) {
    next(new AppError(RATE_LIMIT.MESSAGE, 429));
  }
};

// Health check middleware
export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
