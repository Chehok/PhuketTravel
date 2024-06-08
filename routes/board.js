const express = require('express');
const Board = require('../models/board');
const { isLoggedIn } = require('./helpers');


const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const boards = await Board.findAll();
            res.render('board', {
                title: require('../package.json').name,
                port: process.env.PORT,
                user: req.user,
                boards: boards.map(v => v),
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
            user: req.user,
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

            res.render('boardDetail', {
                title: require('../package.json').name,
                port: process.env.PORT,
                user: req.user,
                board,
            });
        } catch (e) {
            console.error(err);
            next(err);
        }
    })

module.exports = router;