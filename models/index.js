const Sequelize = require('sequelize');
const Board = require('./board');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // 설정 로딩
const db = {};

// DB와 연결
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Board = Board;
db.Comment = Comment;

// init으로 sequelize와 연결
User.init(sequelize);
Board.init(sequelize);
Comment.init(sequelize);

// associate로 관계 설정.
User.associate(db);
Board.associate(db);
Comment.associate(db);

module.exports = db;