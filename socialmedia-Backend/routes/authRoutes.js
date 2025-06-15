const express = require("express");
const { register, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Token verified!",
    user: req.user,
  });
});

module.exports = router;

const upload = require("../middleware/multerConfig");
router.post(
  '/upload',
  verifyToken,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const User = require('../models/User');
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { profilePic: req.file.filename },
        { new: true }
      );

      res.status(200).json({
        message: 'Image uploaded and saved to profile',
        user: {
          username: updatedUser.username,
          email: updatedUser.email,
          profilePic: updatedUser.profilePic
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update user' });
    }
  }
);

