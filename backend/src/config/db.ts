import mongoose from "mongoose";
import logger from "../utils/logger";
import validateEnv from "./env";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(validateEnv.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected.");
    });

    // Optionally log when connected again after disconnect (Mongoose handles reconnection automatically)
    mongoose.connection.on("connected", () => {
      logger.info("MongoDB reconnected.");
    });
  } catch (error: Error) {
    logger.error(
      `Error connecting to MongoDB: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  }
};

export default connectDB;
