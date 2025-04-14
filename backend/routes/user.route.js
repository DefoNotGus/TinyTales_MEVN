// backend/routes/user.route.js
import express from "express";
import {
  getUsers,
  updateUser,
  deleteUser,
  signup,
  login,
  getUserProfile,
} from "../controllers/user.controller.js";

import { protect } from "../middleware/auth.js"; // ✅ uncomment and use

const router = express.Router();

router.get("/", protect, getUsers); // Only for admin or secure dashboard?
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, deleteUser);

// Open routes
router.post("/signup", signup);
router.post("/login", login);

// Optional: add route for user profile
router.get("/profile", protect, getUserProfile);

export default router;
