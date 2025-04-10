// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // Import the User model

const SECRET = process.env.SECRET; // Use environment variable for the secret key

if (!SECRET) {
  throw new Error("SECRET environment variable is not set");
}

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // attaches user info to request
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
