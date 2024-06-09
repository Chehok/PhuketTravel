const express = require('express');
const User = require('../models/user');
const Board = require('../models/board');
const Comment = require('../models/comment');
const bcrypt = require('bcrypt')
const { isLoggedIn } = require('./helpers');


const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const boards = await Board.findAll();
            res.render('board', {
                title: require('../package.json').name,
                port: process.env.PORT,
                boards: boards.map(v => ({
                    boardId: v.dataValues.boardId,
                    title: v.dataValues.title,
                    createdAt:
                        `${v.dataValues.createdAt.getFullYear()}-` +
                        ((v.dataValues.createdAt.getMonth() + 1).toString().length == 1 ? `0${(v.dataValues.createdAt.getMonth() + 1)}-` : `${(v.dataValues.createdAt.getMonth() + 1)}-`) +
                        (v.dataValues.createdAt.getDate().toString().length == 1 ? `0${(v.dataValues.createdAt.getDate())}` : `${(v.dataValues.createdAt.getDate())}`)
                })),
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    })

router.route('/post')
    .get(isLoggedIn, (req, res, next) => {
        res.render('postBoard', {
            title: require('../package.json').name,
            port: process.env.PORT,

        });
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const {
                title,
                main
            } = req.body;

            await Board.create({
                title,
                main
            })

            res.redirect('/menu/board')
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

router.route('/:boardId')
    .get(async (req, res, next) => {
        try {
            const board = await Board.findOne({
                where: { boardId: req.params.boardId }
            });

            if (board) {
                const comments = await Comment.findAll({
                    where: { boardId: board.boardId },
                    include: {
                        model: User
                    }
                })

                res.render('boardDetail', {
                    title: require('../package.json').name,
                    port: process.env.PORT,
                    board,
                    // comments
                    comments: comments.map(v => ({
                        userId: v.dataValues.userId,
                        name: v.User ? v.User.dataValues.name : "",
                        guestId: v.dataValues.guestId,
                        comment: v.dataValues.comment,
                        createdAt: `${v.dataValues.createdAt.getFullYear()}-` +
                            ((v.dataValues.createdAt.getMonth() + 1).toString().length == 1 ? `0${(v.dataValues.createdAt.getMonth() + 1)}-` : `${(v.dataValues.createdAt.getMonth() + 1)}-`) +
                            (v.dataValues.createdAt.getDate().toString().length == 1 ? `0${(v.dataValues.createdAt.getDate())}` : `${(v.dataValues.createdAt.getDate())}`)
                    }))
                });
            }
            else {
                next('없는 게시글입니다!');
            }
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const result = await Board.destroy({
                where: { boardId: req.params.boardId }
            })

            if (result)
                res.redirect('/menu/board')
            else
                next('없는 게시글입니다!');
        } catch (err) {
            console.error(err);
            next(err);
        }
    })

router.route('/update/:boardId')
    .get(isLoggedIn, async (req, res, next) => {
        try {
            const board = await Board.findOne({
                where: { boardId: req.params.boardId }
            });

            res.render('updateBoard', {
                title: require('../package.json').name,
                port: process.env.PORT,
                boardId: board.boardId,
                title: board.title,
                main: board.main
            });
        } catch (err) {
            next(err);
        }
    })
    .post(isLoggedIn, async (req, res, next) => {
        try {
            const {
                boardId,
                title,
                main
            } = req.body;

            console.log(req.body);

            await Board.update({
                title,
                main
            },{
                where: {boardId}
            })

            res.redirect('/menu/board')
        } catch (err) {
            console.error(err);
            next(err);
        }
    });


router.route('/comment/:boardId')
    .post(async (req, res, next) => {
        try {
            const {
                guestId,
                password,
                comment
            } = req.body;

            if (req.user) {
                await Comment.create({
                    userId: req.user.dataValues.userId,
                    comment,
                    boardId: req.body.boardId
                })
            } else {
                const hash = await bcrypt.hash(password, 12);

                await Comment.create({
                    guestId,
                    password: hash,
                    comment,
                    boardId: req.body.boardId
                })
            }

            res.redirect(`/menu/board/${req.body.boardId}`)
        } catch (err) {
            console.error(err);
            next(err);
        }
    })

module.exports = router;