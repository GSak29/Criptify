import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, "SECRET_KEY", { expiresIn: "7d" });

    res.status(201).json({ message: "User created", token, username: newUser.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, "SECRET_KEY", { expiresIn: "7d" });

    res.json({ message: "Login successful", token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Current user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
