const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const ChatRoom = require("./chatRoomModel");

const Message = sequelize.define(
  "Message",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    chatRoomId: {
      type: DataTypes.INTEGER,
      references: {
        model: ChatRoom,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Associations
Message.belongsTo(User, { foreignKey: "userId" });
Message.belongsTo(ChatRoom, { foreignKey: "chatRoomId" });

module.exports = Message;
