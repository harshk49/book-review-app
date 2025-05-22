import winston from "winston";

// Define the custom settings for each transport
const options = {
  file: {
    level: "info",
    filename: "./logs/app.log",
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
  },
};

// Instantiate a new Winston logger with the settings defined above
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// Create a stream object with a 'write' function that will be used by morgan
export const morganStream = {
  write: (message: string) => {
    // Remove all line breaks to ensure clean log entry
    logger.info(message.trim());
  },
};

export default logger;
