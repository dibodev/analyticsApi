import SocketIoService from 'App/Services/SocketIoService'

SocketIoService.boot()

/**
 * Listen for incoming socket connections
 */
SocketIoService.io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' })
})
