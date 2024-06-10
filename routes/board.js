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
            const boards = await Board.findAll();   // DB 에서 게시글 전부 가져오기 / await 는 DB 에 접근할 때 무조건 사용해야 한다.
            res.render('board', {                   // 'board' => board.html 을 렌더링 한다는 의미
                title: require('../package.json').name,     // 내용물 -> title / port / boards 데이터를 board.html 에 같이 넣어서 보내준다.
                port: process.env.PORT,
                boards: boards.map(v => ({                  // boards = [ { 게시판 번호1, 제목1, 작성일1 }, { 게시판 번호2, 제목2, 작성일2 }, { 게시판 번호3, 제목3, 작성일3 } ] 와 같이 여러개의 게시글이 들어있다.
                    boardId: v.dataValues.boardId,          // boardId = 게시판 번호, title = 제목, createdAt = 작성일
                    title: v.dataValues.title,              // nunjucks 를 이용하여 게시글(boards)의 갯수만큼 게시판 테이블을 그려준다.
                    createdAt:
                        `${v.dataValues.createdAt.getFullYear()}-${v.dataValues.createdAt.getMonth() + 1}-${v.dataValues.createdAt.getDate()}` // yyyy-MM-dd 형식으로 만듬. 어디서 긁어왔는지 기억안나요..
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
                        createdAt:
                            `${v.dataValues.createdAt.getFullYear()}-${v.dataValues.createdAt.getMonth() + 1}-${v.dataValues.createdAt.getDate()}` // yyyy-MM-dd 형식으로 만듬. 어디서 긁어왔는지 기억안나요..
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

            await Board.update({
                title,
                main
            }, {
                where: { boardId }
            })

            res.redirect(`/menu/board/${boardId}`)
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