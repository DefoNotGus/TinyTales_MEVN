// intro.route.js
import express from 'express';
import { submitRating, getAverageRating, deleteAllRatings } from '../controllers/intro.controller.js';

const router = express.Router();

router.post('/intro', submitRating);
router.get('/intro/average', getAverageRating);
router.delete('/intro', deleteAllRatings);

export default router;