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

