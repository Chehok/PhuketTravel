const express = require('express');
const Tourist = require('../models/tourist');

// localhost:5000/user
const router = express.Router();

// 회원가입
// localhost:5000/user/sign-up
router.route('/sign-up')
    .get((_, res) => {
        res.render('sign-up', {
            title: require('../package.json').name,
            port: process.env.PORT
        });
    })
    .post(async (req, res, next) => {
        const { id, password, name } = req.body;
        if (!id) return next('아이디를 입력하세요.');
        if (!password) return next('비밀번호를 입력하세요.');

        const user = await Tourist.findOne({ where: { id } });
        if (user) return next('이미 등록된 사용자 아이디입니다.');

        try {
            const hash = await bcrypt.hash(password, 12);
            const user = await Tourist.create({
                id,
                password: hash,
                name
            });

            if (user) res.redirect(`/profile/create/${user.userId}`);
            else next('회원가입이 되지 않았습니다!');       
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

// 유저 정보 세부조회
router.get('/info', async (req, res, next) => {
    try {
        const user = await Tourist.findOne({
            where: { userId: req.user.userId },
            include: {
                model: Profile
            }
        });
        if (user) res.json(user);
        else {
            res.json({
                result: 'fail',
                error: '정보 조회에 실패하였습니다!'
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원 탈퇴
router.get('/delete', async (req, res, next) => {
    try {
        const result = await Tourist.destroy({
            where: { userId: req.user.userId }
        });

        if (result) res.redirect('/');
        else next('Not deleted!');
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;