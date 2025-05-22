import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import validateEnv from "./config/env";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import bookRoutes from "./routes/bookRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import { errorHandler } from "./utils/errorHandler";
import { morganStream } from "./utils/logger";
import { rateLimiterMiddleware, healthCheck } from "./middleware/apiMiddleware";
import { sendResponse } from "./utils/apiUtils";
import swaggerSpec from "./config/swagger";
import { API, REQUEST_LIMITS, SERVER } from "./utils/constants";
import logger from "./utils/logger";
import cacheManager from "./utils/cacheManager";

// Connect to database
connectDB();

const app = express();

// Security and middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(compression()); // Compress responses to improve performance
app.use(express.json({ limit: REQUEST_LIMITS.JSON_BODY_LIMIT })); // Body parser with increased size limit
app.use(
  express.urlencoded({
    extended: false,
    limit: REQUEST_LIMITS.URLENCODED_LIMIT,
  })
);
app.use(cookieParser()); // Parse Cookie header and populate req.cookies
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? validateEnv.FRONTEND_URL // Use the frontend URL from env vars
        : "*",
    credentials: true, // Allow cookies to be sent with requests
    optionsSuccessStatus: 200,
  })
);
app.use(morgan("combined", { stream: morganStream })); // Request logging
app.use(rateLimiterMiddleware); // Rate limiting for API

// API versioning prefix
const API_V1 = API.PREFIX;

// Swagger API documentation
app.use(
  `${API_V1}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

// Routes
app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/books`, bookRoutes);
app.use(`${API_V1}/reviews`, reviewRoutes);

// Health check endpoint
app.get(`${API_V1}/health`, healthCheck);

// Backward compatibility for old API routes (no version prefix)
app.use(API.LEGACY_PREFIX + "/auth", authRoutes);
app.use(API.LEGACY_PREFIX + "/books", bookRoutes);
app.use(API.LEGACY_PREFIX + "/reviews", reviewRoutes);

// Home route
app.get("/", (req: Request, res: Response) => {
  sendResponse(res, 200, true, null, "Welcome to the Book Review API");
});

// Handle 404 - Not Found
app.use((req: Request, res: Response) => {
  sendResponse(
    res,
    404,
    false,
    null,
    `Cannot ${req.method} ${req.originalUrl}`
  );
});

// Global error handler
app.use(errorHandler);

const PORT = validateEnv.PORT || SERVER.DEFAULT_PORT;

// Start the cache cleanup interval
const cleanupInterval = cacheManager.startCleanupInterval();
logger.info("Cache cleanup interval started");

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Function to handle graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Stop the cache cleanup interval
  cacheManager.stopCleanupInterval();

  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, SERVER.SHUTDOWN_TIMEOUT);

  server.close(() => {
    logger.info("Server closed successfully");
    process.exit(0);
  });
};

// Handle unhandled rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  logger.error(err.name, err.message, err.stack);
  gracefulShutdown("unhandledRejection");
});

// Handle SIGTERM
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
