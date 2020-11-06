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

### morgan
###### GET /users 200 5.133 ms - 23
- 위와 같은 콘솔에 나오는 로그는 모두 morgan 미들웨어에서 나오는 것임 (요청에 대한 정보를 콘솔에 기록)
``` JS
var logger = require('morgan');
app.use(logger('dev'));
``` 
- 함수 인자로 dev 대신 short, common, combined등을 줄 수 있음
- 보통 개발시 short나 dev 사용
- 배포시 common, combined 사용


### body-parser
- 요청의 본문을 해석해주는 미들웨어
- 보통 Form이나 AJAX 요청의 데이터를 처리

``` JS
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```
=> But, Express 4.16.0 버전부터는 body-parser의 일부 기능이 익스프레스에 내장되었기 때문에

``` JS
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```
=> 이런식으로 사용이 가능함

- 단, body-parser가 필요한 경우가 있는데, body-parser는 JSON과 url-encoded 형식 본문 외에도 Raw, Text 형식의 본문을 추가로 해석할 수 있음
- Raw는 본문이 버퍼데이터일 때, Text는 본문이 텍스트 데이터일 때 해석
``` JS
app.use(bodyParser.raw());
app.use(bodyParser.text());
```

- JSON은 JSON 형식의 데이터 전달 방식, URL-encoded는 주소 형식으로 데이터를 보내는 방식으로, 보통 폼 전송이 URL-encoded 방식을 주로 사용함.
- URL-encoded의 { extended: false } 라는 옵션이 있는데 이 옵션이 false 이면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석함.
- qs 모듈은 내장 모듈이 아니라 npm 패키지이며 querysting 모듈의 기능을 조금 더 확장한 모듈임.

- http 모듈을 사용할 때는 POST와 PUT 요청의 본문을 받기 위해
``` JS
req.on('data')
...
req.on('end)

```
- 이런식으로 스트림을 사용해야 했는데, body-parser를 사용하면 그럴 필요가 없음. bodyParser가 내부적으로 본문을 해석해 req.body에 추가해줌.


``` Json
{ name: 'dhk', book: 'nodejs' }
```
- e.g. json 형식으로 위 json데이터를 본문으로 보낸다면 req.body에 그대로 들어감
- URL-encoded 형식으로 name=dhk&book=nodejs를 본문으로 보낸다면 위와 같이 req.body로 들어감
=> 하지만 multipart/form-data 같은 폼을 통해 전송된 데이터는 해석하지 못하므로 다른 모듈을 사용해서 해석해야 함.


### cookie-parser
- 요청에 동봉된 쿠키를 해석해줌.
``` JS
var cookieParser = require('cookie-parser');
app.use(cookieParser());
``` 
- 해석된 쿠키들은 req.cookies 객체에 저장됨.
- 예를들어 name=dhk 쿠키를 보냈다면 req.cookies는 { name: 'dhk' }가 됨.

``` JS
app.use(cookieParser('secret code'));
``` 
- 이와 같이 첫번째 인자로 문자열을 넣어줄 수도 있는데, 서명된(암호화) 쿠키가 있는 경우, 제공한 문자열을 키로 삼아 복호화할 수 있음
- 서명된 쿠키는 클라이언트에서 수정했을 때 에러가 발생하므로 클라이언트에서 쿠키로 위엄한 행동을 하는 것을 방지할 수 있음


### static
``` JS
app.use(express.static(path.join(__dirname, 'public')));
```
- static 미들웨어는 정적인 파일들을 제공함.
- Express에 내장되어 있어 따로 설치할 필요가 없음
- 함수의 인자로 정적 파일들이 담겨 있는 폴더를 지정하면 됨.
- /public/stylesheets/style.css는 http://localhost:3000/stylesheets/style.css로 접근이 가능함 (실제 서버의 폴더 경로에는 public에 들어있지만 요청 주소에는 public이 들어있지 않음 -> 보안성)

``` JS
app.use('/img', express.static(path.join(__dirname, 'public')));
```
- 위와 같이 첫번째 인자로 경로를 주면 http://localhost:3000/img/stylesheets/style.css 주소로 접근이 가능
- static 미들웨어는 요청에 부합하는 정적 파일을 발견한 경우에 응답으로 해당 파일을 전송, 이 경우 응답을 보냈으므로 다음에 나오는 라우터가 실행되지 않음 (만약 파일을 찾지 못했을 시엔 라우터로 넘김)

- 자체적인 정적 파일 라우터 기능을 수행하므로 최대한 위쪽에 배치하는 것이 좋음 (서버가 쓸데없는 미들웨어 작업을 하는 것을 막기 위해 -> morgan 다음에 배치하는 것이 좋음)


### express-session
- 세션 관리용 미들웨어
- 로그인 등의 이유로 세션을 구현할 때 매우 유용
- 따로 직접 설치 해줘야함 (npm i express-session)

``` JS
app.use(cookieParser('secret code'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret code',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
```
- cookieParser 미들웨어 뒤에 놓는 것이 안전
======================================================================
#### 인자로 세션에 대한 설정 적용
- resave : 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지
- saveUninitialized: 세션에 저장할 내역이 없더라도 세션을 저장할지, 방문자 추적시 사용
- secret : 필수 항목으로 cookie-parser의 비밀키와 같은 역할

=> express-session은 세션 관리 시 클라이언트에 쿠키를 보냄. 이를 세션 쿠키라고 부름 (안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는 데 'secret' 값이 필요함. cookie-parser의 secret과 같게 설정)

- cookie : 세션 쿠키에 대한 설정, maxAge, domain, path, expires, sameSite, httpOnly, secure 등 일반적인 쿠키 옵션이 모두 제공됨. 현재 httpOnly를 사용해서 클라이언트에서 쿠키를 확인하지 못하도록 하고, secure:false로 https가 아닌 환경에서도 사용할 수 있게 함. (배포시에는 secure를 true로 설정하는 것이 좋음)

- store : 서버를 재시작하면 메모리가 초기화되어 세션이 모두 사라지는데, 배포시에는 store에 데이터베이스를 연결하여 세션을 유지하는 것이 좋음 (Redis 사용)
======================================================================
- express-session 은 req 객체안에 req.session 객체를 만듦
- 나중에 세션을 한번에 삭제하려면 req.session.dstroy() 메소드를 호출하면 됨
- 현재 세션 아이디는 req.sessionID로 확인 가능


### connect-flash
- 일회성 미시지들을 웹 브라우저에 나타낼 때 좋음
- npm i connect-flash
- cookie-parser 와 express-session 을 사용하므로 이들보다 뒤에 위치
``` JS
app.use(cookieParser('secret code'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret code',
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));

app.use(flash());
```
- flash 미들웨어는 req객체에 req.flash 메서드를 추가함.
- req.flash(키, 값) 으로 해당 키에 값을 설정학호, req.flash(키)로 해당 키에 대한 값을 불러옴

``` JS
router.get('/flash', (req, res) => {
    req.session.message = '세션 메시지';
    req.flash('message', 'flash 메시지');
    res.redirect('/users/flash/result');
    // 세션과 flash에 메시지 설정 후 리다이렉트
    
})

router.get('/flash/result', (req, res) => {
    res.send(`${req.session.message} ${req.flash('message')}`)
})
```
=> 처음 /flash/result 화면에는 '세션 메시지 flash 메시지' 가 보이는데 새로고침하면 '세션 메시지' 만 출력됨. 일회용이기때문

## Router 객체로 라우팅 분리
``` JS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/', usersRouter);
```
- app.use를 사용하므로 Router도 일종의 미들웨어라고 볼 수 있음
- 첫 번째 인자로 주소를 받아서 특정 주소에 해당하는 요청이 왔을 때만 미들웨어가 동작하게 함
- app.use에서 use 대신 get, post, put, patch, delete 사용 가능

- router 객체는 express.Router()로 만들 수 있음
- module.exports = router;로 라우터를 모듈로 만들어서 사용 가능
- 라우터 로직이 실행되는 미들웨어 전에 로그인 여부 또는 관리자 여부를 체크하는 미들웨어를 중간에 넣어두곤 함. ( router.get('/', middleware1, middleware2, middleware3) )

- 코드 관리를 위해 라우터를 이용해서 별도 분리하는 것이 좋음
- 라우터에서는 반드시 요청에 대한 응답을 보내거나 에러 핸들러로 요청을 넘겨야 함. res 객체를 통해 응답 (응답을 보내지 않으면 브라우저는 계속 응답을 기다림)

- next함수에는 라우터에서만 동작하는 특수 기능이 있는데, next('route') 임.
- 라우터안에 연결된 나머지 미들웨어들을 건너 뛰고 싶을 때 사용
``` JS
router.get('/', function(req, res, next) {
    next('route');
}, function(req, res, next) {
    console.log('실행되지 않습니다');
    next();
}, function(req, res, next) {
    console.log('실행되지 않습니다');
    next();
});

router.get('/', function(req, res, next) {
    console.log('실행됨');
    res.render('index', { title : 'Express' });
})
```
- 같은 주소의 라우터가 2개가 있지만, 첫번째 라우터는 next('route')를 호출했기 때문에 2,3번째 미들웨어는 실행되지 않음.
- 대신 주소와 일치하는 다음 라우터로 넘어감


``` JS
router.get('/users/:id', function(req, res) => {
    console.log(req.params, req.query);
});
```
- 주소에 :id 는 :id 그대로가 아닌 다른 값을 넣을 수 있음
- /users/1 이나 /users/123 등의 요청도 이 라우터에 걸림
- req.params 객체 안에 들어있으므로 req.params.id로 조회 가능함
- e.g. :type 이면 req.params.type으로 조회 가능


- /users/123?limit=5&skip=10
=> req.params : { id: '123' }
=> req.query : { limit: '5', skip: '10'}

- 이 ':' 패턴을 사용할 때는 일반 라우터보다 뒤에 위치해야 함
- 다양한 라우터를 아우르는 와일드카드 역할을 하므로 일반 라우터보다 뒤에 있어야 방해를 하지 않음


## 템플릿 엔진
- html은 js가 없을 시 주어진 기능만 이용가능한 정적인 언어임
- 템플릿 엔진은 자바스크립트를 통해 html을 렌더링할 수 있게 해줌

### PUG
- 먼저 사용하기 위해서는 
``` JS
app.use('views', path.join(__dirname, 'views'));
app.use('view engine', 'pug')
``` 
- 가 있어야 함.
- /views 는 템플릿 파일들이 위치한 폴더를 지정하는 것
- res.render('index') 는 views.index.pug를 렌더링함

### EJS
- npm i ejs

``` JS
app.use('views', path.join(__dirname, 'views'));
app.use('view engine', 'ejs')
```



