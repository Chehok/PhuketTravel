const express = require('express');
const Tourist = require('../models/tourist');

// localhost:5000/user
const router = express.Router();

// 회원가입
// localhost:5000/transprotation/info
router.route('/info')
    .get((_, res) => {
        res.render('transInfo', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })
    // .post(async (req, res, next) => {

    // });



module.exports = router;