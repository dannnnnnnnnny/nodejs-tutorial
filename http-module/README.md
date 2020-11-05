### 쿠키
- client에서 보내는 요청에는 하나의 단점이 있는데, 누가 요청을 보내는지 모른다는 것임.
- 누구인지 기억하기 위해, 서버는 요청에 대한 응답을 할 때 쿠키라는 것을 같이 보내줌
- 쿠키는 '키-값' 쌍 형태

#### server3.js
- createServer 메소드의 콜백에서 req 객체의 req.headers.cookie에 쿠키가 담겨 있음
- req.headers : 요청의 헤더
- 응답의 헤더에 쿠키를 기록해야 하므로 res.writeHead 메소드 사용

#### server4.js & html
- Cookie에 이름을 담아서 보내는게 아닌, randomInt라는 임의의 숫자를 보냄
- 사용자의 이름과 만료 시간은 session 객체에 대신 저장
- cookie.session이 존재하며, 만료 기한을 넘기지 않았다면 session 변수에서 사용자 정보를 가져와서 사용 가능
=> 이 방식이 세션 방식

- 서버에 사용자 정보를 저장하고 클라이언트와는 세션 아이디로만 소통
- 꼭 쿠키를 이용해서 세션 아이디를 주고받지 않아도 되지만 제일 간단함
- 실제 배포용 서버에서는 보통은 변수로 두지 않고 데이터베이스에 저장해둠


## REST API 와 라우팅
서버에 요청을 보낼 때는 주소를 통해 요청의 내용을 표현
(주소가 /index.html이면 서버의 index.html을 보내달라는 뜻)
=> 요청이 항상 html을 요구할 필요는 없음 
- 위의 예제 처럼 /login을 통해서도 요청이 가능함
- 이렇게 서버가 이해하기 쉬운 주소를 사용하는 것이 좋은데, 여기서 REST API가 등장함.

### REST API ( /http-module/rest )
- REpresentatinal State Transfer 의 약어
- 네트워크 구조의 한 형식
- 서버의 자원을 정의하고 자원에 대한 주소를 지정하는 방법을 가리킴
- 주소는 의미를 명확히 전달하기 위해 명사로 구성
- /user는 사용자 정보에 관련된 자원을 요청, /post는 게시글에 관련된 자원을 요청하는 것
- REST API는 주소 외에도 HTTP 요청 메서드라는 것을 사용 (GET, POST, PUT, PATCH, DELETE)
- 주소 하나가 요청 메소드를 여러개 가질 수 있음
- 또한 HTTP 프로토콜 사용시 클라이언트가 누구든 상관없이 서버와 소통 가능 (서버와 클라이언트의 분리)

 #### /rest/restFront.js
- 페이지가 로딩되면 GET /users로 사용자 목록 가져옴 (getUser())
- 수정 버튼과 삭제 버튼에 각각 PUT /users/사용자id와 DELETE /users/사용자id로 요청 보내도록 지정
- form 제출할 때는 POST /users 로 데이터와 함께 요청 보냄

#### /rest/restServer.js
- 요청이 어떤 메소드를 사용했는지 req.method로 확인가능하며, method를 기준으로 분기


### https
- https 모듈은 웹서버에 SSL 암호화를 추가
- GET이나 POST 요청을 할 때 오고 가는 데이터를 암호화해서 중간에ㅔ 다른 사람이 요청을 가로채더라도 내용을 확인할 수 없게 함.

- http 모듈과 거의 비슷하지만 https의 createServer 메소드는 인자를 2개 받음.
- 두번째 인자는 http 모듈과 같이 서버 로직이고, 첫번째 인자는 인증서에 관련된 옵션 객체
- 인증서를 구입하면 pem이나 crt, 또는 key 확장자를 가진 파일들을 제공해줌 (알맞게 넣어주면 됨)

### http2
- http2는 SSL 암호화와 더불어 최신 HTTP 프로토콜인 http/2