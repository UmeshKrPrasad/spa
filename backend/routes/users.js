// backend/routes/users.js
const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  const { name, email, phone } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email or phone number already exists." });
    }

    // Proceed with creating a new user
    const newUser = new User({ name, email, phone, image });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user && user.image) {
      fs.unlinkSync(user.image);
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, image } = req.body;

  try {
    // Check for duplicate email or phone number
    const existingUser = await User.findOne({ $or: [{ email }, { phone }], _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email or phone number already exists." });
    }

    // Proceed with updating the user
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, phone, image }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
