"use client";

import { useEffect, useState } from "react";
import { bookAPI, reviewAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string[];
  publishedYear: number;
  coverImage?: string;
  reviews: Review[];
}

interface Review {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  rating: number;
  text: string;
  createdAt: string;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function BookDetailPage({ params }: PageProps) {
  const { id } = params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await bookAPI.getBook(id);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        toast.error("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleReviewSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      await bookAPI.addReview(id, { rating, text: reviewText });

      // Refetch the book to get updated reviews
      const response = await bookAPI.getBook(id);
      setBook(response.data);

      setReviewText("");
      setRating(0);
      toast.success("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = async () => {
    if (!editingReview) return;

    try {
      setSubmitting(true);
      await reviewAPI.updateReview(editingReview._id, {
        rating: rating || editingReview.rating,
        text: reviewText,
      });

      // Refetch the book to get updated reviews
      const response = await bookAPI.getBook(id);
      setBook(response.data);

      setEditingReview(null);
      setReviewText("");
      setRating(0);
      toast.success("Review updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewAPI.deleteReview(reviewId);

      // Refetch the book to get updated reviews
      const response = await bookAPI.getBook(id);
      setBook(response.data);

      toast.success("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review. Please try again.");
    }
  };

  const setEditMode = (review: Review) => {
    setEditingReview(review);
    setReviewText(review.text);
    setRating(review.rating);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="md:w-2/3 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2 my-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-40 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-3">Book not found</h2>
        <p className="text-muted-foreground">
          The book you are looking for does not exist.
        </p>
      </div>
    );
  }

  const userHasReviewed = book.reviews.some(
    (review) => review.user._id === user?._id
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <div className="bg-muted h-[400px] rounded-lg overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
                No cover image
              </div>
            )}
          </div>
        </div>
        <div className="md:w-2/3 lg:w-3/4 space-y-4">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-muted-foreground">by {book.author}</p>

          <div className="flex flex-wrap gap-2 my-4">
            {book.genre.map((genre) => (
              <span
                key={genre}
                className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
              >
                {genre}
              </span>
            ))}
            <span className="px-3 py-1 rounded-full text-sm bg-muted">
              {book.publishedYear}
            </span>
          </div>

          <h2 className="text-xl font-semibold mt-6">Description</h2>
          <p className="text-muted-foreground">{book.description}</p>

          <div className="mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {book.reviews.length > 0
                  ? (
                      book.reviews.reduce((acc, r) => acc + r.rating, 0) /
                      book.reviews.length
                    ).toFixed(1)
                  : "No ratings"}
              </span>
              {book.reviews.length > 0 && (
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <=
                        Math.round(
                          book.reviews.reduce((acc, r) => acc + r.rating, 0) /
                            book.reviews.length
                        )
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}
              <span className="text-muted-foreground">
                ({book.reviews.length}{" "}
                {book.reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>

        {!userHasReviewed && !editingReview && (
          <div className="mb-8 border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <div className="flex items-center mb-4">
              <p className="mr-2">Rating:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <Button onClick={handleReviewSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        )}

        {editingReview && (
          <div className="mb-8 border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Your Review</h3>
            <div className="flex items-center mb-4">
              <p className="mr-2">Rating:</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-6 h-6 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this book..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="mb-4"
              rows={4}
            />
            <div className="flex space-x-2">
              <Button onClick={handleEditReview} disabled={submitting}>
                {submitting ? "Updating..." : "Update Review"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingReview(null);
                  setReviewText("");
                  setRating(0);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {book.reviews.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to review this book!
            </p>
          ) : (
            book.reviews.map((review) => (
              <div key={review._id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {user && review.user._id === user._id && (
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Review</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center my-4">
                            <p className="mr-2">Rating:</p>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className="focus:outline-none"
                                >
                                  <svg
                                    className={`w-6 h-6 ${
                                      star <= (rating || review.rating)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                          </div>
                          <Textarea
                            placeholder="Share your thoughts about this book..."
                            defaultValue={review.text}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="mb-4"
                            rows={4}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => {
                                setEditMode(review);
                                handleEditReview();
                              }}
                            >
                              Save
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete your review. This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReview(review._id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>

                <div className="flex mt-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-2">{review.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
