# Book Review API

A modern, feature-rich RESTful API for a book review application built with Node.js, Express, TypeScript, and MongoDB.

## Overview

This backend serves as the API for the Book Review application, providing endpoints for user authentication, book management, and review functionality. It's designed to be used with the Next.js frontend but can be integrated with any client application.

## Features

- **Modern TypeScript Backend**: Fully typed codebase with the latest TypeScript features.
- **RESTful API**: Well-structured API endpoints following RESTful principles.
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control.
- **API Versioning**: Versioned endpoints to ensure backward compatibility.
- **Error Handling**: Comprehensive error handling with meaningful error messages.
- **Input Validation**: Request validation using express-validator.
- **Rate Limiting**: Protection against brute-force attacks and DoS.
- **API Documentation**: Auto-generated Swagger documentation.
- **Logging**: Detailed request and application logging with Morgan and Winston.
- **Security Features**: Implements best practices for API security with Helmet.
- **Environment Validation**: Ensures all required environment variables are properly set.
- **Caching**: Type-safe in-memory caching implementation with wildcard key invalidation.
- **Compression**: GZIP compression for response payloads.
- **Graceful Shutdown**: Proper handling of process termination signals.
- **Cookie-based Auth**: Secure HTTP-only cookies for enhanced JWT security.

## Project Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn
- Git

### Step-by-Step Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/harshk49/book-review-app.git
   cd book-review-app/backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root of the backend directory:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and configure the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/book-review-app
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   API_PREFIX=/api/v1
   LEGACY_API_PREFIX=/api
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up the database**

   Ensure MongoDB is running locally or use MongoDB Atlas. The application will automatically create the required collections on startup.

5. **Initial data seeding (optional)**

   To seed the database with initial data:

   ```bash
   npm run seed
   # or
   yarn seed
   ```

## How to Run Locally

1. **Start in development mode**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   This will start the server with hot reload on http://localhost:5000.

2. **Start in production mode**

   ```bash
   npm run build
   npm start
   # or
   yarn build
   yarn start
   ```

3. **Testing the application**
   ```bash
   npm run test
   # or
   yarn test
   ```

## Database Schema

The application uses MongoDB with the following data models:

### User Schema

```typescript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  profileImage: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Book Schema

```typescript
{
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  genre: [{ type: String }],
  publishedYear: { type: Number },
  coverImage: { type: String },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Review Schema

```typescript
{
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Design Decisions & Architecture

### API Architecture

- **RESTful Design**: API follows REST principles with resource-based URLs and appropriate HTTP methods
- **MVC Pattern**: Controllers handle request processing, Models define data structures, and Routes define API endpoints
- **Middleware-based**: Uses Express middleware for authentication, logging, error handling, etc.

### Authentication Strategy

- **JWT-based**: Uses JSON Web Tokens stored in HTTP-only cookies
- **Role-based Access Control**: Different access levels for regular users and admins
- **Token Rotation**: Short-lived access tokens with appropriate expiration

### Performance Considerations

- **Pagination**: All list endpoints support pagination to handle large datasets efficiently
- **Indexing**: Database collections are indexed for frequently queried fields
- **Caching**: In-memory caching for frequently accessed data with wildcard key invalidation
- **Response Compression**: GZIP compression to reduce payload size

### Security Measures

- **Input Validation**: Request body validation using express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Secure Headers**: Implementation of security headers using Helmet
- **Password Hashing**: Secure password storage using bcrypt
- **CORS Protection**: Properly configured Cross-Origin Resource Sharing

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user info

### Books

- `GET /api/v1/books` - Get all books with pagination
- `GET /api/v1/books/:id` - Get a single book
- `POST /api/v1/books` - Create a new book (Auth required)
- `GET /api/v1/books/search` - Search books by title or author

### Reviews

- `POST /api/v1/books/:id/reviews` - Create a review for a book (Auth required)
- `PUT /api/v1/reviews/:id` - Update a review (Auth required)
- `DELETE /api/v1/reviews/:id` - Delete a review (Auth required)

## API Endpoints Reference

Below is a comprehensive list of all available API endpoints:

### Authentication Endpoints

| Method | Endpoint            | Description                    | Auth Required |
| ------ | ------------------- | ------------------------------ | ------------- |
| POST   | /api/v1/auth/signup | Register a new user            | No            |
| POST   | /api/v1/auth/login  | Log in with email and password | No            |
| POST   | /api/v1/auth/logout | Log out (clear auth cookie)    | Yes           |
| GET    | /api/v1/auth/me     | Get current user profile       | Yes           |

### Books Endpoints

| Method | Endpoint             | Description                     | Auth Required |
| ------ | -------------------- | ------------------------------- | ------------- |
| GET    | /api/v1/books        | Get all books with pagination   | No            |
| GET    | /api/v1/books/:id    | Get a single book by ID         | No            |
| POST   | /api/v1/books        | Create a new book               | Yes           |
| PUT    | /api/v1/books/:id    | Update a book                   | Yes (Author)  |
| DELETE | /api/v1/books/:id    | Delete a book                   | Yes (Author)  |
| GET    | /api/v1/books/search | Search books by title or author | No            |

### Reviews Endpoints

| Method | Endpoint                  | Description                | Auth Required |
| ------ | ------------------------- | -------------------------- | ------------- |
| POST   | /api/v1/books/:id/reviews | Create a review for a book | Yes           |
| GET    | /api/v1/books/:id/reviews | Get all reviews for a book | No            |
| PUT    | /api/v1/reviews/:id       | Update a review            | Yes (Author)  |
| DELETE | /api/v1/reviews/:id       | Delete a review            | Yes (Author)  |

## Example API Requests

Below are examples using both curl and Postman for common API operations:

### User Registration

**Curl**

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

**Postman**

1. Set method to `POST`
2. Enter URL: `http://localhost:5000/api/v1/auth/signup`
3. Go to Body tab, select raw and JSON
4. Enter:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### User Login

**Curl**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }' \
  -c cookies.txt
```

**Postman**

1. Set method to `POST`
2. Enter URL: `http://localhost:5000/api/v1/auth/login`
3. Go to Body tab, select raw and JSON
4. Enter:

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

5. The response will include a JWT token and set a cookie

### Create a Book (Authenticated)

**Curl**

```bash
curl -X POST http://localhost:5000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A novel about the American Dream...",
    "genre": ["Fiction", "Classic"],
    "publishedYear": 1925,
    "coverImage": "https://example.com/gatsby.jpg"
  }'
```

**Postman**

1. Set method to `POST`
2. Enter URL: `http://localhost:5000/api/v1/books`
3. Go to Authorization tab, select Bearer Token and enter your JWT token
4. Go to Body tab, select raw and JSON
5. Enter:

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A novel about the American Dream...",
  "genre": ["Fiction", "Classic"],
  "publishedYear": 1925,
  "coverImage": "https://example.com/gatsby.jpg"
}
```

### Get Books with Filtering and Pagination

**Curl**

```bash
curl "http://localhost:5000/api/v1/books?page=1&limit=10&genre=Fiction&author=Fitzgerald"
```

**Postman**

1. Set method to `GET`
2. Enter URL: `http://localhost:5000/api/v1/books`
3. Go to Params tab and add:
   - Key: `page`, Value: `1`
   - Key: `limit`, Value: `10`
   - Key: `genre`, Value: `Fiction`
   - Key: `author`, Value: `Fitzgerald`

### Search for Books

**Curl**

```bash
curl "http://localhost:5000/api/v1/books/search?q=gatsby"
```

**Postman**

1. Set method to `GET`
2. Enter URL: `http://localhost:5000/api/v1/books/search`
3. Go to Params tab and add:
   - Key: `q`, Value: `gatsby`

### Add a Review (Authenticated)

**Curl**

```bash
curl -X POST http://localhost:5000/api/v1/books/60d21b4667d0d8992e610c85/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "text": "This is an amazing book that changed my perspective."
  }'
```

**Postman**

1. Set method to `POST`
2. Enter URL: `http://localhost:5000/api/v1/books/60d21b4667d0d8992e610c85/reviews`
3. Go to Authorization tab, select Bearer Token and enter your JWT token
4. Go to Body tab, select raw and JSON
5. Enter:

```json
{
  "rating": 5,
  "text": "This is an amazing book that changed my perspective."
}
```

### Update a Review (Authenticated, Owner Only)

**Curl**

```bash
curl -X PUT http://localhost:5000/api/v1/reviews/60d21b4667d0d8992e610c85 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 4,
    "text": "Updated review text here"
  }'
```

**Postman**

1. Set method to `PUT`
2. Enter URL: `http://localhost:5000/api/v1/reviews/60d21b4667d0d8992e610c85`
3. Go to Authorization tab, select Bearer Token and enter your JWT token
4. Go to Body tab, select raw and JSON
5. Enter:

```json
{
  "rating": 4,
  "text": "Updated review text here"
}
```

### Delete a Review (Authenticated, Owner Only)

**Curl**

```bash
curl -X DELETE http://localhost:5000/api/v1/reviews/60d21b4667d0d8992e610c85 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Postman**

1. Set method to `DELETE`
2. Enter URL: `http://localhost:5000/api/v1/reviews/60d21b4667d0d8992e610c85`
3. Go to Authorization tab, select Bearer Token and enter your JWT token

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Missing or invalid token)
- `403` - Forbidden (No permission to access a resource)
- `404` - Not Found (Resource doesn't exist)
- `429` - Too Many Requests (Rate limit exceeded)
- `500` - Server Error (Internal server error)

## Testing with Postman

### Getting Started with Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Import the Book Review API collection from the `postman/Book_Review_API.json` file by clicking on "Import" in Postman

### Setting Up Environment Variables

1. Create a new Environment in Postman by clicking on "Environments" in the sidebar
2. Add the following variables:
   - `baseUrl`: `http://localhost:5000`
   - `apiVersion`: `v1`
   - `token`: (Leave empty initially, will be set after login)

### Authentication Flow

1. **Register a new user**:

   - Open the "Auth/Register" request
   - In the Body tab, provide your username, email, and password:
     ```json
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Click "Send" to create your account

2. **Login**:
   - Open the "Auth/Login" request
   - In the Body tab, provide your email and password:
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```
   - Click "Send"
   - The response will contain a token and also set a HTTP-only cookie in your browser
   - You can manually copy the token value from the response and set it as the "token" environment variable

### Book Operations

1. **Create a book**:

   - Open the "Books/Create Book" request
   - Ensure your Bearer token is set in the Authorization tab
   - In the Body tab, provide the book details:
     ```json
     {
       "title": "The Great Gatsby",
       "author": "F. Scott Fitzgerald",
       "description": "A novel set in the Jazz Age on Long Island...",
       "genre": ["Fiction", "Classic"],
       "publishedYear": 1925
     }
     ```
   - Click "Send"
   - Save the returned book `_id` for later use

2. **Get all books**:

   - Open the "Books/Get All Books" request
   - Add optional query parameters:
     - `page`: 1
     - `limit`: 10
     - `author`: Fitzgerald
     - `genre`: Fiction
   - Click "Send"

3. **Get book by ID**:

   - Open the "Books/Get Book by ID" request
   - Replace the `:id` parameter with your saved book ID
   - Click "Send"

4. **Search books**:
   - Open the "Books/Search Books" request
   - Add the query parameter `q` with your search term
   - Click "Send"

### Review Operations

1. **Add a review**:

   - Open the "Reviews/Create Review" request
   - Replace the `:id` parameter with your saved book ID
   - Ensure your Bearer token is set in the Authorization tab (or you have the auth cookie)
   - In the Body tab, provide the review details:
     ```json
     {
       "rating": 5,
       "text": "This is my review of this amazing book."
     }
     ```
   - Click "Send"
   - Save the returned review `_id` for later use

2. **Update review**:

   - Open the "Reviews/Update Review" request
   - Replace the `:id` parameter with your saved review ID
   - Ensure your Bearer token is set in the Authorization tab
   - In the Body tab, provide the updated details:
     ```json
     {
       "rating": 4,
       "text": "I've updated my review after a second reading."
     }
     ```
   - Click "Send"

3. **Delete review**:
   - Open the "Reviews/Delete Review" request
   - Replace the `:id` parameter with your saved review ID
   - Ensure your Bearer token is set in the Authorization tab
   - Click "Send"

### Troubleshooting

- **401 Unauthorized**: Your token is missing or expired. Re-login to get a new token.
- **403 Forbidden**: You're trying to access a resource you don't own.
- **404 Not Found**: The requested resource (book/review) doesn't exist.
- **400 Bad Request**: Check your request body for missing or invalid fields.
- **429 Too Many Requests**: You've hit the rate limit. Wait and try again.

## Postman Collection

You can find the complete Postman collection in the `postman/Book_Review_API.json` file.

The collection includes the following request folders:

1. Auth

   - POST {{baseUrl}}/api/{{apiVersion}}/auth/signup
   - POST {{baseUrl}}/api/{{apiVersion}}/auth/login
   - POST {{baseUrl}}/api/{{apiVersion}}/auth/logout
   - GET {{baseUrl}}/api/{{apiVersion}}/auth/me

2. Books

   - POST {{baseUrl}}/api/{{apiVersion}}/books
   - GET {{baseUrl}}/api/{{apiVersion}}/books
   - GET {{baseUrl}}/api/{{apiVersion}}/books/:id
   - GET {{baseUrl}}/api/{{apiVersion}}/books/search?q=:query

3. Reviews
   - POST {{baseUrl}}/api/{{apiVersion}}/books/:id/reviews
   - PUT {{baseUrl}}/api/{{apiVersion}}/reviews/:id
   - DELETE {{baseUrl}}/api/{{apiVersion}}/reviews/:id

## Health Check Endpoint

The API provides a health check endpoint at:

```
GET /api/v1/health
```

This endpoint returns basic information about the API status and version.

## Documentation

Once the server is running, you can access the Swagger API documentation at:

```
http://localhost:5000/api/v1/docs
```

## Testing Strategy

The application includes comprehensive testing to ensure reliability:

### Unit Tests

Unit tests cover individual components in isolation:

```bash
npm run test:unit
```

### Integration Tests

Integration tests verify that components work together correctly:

```bash
npm run test:integration
```

### API Tests

API tests ensure endpoints function correctly:

```bash
npm run test:api
```

### Running All Tests

To run all tests with coverage:

```bash
npm test
```

## Deployment Notes

### Production Preparation

Before deploying to production:

1. Set `NODE_ENV=production` in your environment variables
2. Update the `JWT_SECRET` to a strong, unique value
3. Configure a production-ready MongoDB instance
4. Set `FRONTEND_URL` to your production frontend URL for CORS

### Deployment Options

#### Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
# Build the Docker image
docker build -t book-review-api .

# Run the container
docker run -p 5000:5000 --env-file .env book-review-api
```

#### Cloud Deployment

The API can be deployed to various cloud platforms:

- **Heroku**: Use the Procfile in the repository
- **AWS Elastic Beanstalk**: Use the provided EB configuration
- **Azure App Service**: Deploy directly from GitHub
- **Google Cloud Run**: Use the Dockerfile

## Performance Monitoring

The application includes performance monitoring endpoints:

```
GET /api/v1/health/status - Basic health check
GET /api/v1/health/metrics - Application metrics (authenticated)
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

Please ensure your code passes all tests and linting before submitting.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
