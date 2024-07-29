const User = require("../userModel");
const Message = require("../messageModel");
Message.hasOne(User, { foreignKey: "userId", as: "user" });
// User.hasMany(Message, { foreignKey: "userId", as: "message" });
