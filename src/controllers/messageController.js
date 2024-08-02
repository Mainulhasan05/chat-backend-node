// controllers/messageController.js
const Message = require("../models/messageModel");
const { Op } = require("sequelize");
const sendResponse = require("../utils/sendResponse");

exports.sendPrivateMessage = async (req, res) => {
  const { content, image, file, recipient_id } = req.body;
  const { id: sender_id } = req.user;

  try {
    const message = await Message.create({
      content,
      image,
      file,
      sender_id,
      recipient_id,
    });

    return sendResponse(res, 201, true, "Message sent successfully", message);
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

exports.getPrivateMessages = async (req, res) => {
  const { recipient_id } = req.params;
  const { id: userId } = req.user;
  const { page = 1, limit = 40, search = "" } = req.query;

  const offset = (page - 1) * limit;

  try {
    const whereClause = {
      [Op.or]: [
        { sender_id: userId, recipient_id },
        { sender_id: recipient_id, recipient_id: userId },
      ],
    };

    if (search) {
      whereClause.content = { [Op.like]: `%${search}%` };
    }

    const messages = await Message.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "ASC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    const totalPages = Math.ceil(messages.count / limit);

    return sendResponse(res, 200, true, "Messages retrieved successfully", {
      messages: messages.rows,
      currentPage: parseInt(page, 10),
      totalPages,
      totalMessages: messages.count,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

exports.getGroupMessages = async (req, res) => {
  const { group_id } = req.params;

  try {
    const messages = await GroupMessage.findAll({
      where: { group_id },
      order: [["createdAt", "ASC"]],
    });

    return sendResponse(
      res,
      200,
      true,
      "Group messages retrieved successfully",
      messages
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

const GroupMessage = require("../models/groupMessageModel");

exports.sendGroupMessage = async (req, res) => {
  const { content, image, file, group_id } = req.body;
  const { id: sender_id } = req.user;

  try {
    const message = await GroupMessage.create({
      content,
      image,
      file,
      sender_id,
      group_id,
    });

    return sendResponse(
      res,
      201,
      true,
      "Group message sent successfully",
      message
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};
