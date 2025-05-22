# Book Review App - Frontend

A modern, responsive frontend for the Book Review application built with Next.js, TypeScript, and Tailwind CSS.

## Repository

GitHub: [https://github.com/harshk49/book-review-app](https://github.com/harshk49/book-review-app)

## Features

- **Modern React App**: Built with Next.js for server-side rendering and routing
- **TypeScript Support**: Fully typed codebase
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Authentication**: Secure login and registration
- **Book Management**: Browse, search, and review books
- **Animated UI Components**: Smooth transitions and animations
- **Tailwind CSS**: Utility-first CSS framework for styling

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- **app/**: App router pages and layouts
  - **dashboard/**: Authenticated user dashboard
  - **books/**: Book details and review pages
  - **login/ & signup/**: Authentication pages
- **components/**: Reusable React components
  - **animations/**: Animation components
  - **common/**: Common UI components
  - **layouts/**: Layout components
  - **ui/**: UI component library
- **contexts/**: React context providers
- **hooks/**: Custom React hooks
- **lib/**: Utility functions and API clients
  - **api/**: API client functions
  - **types/**: TypeScript type definitions

## Features

1. **User Authentication**

   - Register, login, and logout functionality
   - Protected routes for authenticated users
   - User profile management

2. **Book Browsing**

   - View list of books with pagination
   - Filter books by author and genre
   - Search functionality

3. **Book Details**

   - View detailed information about books
   - See existing reviews
   - Add, edit, and delete your own reviews

4. **Responsive Design**
   - Mobile-first approach
   - Adapts to different screen sizes

## Backend Integration

This frontend connects to the Book Review API backend. Make sure the backend server is running on http://localhost:5000 before starting the frontend application.

To configure the API URL, set the appropriate environment variables in your `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript features and usage.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS utility classes.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
