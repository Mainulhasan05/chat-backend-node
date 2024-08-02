// fetching last message and time queries
const getUserChats = async (userId) => {
  // Get private chats
  const privateChats = await Message.findAll({
    where: {
      [Op.or]: [{ sender_id: userId }, { recipient_id: userId }],
    },
    include: [
      { model: User, as: "sender" },
      { model: User, as: "recipient" },
    ],
    order: [["createdAt", "DESC"]],
    limit: 1,
  });

  // Get group chats
  const groupChats = await GroupMessage.findAll({
    include: [{ model: Group }, { model: User, as: "sender" }],
    order: [["createdAt", "DESC"]],
    limit: 1,
  });

  return { privateChats, groupChats };
};
