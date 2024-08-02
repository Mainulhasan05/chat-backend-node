const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const Group = require("./groupModel");

const GroupMessage = sequelize.define(
  "GroupMessage",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Group,
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

GroupMessage.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
GroupMessage.belongsTo(Group, { foreignKey: "group_id" });

module.exports = GroupMessage;
