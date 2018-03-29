import * as Io from 'socket.io'
import * as Express from 'express'
import * as Htpp from 'http'


let app = Express()
let http = new Htpp.Server(app)
let io = Io(http,{
  path:'/showCode'
})


io.on('connect', function (socket) {
  let room = socket.handshake.query.room
  if(!room) {
    socket.emit('message','请先设置房间号room')
    socket.disconnect(true)
  }
  socket.join(room)
  socket.on('codeChange', function (data) {
    socket.to(room).emit('codeChange', data)
  })
  socket.on('mouseMove', function (data) {
    socket.to(room).emit('mouseMove', data)
  })
  socket.on('cursorChange', function (data) {
    socket.to(room).emit('cursorChange', data)
  })
})

http.listen(3001)