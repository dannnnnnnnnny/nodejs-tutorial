const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const { User } = require('../models')

const router = express.Router()

// 회원가입 라우터
router.post('/join', isNotLoggedIn, async(req, res, next) => {
    const { email, nick, password } = req.body;

    try {
        const exUser = await User.findOne({ where: { email } })
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.')
            return res.redirect('/join')
        }
        
        // bcrypt의 두 번째 인자는 pbkdf2의 반복 횟수와 비슷한 기능을 함
        // 숫자가 커질수록 비밀번호를 알아내기 어려워지지만 암호화 시간도 오래 걸림
        // 12이상 추천 (31까지 가능)
        const hash = await bcrypt.hash(password, 12)


        
        await User.create({
            email,
            nick,
            password: hash
        })

        return res.redirect('/')

    } catch (err) {
        console.error(err)
        return next(error)
    }
})


// 로그인 라우터
// passport.authenticate('local') 미들웨어가 로컬 로그인 전략 수행
// 미들웨어지만 미들웨어 안에 존재(미들웨어에 사용자 정의 기능을 추가하고 싶을 때)
// 내부 미들웨어에 (req, res, next)를 인자로 제공해서 호출
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError)
            return next(authError)
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        
        // 성공시 req.login 메서드 호출
        // req.login은 passport.serializeUser 호출
        // req.login에서 제공하는 user 객체가 serializeUser로 넘어감
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError)
                return next(loginError)
            }

            return res.redirect('/')
        })
    })(req, res, next)      // 미들웨어 내 미들웨어에는 (req,res,next)를 붙임
})


// 로그아웃 라우터
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()             // req.user 객체를 제거
    req.session.destroy()   // req.session 객체의 내용 제거
    res.redirect('/')
})


// 카카오 로그인 과정 시작
// 카카오 로그인 창으로 redirect
router.get('/kakao', passport.authenticate('kakao'));


// 카카오 로그인 전략 수행
// authenticate 메서드에 콜백함수가 없음. (내부적으로 req.login을 호출)
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',   // 실패했을 때 이동할 url
}), (req, res) => {
    res.redirect('/');
});

module.exports = router