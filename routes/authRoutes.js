import express from "express";

import {
  signup,
  login,
  getProfile,
  logout,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);

router.post("/login", login);

// Protected Route
router.get("/profile", protect, getProfile);

// Logout
router.post("/logout", logout);

export default router;