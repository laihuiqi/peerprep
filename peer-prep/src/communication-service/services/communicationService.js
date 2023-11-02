const startCommunication = async(socket, io) => {

    socket.on('create', function (callback) {
        console.log('caller at', socket.id);
        callback(socket.id);
    });

    const sessionId = socket.handshake.query.sessionId;
    const userId = socket.handshake.query.userId;

    socket.join(sessionId);
    socket.emit('join', sessionId);

    socket.on('candidate', (event) => {
        socket.broadcast.to(sessionId).emit('served-candidate', event);
    });

    socket.on('offer', (event) => {
        socket.broadcast.to(sessionId).emit('offered', { event: event.sdp, caller: socket.id });
    });

    socket.on('answer', (event) => {
        socket.broadcast.to(sessionId).emit('answered', event.sdp);
    });
}

module.exports = {
    startCommunication
}