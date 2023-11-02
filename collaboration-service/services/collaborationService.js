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

        socket.join(sessionId);
        socket.emit('join', sessionId);

        if (initSession.has(sessionId)) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
            initSession.set(sessionId, config.DEFAULT_TIME_LIMIT[session.difficulty]);
        }

        const initValue = await initCollaborativeCode(sessionId, session.language);
        const [startTime, language, codes] = initValue;

        let sessionTimer = setTimeout(async() => {
            io.to(sessionId).emit('system-terminate', sessionId);
            console.log("terminate here");

            await systemTerminate(sessionId, io);

        }, initSession.get(sessionId) - (Date.now() - startTime));

        console.log('user joined: ', userId);
        socket.to(sessionId).emit('user-joined', userId);

        console.log(`init code input storage for session ${sessionId}`);
        socket.emit('init-code', language, codes);

        socket.on('update-code', (line, code) => {
            console.log(`Code changed on line ${line}`);
            socket.broadcast.to(sessionId).emit('code-changed', line, code);
        });

        socket.on('clear', async() => {
            console.log(`Clearing code input storage for session ${sessionId}`);
            socket.broadcast.to(sessionId).emit('cleared', sessionId);
            await updateCollaborativeInput(sessionId, []);
        });

        socket.on('change-line', async(line, code) => {
            socket.broadcast.to(sessionId).emit('code-changed', line, code);
            if (line > 0 && code !== "") {
                await updateCollaborativeLineInput(sessionId, line, code, userId);
            }
        });

        socket.on('extend-time', async() => {
            console.log(`Extending time for session ${sessionId}`);

            const sessionLength = initSession.get(sessionId);
            const newSessionDuration = sessionLength + config.EXTENSION_TIME;

            if (newSessionDuration <= config.MAX_TIME_LIMIT) {
                console.log(`New session duration for session ${sessionId}: ${config.EXTENSION_TIME}`);

                clearTimeout(sessionTimer);

                io.to(sessionId).emit('time-extended', config.EXTENSION_TIME);

                sessionTimer = setTimeout(async() => {
                    io.to(sessionId).emit('system-terminate', sessionId);
                    await systemTerminate(sessionId, io);

                }, config.EXTENSION_TIME);

                initSession.set(sessionId, newSessionDuration);

            } else {
                console.log(`Reached Max Time ${sessionId}`);

                clearTimeout(sessionTimer);

                io.to(sessionId).emit('time-extended', config.MAX_TIME_LIMIT - sessionLength);

                sessionTimer = setTimeout(async() => {
                    io.to(sessionId).emit('system-terminate', sessionId);
                    await systemTerminate(sessionId, io);

                }, config.MAX_TIME_LIMIT - sessionLength);

                initSession.set(sessionId, config.MAX_TIME_LIMIT);
            }
        });

        socket.on('update-time', async(time) => {
            console.log(`Updating time for session ${sessionId}: ${time}`);

            clearTimeout(sessionTimer);

            sessionTimer = setTimeout(async() => {
                io.to(sessionId).emit('system-terminate', sessionId);
                await systemTerminate(sessionId, io);

            }, time);
        });

        socket.on('user-terminate', async(line, code) => {
            console.log(`User terminated session ${sessionId}`);

            clearTimeout(sessionTimer);

            socket.broadcast.to(sessionId).emit('notify-terminate', sessionId);

            if (line > 0 && code !== "") {
                await updateCollaborativeLineInput(sessionId, line, code, userId);
            }
            await endSession(sessionId);
            initSession.delete(sessionId);

            socket.disconnect();

            setTimeout(async() => {

                await systemTerminate(sessionId, io);

            }, config.SYSTEM_TERMINATE_TIMEOUT);
        });


        socket.on('ack-terminate', async(line, code) => {
            console.log(`User acknowledged termination for session ${sessionId}`);

            clearTimeout(sessionTimer);

            if (line > 0 && code !== "") {
                await updateCollaborativeLineInput(sessionId, line, code, userId);
            }
            socket.disconnect();
        });

        socket.on('disconnect', async() => {
            console.log('user disconnected: ', userId);

            clearTimeout(sessionTimer);

            socket.broadcast.to(sessionId).emit('user-disconnected', userId);
        });

        socket.on('reconnect', async() => {
            console.log('user reconnected: ', userId);
            
            const collaborativeInput =  await restoreCodeEditor(sessionId);
            
            socket.emit('success-reconnected', collaborativeInput);

            socket.broadcast.to(sessionId).emit('user-reconnected', userId);
        });

    } else {
        console.log('Collaboration session does not exist');

        await endSession(socket.handshake.query.sessionId);

        socket.disconnect();
    }
}

const systemTerminate = async(sessionId, io) => {
    console.log(`system terminated: ${sessionId}`);
    initSession.delete(sessionId);

    await endSession(sessionId);

    io.in(sessionId).disconnectSockets();
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