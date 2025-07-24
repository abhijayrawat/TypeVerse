import express from "express";
import TestResult from "../models/TestResult.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Save a test result
router.post("/", auth, async (req, res) => {
  const { wpm, accuracy, time } = req.body;
  if (!wpm || !accuracy || !time) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const result = await TestResult.create({
      user: req.user.id,
      wpm,
      accuracy,
      time,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get test history for user
router.get("/", auth, async (req, res) => {
  try {
    const history = await TestResult.find({ user: req.user.id }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;