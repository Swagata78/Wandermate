
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ====================== REGISTER ======================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phone,
      country,
      dob,
      gender,
      travelStyle,
      bio,
    } = req.body;

    // check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      country,
      dob,
      gender,
      travelStyle,
      bio,
    });

    await newUser.save();

    res.status(201).json({ message: "🎉 Registration successful" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ====================== LOGIN ======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // return user info (you could also add JWT token here for sessions)
    res.status(200).json({
      message: "✅ Login successful",
      name: user.name,
      username: user.username,
      email: user.email,
      country: user.country,
      travelStyle: user.travelStyle,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
