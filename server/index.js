const express = require('express') // 모듈 import
const app = express()
const port = 5000
const config = require('./config/key')
const { auth } = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// application/x-www-form-urlencoded <- 이 데이터를 분석해서 가져올 수 있게 함.
app.use(bodyParser.urlencoded({extended: true}));


app.use(bodyParser.json()); //application/json <-json 데이터를 분석해서 가져올 수 있게 함.
app.use(cookieParser());    //client의 cookie 데이터를 분석해서 사용가능하게 함.

const { User } = require('./models/User')
const mongoose = require('mongoose')

// 몽구스를 이용한 몽고db 연동 (MongoDB -> IP에러가 나서 Clusters -> Network Access -> IP 0.0.0.0/0 으로 수정했음.)
// config.mongoURI를 config 폴더에 따로 두어 주소가 공개되지 않도록 함(.gitignore)
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err))


/* 메인 */
app.get('/', (req, res) => { // root 디렉토리
  res.send('Hello World!')
})


/* 회원가입 */
app.post('/api/users/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어줌.
    
    // 새로운 User 인스턴스 생성
    // req.body 안에는 json형식으로 {id:'hello', ...} 이런식으로 데이터가 들어가 있음
    // ( postman으로 http://localhost:5000/register, body는 raw - json으로 데이터 입력하여 post해주면 됨. )
    const user = new User(req.body)

    user.save((err, userInfo) => {       // .save() : mongodb 메소드
        if(err) return res.json({ success: false, err}) // client에게 json형식으로 에러 알림
        return res.status(200).json({   // http 성공 코드(200)
            success: true
        })
    }) 
})


/* 로그인 */
app.post('/api/users/login', (req, res) => {
    
    // 1. 요청된 이메일을 데이터베이스에 있는지 찾기
    // console.log("email : ",req.body.email);

    User.findOne({ email: req.body.email }, (err, user) => {    // email을 이용해서 user 객체 하나를 찾음
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        // console.log("user : ",user);
        
        // 2. 있다면 패스워드가 같은지 확인
        // comparePassword는 models/User.js에서 직접 정의한 메소드
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."} )

        
            // 3. 비밀번호까지 같다면 Token 생성
            // 토큰 생성 메소드 (models/User.js generateToken 메소드)
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                // 토큰 저장 (쿠키에 "x_auth"라는 이름으로 저장 (로컬 스토리지에도 저장해도 됨))
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


/* auth 인증 */
// client 쿠키의 token을 decode('secretToken'으로)하여 user._id를 알아낸 후
// DB에서 user._id의 토큰을 찾아 인증
/*
    1. 페이지 이동시 로그인되어 있는지, 관리자 유저인지 등을 체크
    2. 글을 쓸때나 지울 때 권한이 있는지 체크    
*/
app.get('/api/users/auth', auth, (req, res) => { // auth라는 middleware 추가

    // auth middlieware 먼저 거치고 옴

    // 여기까지 미들웨어가 통과해왔다는 얘기는 Authentication이 True라는 뜻
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})


/* 로그아웃 */
// 로그아웃 하려는 유저를 DB에서 찾고
// 유저의 토큰을 지워줌

app.get('/api/users/logout', auth, (req, res) => {  // 로그인 중인 상태이기 때문에 auth middleware 추가

    // auth middleware에서 쿠키를 통해 해당 유저를 req.user에 담음
    // token 을 공백으로 바꿈으로써 인증할 수 없게 만들어, 로그아웃
    // 유저를 찾아서 업데이트
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
            if(err)
                return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})