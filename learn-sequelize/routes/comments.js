const express = require('express')
const router = express.Router();

const { User, Comment } = require('../models');

router.get('/', async(req, res, next) => {
    try {
        const result = await Comment.findAll();
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        next(arr);
    }
})

router.get('/:id', async(req, res, next) => {
    try {
        const result = await Comment.findAll({
            include : {
                model: User,
                where: { id: req.params.id }
            }
        })
        res.status(200).send(result)
    } catch (err) {
        console.error(err)
        next(arr)
    }
    
})

module.exports = router;