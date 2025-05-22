import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User, { IUser } from "../models/User";
import { catchAsync } from "../utils/apiUtils";
import AppError from "../utils/errorHandler";
import { sendResponse } from "../utils/apiUtils";
import validateEnv from "../config/env";
import logger from "../utils/logger";
import { AUTH } from "../utils/constants";

// Generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, validateEnv.JWT_SECRET, {
    expiresIn: validateEnv.JWT_EXPIRE,
  });
};

// Create and send token with response
const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  const token = generateToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + parseInt(validateEnv.JWT_EXPIRE) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: validateEnv.NODE_ENV === "production",
  };

  // Set cookie
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  const userObject = user.toObject();
  delete userObject.password;

  return sendResponse(
    res,
    statusCode,
    true,
    {
      user: userObject,
      token,
    },
    "Success"
  );
};

// @desc    Register new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return next(
        new AppError("User already exists with this email or username", 400)
      );
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate JWT and send response
    createSendToken(user, 201, res);
  }
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // Check if user exists & password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid credentials", 401));
    }

    // Generate JWT and send response
    createSendToken(user, 200, res);
  }
);

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Public
export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  sendResponse(res, 200, true, null, "Logged out successfully");
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = catchAsync(async (req: Request, res: Response) => {
  // User is already available on req due to the protect middleware
  sendResponse(res, 200, true, { user: req.user }, "Success");
});

// Update password functionality removed

// Forgot password functionality removed

// Reset password functionality removed
