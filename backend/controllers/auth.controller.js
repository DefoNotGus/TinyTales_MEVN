// backend/controllers/auth.controller.js
import User from "../../backend/models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import { protect } from "../../backend/middleware/auth.js"; // Import the protect middleware
// Ensure the environment variable is loaded

const SECRET = process.env.SECRET; // Use environment variable for the secret key

if (!SECRET) {
  throw new Error("SECRET environment variable is not set");
}

// Remove or clarify the purpose of this file if not used.
// If needed, ensure it does not conflict with user.controller.js.

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id, username: user.username }, SECRET, {
      expiresIn: "1h"
    });

    console.log("Generated Token:", token); // Log the token for debugging

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Example: Clear a session or token (if applicable)
    res.clearCookie("token"); // Replace "token" with the actual cookie name if applicable

    console.log("Logout function invoked"); // Log to confirm the function is called

    // Respond to the client
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
