const express = require('express');

const router = express.Router();

// 회원가입
// localhost:5000/phuketLocation/info
router.route('/info')
    .get((_, res) => {
        res.render('phuketLocation', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })
    
module.exports = router;