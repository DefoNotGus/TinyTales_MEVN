import express from "express";
import {
  addComment,
  getCommentsForTale,
  likeTale,
  createTale,
  deleteTale,
  getTaleById,
  getTales,
  deleteComment,
  updateTale,
  addRoseRating,
  removeRoseRating,
  getRoseRatings,
  getGuestCommentsForTale,
  addGuestComment,
  deleteGuestComment,
  claimGuestComments
} from "../controllers/tale.controller.js";

import { protect, protectOptional } from "../middleware/auth.js";
import rateLimit from 'express-rate-limit';

const router = express.Router();

// 🔐 Rate limiter for tale creation — 3 per 15 minutes per IP
const taleSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // max submissions per window
  message: {
    success: false,
    message: "⏳ You’ve reached the submission limit. Please wait a bit.",
  },
});

// Guests and users can fetch public tales
router.get("/", protectOptional, getTales);

// 🔐 Apply limiter ONLY to tale creation
router.post("/", taleSubmissionLimiter, protectOptional, createTale);

// Authenticated users only for protected actions
router.put("/:id", protect, updateTale);
router.delete("/:id", protect, deleteTale);

// Like/Cheer feature
router.patch('/:id/like', protect, likeTale);

// Comments
router.post('/:taleId/comments', protect, addComment); // Guests handled separately
router.get('/:taleId/comments', protectOptional, getCommentsForTale);
router.delete('/:taleId/comments/:commentId', protect, deleteComment);

// 🌹 Rose rating system
router.post('/:id/rose', protect, addRoseRating);
router.delete('/:id/rose', protect, removeRoseRating);
router.get('/:id/rose', protectOptional, getRoseRatings);

// Guest Comments
router.post('/:taleId/guestcomments', addGuestComment);
router.get('/:taleId/guestcomments', getGuestCommentsForTale);
router.delete('/:taleId/guestcomments/:commentId', deleteGuestComment);

// Claiming via ClaimerBox
router.patch('/:id/claimguestcomments', protect, claimGuestComments);

// Get single tale
router.get("/:id", getTaleById);

export default router;
