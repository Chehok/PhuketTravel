const express = require('express');

const router = express.Router();

// 푸켓 위치
router.route('/phuketLocation')
    .get((_, res) => {
        res.render('phuketLocation', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })

// 항공편
router.route('/transInfo')
    .get((_, res) => {
        res.render('transInfo', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })

// 숙소
router.route('/accomodation')
    .get((_, res) => {
        res.render('accomodation', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })

// 관광지
router.route('/tourist')
    .get((_, res) => {
        res.render('transInfo', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })

// 음식
router.route('/food')
    .get((_, res) => {
        res.render('transInfo', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })

// 준비사항
router.route('/preparation')
    .get((_, res) => {
        res.render('transInfo', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })

module.exports = router;