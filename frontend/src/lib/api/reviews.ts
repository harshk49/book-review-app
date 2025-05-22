import api from "./base";
import {
  Review,
  ReviewCreateInput,
  ReviewUpdateInput,
} from "@/lib/types/review";

export const reviewAPI = {
  addReview: (bookId: string, reviewData: ReviewCreateInput) =>
    api.post<{ review: Review }>(`/books/${bookId}/reviews`, reviewData),
  updateReview: (reviewId: string, reviewData: ReviewUpdateInput) =>
    api.put<{ review: Review }>(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId: string) =>
    api.delete<{ message: string }>(`/reviews/${reviewId}`),
};
