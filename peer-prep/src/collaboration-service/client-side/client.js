const socketURL = 'http://localhost:3002';
const changeLine = document.getElementById('changeLine');
const clear = document.getElementById('clear');
const extend = document.getElementById('extendTime');
const terminate = document.getElementById('terminate');
const acknowledge = document.getElementById('ack');


let userId;
let sessionId;

userId = 1;
sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

// eslint-disable-next-line no-undef
var clientSocket = io(socketURL, { retries: 3, query: { userId: userId, sessionId: sessionId }});

changeLine.addEventListener('click', () => {
    console.log("start change");
    clientSocket.emit('change-line', 1, 'console.log("hello world");');
    console.log("change successful");
});

clear.addEventListener('click', () => {
    console.log("start clear");
    clientSocket.emit('clear');
    console.log("clear successful");
});

extend.addEventListener('click', () => {
    console.log("start extend");
    clientSocket.emit('extend-time');
    console.log("time extended successful");
});

terminate.addEventListener('click', () => {
    console.log("start terminate");
    clientSocket.emit('user-terminate', 2, 'console.log("goodBye");');
    console.log("terminate successful");
});

acknowledge.addEventListener('click', () => {
    console.log("start acknowledge");
    clientSocket.emit('ack-terminate', 1, 'console.log("okeii bye");');
    console.log("acknowledge successful");
});

clientSocket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

clientSocket.io.on('reconnect', () => {
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
    return totalTimeLeft;
});

clientSocket.on('notify-terminate', (sessionId) => {
    console.log(`Session ${sessionId} terminated`);
    return sessionId;
});

clientSocket.on('user-disconnected', (userId) => {
    console.log(`Collaborator ${userId} has disconnected`);
    return userId;
});

clientSocket.on('user-reconnected', (userId) => {
    console.log(`Collaborator ${userId} has reconnected`);
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

/*
module.exports = {
    clientSocket,
    updateLineCode,
    clearCode,
    extendTime,
    terminateSession,
    acknowledgeTerminate
}
*/