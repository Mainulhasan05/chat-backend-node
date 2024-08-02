// routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  getUserProfile,
} = require("../controllers/authController");

const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getUserProfile);

module.exports = router;
