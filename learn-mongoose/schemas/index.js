const mongoose = require('mongoose')

module.exports = () => {
    const connect = () => {
        
        // 1) 개발 환경이 아닐 때 몽구스가 생성하는 쿼리 내용을 콘솔을 통해 확인
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }

        // 2) 몽구스와 몽고디비 연결, 몽고디비 주소로 접속 시도.
        // 접속 시도하는 주소의 DB는 admin이지만 실제 사용할 DB는 nodejs이므로
        // 2번째 인자로 dbName을 주어 사용
        // 마지막 인자로 주어진 콜백 함수를 통해 연결 여부 확인
        mongoose.connect('mongodb://root:1234@localhost:27017/admin', {
            dbName: 'nodejs',
        }, (error) => {
            if (error) {
                console.log('MongoDB Error', error);
            } else {
                console.log('접속 성공')
            }
        });
    };
    
    connect();

    // 몽구스 커넥션에 이벤트 리스너 장착
    // 에러 발생시 에러 내용 기록 / 연결 종료 시 재연결
    mongoose.connection.on('error', (error) => {
        console.log('MongoDB 연결 에러', error);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB 연결이 끊김. 연결 재시도');
        connect();
    });

    require('./user');
    require('./comment');
}