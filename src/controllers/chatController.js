const Message = require("../models/messageModel");
const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModel");
const sendResponse = require("../utils/sendResponse");

exports.sendMessage = async (req, res) => {
  const { chatRoomId, content } = req.body;
  const userId = req.user.id;

  try {
    const message = await Message.create({ userId, content, chatRoomId });
    res.send(message);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getMessages = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit || 40);

  const { chatRoomId = 1 } = req.params;

  try {
    const userId = req.user.id;

    const user = await User.findOne({ where: { id: userId } });

    const sortQuery = [["createdAt", "DESC"]];

    const messages = await Message.findAll({
      where: { chatRoomId },
      limit: limit,
      offset: (page - 1) * limit,
      order: sortQuery,
      include: {
        model: User,
        attributes: ["id", "username"], // Specify which user attributes you want to include
      },
    });

    sendResponse(res, 200, true, "Messages Retrieved Successfully", {
      messages,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};
