// App information
export const APP_NAME = "Book Review";
export const APP_DESCRIPTION =
  "A platform for book enthusiasts to review and discover books";

// API configurations
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};

// Route paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  SEARCH: "/dashboard/search",
  BOOK_DETAILS: (id: string) => `/dashboard/books/${id}`,
};
