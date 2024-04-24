const Sequelize = require('sequelize');
const Tourist = require('./tourist');
const User = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // 설정 로딩
const db = {};

// DB와 연결
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Tourist = Tourist;
db.User = User;

// init으로 sequelize와 연결
Tourist.init(sequelize);
User.init(sequelize);

// associate로 관계 설정.
Tourist.associate(db);
User.associate(db);

module.exports = db;