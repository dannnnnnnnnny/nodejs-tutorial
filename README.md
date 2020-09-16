# Client - Server 통신

1. 회원가입시 Client를 통해 이메일, 이름, 패스워드를 입력 후 서버로 보냄
2. Body-parser를 통해 Client에서 보낸 값을 받음 (Body-parser dependency)

*Client가 없을 경우 Postman을 사용하여 요청해볼 수 있음
- React를 사용하여 Server 측으로 Request할 때, Axios를 사용
- 처음에 Axios 를 통해 server 측으로 axios.get() 을 보내면 404에러가 발생함.
=> Server는 port 5000, client는 port 3000 임
=> Cors 정책 때문 (Cross-Origin Resource Sharing)
=> 해결 방법 중, Proxy를 사용하는 방법으로 해결 
(https://create-react-app.dev/docs/proxying-api-requests-in-development/)

    * proxy 기능
    1. IP를 Proxy Server에서 임의로 바꿀 수 있음(인터넷에 접근하는 사람의 IP를 모르게 함)
    2. 보내는 데이터를 임의로 바꿀 수 있음.
    3. 방화벽 기능
    4. 웹 필터 기능
    5. 캐쉬 데이터, 공유 데이터 제공 기능

    * proxy 사용 이유
    1. 회사에서 직원들이나 집안에서 아이들 인터넷 사용 제어
    2. 캐쉬를 이용하여 더 빠른 인터넷 이용 제공
    3. 더 나은 보안 제공
    4. 이용 제한된 사이트 접근 가능

* Concurrently
: 프론트엔드, 백엔드 서버 한번에 켜기
in package.json
    "start": "concurrently \"command1 arg\" \"command2 arg\""
    - "dev": "concurrently \"npm run backend\" \"npm run start --prefix client\"" (이런 식으로 작성 --prefix 해주면 client를 찾아서 직접 실행시켜줌)


# Node Mon
: 소스를 변경할 때 그걸 감지해서 자동으로 서버를 재시작해주는 툴
npm install nodemon --save-dev
(-dev를 붙이면 로컬에서 개발모드일때 사용한다는 뜻)


# 패스워드 암호화
- Postman의 body raw를 통해 {"name":~~, "password":~~} 이런식으로 값을 넘기면 데이터베이스에 그대로 들어가기 때문에 안전하지 않음.
- Bcrypt를 이용하여 비밀번호를 암호화 후 저장

---------------------------------------------------

# React 라이브러리
- Real DOM 과 다르게 Virtual DOM 은 하나가 업데이트 되었을 때
전체를 업데이트 하는 것이 아니라 바뀐 하나만 DOM에서 바꿔줌

1. JSX 렌더링 -> Virtual DOM Update
2. Virtual DOM이 이전 virtual DOM에서 찍어둔 Snapshot와 비교해서 바뀐 부분 찾음 ('diffing')
3. 바뀐 부분만 Real DOM에서 바꿔줌

# Babel
: 최신 자바스크립트 문법을 지원하지 않는 브라우저들을 위해서
최신 자바스크립트 문법을 구형 브라우저에서도 돌 수 있게 반환시켜줌.

# Webpack
: 많은 모듈들을 합해서 간단하게 만들어줌
create-react-app 으로 생성된 폴더/파일들에서 src폴더만
webpack이 관리를 해줌. public은 관리를 해주지 않기 때문에
이미지 파일들을 앱에 넣고 싶을 때는 src에 넣어줘야 webpack이 파일들을 모아줌.


# NPX & NPM
- NPM : 레지스트리, 라이브러리를 담는 역할 / 빌드 역할 (package.json) 
npm install -g : '-g' 명령어를 주면 global로 다운로드가 되어 윈도우 같은 경우 '%AppData%/npm'에 다운이 됨.

- NPX : 다운받지 않고 npm registry에서 create-react-app을 찾아서 실행시켜줌
    - NPX의 장점 :
    1. Disk Space를 낭비하지 않음
    2. 항상 최신 버전을 사용할 수 있음


---------------------------------------------------
# client (react) 설명
_actions, _reducer : Redux를 위한 폴더
components/views : 각종 Page들

App.js : Routing 관련 처리
Config.js : 환경 변수 관리
hoc : Higher Order Components, 인증이나 권한 등 처리
utils : 여러 군데서 사용할 것들 담음

---------------------------------------------------
# CSS Framework
: 기능을 만드는 데 더욱 집중하기 위해서 사용
    - 종류
    1. Material UI
    2. React Bootstrap
    3. Semantic UI
    4. Ant Design
    5. Materialize
    ...

---------------------------------------------------
# Redux
- 상태(state) 관리 라이브러리

    React =>
    1. Props
        - Properties
        - 컴포넌트 간에 주고받을 때 props 사용
        - 소통 방식 ( 부모 -> 자식 )
        - 불변 객체 (부모에서 넘어온 props는 자식에서 바꿀 수 없음)
    2. State
        - props처럼 data를 보내는게 아닌 컴포넌트 안에서 데이터 전달 ( 검색 창에 글 입력시 글이 변하는 것은 state를 바꾼 것)
        - 가변 객체
        - state가 변하면 re-render 됨

    * Redux 데이터 Flow (한방향으로만 흐름)
    Action --> Reducer --> Store -(Subscribe)-> React Component -(Dispatch(action))-> Action 반복 

    - Action : ex) 객체 형식 {type: 'LIKE_ARTICLE', articleId: 42}  // id 42를 좋아요 했다는 의미
    - Reducer : (previousState, action) => nextState // 이전 state와 action object를 받은 후 변한 new state를 return 함
    - Store : 전체적인 State을 감싸주는 역할, Store안의 메소드를 통해 state를 관리할 수 있음

    * redux 미들웨어
    redux를 더 잘 다룰 수 있게 해주는 도구
    : store의 state을 변경하고싶을 때는 dispatch를 이용하여 action(객체 형식)을 통해 바꿀 수 있는데, 언제나 객체 형식의 action을 받는 것이 아니라 promise 나 function 으로 받을 수도 있음.

    - redux-promise : dispatch에게 promise을 받는 방법을 알려줌
    - redux-thunk : dispatch에게 function을 받는 방법을 알려줌

---------------------------------------------------
# React Hooks
* 클래스 컴포넌트
    - 많은 기능들을 사용 가능
    - 코드가 길어짐
    - 복잡해짐
    - 느린 퍼포먼스

* 함수형 컴포넌트
    - 제공하는 기능이 한정됨
    - 코드가 짧아짐
    - 가독성이 좋음
    - 빠른 퍼포먼스

* 클래스 컴포넌트 사용시 LifeCycles
- Mounting, Updating, Unmounting ...
=> 함수형 컴포넌트에서 사용할 수가 없음
=> But, React Hooks를 통해 함수형 컴포넌트에서도 LifeCycles 사용 가능해짐


---------------------------------------------------
# Auth Check
- 아무나 진입 가능한 페이지
ex) LandingPage, AboutPage

- 로그인한 회원만 진입 가능한 페이지
ex) DetailPage

- 로그인한 회원은 진입 못하는 페이지
ex) RegisterPage, LoginPage

- 관리자만 진입 가능한 페이지
ex) AdminPage