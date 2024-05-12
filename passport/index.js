const passport = require('passport');
const local = require('./local');
// const kakao = require('./kakao');
const User = require('../models/user');

module.exports = () => {
  // 로그인 요청을 할 때 씀.
  // 리턴값은 user객체의 id키(PK) 이다. 리턴값은 req.session 객체에 저장된다.
  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  // 이미 로그인 한 상태일 때 사용함.
  // req.session 객체에 있는 id 값을 받음.
  // id 키를 통해서 db 조회 후 user 객체를 req.body에 반환받을 수 있으며, db 오류가 나면 err를 반환한다.
  passport.deserializeUser((userId, done) => {
    User.findOne({
      where: { userId }
    })
    // 요청 객체에 user가 담긴다. (req.user)
    .then(user => done(null, user))
    .catch(err => done(err));
  });

  local(); // passport/local
  // kakao();
};
