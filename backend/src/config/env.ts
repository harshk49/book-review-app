// Load environment variables using dotenv
import dotenv from "dotenv";
import logger from "../utils/logger";
dotenv.config();

// Validate environment variables
export const validateEnv = () => {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV || "development",
      PORT: parseInt(process.env.PORT || "5000", 10),
      MONGO_URI: process.env.MONGO_URI,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
      API_PREFIX: process.env.API_PREFIX || "/api/v1",
      LEGACY_API_PREFIX: process.env.LEGACY_API_PREFIX || "/api",
      FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    };

    // Perform validation checks manually
    if (!["development", "test", "production"].includes(env.NODE_ENV)) {
      throw new Error("NODE_ENV must be development, test, or production");
    }

    if (isNaN(env.PORT) || env.PORT < 0 || env.PORT > 65535) {
      throw new Error("PORT must be a valid port number (0-65535)");
    }

    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is required");
    }

    if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
      if (env.NODE_ENV === "production") {
        throw new Error(
          "JWT_SECRET must be at least 32 characters in production"
        );
      } else {
        logger.warn(
          "Warning: Using weak JWT_SECRET in development environment"
        );
        env.JWT_SECRET = "default-secret-key-for-development-only";
      }
    }

    // Validate API prefixes
    if (!env.API_PREFIX.startsWith("/")) {
      env.API_PREFIX = "/" + env.API_PREFIX;
    }

    if (!env.LEGACY_API_PREFIX.startsWith("/")) {
      env.LEGACY_API_PREFIX = "/" + env.LEGACY_API_PREFIX;
    }

    return env;
  } catch (error) {
    logger.error("Environment validation error:", error);
    process.exit(1);
  }
};

// Export validated env variables
export default validateEnv();
