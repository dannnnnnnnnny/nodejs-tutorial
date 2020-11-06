var express = require('express');
var router = express.Router();
var User = require('../models').User;

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch(err) {
    next(err)
  }
  
});

module.exports = router;
