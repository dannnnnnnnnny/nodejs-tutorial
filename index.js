const express = require('express') // 모듈 import
const app = express()
const port = 5000

const config = require('./config/key')

const bodyParser = require('body-parser')

// application/x-www-form-urlencoded <- 이 데이터를 분석해서 가져올 수 있게 함.
app.use(bodyParser.urlencoded({extended: true}));

//application/json <-json 데이터를 분석해서 가져올 수 있게 함.
app.use(bodyParser.json());


const { User } = require('./models/User')
const mongoose = require('mongoose')

// 몽구스를 이용한 몽고db 연동 (MongoDB -> IP에러가 나서 Network Access에서 IP를 0.0.0.0/0 으로 수정했음.)
// config 폴더를 따로 두어 주소가 공개되지 않도록 함(.gitignore)
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err))


app.get('/', (req, res) => { // root 디렉토리
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터베이스에 넣어줌.
    
    // 새로운 User 인스턴스 생성
    // req.body 안에는 json형식으로 {id:'hello', ...} 이런식으로 데이터가 들어가 있음
    const user = new User(req.body) 
    user.save((err, useInfo) => {       // .save() : mongodb 메소드
        if(err) return res.json({ success: false, err}) // client에게 json형식으로 에러 알림
        return res.status(200).json({   // 200은 성공
            success: true
        })
    }) 
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})