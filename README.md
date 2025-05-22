# Book Review Application

A full-stack application for browsing and reviewing books, built with modern web technologies.

## Repository

GitHub: [https://github.com/harshk49/book-review-app](https://github.com/harshk49/book-review-app)

## Project Structure

This project is organized as a monorepo with separate frontend and backend directories:

- **frontend/**: Next.js application with TypeScript and Tailwind CSS
- **backend/**: Node.js API with Express, TypeScript, and MongoDB

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (copy from `.env.example` if available) and configure:

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

4. Start the backend server:

```bash
npm run dev
```

The API will be available at http://localhost:5000.

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file and configure:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

4. Start the frontend development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Running Both Services

For the best development experience, run both services simultaneously:

1. Start the backend server in one terminal.
2. Start the frontend server in another terminal.
3. Access the application at http://localhost:3000.

## Features

- User authentication (signup, login, logout)
- Book browsing and searching
- Book details with reviews
- Adding, editing, and deleting reviews
- Responsive design for all devices

## API Documentation

When the backend is running, Swagger documentation is available at:

```
http://localhost:5000/api/v1/docs
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
