import express from "express";
import Password from "../models/Password.js";

const router = express.Router();

// Get all passwords for a user
router.get("/:userId", async (req, res) => {
  try {
    const passwords = await Password.find({ userId: req.params.userId });
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new password
router.post("/", async (req, res) => {
  try {
    const newPassword = new Password(req.body);
    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a password
router.put("/:id", async (req, res) => {
  try {
    const updatedPassword = await Password.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPassword);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a password
router.delete("/:id", async (req, res) => {
  try {
    await Password.findByIdAndDelete(req.params.id);
    res.json({ message: "Password deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
