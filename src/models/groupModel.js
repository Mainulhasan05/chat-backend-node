const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");

const Group = sequelize.define(
  "Group",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
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

Group.belongsTo(User, { as: "creator", foreignKey: "created_by" });

module.exports = Group;
