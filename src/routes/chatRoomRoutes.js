const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { joinOrCreateRoom } = require("../controllers/chatRoomController");

router.post("/join", authenticate, joinOrCreateRoom);

module.exports = router;
