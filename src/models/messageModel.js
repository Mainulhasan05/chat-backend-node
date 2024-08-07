const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./userModel");

const Message = sequelize.define(
  "Message",
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
    recipient_id: {
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

Message.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
Message.belongsTo(User, { as: "recipient", foreignKey: "recipient_id" });

module.exports = Message;
