const { User } = require('../models/User')

let auth = (req, res, next) => { // 인증 처리 하는 곳
    
    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화한 후 유저를 찾음
    User.findByToken(token, (err, user) => {
        if(err)
            throw err;

        // 유저가 없으면 인증 No
        if(!user) return res.json({ isAuth: false, error: true })
    
        // 유저가 있으면 인증 Ok
        req.token = token;
        req.user = user;    // req에 넣어줌으로써 index.js의 auth route에서
                            // req.token, req.user 로도 사용할 수 있게 됨.
        next();     // middleware라 끝나면 이어서 작업할 수 있게

    })
}

module.exports = { auth };