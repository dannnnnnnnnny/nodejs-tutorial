const express = require('express') // 모듈 import
const app = express()
const port = 5000

const mongoose = require('mongoose')

// 몽구스를 이용한 몽고db 연동 (MongoDB -> IP에러가 나서 Network Access에서 IP를 0.0.0.0/0 으로 수정했음.)
mongoose.connect('mongodb+srv://ehdgnl5249:kk5249@youtubeclone.ex5jz.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err))

app.get('/', (req, res) => { // root 디렉토리
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})