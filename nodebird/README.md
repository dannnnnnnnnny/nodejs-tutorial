## Nodebird 

### 초기 개발세팅(SNS)
- npm init (package.json 생성)
- npm i -g sequelize-cli
- npm i sequelize mysql2
- sequelize init
- /views, /routes, /public, /passport 폴더 생성
- app.js 생성
- npm i express cookie-parser, express-session, morgan, connect-flash pug
- npm i -g nodemon
- npm i -D nodemon 


### 비밀키 관리
- 키를 하드코딩하면 소스 코드가 유출되었을 때 키도 같이 유출되므로 별도로 관리해야 함
- npm i dotenv
- 비밀키는 .env에 모아두고 dotenv가 .env파일을 읽어 process.env객체에 넣음

- .env 파일 생성 후 키=값 형태로 비밀키 추가

===============================================================

- user, post, hashtag 모델 생성 후 /config/config.json에서 development mysql 데이터 변경
- 콘솔에 "sequelize db:create" 하면 데이터베이스 생성

- app.js에서 시퀄라이즈 동기화
``` js
const { sequelize } = require('./models')
sequelize.sync()
```

### Passport 모듈 설치
- npm i passport passport-local passport-kakao bcrypt

### Passport local 로그인 구현
- SNS 서비스로 로그인하는 것이 아닌 아이디/비밀번호로 로그인하는 것
- 회원가입 로그인 로그아웃 라우터를 만들어야하는데, 이미 로그인한 유저는 회원가입과 로그인 라우터에 접근하면 안되기 때문에 라우터에 접근 권한을 제어하는 미들웨어를 추가해줘야 함.
- passport가 req 객체에 추가해주는 isAuthenticated 메서드 사용
- /routes/middlewares.js


## Multer 모듈로 이미지 업로드 구현
- 이미지는 보통 input[type=file] 태그 또는 form 태그로 업로드함
- form 인코딩 타입은 multipart/form-data 인 경우가 많은데 이런 형식으로 올라온 데이터는 직접 처리하기가 힘드므로 multipart 처리용 모듈을 사용하는 것이 좋음
- npm i multer

- (/routes/post.js)