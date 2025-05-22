import api from "./base";
import { Book, BookCreateInput, BookSearchParams } from "@/lib/types/book";

export const bookAPI = {
  getBooks: (params?: BookSearchParams) => 
    api.get<{ books: Book[]; totalBooks: number; page: number; totalPages: number }>("/books", { params }),
  getBook: (id: string) => 
    api.get<{ book: Book }>(`/books/${id}`),
  createBook: (bookData: BookCreateInput) => 
    api.post<{ book: Book }>("/books", bookData),
  searchBooks: (query: string) =>
    api.get<{ books: Book[]; totalBooks: number }>(`/search?q=${encodeURIComponent(query)}`),
};
