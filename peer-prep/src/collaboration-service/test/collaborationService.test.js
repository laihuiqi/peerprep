const { io } = require('socket.io-client');
const { EXTENSION_TIME } = require('../config/config');
const { connectDB } = require('../server');

const socketURL = 'http://localhost:3002';

jest.setTimeout(20000);

describe('Collaboration Service', () => {
    let user1, user2, sessionId;

    beforeAll(async() => {
        await connectDB();

        sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

        user1 = io(socketURL, {
            query: {
                userId: 1,
                sessionId: sessionId
            }
        });

        user2 = io(socketURL, {
            query: {
                userId: 2,
                sessionId: sessionId
            }
        });

        await new Promise(resolve => setTimeout(resolve, 10000));

    });

    afterAll(async() => {
        //await user1.disconnect();
        //await user2.disconnect();
    });

    
    test('users should join room with the correct sessionId', async() => {
        await user1.on('join', (recvSessionId) => {
            expect(recvSessionId).toStrictEqual(sessionId);
            expect(user1.rooms[sessionId]).toStrictEqual(sessionId);
            console.log("0 ", recvSessionId);
        });

        await user2.on('join', (recvSessionId) => {
            expect(recvSessionId).toStrictEqual(sessionId);
            expect(user1.rooms[sessionId]).toStrictEqual(sessionId);
            console.log("1 ", recvSessionId);
        });
    });
        
    test('code change should be detected and broadcasted to all users in the same room', async() => {

        await user1.emit('code-change', 1, 'console.log("hello world");');
        await user2.emit('code-change', 2, 'console.log("bye world");');

        await user1.on('code-changed', (line, code) => {
            expect(line).toStrictEqual("2");
            expect(code).toStrictEqual('console.log("bye world");');
        });

        await user2.on('code-changed', (line, code) => {
            expect(line).toStrictEqual("1");
            expect(code).toStrictEqual('console.log("hello world");');
            console.log("2 ", line, code);
        });
    });
    
        test('code editor should be cleared after the cleaning request', async() => {
            await user1.emit('clear');

            await user2.on('cleared', (recvSessionId) => {
                expect(recvSessionId).toStrictEqual(sessionId);
                console.log("3 ", recvSessionId);
            });
        });

        test('line change should be detected and last change to previous line should be saved', async() => {
            await user1.emit('change-line', 1, 'console.log("python god");');
        });

        test('time extension should be successful when time is sufficient', async() => {
            await user1.emit('extend-time');

            await user1.on('time-extended', (time) => {
                expect(time).toStrictEqual(EXTENSION_TIME);
            });

            await user2.on('time-extended', (time) => {
                expect(time).toStrictEqual(EXTENSION_TIME);
                console.log("5 ", time);
            });
        });

        test('session should start to terminate once user requests', async() => {
            await user1.emit('user-terminate', 2, 'console.log("java is good");');

            await user2.on('notify-terminate', (session) => {
                expect(session).toStrictEqual(sessionId);
                console.log("6 ", session);
            });

            await user2.on('user-disconnected', (userId) => {
                expect(userId).toStrictEqual("1");
                console.log("6 ", userId);
            });
        });

        test('session should terminate once notification is received', async() => {
            await user1.emit('ack-terminate', 3, 'console.log("do an easy unit test");');

            await user2.on('user-disconnected', (userId) => {
                expect(userId).toStrictEqual("1");
                console.log("7 ", userId);
            });
        });

        test('user should be disconnected once session is terminated', async() => {
            await user1.disconnect();

            await user2.on('user-disconnected', (userId) => {
                expect(userId).toStrictEqual("1");
                console.log("8 ", userId);
            });
        });

        test('user\'s reconnection could be received by collaborator', async() => {
            await user1.emit('reconnect');

            await user1.on('success-reconnected', (collaborativeInput) => {
                let language, codes = collaborativeInput;
                expect(language).toStrictEqual('None');
                expect(codes).toStrictEqual("");
                console.log("9 ", language, codes);
            });

            await user2.on('user-reconnected', (userId) => {
                expect(userId).toStrictEqual("1");
                console.log("9 ", userId);
            });
        });
        
});