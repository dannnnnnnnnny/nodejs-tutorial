const express = require('express');
const axios = require('axios');
const { token } = require('morgan');
const router = express.Router();

const URL = 'http://localhost:8002/v1';

router.get('/test', async (req, res, next) => {
	try {
		if (!req.session.jwt) {
			// 세션에 토큰이 없으면
			const tokenResult = await axios.post('http://localhost:8002/v1/token', {
				clientSecret: process.env.CLIENT_SECRET,
			});

			if (tokenResult.data && tokenResult.data.code === 200) {
				req.session.jwt = tokenResult.data.token;
			} else {
				return res.json(tokenResult.data);
			}
		}

		const result = await axios.get('http://localhost:8002/v1/test', {
			headers: { authorization: req.session.jwt },
		});
		return res.json(result.data);
	} catch (error) {
		console.error(error);
		if (error.response.status === 419) {
			// 토큰 만료
			return res.json(error.response.data);
		}
		return next(error);
	}
});

module.exports = router;
