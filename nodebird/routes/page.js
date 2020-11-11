const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const { Post, User } = require('../models')

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', isLoggedIn ,(req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

router.get('/join', isNotLoggedIn,(req, res) => {
  res.render('join', { 
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  // 게시글 조회
  // 게시글 작성자의 id, 닉네임을 JSON해서 제공
  // 게시글 순서는 최신순으로
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick'], 
    },
    order: [['createdAt', 'DESC']]
  })
    .then((posts) => {
      res.render('main', {
        title: 'NodeBird',
        twits: posts,
        user: req.user,
        loginError: req.flash('loginError')
      });
    })
    .catch((error) => { 
      console.error(error)
      next(error)
    })
});

module.exports = router;