var express = require('express');
var router = express.Router();

var { User } = require('../models/user');

/* GET home page. */
router.get('/', async(req, res, next)=>{
  try {
    const users = await User.findAll();
    res.send(users)
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = router;
