const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Domain = require('./domain')(sequelize, Sequelize);

// 1:N 관계
// 시퀄라이즈는 Post 모델에 userId 컬럼 추가
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// N:M 관계
// 시퀄라이즈가 관계를 분석하여 PostHashtag 테이블 자동 생성
// 컬럼명은 postId 와 hashtagId
// post 데이터에는 getHashtags, addHashtags 등의 메서드 추가
// hashtag 데이터에는 getPosts, addPosts등의 메서드 추가해줌
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });

// 같은 테이블끼리 N:M 관계를 가질 수 있음
// 같은 테이블 간의 N:M 관계에서는 모델 이름과 컬럼 이름을 따로 정해줘야 함
// through 옵션으로 생성할 모델 이름 Follow로 정함
// Follow 모델에서 컬럼을 구분하기 위해 foreignKey 옵션에 각각 followerId, followingId 추가
// as 옵션은 시퀄라이즈가 JSON 작업시 사용하는 이름 (getFollowings, addFollowing 등 메소드 자동 추가)
db.User.belongsToMany(db.User, {
	foreignKey: 'followingId',
	as: 'Followers',
	through: 'Follow',
});
db.User.belongsToMany(db.User, {
	foreignKey: 'followerId',
	as: 'Followings',
	through: 'Follow',
});

db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

module.exports = db;
