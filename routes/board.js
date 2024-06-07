const express = require('express');
const Board = require('../models/board');

const router = express.Router();

// 푸켓 위치
router.route('/')
    .get(async (req, res, next) => {
        try {
            const boards = await Board.findAll({
                // where: { refrigeratorId: req.params.refrigeratorId }
            });

            res.render('board', {
                title: require('../package.json').name,
                port: process.env.PORT,
                user: req.user,
                boards: boards.map(v => v),
            });
            // const products = await Product.findAll({
            //     where: { refrigeratorId: req.params.refrigeratorId }
            // });
    
            // res.render('product', {
            //     products: products.map(v => v),
            //     title: require('../package.json').name,
            //     name: req.user.name,
            //     port: process.env.PORT,
            //     refrigeratorId: req.params.refrigeratorId
            // });
        } catch (err) {
            console.error(err);
            next(err);
        }
        
    })

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