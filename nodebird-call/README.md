## API 호출 서버

### (GET /test)

- 사용자 토큰 인증 과정을 테스트해보는 라우터

1. 요청이 왔을 때 세션에 발급받은 토큰이 저장되어 있지 않다면
2. POST http://localhost:8002/v1/token 라우터로부터 토큰을 발급 (이 때 클라이언트 비밀키를 실어 보냄)
3. 발급에 성공했다면 발급받은 토큰으로 GET http://localhost:8002/v1/test 에 접근하여 토큰 테스트 (headers에 토큰을 담아서)

- axios 패키지는 프로미스 기반으로 동작하므로 async/await 문법과 함께 사용 가능, 다른 패키지에 비해 직관적인 요청 보낼 수 있음

##### axios.get(주소, { headers: { 헤더 } })

- 주소에 헤더와 함께 GET 요청을 보냄
- 응답결과는 await로 받은 객체의 data 속성에 있음 (result.data)
