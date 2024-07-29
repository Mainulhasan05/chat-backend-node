const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const ChatRoom = require("../models/chatRoomModel");
const sendResponse = require("../utils/sendResponse");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input lengths
  if (username.length < 2) {
    return res
      .status(400)
      .json({ error: "Username must be at least 2 characters long" });
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
        return sendResponse(res, 400, false, "Invalid password", null);
      }
    } else {
      // User does not exist, create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({ username, password: hashedPassword });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, "your_jwt_secret_key");
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
