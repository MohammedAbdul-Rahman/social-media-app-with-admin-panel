const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("🟢 Login request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("⚠️ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log("📨 Looking for user with email:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("🔐 Invalid credentials for user:", user.username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, isApproved: user.isApproved,},
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log("✅ Login successful for user:", user.username);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("❌ Server error during login:", err);
    res.status(500).json({ message: "Login failed" });
  }
};