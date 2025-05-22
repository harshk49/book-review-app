import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  book: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per user per book
ReviewSchema.index({ book: 1, user: 1 }, { unique: true });

export default mongoose.model<IReview>("Review", ReviewSchema);
