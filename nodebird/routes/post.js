const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const { Post, Hashtag, User } = require('../models')
const { isLoggedIn } = require('./middlewares')

// /uploads 폴더가 없을 때 폴더 생성
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
        fs.mkdirSync('uploads')
    }
})

// Multer 모듈에 옵션을 주어 upload 변수에 대입
// upload 변수는 미들웨어를 만드는 객체

const upload = multer({

    // storage : 파일 저장 방식과 경로, 파일명 등 설정
    // diskStorage를 통해 서버 디스크에 저장
    storage: multer.diskStorage({

        // destination : 저장경로
        destination(req, file, cb) {
            cb(null, 'uploads/')
        },

        // filename : 기존 original이름 + 업로드 날짜 + 확장자
        filename(req, file, cb) {
            const ext = path.extname(file.originalname)
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 10mb 최대 이미지 파일 용량

})


// 이미지 업로드 라우터
// req.file 객체 형식예)
// { 
//     fieldname : 'img',
//     originalname: 'nodejs.png',
//     encoding: '7bit',
//     mimetype: 'image/png',
//     destination: 'uploads/',
//     filename: 'nodejs1521421~~~.png',
//     path: 'uploads\\nodejs15214216~~~~.png'
// }
router.post('/img', isLoggedIn, upload.single('img'), async(req, res, next) => {
    console.log(req.file)
    res.json({ url: `/img/${req.file.filename}` })
})



// 게시물 업로드 처리 라우터
// 이미지를 업로드했다면 이지미 주소도 req.body.url로 전송됨
// 데이터 형식이 multipart지만 이미지 데이터가 들어있지 않으므로 none 메서드 사용
// (이미지 주소가 온 것이지 이미지 데이터 자체가 온 것이 아님)
// 게시글을 DB에 저장 후, 게시글 내용에서 해시태그를 정규표현식으로 추출
// 추출한 해시태그들을 DB에 저장 후, 
// post.addHashtags 메서드로 게시글과 해시태그의 관계를 PostHashtag 테이블에 넣음 
const upload2 = multer()
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id
        })

        const hashtags = req.body.content.match(/#[^\s#]*/g)

        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })))

            await post.addHashtags(result.map(r => r[0]))
        }

        res.redirect('/')
    } catch (error) {
        console.error(error)
        next(error)
    }
})


router.get('/hashtag', async (req, res, next) => {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/')
    }
    try {

        const hashtag = await Hashtag.findOne({ where: { title: query } })
        let posts = [];

        if (hashtag) {
            posts = await hashtag.getPosts({
                include: [{ model: User }]
            })
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            user: req.user,
            twits: posts,
        })

    } catch (error) {
        console.error(error)
        next(error)
    }
})


module.exports = router


// upload 변수는 미들웨어를 만드는 여러 가지 메서드를 가지고 있음 (single, array, fields, none)
// single : 하나의 이미지를 업로드할 때, req.file 객체를 생성
// array, fields : 여러 개의 이미지를 업로드할 때 사용, req.files 객체 생성
// array와 fields의 차이점은 이미지를 업로드한 body 속성의 갯수 
// (속성 하나에 이미지를 여러개 업로드했다면 array, 여러 개의 속성에 이미지를 하나씩 업로드했다면 fields)
// none : 이미지를 올리지 않고 데이터만 multipart 형식으로 전송했을 때 사용