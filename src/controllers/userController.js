const sendResponse = require("../utils/sendResponse");
const User = require("../models/userModel");

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    sendResponse(res, 200, true, "All users", users);
  } catch (err) {
    sendResponse(res, 400, false, err.message, null);
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.id });
    if (!user) {
      return sendResponse(res, 500, false, "You must login");
    }
    sendResponse(res, 200, true, "User Fetched Successfully", user);
  } catch (err) {}
};
