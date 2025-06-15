const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verifyToken = require("../middleware/authMiddleware");


router.get("/unapproved", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const users = await User.find({ isApproved: false }).select("-password");
    res.status(200).json({ users });
  } catch (err) {
    console.error("❌ Failed to fetch users:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


router.put("/approve/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User approved", user: updatedUser });
  } catch (err) {
    console.error("❌ Approval failed:", err.message);
    res.status(500).json({ message: "Approval failed" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json({ user, posts });
  } catch (err) {
    console.error("❌ Error fetching profile:", err.message);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

module.exports = router;
