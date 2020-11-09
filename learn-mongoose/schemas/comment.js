const mongoose = require('mongoose')

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const commentSchema = new Schema({
    commenter: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// 첫 번째 인자로 컬렉션 이름 생성 (e.g. User => users로 생성됨)
// mongoose.model('Comment', commentSchema, 'comment_table'); 이렇게 세 번째 인자로 컬렉션 이름을 강제할 수도 있음
module.exports = mongoose.model('Comment', commentSchema);
