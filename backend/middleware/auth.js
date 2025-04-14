import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config(); // ensure dotenv is initialized

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error("❌ SECRET environment variable is not set");
}

// 🔐 Middleware to protect routes (requires a valid token)
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
      code: "NO_TOKEN"
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Invalid token:", error.message);
    console.error("🚨 Token received:", token);

    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token",
      code: "INVALID_TOKEN"
    });
  }
};

// 🟡 Middleware to optionally allow token-based users (or default to guest)
export const protectOptional = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
  } catch (error) {
    req.user = null;
  }

  next();
};
