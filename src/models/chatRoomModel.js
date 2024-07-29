const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");

const ChatRoom = sequelize.define(
  "ChatRoom",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ChatRoom;
