// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendResponse = require("../utils/sendResponse");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = await User.findByPk(decoded.id);
      if (!req.user) {
        return sendResponse(res, 401, false, "Not authorized", null);
      }

      next();
    } catch (error) {
      return sendResponse(res, 401, false, "Not authorized", null);
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, "Not authorized, no token", null);
  }
};
