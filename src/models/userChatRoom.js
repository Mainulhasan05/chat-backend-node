const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const ChatRoom = require('./chaRoom');

const UserChatRoom = sequelize.define('UserChatRoom', {}, {
    timestamps: false
});

User.belongsToMany(ChatRoom, { through: UserChatRoom });
ChatRoom.belongsToMany(User, { through: UserChatRoom });

module.exports = UserChatRoom;
