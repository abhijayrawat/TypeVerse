import express from "express";
import TestResult from "../models/TestResult.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Aggregation pipeline to get top 20 scores with user info
    const topResults = await TestResult.aggregate([
      { $sort: { wpm: -1, accuracy: -1, date: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users", // MongoDB collection name (check your users collection)
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          wpm: 1,
          accuracy: 1,
          time: 1,
          date: 1,
          username: "$userInfo.username",
        },
      },
    ]);

    res.json(topResults);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Server error fetching leaderboard" });
  }
});

export default router;
