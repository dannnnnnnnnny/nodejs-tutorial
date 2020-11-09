const express = require('express')
const Comment = require('../schemas/comment')

const router = express.Router()

router.get('/', async(req, res, next) => {
    try {
        const comments = await Comment.find({})
        res.json(comments)
    } catch (error) {
        console.error(error)
        next(error)
    }
})
// 도큐먼트 등록 라우터
// Comment 스키마로 comment 객체를 만들어 도큐먼트 내용을 넣은 뒤 save로 저장
// 결과를 populate로 User 
router.post('/', async (req, res, next) => {
    try {
        const comment = await new Comment.create({
            commenter: req.body.id,
            comment: req.body.comment
        });

        const result = await Comment.populate(comment, { path: 'commenter' });

        res.status(201).json(result);
    } catch (err) {
        console.error(err)
        next(err)
    }
})

// 수정에는 patch 메소드 사용
// MongoDB와 다르게 $set 연산자 사용하지 않아도 기입한 필드만 바꿔줌
router.patch('/:id', async (req, res, next) => {
    try {
        const result = await Comment.update({ _id: req.params.id }, { comment: req.body.comment })
        res.json(result)
    } catch (err) {
        console.error(err)
        next(err)
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Comment.remove({ _id: req.params.id })
        res.json(result)
    } catch (err) {
        console.error(err)
        next(err)
    }
})

module.exports = router;