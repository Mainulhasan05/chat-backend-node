const express = require("express");
const { sendMessage, getMessages } = require("../controllers/chatController");
const { authenticate } = require("../middlewares/authMiddleware");
const router = express.Router();
// const configureMulter = require("../utils/multerConfig");
// const uploads = configureMulter("/uploads");

router.post("/send", authenticate, sendMessage);
router.get("/get-messages/:chatRoomId", authenticate, getMessages);

module.exports = router;
