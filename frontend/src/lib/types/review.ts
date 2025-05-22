// Review-related types used throughout the frontend

export interface Review {
  _id: string;
  bookId: string;
  userId: string;
  username: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreateInput {
  rating: number;
  text: string;
}

export interface ReviewUpdateInput {
  rating: number;
  text: string;
}
