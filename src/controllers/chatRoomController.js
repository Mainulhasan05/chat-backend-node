const bcrypt = require("bcrypt");
const ChatRoom = require("../models/chatRoomModel");
const UserChatRoom = require("../models/userChatRoom");
const sendResponse = require("../utils/sendResponse");

exports.createRoom = async (req, res) => {
  const { name, password } = req.body;
  const userId = req.user.id;

  try {
    // Check if the chat room already exists
    const existingRoom = await ChatRoom.findOne({ where: { name } });

    if (existingRoom) {
      return sendResponse(res, 400, false, "Chat room already exists", null);
    }

    // Hash the password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Create the chat room
    const chatRoom = await ChatRoom.create({
      name,
      password: hashedPassword,
      ownerId: userId,
    });

    // Associate the user with the new chat room
    await UserChatRoom.create({ userId, chatRoomId: chatRoom.id });

    sendResponse(res, 201, true, "Chat room created successfully", chatRoom);
  } catch (err) {
    sendResponse(res, 400, false, err.message, null);
  }
};

exports.joinOrCreateRoom = async (req, res) => {
  const { name, password } = req.body;
  const userId = req.user.id;

  try {
    // Attempt to find an existing chat room
    let chatRoom = await ChatRoom.findOne({ where: { name } });

    if (!chatRoom) {
      // If the chat room doesn't exist, create a new one
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      chatRoom = await ChatRoom.create({
        name,
        password: hashedPassword,
        ownerId: userId, // Set the ownerId for the new chat room
      });

      // Associate the user with the new chat room
      await UserChatRoom.create({ UserId: userId, ChatRoomId: chatRoom.id });

      return sendResponse(res, 201, true, "Chat room created", chatRoom);
    } else {
      // If the chat room exists, check the password
      if (chatRoom.password) {
        const validPassword = await bcrypt.compare(password, chatRoom.password);
        if (!validPassword) {
          return sendResponse(res, 400, false, "Invalid password", null);
        }
      }

      // Check if the user is already associated with the chat room

      const userChatRoom = await UserChatRoom.findOne({
        where: { UserId: userId, ChatRoomId: chatRoom.id },
      });

      if (!userChatRoom) {
        // If not, associate the user with the existing chat room
        console.log(userId, "going to associate", chatRoom.id);
        await UserChatRoom.create({ UserId: userId, ChatRoomId: chatRoom.id });
      }

      return sendResponse(
        res,
        200,
        true,
        "Successfully joined chat room",
        chatRoom
      );
    }
  } catch (err) {
    sendResponse(res, 400, false, err.message, null);
  }
};
