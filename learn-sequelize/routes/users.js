var express = require('express');
var router = express.Router();
var User = require('../models').User;

/* GET users listing. */
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users)
  } catch(err) {
    next(err)
  }
});

router.post('/', async(req, res, next) => {
  try {
    const result = await User.create({
      name : req.body.name,
      age: req.body.age,
      married: req.body.married
    })

    res.status(201).send(result)
  } catch {
    next(err)
  }
})

module.exports = router;
