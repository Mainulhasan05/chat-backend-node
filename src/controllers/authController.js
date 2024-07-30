const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/userModel");
const ChatRoom = require("../models/chatRoomModel");
const UserChatRoom = require("../models/userChatRoom");
const sendResponse = require("../utils/sendResponse");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username.length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters long" });
  }
  if (password.length < 5) {
    return res
      .status(400)
      .json({ error: "Password must be at least 5 characters long" });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ where: { username } });

    if (user) {
      // User exists, validate password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Password doesn't match" });
      }
    } else {
      // User does not exist, create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ username, password: hashedPassword });
    }

    // Search for the public_chat room
    const publicChatRoom = await ChatRoom.findOne({
      where: { name: "public_room" },
    });

    if (publicChatRoom) {
      // Check if the user is already associated with the public_chat room
      const userChatRoom = await UserChatRoom.findOne({
        where: { UserId: user.id, ChatRoomId: publicChatRoom.id },
      });

      if (!userChatRoom) {
        // If the user is not associated, create the association
        await UserChatRoom.create({
          UserId: user.id,
          ChatRoomId: publicChatRoom.id,
        });
      }
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
    sendResponse(res, 200, true, "User authenticated successfully", {
      user,
      token,
    });
  } catch (err) {
    sendResponse(res, 400, false, err.message, null);
  }
};

exports.getUserChatRooms = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      include: {
        model: ChatRoom,
        through: {
          attributes: [],
        },
      },
    });

    if (!user) {
      return sendResponse(res, 404, false, "User not found", null);
    }

    sendResponse(
      res,
      200,
      true,
      "User's chat rooms fetched successfully",
      user.ChatRooms
    );
  } catch (err) {
    sendResponse(res, 400, false, err.message, null);
  }
};
