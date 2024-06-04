const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chat_db', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
