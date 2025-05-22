import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  genre?: string[];
  publishedYear?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    genre: {
      type: [String],
      default: [],
    },
    publishedYear: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search functionality
BookSchema.index({ title: "text", author: "text" });

export default mongoose.model<IBook>("Book", BookSchema);
