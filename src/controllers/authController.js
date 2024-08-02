// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const sendResponse = require("../utils/sendResponse");

exports.register = async (req, res) => {
  const { full_name, phone, password, avatar } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return sendResponse(res, 400, false, "User already exists", null);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a unique room ID for the user
    const room_id = `room_${phone}`;

    // Create a new user
    const newUser = await User.create({
      full_name,
      phone,
      password: hashedPassword,
      avatar,
      room_id,
    });

    // Create a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "990d",
    });

    return sendResponse(res, 201, true, "User registered successfully", {
      token,
      user: newUser,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return sendResponse(res, 400, false, "Invalid phone or password", null);
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 400, false, "Invalid phone or password", null);
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "990d",
    });

    return sendResponse(res, 200, true, "Login successful", { token, user });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};

exports.getUserProfile = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findByPk(userId);
    return sendResponse(res, 200, true, "User profile retrieved successfully", {
      user,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message, null);
  }
};
