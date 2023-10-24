const { getSession, endSession, getCurrentActiveSession } = require('../database/matchedPairDb');
const { initCollaborativeCode, updateCollaborativeInput, updateCollaborativeLineInput, getCollaborativeInput } = require('../database/collaborativeInputDb');
const config = require('../config/config');

let initSession = new Map();

const startCollaboration = async(socket, io) => {

    const collaborationSessionExist = await verifyCurrentSession(
        socket.handshake.query.sessionId, socket.handshake.query.userId);

    console.log(`Collaboration session exist: ${collaborationSessionExist}`);

    if (collaborationSessionExist) {
        console.log(`Socket starts: ${socket.id}`);

        const sessionId = socket.handshake.query.sessionId;
        const userId = socket.handshake.query.userId;
        const session = await getSession(sessionId);

        let sessionTimer = setTimeout(async() => {
            io.emit('system-terminate', sessionId);
            console.log("terminate here");
            await systemTerminate(sessionId, userId, socket);

        }, config.DEFAULT_TIME_LIMIT[session.difficulty]);

        socket.join(sessionId);
        socket.emit('join', sessionId);

        if (initSession.has(sessionId)) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        initSession.set(sessionId, config.DEFAULT_TIME_LIMIT[session.difficulty]);
        const { language, codes } = await initCollaborativeCode(sessionId, session.language);

        console.log('user joined: ', userId);
        socket.to(sessionId).emit('user-joined', userId);
        console.log(`init code input storage for session ${sessionId}`);
        socket.emit('init-code', language, codes);

        socket.on('update-code', (line, code) => {
            socket.broadcast.to(sessionId).emit('code-changed', line, code);
        });

        socket.on('clear', async() => {
            console.log(`Clearing code input storage for session ${sessionId}`);

            socket.broadcast.to(sessionId).emit('cleared', sessionId);
            await updateCollaborativeInput(sessionId, []);
        });

        socket.on('change-line', async(line, code) => {
            await updateCollaborativeLineInput(sessionId, line, code, userId);
            socket.broadcast.to(sessionId).emit('code-changed', line, code);
        });

        socket.on('extend-time', async() => {
            console.log(`Extending time for session ${sessionId}`);

            const sessionLength = initSession.get(sessionId);
            const newSessionDuration = sessionLength + config.EXTENSION_TIME;

            if (newSessionDuration <= config.MAX_TIME_LIMIT) {
                console.log(`New session duration for session ${sessionId}: ${newSessionDuration}`);

                clearTimeout(sessionTimer);

                io.emit('time-extended', config.EXTENSION_TIME);

                sessionTimer = setTimeout(async() => {
                    io.emit('system-terminate', sessionId);
                    await systemTerminate(sessionId, userId, socket);

                }, config.EXTENSION_TIME);

            } else {
                console.log(`New session duration for session ${sessionId}: ${config.MAX_TIME_LIMIT}`);

                clearTimeout(sessionTimer);

                io.emit('time-extended', config.MAX_TIME_LIMIT - sessionLength);

                sessionTimer = setTimeout(async() => {
                    io.to(sessionId).emit('system-terminate', sessionId);
                    await systemTerminate(sessionId, userId, socket);

                }, config.MAX_TIME_LIMIT - sessionLength);
            }
        });

        socket.on('user-terminate', async(line, code) => {
            console.log(`User terminated session ${sessionId}`);

            clearTimeout(sessionTimer);

            socket.broadcast.to(sessionId).emit('notify-terminate', sessionId);

            await updateCollaborativeLineInput(sessionId, line, code, userId);
            await endSession(sessionId);
            socket.disconnect();
        });


        socket.on('ack-terminate', async(line, code) => {
            console.log(`User acknowledged termination for session ${sessionId}`);

            clearTimeout(sessionTimer);

            await updateCollaborativeLineInput(sessionId, line, code, userId);
            socket.disconnect();
        });

        let terminateTimeout;

        socket.on('disconnect', async() => {
            console.log('user disconnected: ', userId);

            socket.broadcast.to(sessionId).emit('user-disconnected', userId);

            terminateTimeout = setTimeout(async() => {
                console.log("terminate diconn");
                await systemTerminate(sessionId, userId, socket);

            }, config.DISCONNECTION_TIMEOUT);
        });

        socket.on('reconnect', () => {
            console.log('user reconnected: ', userId);

            socket.emit('success-reconnected', restoreCodeEditor(sessionId));

            socket.broadcast.to(sessionId).emit('user-reconnected', userId);

            clearTimeout(terminateTimeout);
        });

    } else {
        console.log('Collaboration session does not exist');

        await endSession(socket.handshake.query.sessionId);
        socket.disconnect();
    }
}

const systemTerminate = async(sessionId, userId, socket) => {
    console.log(`system terminated: ${sessionId} for user ${userId}`);

    await endSession(sessionId);
    socket.disconnect();
}

const verifyCurrentSession = async(sessionId, userId) => {
    console.log(`Verifying current session ${sessionId} for user ${userId}`);

    const currentSessionId = await getCurrentActiveSession(userId);
    return sessionId === currentSessionId;
}

const restoreCodeEditor = async(sessionId) => {
    console.log(`Restoring code editor for session ${sessionId}`);

    const collaborativeInput = await getCollaborativeInput(sessionId);
    return collaborativeInput;
}

module.exports = {
    startCollaboration
}