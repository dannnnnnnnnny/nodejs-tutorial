module.exports = {
    mongoURI: process.env.MONGO_URI
}

// prod.js는 배포했을 때 사용하며
// heroku 사용시에는 heroku 사이트의 Config Vars에 직접
// MONGO_URI : mongodb+srv .....
// 이런식으로 입력해놔야함. 그 값을 prod.js의 process.env.MONGO_URI 변수가져와서 사용하는 것
