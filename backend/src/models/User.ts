import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { VALIDATION, AUTH } from "../utils/constants";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
  passwordChangedAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      minlength: [
        VALIDATION.USERNAME_MIN_LENGTH,
        `Username must be at least ${VALIDATION.USERNAME_MIN_LENGTH} characters`,
      ],
      maxlength: [
        VALIDATION.USERNAME_MAX_LENGTH,
        `Username cannot exceed ${VALIDATION.USERNAME_MAX_LENGTH} characters`,
      ],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create virtual property for user's reviews
UserSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "user",
});

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  // Only run this function if password was modified
  if (!this.isModified("password")) return next();

  try {
    // Hash password with configurable salt rounds
    const salt = await bcrypt.genSalt(AUTH.SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);

    // Update passwordChangedAt if not a new user
    if (!this.isNew) {
      this.passwordChangedAt = new Date(Date.now() - 1000); // -1s ensures token is created after password change
    }

    next();
  } catch (error: Error) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Query middleware to filter out inactive users
UserSchema.pre(/^find/, function (this: mongoose.Query<any, IUser>, next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

export default mongoose.model<IUser>("User", UserSchema);
