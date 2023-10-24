const { endSession } = require("../database/matchedPairDb");

const socketURL = 'http://localhost:3002';
const changeLine = document.getElementById('changeLine');
const clear = document.getElementById('clear');
const extend = document.getElementById('extendTime');
const terminate = document.getElementById('terminate');
const acknowledge = document.getElementById('ack');

let userId;
let sessionId;

// eslint-disable-next-line no-undef
var clientSocket = io(socketURL, { retries: 3, query: { userId: userId, sessionId: sessionId }});

changeLine.addEventListener('click', () => {
    clientSocket.emit('change-line', 1, 'console.log("hello world");');
});

clear.addEventListener('click', () => {
    clientSocket.emit('clear');
});

extend.addEventListener('click', () => {
    clientSocket.emit('extend-time');
});

terminate.addEventListener('click', () => {
    clientSocket.emit('user-terminate', 2, 'console.log("goodBye");');
});

acknowledge.addEventListener('click', () => {
    clientSocket.emit('ack-terminate', 1, 'console.log("okeii bye");');
});

clientSocket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

clientSocket.on('reconnect', () => {
    console.log('Reconnected to the server');
});

clientSocket.on('join', (recvSessionId) => {
    console.log('Joined session:', recvSessionId);
    return recvSessionId;
});

clientSocket.on('user-joined', (userId) => {
    console.log(`Collaborator ${userId} has joined:`);
    return userId;
});

clientSocket.on('init-code', (question, codes) => {
    console.log('Question fetched');
    return [question, codes];
});

clientSocket.on('code-changed', (line, code) => {
    console.log(`Code changed on line ${line}`);
    return [line, code];
});

clientSocket.on('cleared', (sessionId) => {
    console.log(`Code cleared for session ${sessionId}`);
    return sessionId;
});

clientSocket.on('time-extended', (totalTimeLeft) => {
    console.log(`Timer ends after ${totalTimeLeft}`);
    clientSocket.emit('update-time', totalTimeLeft);
    return totalTimeLeft;
});

clientSocket.on('notify-terminate', (sessionId) => {
    console.log(`Session ${sessionId} terminated`);
    return sessionId;
});

let terminateTimeout;
const DISCONNECTION_TIMEOUT = 30 * 1000;

clientSocket.on('user-disconnected', (userId) => {
    console.log(`Collaborator ${userId} has disconnected`);
    terminateTimeout = setTimeout(async() => {
        await clientSocket.emit('user-terminate', -1, "");
        await endSession(sessionId);
        clientSocket.disconnect();

    }, DISCONNECTION_TIMEOUT);
            
});

clientSocket.on('user-reconnected', (userId) => {
    console.log(`Collaborator ${userId} has reconnected`);
    clearTimeout(terminateTimeout);
    return userId;
});

clientSocket.on('success-reconnected', (collaborativeInput) => {
    console.log(`Successfully reconnected`);
    console.log(collaborativeInput);
    return collaborativeInput;
});

clientSocket.on('system-terminated', (sessionId) => {
    console.log(`Session ${sessionId} terminated`);
    return sessionId;
});

const setUid = (id) => {
    userId = id;
}

const setSid = (id) => {
    sessionId = id;
}

const reconnect = () => {
    clientSocket.emit('reconnect');
}

const updateCode = (line, code) => {
    clientSocket.emit('update-code', line, code);
}

const updateLineCode = async(line, code) => {
    await clientSocket.emit('change-line', line, code);
}

const clearCode = async() => {
    await clientSocket.emit('clear');
}

const extendTime = async(timeLeft) => {
    await clientSocket.emit('extend-time', timeLeft);
}

const terminateSession = async(currentLine, currentCode) => {
    await clientSocket.emit('user-terminate', currentLine, currentCode);
}

const acknowledgeTerminate = async(currentLine, currentCode) => {
    await clientSocket.emit('ack-terminate', currentLine, currentCode);
}