import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load from .env

const SECRET = process.env.SECRET;

if (!SECRET) {
  throw new Error("SECRET environment variable is not set");
}

export const guestLogin = (req, res) => {
  const guestPayload = {
    role: "guest",
    sessionId: Math.random().toString(36).substring(2),
  };

  const token = jwt.sign(guestPayload, SECRET, { expiresIn: "2h" });

  res.json({ token });
};
