// routes/chatRoutes.js
const express = require("express");
const { getUserChats } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserChats);

module.exports = router;
