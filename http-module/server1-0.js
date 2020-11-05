const http = require('http')

const server = http.createServer((req, res) => {
    res.write('<h1>Hello node</h1>')
    res.end('<h1>Hello server</h1>')
})

server.listen(8080)

server.on('listening', () => {
    console.log("8080 포트 서버 대기중")
})

server.on('error', (error) => {
    console.error(error)
})
