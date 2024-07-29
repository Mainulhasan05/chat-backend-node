const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.authenticate = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
