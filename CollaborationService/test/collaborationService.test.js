const { io } = require('socket.io-client');
const config = require('../config/config');

const socketURL = config.serverAddress;

jest.setTimeout(20000);

describe('Collaboration Service', () => {
    let user1, user2, sessionId;

    beforeEach(async() => {

        sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

        user1 = io(socketURL, {
            query: {
                userId: 'Gc2Bz9Nl8Wx4',
                sessionId: sessionId
            }
        });

        user2 = io(socketURL, {
            query: {
                userId: 'PxJ3lVtWz8Kq',
                sessionId: sessionId
            }
        });

        user1.on('join', (recvSessionId) => {
            expect(recvSessionId).toBe(sessionId);
        });

        user2.on('join', (recvSessionId) => {
            expect(recvSessionId).toBe(sessionId);
        });

        await new Promise(resolve => setTimeout(resolve, 4000));

    });

    afterAll(async() => {
        await user1.disconnect();
        await user2.disconnect();
    });
    
    test('code change should be detected and broadcasted to all users in the same room', async() => {

        await user1.emit('change-line', 1, 'console.log("hello world");');
        user2.on('code-changed', (line, code) => {
            expect(line).toBe(1);
            expect(code).toBe('console.log("hello world");');
            console.log("1 ", line, code);
        });
        
        await user2.emit('change-line', 2, 'console.log("bye world");');

        user1.on('code-changed', (line, code) => {
            expect(line).toBe(2);
            expect(code).toBe('console.log("bye world");');
            console.log("1 ", line, code);
        });
        
    });
    
    test('time extension should be successful when time is sufficient', async() => {
        await user1.emit('extend-time');

        user1.on('time-extended', (init, length) => {
            expect(length).toBe(config.DEFAULT_TIME_LIMIT.Easy + config.EXTENSION_TIME);
            console.log("2 ", length);
        });

        user2.on('time-extended', (init, length) => {
            expect(length).toBe(config.DEFAULT_TIME_LIMIT.Easy + config.EXTENSION_TIME);
            console.log("2 ", length);
        });
    });

    test('code editor should be cleared after the cleaning request', async() => {
        await user1.emit('clear');

        user2.on('cleared', (recvSessionId) => {
            expect(recvSessionId).toBe(sessionId);
            console.log("3 ", recvSessionId);
        });
    });

    test('user\'s reconnection could be received by collaborator', async() => {
        await user1.emit('clear');
        await user1.emit('reconnect');

        user1.on('success-reconnected', (collaborativeInput) => {
            const [time, language, codes] = collaborativeInput;
            expect(language).toBe('Java');
            expect(codes).toStrictEqual([]);
            console.log("4 ", language, codes);
        });

        user2.on('user-reconnected', (userId) => {
            expect(userId).toBe("Gc2Bz9Nl8Wx4");
            console.log("4 ", userId);
        });
    });

    test('session should start to terminate once user requests', async() => {
        await user1.emit('user-terminate', 2, 'console.log("java is good");');

        user2.on('notify-terminate', (session) => {
            expect(session).toBe(sessionId);
            console.log("5 ", session);
        });

    });
    
});