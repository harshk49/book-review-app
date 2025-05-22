import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import AppError from "./errorHandler";

// Define interface for API response
export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data?: T;
  message?: string;
}

// Middleware to handle validation results
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format validation errors and return them
    const formattedErrors = errors
      .array()
      .reduce((acc: Record<string, string>, error) => {
        acc[error.param] = error.msg;
        return acc;
      }, {});

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
      message: "Validation failed",
    });
  };
};

// Common response format
export const sendResponse = <T>(
  res: Response,
  status: number,
  success: boolean,
  data: T | null,
  message?: string
) => {
  const response: ApiResponse<T> = {
    success,
    timestamp: new Date().toISOString(),
  };

  if (data) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  return res.status(status).json(response);
};

// Catch async errors in route handlers
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
