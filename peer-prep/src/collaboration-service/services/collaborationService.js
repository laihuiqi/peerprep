const io = require('../server');
const { getSession, endSession, getCurrentActiveSession } = require('../database/matchedPairDb');
const collaborativeInputDB = require('../database/collaborativeInputDb');
const config = require('../config/config');

let initSession = [];

const startCollaboration = async(socket) => {

    const collaborationSessionExist = await verifyCurrentSession(
        socket.handshake.query.sessionId, socket.handshake.query.userId);

    console.log(`Collaboration session exist: ${collaborationSessionExist}`);

    if (collaborationSessionExist) {
        console.log(`Socket starts: ${socket.id}`);

        const sessionId = socket.handshake.query.sessionId;
        const userId = socket.handshake.query.userId;
        const startTime = new Date().getTime();
        const session = await getSession(sessionId);
        const sessionDifficulty = session.difficulty;
        const sessionLanguage = session.language;

        let sessionTimer = setTimeout(async() => {
           await systemTerminate(sessionId, userId, socket);

        }, config.DEFAULT_TIME_LIMIT[sessionDifficulty]);

        socket.join(sessionId);
        socket.emit('join', sessionId);

        if (initSession.includes(sessionId)) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        initSession.push(sessionId);
        await collaborativeInputDB.initCollaborativeCode(sessionId, sessionLanguage);

        console.log('user joined: ', userId);
        console.log(`init code input storage for session ${sessionId}`);
        socket.to(sessionId).emit('user-joined', userId);

        socket.on('code-change', (line, code) => {
            socket.to(sessionId).emit('code-changed', line, code);
        });

        socket.on('clear', async() => {
            console.log(`Clearing code input storage for session ${sessionId}`);

            socket.to(sessionId).emit('cleared', sessionId);
            await collaborativeInputDB.updateCollaborativeInput(sessionId, []);
        });

        socket.on('change-line', async(line, code) => {
            await collaborativeInputDB.updateCollaborativeLineInput(sessionId, line, code, userId);
        });

        socket.on('extend-time', () => {
            console.log(`Extending time for session ${sessionId}`);

            const currTime = new Date().getTime();
            const newSessionDuration = currTime - startTime + config.EXTENSION_TIME;

            if (newSessionDuration <= config.MAX_TIME_LIMIT) {
                console.log(`New session duration for session ${sessionId}: ${newSessionDuration}`);

                clearTimeout(sessionTimer);

                io.to(sessionId).emit('time-extended', config.EXTENSION_TIME);

                sessionTimer = setTimeout(async() => {
                    await systemTerminate(sessionId, userId, socket);

                }, newSessionDuration - (currTime - startTime));

            } else {
                console.log(`New session duration for session ${sessionId}: ${config.MAX_TIME_LIMIT}`);

                clearTimeout(sessionTimer);

                io.to(sessionId).emit('time-extended', config.MAX_TIME_LIMIT - (currTime - startTime));

                sessionTimer = setTimeout(async() => {
                    await systemTerminate(sessionId, userId, socket);

                }, config.MAX_TIME_LIMIT - (currTime - startTime));
            }
        });

        socket.on('user-terminate', async(line, code) => {
            console.log(`User terminated session ${sessionId}`);

            clearTimeout(sessionTimer);

            socket.to(sessionId).emit('notify-terminate', sessionId);

            await collaborativeInputDB.updateCollaborativeLineInput(sessionId, line, code, userId);
            await endSession(sessionId);
            socket.disconnect();
        });


        socket.on('ack-terminate', async(line, code) => {
            console.log(`User acknowledged termination for session ${sessionId}`);

            clearTimeout(sessionTimer);

            await collaborativeInputDB.updateCollaborativeLineInput(sessionId, line, code, userId);
            socket.disconnect();
        });

        let terminateTimeout;

        socket.on('disconnect', () => {
            console.log('user disconnected: ', userId);

            socket.to(sessionId).emit('user-disconnected', userId);

            terminateTimeout = setTimeout(() => {
                systemTerminate(sessionId, userId, socket);

            }, config.DISCONNECTION_TIMEOUT);
        });

        socket.on('reconnect', () => {
            console.log('user reconnected: ', userId);

            socket.emit('success-reconnected', restoreCodeEditor(sessionId));

            socket.to(sessionId).emit('user-reconnected', userId);

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

    io.to(sessionId).broadcast('system-terminate', sessionId);
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

    const collaborativeInput = await collaborativeInputDB.getCollaborativeInput(sessionId);
    return collaborativeInput;
}

module.exports = {
    startCollaboration,
}