const Message = require('../models/messageModel');
const ChatRoom = require('../models/chatRoom');

exports.sendMessage = async (req, res) => {
    const { chatRoomId, content } = req.body;
    const { id: userId } = req.user;

    try {
        const message = await Message.create({ userId, chatRoomId, content });
        res.send(message);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getMessages = async (req, res) => {
    const { chatRoomId } = req.params;

    try {
        const messages = await Message.findAll({ where: { chatRoomId } });
        res.send(messages);
    } catch (err) {
        res.status(400).send(err);
    }
};
