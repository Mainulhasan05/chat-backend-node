const Message = require("../models/messageModel");
const ChatRoom = require("../models/chatRoomModel");
const User = require("../models/userModel");
const sendResponse = require("../utils/sendResponse");

exports.sendMessage = async (req, res) => {
  const { chatRoomId, content } = req.body;
  const { id: userId } = req.id;

  try {
    const message = await Message.create({ userId, content });
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
    const { id: userId } = req.id;

    const user = await User.findOne({ where: { id: userId } });

    let sortQuery = [];
    sortQuery.push(["createdAt", "DESC"]);
    const messages = await Message.findAll({
      where: { chatRoomId },
      limit: limit,
      order: sortQuery,
      include: {
        model: User,
        as: "user",
        foreignKey: "id",
      },
    });

    sendResponse(res, 200, true, "Messages Retrive Successfully", {
      messages,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};
