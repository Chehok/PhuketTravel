const path = require('path');

const express = require('express');
const dotenv = require('dotenv');

const nunjucks = require('nunjucks');
const { sequelize, Tourist } = require('./models');

const userRouter = require('./routes/user');

dotenv.config(); // .env 파일을 읽어서 process.env로 만든다. (dotenv => dot(.) + env) 비밀 키들을 관리하기 위함.

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

// 데이터베이스 연결해줌 mysql 연결
sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error(err));

// app.use -> 미들웨어를 사용하겠다는 의미.
// localhost:5000/
app.use(
    // 'abcd',  <= 와 같이 첫번째 인자에 경로를 지정해줄 수 있다. 그럼 주소가 바뀜 (localhost:5000/abcd)
    // 지정해주지 않으면 '/'가 디폴트 값으로 지정되어있는걸로 처리.
    // morgan('dev'), // 서버에 들어온 응답과 요청을 기록해주는 미들웨어, 기록 후 next 호출 // FIXME
    express.static(path.join(__dirname, 'public')), // 요청하는 파일이 있을 때 파일 경로를 제공하며, localhost:5000/ 에 접속하면 public으로 경로를 바꿔줌
    express.json(), // put이나 patch, post 요청 시에 req.body에 프런트에서 온 데이터를 넣어줌
    express.urlencoded({ extended: false })
);

// 각 주소에 해당하는 라우터로 넘김
app.use('/user', userRouter);

app.use(async (req, res, next) => {
    try {
        if (req.user) {
            const profile = await Profile.findOne({
                where: { userId: req.user.userId }
            });
            res.locals.profile = profile;
        }
    } catch (err) {
        console.error(err)
        next(err);
    }
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('index');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});