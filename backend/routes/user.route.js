// backend/routes/user.route.js
import express from "express";
import { getUsers, updateUser, deleteUser, signup, login, getUserProfile } from "../controllers/user.controller.js";
// import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getUsers);

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

export default router;
