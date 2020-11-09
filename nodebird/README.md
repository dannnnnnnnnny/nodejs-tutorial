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


## 비밀키 관리
- 키를 하드코딩하면 소스 코드가 유출되었을 때 키도 같이 유출되므로 별도로 관리해야 함
- npm i dotenv
- 비밀키는 .env에 모아두고 dotenv가 .env파일을 읽어 process.env객체에 넣음

- .env 파일 생성 후 키=값 형태로 비밀키 추가

