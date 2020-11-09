## MongoDB
- mongoDB의 특징 중 하나는 JS 문법을 사용한다는 것
- 노드도 자바스크립트를 사용하므로 DB마저 mongoDB를 사용한다면 JS만 사용하여 웹 애플리케이션을 만들 수 있음 (하나의 언어만 사용하면되므로 생산성이 높음)

### SQL과의 차이
- 자유로운 데이터 입력
- 컬렉션 간 JOIN 미지원
- 트랜잭션 미지원
- 확장성, 가용성
- 용어 (컬렉션, 도큐먼트, 필드)


- NoSQL은 테이블에 상응하는 컬렉션이라는 개념이 있긴 하지만 컬럼을 따로 정의하지 않고 고정된 테이블이 없음.

=> 트랜잭션도 안되고 JOIN도 안되지만 MongoDB를 사용하는 이유는 확장성과 가용성 때문 (데이터 일관성을 보장해주는 기능이 약한 대신 데이터를 빠르게 넣을 수 있고, 쉽게 여러 서버에 데이터를 분산할 수 있음)


### Create
- 컬렉션에 컬럼을 정의하지 않아도 컬렉션에는 아무 데이터나 넣을 수 있음
- db.users.insert({ name: "", age: , comment: "", married: false, createAt: new Date()})
- db.users.save({ name: "", age: , comment: "", married: false, createAt: new Date()})

### Read
* 전체 조회
- db.users.find({})
- db.comments.find({})

* 특정 필드 조회
- db.users.find({}, { _id: 0, name: 1, married: 1 });
=> 두 번째 인자로 조회할 필드 삽입 (1 또는 true로 표시한 필드만 가져옴)

* 조건 추가
- db.users.find({ age: {$gt: 30}, married: true}, {name: 1, age: 1});

* OR 연산
- db.users.find({ $or : [{age : {$gt: 30}}, {married: false}]}, {name: 1, age: 1});

* Sort (-1은 내림차, 1은 오름차)
- db.users.find({}, {_id: 0, name: 1, age: 1}).sort({ age: -1 })

* 조회할 도큐먼트 갯수 설정
- db.users.find({}).limit(1)

* 건너뛰기
- db.users.find({}).skip(1)

### Update
- db.users.update({ name: 'dh' }, { $set: { comment: "안녕" } })
=> 첫 번째 인자는 수정할 도큐먼트 객체 지정, 두 번째 객체는 수정할 내용을 입력하는 객체

### Delete
- db.users.remove({ name: "kim" })


## Mongoose
- MySQL의 Sequelize와 다르게 ORM이 아닌 ODM이라고 불림
- 몽구스에는 스키마라는 것이 존재함. MongoDB는 자유롭지만 실수를 할 수도 있기 때문에, 몽구스는 데이터를 넣기 전에 노드 서버단에서 데이터를 한 번 필터링하는 역할을 해줌
- MySQL의 JOIN 기능을 populate 메소드로 어느 정도 보완 가능

* id 조회
``` JS
router.get('/blog/:id', function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        ...
    })
})
```
* id 조회 및 수정
``` JS
router.put('/blog/:id', function(req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        ...
    })
})
```


#### npm i mongoose
