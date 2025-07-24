import dotenv from "dotenv";
dotenv.config(); // Must be called first, before other imports

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import testsRoutes from "./routes/tests.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Allow frontend URL or open to all in dev
  credentials: true
}));
app.use(express.json());

// Sample test route
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

app.use("/api/auth", authRoutes);
app.use("/api/tests", testsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
console.log("PORT:", PORT);

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables!");
  process.exit(1);
}

// Connect to MongoDB and then start server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
