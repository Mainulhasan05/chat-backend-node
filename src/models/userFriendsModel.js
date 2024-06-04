const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const UserFriends = sequelize.define('UserFriends', {}, {
    timestamps: false
});

User.belongsToMany(User, { through: UserFriends, as: 'Friends', foreignKey: 'userId' });
User.belongsToMany(User, { through: UserFriends, as: 'UserFriends', foreignKey: 'friendId' });

module.exports = UserFriends;
