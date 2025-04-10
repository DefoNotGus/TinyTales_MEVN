// backend/routes/tale.route.js
import express from "express";
import { addComment, getCommentsForTale, likeTale } from '../controllers/tale.controller.js';


import { createTale, deleteTale, getTales, updateTale } from "../controllers/tale.controller.js";

const router = express.Router();

router.get("/", getTales);
router.post("/", createTale);
router.put("/:id", updateTale);
router.delete("/:id", deleteTale);
router.patch('/:id/like', likeTale);
router.post('/:taleId/comments', addComment);
router.get('/:taleId/comments', getCommentsForTale);



export default router;