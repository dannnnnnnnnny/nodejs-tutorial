// passport는 req 객체에 isAuthenticated 메서드를 추가함
// 로그인 여부를 확인할 수 있음
const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(403).send('로그인이 필요합니다.');
	}
};

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/');
	}
};

exports.verifyToken = (req, res, next) => {
	try {
		req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
		return next();
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(419).json({
				code: 419,
				message: '토큰 기간 만료',
			});
		}
		return res.status(401).json({
			code: 401,
			message: '유효하지 않은 토큰',
		});
	}
};
