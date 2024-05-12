const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// 로컬 전략 로그인 API 
const User = require('../models/user');

module.exports = () => {
  passport.use(new Strategy({
    // req.body.id or password 왜냐? 로그인 정보는 노출되면 안되기 때문에 무조건 post요청이기 때문
    idField: 'id',
    passwordField: 'password'
  }, async (id, password, done) => {
    console.log(id, password)

    try {
      const user = await User.findOne({ where: { id } });
      // id에 해당하는 user 객체가 있으면
      console.log(user)
      if (user) {
        const result = await bcrypt.compare(password, user.password);
        // 로그인 성공! -> 유저 정보를 2번째 인자로 전달 (req, res)
        if (result)
          done(null, user);
        // 로그인 실패. -> 유저 정보가 리턴 X 그리고, 비밀번호가 일치하지 않다고 알려줌.
        else
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
      }
      // id에 해당하는 user 객체가 없으면
      else
        done(null, false, { message: '가입되지 않은 회원입니다.' });
    } catch (error) {
      done(error);
    }
  }));
};
