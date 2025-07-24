import express from "express";
import TestResult from "../models/TestResult.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Save a test result
router.post("/", auth, async (req, res) => {
  const { wpm, accuracy, time, wordCount, mode } = req.body;
  if (
    wpm === undefined ||
    accuracy === undefined ||
    time === undefined ||
    wordCount === undefined ||
    !["time", "words"].includes(mode)
  ) {
    return res.status(400).json({ message: "Missing or invalid fields" });
  }
  try {
    const result = await TestResult.create({
      user: req.user.id,
      wpm,
      accuracy,
      time,
      wordCount,
      mode,
      date: new Date(),
    });
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get test history for user, with optional mode filter
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const modeFilter = req.query.mode;
    const filter = { user: userId };

    if (modeFilter === "time" || modeFilter === "words") {
      filter.mode = modeFilter;
    }

    const history = await TestResult.find(filter).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
/**
 * Delete/Clear tests for a user filtered by time frame and/or limit.
 * Body params:
 * - timeFrame: "day" | "week" | "month" | "all"
 * - limit: optional number (e.g., 5 for last N entries)
 */
router.delete("/clear", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeFrame = "all", limit } = req.body;

    const now = new Date();
    let dateFrom;

    // Calculate dateFrom for filtering
    switch (timeFrame) {
      case "day":
        dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        const dayOfWeek = now.getDay();
        dateFrom = new Date(now);
        dateFrom.setDate(now.getDate() - dayOfWeek);
        dateFrom.setHours(0, 0, 0, 0);
        break;
      case "month":
        dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "all":
      default:
        dateFrom = null;
        break;
    }

    // Build filter query
    const filter = { user: userId };
    if (dateFrom) filter.date = { $gte: dateFrom };

    if (limit) {
      // Delete only last `limit` number of tests in the timeframe
      const testsToDelete = await TestResult.find(filter)
        .sort({ date: -1 })
        .limit(limit)
        .select("_id");

      const idsToDelete = testsToDelete.map((t) => t._id);
      await TestResult.deleteMany({ _id: { $in: idsToDelete } });
    } else {
      // Delete all matching tests in the timeframe
      await TestResult.deleteMany(filter);
    }

    res.json({ message: "Tests cleared successfully" });
  } catch (err) {
    console.error("Failed to clear tests:", err);
    res.status(500).json({ message: "Server error clearing tests" });
  }
});

export default router;
