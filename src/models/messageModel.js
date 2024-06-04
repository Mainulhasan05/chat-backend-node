const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const ChatRoom = require('./chatRoom');

const Message = sequelize.define('Message', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});

Message.belongsTo(User, { foreignKey: 'userId' });
Message.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });

module.exports = Message;
