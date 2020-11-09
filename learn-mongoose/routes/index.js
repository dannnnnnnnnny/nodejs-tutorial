var express = require('express');
var router = express.Router();
var User = require('../schemas/user');

router.get('/', async(req, res, next) => {
  try {
    const users = await User.find({})
    res.render('mongoose', { users })
  } catch (err) {
    console.error(err);
    next(err);
  }
  
});

module.exports = router;
