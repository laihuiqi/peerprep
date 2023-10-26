const { expect } = require('chai');
const { createServer } = require('http');
const ioClient = require('socket.io-client');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const { EXTENSION_TIME } = require('../config/config');

const socketURL = 'http://localhost:3002';

jest.setTimeout(10000);

describe('Collaboration Service', () => {
    let io, user1, user2, serverSocket, sessionId;

    beforeEach((done) => {
        sessionId = uuidv4();
        const httpServer = createServer();
        io = new Server(httpServer);

        httpServer.listen(() => {
            user1 = ioClient(socketURL, {
                query: {
                    userId: 1,
                    sessionId: sessionId
                }
            });

            user2 = ioClient(socketURL, {
                query: {
                    userId: 2,
                    sessionId: sessionId
                }
            });

            io.on('connection', (socket) => {
                console.log(1);
                serverSocket = socket;

            });

            user1.on('connect', done);
            user2.on('connect', done);

            done();
        });
    });


    afterEach(() => {
        io.close();
        user1.disconnect();
        user2.disconnect();
    });
    /*
        test('users should join room with the correct sessionId', (done) => {
            user1.on('join', (recvSessionId) => {
                expect(recvSessionId).equal(sessionId);
                expect(user1.rooms[sessionId]).equal(sessionId);
                done();
            });

            user2.on('join', (recvSessionId) => {
                expect(recvSessionId).equal(sessionId);
                expect(user1.rooms[sessionId]).equal(sessionId);
                done();
            });
        });

        
    test('code change should be detected and broadcasted to all users in the same room', (done) => {
        serverSocket.on('code-changed', (line, code) => {
            expect(line).equal(1);
            expect(code).equal('console.log("hello world");');
            done();
        });

        user1.emit('code-change', 1, 'console.log("hello world");');
        user2.emit('code-change', 2, 'console.log("bye world");');

        user1.on('code-changed', (line, code) => {
            expect(line).equal(2);
            expect(code).equal('console.log("bye world");');
            done();
        });

        user2.on('code-changed', (line, code) => {
            expect(line).equal(1);
            expect(code).equal('console.log("hello world");');
            done();
        });
    });
    
        test('code editor should be cleared after the cleaning request', (done) => {
            user1.emit('clear');

            user2.on('cleared', () => {
                done();
            });
        });

        test('line change should be detected and last change to previous line should be saved', (done) => {
            user1.emit('change-line', 1, 'console.log("python god");');
        });

        test('time extension should be successful when time is sufficient', (done) => {
            user1.emit('extend-time');

            user1.on('time-extended', (time) => {
                expect(time).equal(EXTENSION_TIME);
                done();
            });

            user2.on('time-extended', (time) => {
                expect(time).equal(EXTENSION_TIME);
                done();
            });
        });

        test('session should start to terminate once user requests', (done) => {
            user1.emit('user-terminate', 2, 'console.log("java is good");');

            user2.on('notify-terminate', (session) => {
                expect(session).equal(sessionId);
                done();
            });

            user2.on('user-disconnected', (userId) => {
                expect(userId).equal(1);
                done();
            });
        });

        test('session should terminate once notification is received', (done) => {
            user1.emit('ack-terminate', 3, 'console.log("do an easy unit test");');

            user2.on('user-disconnected', (userId) => {
                expect(userId).equal(1);
                done();
            });
        });

        test('user should be disconnected once session is terminated', (done) => {
            user1.disconnect();

            user2.on('user-disconnected', (userId) => {
                expect(userId).equal(1);
                done();
            });
        });

        test('user\'s reconnection could be received by collaborator', (done) => {
            user1.emit('reconnect');

            user1.on('success-reconnected', (collaborativeInput) => {
                let language, codes = collaborativeInput;
                expect(language).equal('None');
                expect(codes).equal("");
                done();
            });

            user2.on('user-reconnected', (userId) => {
                expect(userId).equal(1);
                done();
            });
        });
        */
});