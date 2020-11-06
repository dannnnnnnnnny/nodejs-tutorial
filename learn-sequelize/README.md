## 시퀄라이즈(Sequelize)
- 시퀄라이즈는 ORM으로 분류됨
- ORM은 자바스크립트 객체와 데이터베이스의 릴레이션을 매핑해주는 도구

- npm i sequelize mysql2
- npm i -g sequelize-cli
- sequelize init

- sequelize init 명령 호출시 config, models, migrations, seeders 폴더가 생성됨
- /models/index.js 의 자동 생성된 코드는 그대로 사용할 때 에러가 발생하고, 필요 없는 부분이 많기 때문에 수정해줌
``` JS
const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname + '..', 'config', 'cobnfig.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

``` 

- 시퀄라이즈를 통해 Express 앱와 Mysql을 연결시킴
``` JS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sequelize = require('./models').sequelize;

var app = express();
sequelize.sync();
```
- sequelize.sync()를 통해 서버 실행시 알아서 MySQL과 연동됨

### 모델 정의
- MySQL에서 정의한 테이블을  시퀄라이즈에도 정의해야 함.
- MySQL 테이블은 시퀄라이즈의 모델과 대응됨
- 시퀄라이즈는 모델과 MySQL 테이블을 연결해주는 역할

- User와 Comment 모델을 만들어 users 테이블과 comments 테이블에 연결
- 시퀄라이즈는 기본적으로 모델 이름은 단수형, 테이블 이름은 복수형으로 사용

``` JS
// /models/users.js

const { DataTypes } = require("sequelize/types");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    
    return sequelize.define('user', {
        name : {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        age: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        married : {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        created_at : {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        timestamps: false,
    });
};
```
- 시퀄라이즈는 알아서 id를 기본키로 연결하므로 id 컬럼은 적어줄 필요 X
- sequelize.define 메소드로 테이블명과 각 컬럼의 스펙을 입력
- MySQL 테이블과 컬럼 내용이 일치해야 정확하게 대응됨

- 시퀄라이즈 자료형은 MySQL과 조금 다른데
- VARCHAR : STRING
- INT : INTEGER
- TINYINT : BOOLEAN,
- DATETIME : DATE
- (INTEGER.UNSIGNED는 UNSIGND옵션이 적용된 INT이며, ZEROFILL 옵션을 사용하고 싶다면 INTEGER.UNSIGNED.ZEROFILL)

- define 메소드의 세번째 인자는 테이블 옵션



``` JS
// /models/index.js

...
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./users')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
...

```
- user 모델과 comment 모델 생성 후 /model/index.js에서 db 객체에 User와 Comment 모델을 담음

``` JS
// /config/config.json
{
  "development": {
    "username": "root",
    "password": "1234",
    "database": "nodejs",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
```
- config.json의 test와 production 쪽은 각각 테스트 용도와 배포 용도로 사용되는 것이므로 지금은 삭제함
- password와 database를 수정하고 operatorsAliases 는 보안에 취약한 연산자를 사용할지 여부를 설정하는 옵션

- 이 설정은 process.env.NODE_ENV가 development일 때 적용


### 관계 정의
* users 테이블과 comments 테이블 간이 관계 정의
- 사용자 1명은 댓글을 여러 개 작성 가능
- 하지만 댓글 하나에 사용자가 여러 명일 수 없음
=> 이러한 관계를 일대다 (1:N) 관계

- MySQL에서는 JOIN 이라는 기능으로 여러 테이블 간의 관계를 파악해 결과를 도출하는데, 시퀄라이즈는 JOIN 기능도 알아서 구현해줌. 대신 시퀄라이즈에게 테이블 간에 어떠한 관계가 있는지 알려줘야 함.

#### 1:N
- 시퀄라이즈에서는 1:N 관계를 hasMany라는 메서드로 표현함 (users 테이블의 로우 하나를 불러 연결된 comments 테이블 로우를 불러올 수 있음)
- 반대로 belongsTo 메서드로 comments 테이블 로우를 불러올 때 연결된 users 테이블의 로우도 가져올 수 있음.

``` JS
// /models/index.js
...
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./users')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

db.User.hasMany(db.Comment, { foriegnKey: 'commenter', sourceKey: 'id' });
db.Comment.belongsTo(db.User, {foriegnKey: 'commenter', targetKey: 'id' });

module.exports = db;
```
- npm start 해보면 콘솔에 시퀄라이즈가 스스로 실행하는 SQL문이 나옴


#### 1:1
- 1:1 관계에서는 hasMany 메서드 대신 hasOne 메서드 사용
- 사용자 정보를 담고 있는 가상의 Info 모델이 있다고 하면
``` JS
db.User.hasOne(db.Info, { foriegnKey: 'user_id', sourceKey: 'id' });
db.Info.belongsTo(db.User, { foreignKey: 'user_id', targetKey: 'id'});
```


#### N:M
- 시퀄라이즈는 N:M 관계를 표현하기 위해 belongsToMany 메서드가 있음
- 게시글 정보를 담고 있는 가상의 Post 모델과 해시태그 정보를 담고 있는 가상의 Hashtag 모델이 있다면
``` JS
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
```
- N:M 관계 특성상 새로운 모델이 생성됨
- through 속성에 그 이름을 적어주면 됨
- 새로 생성된 PostHashtag 모델에는 게시글과 해시태그의 아이디가 저장됨

- N:M 에서는 데이터를 조회할 때 여러 단계를 거쳐야 함.
- 노드 해시태그를 사용한 게시물을 조회하는 경우, 먼저 노드 해시태그를 Hashtag 모델에서 조회하고 가져온 태그의 아이디(1)를 바탕으로 PostHashtag 모델에서
hashtagId가 1인 postId들을 찾아 Post모델에서 정보를 가져와야 함.
=> 시퀄라이즈는 이 과정을 편하게 할 수 있도록 몇가지 메서드를 지원함

``` JS
// async / await
async (req, res, next) => {
    const tag = await Hashtag.findOne({ where: { title: '노드' } });
    const posts = await tag.getPosts();
}
```
- 해시태그를 찾으면 그 해시태그에서 바로 getPosts 메서드를 사용할 수 있음 (get + 모델이름의 복수형)

``` JS
// Promise
Hashtag.findOne({ where: { title: '노드' } })
    .then(tag => tag.getPosts())
    .then(posts => console.log(posts));
```


- (get + 모델이름 복수형)과 비슷한 것으로 add + 모델이름 복수형이 있음
- 두 테이블 간 N:M 관계를 추가해줌

``` JS
async (req, res, next) => {
    const tag = await Hashtag.findOne({ where: { title: '노드' } });
    await tag.addPosts(3)
}
```
- PostHashtag 모델에 postId가 3이고 hashtagId가 1인 Raw가 생성됨


### 시퀄라이즈 CRUD 쿼리
``` SQL
-- SQL 쿼리 --
INSERT INTO users (name, age, married, comment) VALUES ('zero', 24, 0, '자기소개1');
```
``` JS
// JavaScript Sequelize 쿼리
const { User } = require('../models')
User.create({
    name: 'zero',
    age: 24,
    married: false,
    comment: '자기소개1',
});
```
- models 모듈의 User 모델을 불러와서 create 메서드를 사용
- MySQL의 자료형이 아닌 시퀄라이즈 모델에 정의한 자료형대로 넣어줘야 함. (married가 0이 아닌 false)


* 유저의 모든 데이터 조회
``` SQL
-- SQL 쿼리 --
SELECT * FROM users;
```
``` JS
User.findAll({});
```

* 원하는 컬럼만 조회
``` SQL
-- SQL 쿼리 --
SELECT name, married FROM users;
```
``` JS
User.findAll({
    attributes: ['name', 'married'],
});
```

* where 옵션 추가
``` SQL
-- SQL 쿼리 --
SELECT name, age FROM users WHERE married = 1 AND age > 30;
```
``` JS
const { User, Sequelize: { Op } } = require('../models');
User.findAll({
    attributes : ['name', 'age'],
    where : {
        married: 1,
        age: { [Op.gt]: 30 },
    }
});
```
- 시퀄라이즈는 자바스크립트 객체를 사용해서 쿼리를 생성해야 하므로 Op.gt같은 특수한 연산자들이 사용됨. Sequelize 객체 내부의 Op 객체를 불러와서 사용.
- (Op.gt, Op.gte, Op.lt, Op.lte, Op.ne, Op.or, Op.in, Op.notIn)

* Op.or 예제
``` JS
const { User, Sequelize: { Op } } = require('../models');
User.findAll({
    attributes : ['name', 'age'],
    where : {
        [Op.or]: [ { married: 0 }, { age: { [Op.gt]: 30 } } ]
    }
});
```
- OR 연산에 적용할 쿼리를 배열로 나열


* 시퀄라이즈 정렬
``` SQL
-- SQL 쿼리 --
SELECT id, name FROM users ORDER BY age DESC;
```
``` JS
User.findAll({
    attributes : ['name', 'age'],
    order: [['age', 'DESC']],
});
```
- order 옵션을 통해 사용가능 (배열안에 배열 -> 정렬은 기준 컬럼 2개 이상으로 할수도 있기 때문)


* 시퀄라이즈 Limit
``` SQL
-- SQL 쿼리 --
SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
```
``` JS
User.findAll({
    attributes : ['name', 'age'],
    order: [['age', 'DESC']],
    limit: 1,
});
```

* 시퀄라이즈 offset
``` SQL
-- SQL 쿼리 --
SELECT id, name FROM users ORDER BY age DESC LIMIT 1 OFFSET 1;
```
``` JS
User.findAll({
    attributes : ['name', 'age'],
    order: [['age', 'DESC']],
    limit: 1,
    offset: 1,
});
```

* 시퀄라이즈 update
``` SQL
-- SQL 쿼리 --
UPDATE users SET comment = '바꿀 내용' WHERE id=2;
```
``` JS
User.update({
    comment: '바꿀 내용',
}, {
    where: { id: 2 },
});
```
- 첫 번째 인자는 수정할 내용, 두 번째 인자는 수정 대상 로우를 찾는 조건

* 시퀄라이즈 update
``` SQL
-- SQL 쿼리 --
DELETE FROM users WHERE id=2;
```
``` JS
User.destroy({
    where: { id: 2 },
});
```
- destroy 메서드로 삭제.
- where 옵션에 조건들을 작성
