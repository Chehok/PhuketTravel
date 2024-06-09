// const express = require('express');
// const Transport = require('../models/transport');

// // localhost:5000/transport
// const router = express.Router();

// router.route('/info')
//     .get((req, res, next) => {
//         res.render('transInfo', {
//             
//             title: require('../package.json').name,
//             port: process.env.PORT
//         });
//     })

// router.route('/post')
//     .get((req, res, next) => {
//         res.render('postTransInfo', {
//              // 로그인 기능 추가
//             title: require('../package.json').name,
//             port: process.env.PORT
//         });
//     })
//     // [] 게시글 작성 기능 추가
//     .post(async (req, res, next) => {
//         const { name ,desc, imgLink, expCost } = req.body;

//         try {
//             const post = await Transport.create({
//                 name,
//                 desc,
//                 imgLink,
//                 expCost
//             })
//         } catch (err) {
//             console.error(err);
//             next(err);
//         }
//     })

// module.exports = router;