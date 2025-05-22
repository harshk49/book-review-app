import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import AppError from "../utils/errorHandler";
import logger from "../utils/logger";
import { catchAsync } from "../utils/apiUtils";
import validateEnv from "../config/env";

interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Extending the Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Protect routes - Middleware to check if user is authenticated
const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token from header and check if it exists
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      // Also check in cookies if token exists
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to get access", 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(token, validateEnv.JWT_SECRET) as DecodedToken;

    // 3) Check if user still exists
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (
      user.passwordChangedAt &&
      isTokenIssuedBeforePasswordChanged(decoded.iat, user.passwordChangedAt)
    ) {
      return next(
        new AppError("User recently changed password. Please log in again", 401)
      );
    }

    // Grant access to protected route
    req.user = user;
    next();
  }
);

// Role-based authorization
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user role is in the permitted roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

// Helper function to check if password was changed after token was issued
const isTokenIssuedBeforePasswordChanged = (
  tokenIssuedAt: number,
  passwordChangedAt: Date
): boolean => {
  const changedTimestamp = passwordChangedAt.getTime() / 1000;
  return tokenIssuedAt < changedTimestamp;
};

export { protect };
export default protect;
