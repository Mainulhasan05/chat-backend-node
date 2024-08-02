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
    return sendResponse(res, 500, false, "Internal server error", null);
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
    return sendResponse(res, 500, false, "Internal server error", null);
  }
};
