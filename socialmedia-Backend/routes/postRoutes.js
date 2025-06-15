const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");
const Post = require("../models/Post");
const User = require("../models/User");

router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const { caption } = req.body;

      if (!req.user.isApproved) {
        return res.status(403).json({
          message: "You are not approved by admin to create posts.",
        });
      }
 
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }

      const newPost = new Post({
        caption,
        image: req.file.filename,
        owner: req.user.id,
        isApproved: req.user.role === "admin" ? true : false,
      });

      await newPost.save();

      res.status(201).json({
        message: "Post created successfully and is pending approval.",
        post: newPost,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create post" });
    }
  }
);

module.exports = router;

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({ isApproved: true })
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

router.put("/approve/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post approved", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isOwner = post.owner.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});


router.get("/unapproved", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const posts = await Post.find({ isApproved: false }).populate("owner", "username");
    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error fetching unapproved posts:", err);
    res.status(500).json({ message: "Server error" });
  }
});
