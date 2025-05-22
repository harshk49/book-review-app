import swaggerJSDoc from "swagger-jsdoc";
import { version } from "../../package.json";
import { API } from "../utils/constants";
import validateEnv from "./env";

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Book Review API",
      version,
      description: "API documentation for the Book Review application",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "API Support",
        url: "https://example.com/support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${validateEnv.PORT || 5000}${API.PREFIX}`,
        description: "Development server",
      },
      {
        url: `https://api.example.com${API.PREFIX}`,
        description: "Production server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication operations",
      },
      {
        name: "Books",
        description: "Book management operations",
      },
      {
        name: "Reviews",
        description: "Book review operations",
      },
      {
        name: "Users",
        description: "User profile operations",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            username: {
              type: "string",
              description: "User name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
              description: "User role",
            },
            avatar: {
              type: "string",
              description: "URL to avatar image",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update date",
            },
          },
        },
        Book: {
          type: "object",
          required: ["title", "author", "description", "genre"],
          properties: {
            _id: {
              type: "string",
              description: "Book ID",
            },
            title: {
              type: "string",
              description: "Book title",
            },
            author: {
              type: "string",
              description: "Book author",
            },
            description: {
              type: "string",
              description: "Book description",
            },
            genre: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Book genres",
            },
            coverImage: {
              type: "string",
              description: "URL to book cover image",
            },
            publishedYear: {
              type: "integer",
              description: "Year the book was published",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Book creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Book last update date",
            },
          },
        },
        Review: {
          type: "object",
          required: ["bookId", "user", "rating"],
          properties: {
            _id: {
              type: "string",
              description: "Review ID",
            },
            bookId: {
              type: "string",
              description: "ID of the book being reviewed",
            },
            user: {
              type: "string",
              description: "ID of the user who wrote the review",
            },
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
              description: "Rating from 1 to 5",
            },
            comment: {
              type: "string",
              description: "Review comment",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Review creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Review last update date",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              description: "Error message",
            },
            stack: {
              type: "string",
              description: "Error stack trace (only in development)",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              description: "Time when the error occurred",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Books",
        description: "Book operations",
      },
      {
        name: "Reviews",
        description: "Review operations",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
