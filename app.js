// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./backend/config/db.js";
import userRoutes from "./backend/routes/user.route.js";
import taleRoutes from "./backend/routes/tale.route.js";
import { logoutUser } from "./backend/controllers/auth.controller.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌐 Middleware
app.use(express.json());
app.use(cors({
  origin: true, // allow all in dev, restrict in prod
  credentials: true
}));

// 🚀 Serve frontend build
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

// 📡 API routes
app.use("/api/tales", taleRoutes);
app.use("/api/users", userRoutes);
app.post("/api/logout", logoutUser);

// 🎯 Catch-all for SPA routes (must come AFTER API routes!)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 🧠 Connect DB and start server
app.listen(PORT, () => {
  connectDB(); // Comment this out if you’re not using a DB yet
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
