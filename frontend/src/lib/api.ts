import axios from "axios";
import { BookCreateInput, BookSearchParams } from "./types/book";
import { ReviewCreateInput } from "./types/review";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle the standardized API response format
api.interceptors.response.use(
  (response) => {
    // Extract the data from the standardized response format
    if (response.data && response.data.success !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define API functions
export const authAPI = {
  register: (userData: { username: string; email: string; password: string }) =>
    api.post("/auth/signup", userData),
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

export const bookAPI = {
  getBooks: (params?: BookSearchParams) => api.get("/books", { params }),
  getBook: (id: string) => api.get(`/books/${id}`),
  createBook: (bookData: BookCreateInput) => api.post("/books", bookData),
  searchBooks: (query: string) =>
    api.get(`/books/search?q=${encodeURIComponent(query)}`),
  addReview: (bookId: string, reviewData: ReviewCreateInput) =>
    api.post(`/books/${bookId}/reviews`, reviewData),
};

export const reviewAPI = {
  updateReview: (
    reviewId: string,
    reviewData: { rating: number; text: string }
  ) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
};

export default api;
