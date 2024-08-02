// routes/messageRoutes.js
const express = require("express");
const {
  sendPrivateMessage,
  sendGroupMessage,
  getPrivateMessages,
  getGroupMessages,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/private", protect, sendPrivateMessage);
router.post("/group", protect, sendGroupMessage);
router.get("/private/:recipient_id", protect, getPrivateMessages);
router.get("/group/:group_id", protect, getGroupMessages);

module.exports = router;
