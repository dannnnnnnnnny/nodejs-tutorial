const express = require('express')
const router = express.Router();

const { User, Comment } = require('../models');

router.get('/', async(req, res, next) => {
    const result = Comment.findAll();

    res.status(200).send(result);
})

router.get('/:id', async(req, res, next) => {
    const result = Comment.findAll({
        include : {
            model: User,
            where: { id: req.params.id }
        }
    })
    res.status(200).send(result)
})

module.exports = router;