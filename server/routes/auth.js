import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Update path if necessary

const router = express.Router();

// We do NOT fetch JWT_SECRET here globally.
// Instead, fetch it inside route handlers after dotenv has loaded.

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid credentials" });

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error("JWT_SECRET not set in environment");
      return res.status(500).json({ message: "Server config error" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
