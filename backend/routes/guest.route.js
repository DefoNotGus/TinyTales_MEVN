import express from 'express';
import { guestLogin } from '../controllers/guest.controller.js';

const router = express.Router();

router.post('/login', guestLogin);

export default router;
