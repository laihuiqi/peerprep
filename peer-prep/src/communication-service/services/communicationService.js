const communicationPair = new Map();

const startCommunication = async(socket) => {

    const sessionId = socket.handshake.query.sessionId;
    const userId = socket.handshake.query.userId;

    let collaborators;

    socket.join(sessionId);
    socket.emit('join', sessionId);

    if (communicationPair.has(sessionId)) {
        collaborators = communicationPair.get(sessionId);

        if (collaborators && !collaborators.includes(userId)) {
            collaborators.push(userId);
            communicationPair.set(sessionId, collaborators);

            socket.to(sessionId).emit('collaborator-joined', userId);
        }
    } else {
        collaborators = [userId]
        communicationPair.set(sessionId, collaborators);
    }

    socket.on('recv-join', () => {
        console.log('recv-join from ', userId);
        socket.to(sessionId).emit('collaborator-recv-join', userId);
    });

    socket.on('call', (offer) => {
        console.log(userId, ' calls collaborator');
        socket.to(sessionId).emit('called', offer);
    });

    socket.on('answer', (answer) => {
        console.log(userId, ' answers call');
        socket.to(sessionId).emit('answered', answer);
    });

    socket.on('disconnect', () => {
        console.log(userId, ' disconnect');
        communicationPair.delete(sessionId);
        socket.to(sessionId).emit('collaborator-disconnected');
    });

}

module.exports = {
    startCommunication
}