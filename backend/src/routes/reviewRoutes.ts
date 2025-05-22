import express from "express";
import { updateReview, deleteReview } from "../controllers/reviewController";
import protect from "../middleware/authMiddleware";
import { updateReviewValidator } from "../utils/validator";
import { validate, catchAsync } from "../utils/apiUtils";

const router = express.Router();

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put(
  "/:id",
  protect,
  validate(updateReviewValidator),
  catchAsync(updateReview)
);

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete("/:id", protect, catchAsync(deleteReview));

export default router;
