const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/messages', authMiddleware, sendMessage);
router.get('/messages/:chatRoomId', authMiddleware, getMessages);

module.exports = router;
