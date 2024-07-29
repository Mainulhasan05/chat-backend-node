const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const ChatRoom = require("./chatRoomModel");

const UserChatRoom = sequelize.define(
  "UserChatRoom",
  {
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
    // chatRoomId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: ChatRoom,
    //     key: "id",
    //   },
    // },
  },
  {
    timestamps: false,
  }
);

User.belongsToMany(ChatRoom, { through: UserChatRoom });
ChatRoom.belongsToMany(User, { through: UserChatRoom });

module.exports = UserChatRoom;
