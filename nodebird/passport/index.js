// **## 전체 과정 ##**
// 1) 로그인 요청
// 2) passport.authenticate 메서드 호출
// 3) 로그인 전략 수행
// 4) 로그인 성공시 사용자 정보 객체와 함께 req.login 호출
// 5) req.login 메서드가 passport.serializeUser 호출
// 6) req.session에 사용자 아이디만 저장
// 7) 로그인 완료

// **## 로그인 이후 과정 ##**
// 1) 모든 요청에 passport.session() 미들웨어가 passport.deserializeUser 메서드 호출
// 2) req.session에 저장된 아이디로 DB에서 사용자 조회
// 3) 조회된 사용자 정보를 req.user에 저장
// 4) 라우터에서 req.user 객체 사용 가능

const local = require('./localStrategy')
const kakao = require('./kakaoStrategy')
const { User } = require('../models') 

module.exports = (passport) => {
    // req.session 객체에 어떤 데이터를 저장할지 선택함
    // done 두 번째 인자로 user.id 보내 저장함
    // (세션에 사용자 정보 객체를 아이디로 저장)
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    // 매 요청시 passport.session() 미들웨어가 이 메서드를 호출함
    // serializeUser에서 세션에 저장했던 ID를 받아 DB에서 사용자 정보 조회
    // 조회한 정보를 req.user에 저장하여 앞으로 
    // req.user를 통해 로그인한 사용자의 정보 가져올 수 있음
    // (세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴)
    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id } })
        .then(user => done(null, user))
        .catch(err => done(err))
    })

    local(passport)
    kakao(passport)
}