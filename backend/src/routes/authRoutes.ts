import express from "express";
import { signup, login, logout, getMe } from "../controllers/authController";
import { validate, catchAsync } from "../utils/apiUtils";
import { registerValidator, loginValidator } from "../utils/validator";
import protect from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/signup", validate(registerValidator), catchAsync(signup));
router.post("/login", validate(loginValidator), catchAsync(login));
router.post("/logout", catchAsync(logout));

// Protected routes - require authentication
router.use(protect);
router.get("/me", catchAsync(getMe));

export default router;
