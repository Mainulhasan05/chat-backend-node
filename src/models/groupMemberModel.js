const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");
const Group = require("./groupModel");

const GroupMember = sequelize.define(
  "GroupMember",
  {
    user_id: {
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
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

GroupMember.belongsTo(User, { foreignKey: "user_id" });
GroupMember.belongsTo(Group, { foreignKey: "group_id" });

module.exports = GroupMember;
