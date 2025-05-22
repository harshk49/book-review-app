// Book-related types used throughout the frontend

export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  genre?: string[];
  publishedYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookCreateInput {
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  genre?: string[];
  publishedYear?: number;
}

export interface BookListResponse {
  books: Book[];
  totalBooks: number;
  page: number;
  totalPages: number;
}

export interface BookSearchParams {
  page?: number;
  limit?: number;
  author?: string;
  genre?: string;
}
