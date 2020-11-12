## 웹 API 서버

#### /models/domain.js

- 도메인을 등록하는 기능을 하는 도메인 모델
- validate 설정은 데이터를 추가로 검증하는 속성
- unknownType이라는 검증기 생성 (free와 premium 중 하나만 선택 가능)
- 등록한 도메인에서만 API를 사용할 수 있게 하기 위함
- 웹 브라우저에서 요청을 보낼 때, 응답을 하는 곳과 도메인이 다르면 CORS 에러 발생

#### /routes/index.js

- (GET /) 루트 라우터는 접속 시 로그인 화면을 보여줌
- (POST /domain) 폼으로부터 온 데이터를 도메인 모델에 저장

- clientSecret을 uuid 모듈을 통해 생성. uuid는 범용 고유 식별자로 고유한 문자열을 만들고 싶을 때 사용
- clientSecret에 고유한 문자열을 부여하기 위해
