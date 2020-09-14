const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 스페이스 등의 공백을 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // 관리자 (0) or 일반 유저 (1)
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});
// 유저 스키마 작성

const User = mongoose.model('User', userSchema);
// 'User'라는 이름의 모델로 위에서 만든 유저 스키마를 감싸줌

module.exports = { User }
// 다른 곳에서도 쓸 수 있게 모듈을 exports 해줌