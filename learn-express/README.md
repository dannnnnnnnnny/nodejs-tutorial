## express-generator
- npm i -g express-generator
- express learn-express --view=pug
- cd learn-express && npm i

* --view=pug : express-generator 는 원래 기본적으로 Jade를 템플릿 엔진으로 설치. 하지만 Jade는 Pug로 이름을 바꾼지 오래됐기 때문에, 최신버전으로 설치하기 위함

### 폴더 구조
- app.js : 핵심적이 서버 역할
- /bin/www : 서버를 실행하는 스크립트
- /public : 외부에서 접근 가능한 파일들을 모아둔 곳
- /routes : 주소별 라우터들을 모아둔 곳
- /views : 템플릿 파일을 모아둔 곳

=> 앞으로의 서버 로직은 routes 폴더안의 파일에 작성, 화면 부분은 views 폴더안에 작성
=> DB는 models 폴더를 따로 만들어서 작성

- npm run start로 바로 서버 실행 가능 (npm start 로도 가능)


## 미들웨어
- 익스프레스의 핵심
- 요청과 응답의 중간에 위치
- 라우터와 에러 핸들러 또한 미들웨어의 일종
- 미들웨어는 app.use()와 함께 사용됨

#### 커스텀 미들웨어 생성해보기
``` JS
app.use(function(req, res, next) {
    console.log(req.url, '저도 미들웨어 입니다.');
    next();
});

```
=> 반드시 next() 를 호출해야 다음 미들웨어로 넘어감
=> logger나 express.json, urlencoded, cookieParser, static 은 모두 내부적으로 next() 호출 (넣지않으면 흐름이 끊김)

- next()에 인자를 아무것도 넣지 않으면 단순하게 다음 미들웨어로 넘어감
- 인자로 route를 넣을수도 있으며 route외의 다른 값을 넣으면 다른 미들웨어나 라우터를 건너뛰고 바로 에러 핸들러로 이동함. (넣은 내용을 에러에 대한 내용으로 간주)

#### 에러 핸들러 미들웨어 소스
```JS
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
})
```
=> 함수 인자가 4개인데 req 전에 err 인자가 추가되었음
=> next함수에 넣어준 인자가 err매개변수로 연결됨


#### 하나의 use에 미들웨어를 여러개 장착 가능
``` JS
app.use(function(req, res, next) {
    console.log('1');
    next()
}, function(req, res, next) {
    console.log('1');
    next()
}, function(req, res, next) {
    console.log('1');
    next()
})
```



- 여러개 장착 가능한 성질을 활용하여 Express-generator 생성 코드를 줄일 수 있음
``` JS
app.use(logger('dev'), express.json(), express.urlencoded({extended: false}), cookieParser(), expresss.static(path.join(__dirname, 'public')));
```
=> 가독성이 별로라 잘 사용하지 않지만 유효함



- next를 호출하지 않으면 다음 미들웨어로 넘어가지 않는다는 성질을 사용
``` JS
app.use(function(req, res, next) {
    if (Date.now() % 2 === 0) {
        return res.status(404).send('50% 실패');
    } else {
        next();
    }
}, function(req, res, next) {
    console.log('50% 성공');
    next();
})
```

#### morgan
###### GET /users 200 5.133 ms - 23
- 위와 같은 콘솔에 나오는 로그는 모두 morgan 미들웨어에서 나오는 것임 (요청에 대한 정보를 콘솔에 기록)
``` JS
var logger = require('morgan');
app.use(logger('dev'));
``` 
- 함수 인자로 dev 대신 short, common, combined등을 줄 수 있음
- 보통 개발시 short나 dev 사용
- 배포시 common, combined 사용