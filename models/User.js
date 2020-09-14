const mongoose = require('mongoose');
const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10; // 10자리인 salt를 만들고 salt를 이용해서 암호화
const jwt = require('jsonwebtoken')

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


userSchema.pre('save', function( next ){ // 유저모델을 저장하기 전에 실행됨
    var user = this;
    // 비밀번호 암호화 시킴
    
    if (user.isModified('password')) { // 패스워드가 변경될 때만
        bcrypt.genSalt(saltRounds, function(err, salt) { // 10자리인 salt 생성
            if(err) return next(err)

                        // 기본 순수 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash // hash가 생성되었다면 비밀번호를 암호화된 hash로 변경해줌
                next()
            });
        });

    } else {    // 패스워드 변경되지 않을 때도 next() 해줘야 함
        next()
    }
}) 

// 비밀번호 비교 메소드 정의
// comparepassword 메소드 이름은 마음대로 바꾸면 됨.
userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword : 1234567       암호화된 비밀번호 $2b$~~~~
    // 두 암호가 같은지 확인 (plainPassword를 암호화하여 확인)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) 
            return cb(err)
        cb(null, isMatch)   // 에러없고, True
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this
    
    // jwt을 이용한 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // => user._id와 'screetToken' 이라는 문자열을 암호화하여
    // => token을 생성함. secreetTOken으로 복호화하면 user._id가 나옴
    
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)

    })
}

const User = mongoose.model('User', userSchema);
// 'User'라는 이름의 모델로 위에서 만든 유저 스키마를 감싸줌

module.exports = { User }
// 다른 곳에서도 쓸 수 있게 모듈을 exports 해줌