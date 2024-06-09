const express = require('express');

const router = express.Router();

// 푸켓 위치
router.route('/phuketLocation')
    .get((req, res, next) => {
        res.render('phuketLocation', {
            title: require('../package.json').name,
            port: process.env.PORT,
        });
    })

// 항공편
router.route('/transInfo')
    .get((req, res, next) => {
        res.render('transInfo', {
            title: require('../package.json').name,
            port: process.env.PORT,
        });
    })

// 숙소
router.route('/accomodation')
    .get((req, res, next) => {
        res.render('accomodation', {
            title: require('../package.json').name,
            port: process.env.PORT,
        });
    })

// 관광지
router.route('/tourist')
    .get((req, res, next) => {
        res.render('tourist', {
            title: require('../package.json').name,
            port: process.env.PORT, 
        });
    })

// 음식
router.route('/food')
    .get((req, res, next) => {
        res.render('food', {
            title: require('../package.json').name,
            port: process.env.PORT,
        });
    })

// 준비사항
router.route('/preparation')
    .get((req, res, next) => {
        res.render('preparation', {
            title: require('../package.json').name,
            port: process.env.PORT,
        });
    })

module.exports = router;