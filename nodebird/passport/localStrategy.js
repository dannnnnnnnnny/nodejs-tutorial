// 로그인 전략 구현
/// passport-local 모듈에서 Strategy 생성자 불러와서 사용

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models')

module.exports = (passport) => {
    
    // usernameField와 passwordField에 일치하는 req.body 속성명 넣어줌
    passport.use(new LocalStrategy({
        usernameField: 'email',     // req.body.email
        passwordField: 'password',  // req.body.password

    }, async(email, password, done) => {    
        // done은 passport.authenticate의 콜백 함수
        try {
            // 일치하는 이메일 찾음
            const exUser = await User.findOne({ where: { email } })
            if (exUser) {
                // 있다면 비밀번호 비교
                const result = await bcrypt.compare(password, exUser.password)
                if (result) {
                    // 일치하면 사용자 정보 넣어 보냄
                    done(null, exUser)
                } else {
                    done (null, false, { message: '비밀번호가 일치하지 않습니다.' })
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원' })
            }
        } catch (err) {
            console.error(err)
            done(err)
        }
    }))
}


// 1) 로그인 성공시
// done(null, exUser);
// => passport.authenticate('local', (authError, user, info) => {})
// authError에 null, user에 exUser 대입

// 2) 로그인 실패시
// done(null, false, { message: "비밀번호 일치하지 않음"});
// => passport.authenticate('local', (authError, user, info) => {})
// authError에 null, user에 false, info에 JSON(message) 대입

// 3) 서버 에러시
// done(error);
// passport.authenticate('local', (authError, user, info) => {})
// authError에 error 대입


// done이 호출된 이후에는 passport.authenticate 콜백 함수에서 나머지 로직 실행
