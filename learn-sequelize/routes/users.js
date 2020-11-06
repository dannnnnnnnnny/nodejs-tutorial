var express = require('express');
var router = express.Router();
var { User } = require('../models/user');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users)
  } catch (error) {
    console.error(error)
    next(error)
  }
});

router.post('/', async (req, res, next) => {
  try {
    const result = await User.create({ 
                            name: req.body.name,
                            age: req.body.age,
                            married: req.body.married
                          })
    res.status(201).send(result)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router;
