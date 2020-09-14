# Client - Server 통신

1. 회원가입시 Client를 통해 이메일, 이름, 패스워드를 입력 후 서버로 보냄
2. Body-parser를 통해 Client에서 보낸 값을 받음 (Body-parser dependency)

*Client가 없을 경우 Postman을 사용하여 요청해볼 수 있음


# Node Mon
: 소스를 변경할 때 그걸 감지해서 자동으로 서버를 재시작해주는 툴
npm install nodemon --save-dev
(-dev를 붙이면 로컬에서 개발모드일때 사용한다는 뜻)


# 패스워드 암호화
- Postman의 body raw를 통해 {"name":~~, "password":~~} 이런식으로 값을 넘기면 데이터베이스에 그대로 들어가기 때문에 안전하지 않음.
- Bcrypt를 이용하여 비밀번호를 암호화 후 저장
