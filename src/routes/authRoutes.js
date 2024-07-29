const express = require("express");
const { login, getUserChatRooms } = require("../controllers/authController");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");

router.post("/login", login);
router.get("/chat-rooms", authenticate, getUserChatRooms);

module.exports = router;
