const express = require('express')
const { User, Comment } = require('../models')

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            include: {
                model: User,
                where: { id: req.params.id }
            }
        })
        res.status(200).send(comments)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

router.post('/', async(req, res, next) => {
    try {
        const result = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment
        })
        res.status(201).send(result)
    } catch (error) {
        console.error(error)
        next(error)
    }
})

module.exports = router