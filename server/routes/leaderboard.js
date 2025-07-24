import express from "express";
import TestResult from "../models/TestResult.js";

const router = express.Router();

/**
 * GET /api/leaderboard
 * Query params:
 * - mode (optional): "time" | "words"
 * 
 * Returns top 20 test results sorted by wpm, accuracy, and date,
 * filtered by mode if provided.
 */
router.get("/", async (req, res) => {
  try {
    const modeFilter = req.query.mode;
    const matchStage = {};
    
    // Apply mode filtering if valid mode is provided
    if (modeFilter === "time" || modeFilter === "words") {
      matchStage.mode = modeFilter;
    }

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },        // Filter by mode if set
      { $sort: { wpm: -1, accuracy: -1, date: -1 } },  // Sort by wpm desc, then accuracy desc, then recent date
      { $limit: 20 },                // Top 20 results
      {
        $lookup: {
          from: "users",             // Related users collection name
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },      // Unwind user info array
      {
        $project: {
          wpm: 1,
          accuracy: 1,
          time: 1,
          date: 1,
          username: "$userInfo.username",
        },
      },
    ];

    const topResults = await TestResult.aggregate(pipeline);

    res.json(topResults);
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Server error fetching leaderboard" });
  }
});

export default router;
