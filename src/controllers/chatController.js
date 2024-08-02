// controllers/chatController.js
const { Op, fn, col } = require("sequelize"); // Import sequelize functions
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const GroupMessage = require("../models/groupMessageModel");
const Group = require("../models/groupModel");
const GroupMember = require("../models/groupMemberModel");
const sendResponse = require("../utils/sendResponse");

exports.getUserChats = async (req, res) => {
  const { id: userId } = req.user;

  try {
    // Get private chats
    const privateChats = await Message.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { recipient_id: userId }],
      },
      attributes: [
        [fn("MAX", col("createdAt")), "lastMessageTime"],
        "sender_id",
        "recipient_id",
      ],
      group: ["sender_id", "recipient_id"],
    });

    // Keep track of unique user IDs
    const uniqueUserIds = new Set();

    // Retrieve the last message details for each private chat
    const privateChatDetails = await Promise.all(
      privateChats.map(async (chat) => {
        const otherUserId =
          chat.sender_id === userId ? chat.recipient_id : chat.sender_id;

        if (uniqueUserIds.has(otherUserId)) {
          return null;
        }

        uniqueUserIds.add(otherUserId);

        // Fetch last message based on timestamp
        const lastMessage = await Message.findOne({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  { sender_id: userId, recipient_id: otherUserId },
                  { sender_id: otherUserId, recipient_id: userId },
                ],
              },
            ],
          },
          include: [
            { model: User, as: "sender" },
            { model: User, as: "recipient" },
          ],
        });

        const otherUser = await User.findByPk(otherUserId);
        return {
          user: otherUser,
          lastMessage,
        };
      })
    );

    // Filter out null values
    const filteredPrivateChatDetails = privateChatDetails.filter(
      (chat) => chat !== null
    );

    // Get group memberships
    const groupMemberships = await GroupMember.findAll({
      where: { user_id: userId },
      include: [{ model: Group }],
    });

    // Retrieve the last message details for each group chat
    const groupChats = await Promise.all(
      groupMemberships.map(async (membership) => {
        const group = membership.group;
        const lastGroupMessage = await GroupMessage.findOne({
          where: { group_id: group.id },
        });

        return {
          group,
          lastMessage: lastGroupMessage,
        };
      })
    );

    return sendResponse(res, 200, true, "Chats retrieved successfully", {
      privateChats: filteredPrivateChatDetails,
      groupChats,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};
