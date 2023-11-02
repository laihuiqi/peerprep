const { io } = require('socket.io-client');
const config = require('../config/config');

const socketURL = config.serverAddress;

jest.setTimeout(50000);

describe('Collaboration Service', () => {
    let user1, user2, sessionId;

    beforeEach(async() => {

        sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

    });

    test('same session should be connected', async() => {
        user1 = io(socketURL, {
            query: {
                userId: 'Gc2Bz9Nl8Wx4',
                sessionId: sessionId
            }
        });

        const user1JoinPromise = new Promise((resolve) => {
            user1.on('join', (recvSessionId) => {
                expect(recvSessionId).toBe(sessionId);
                console.log('user1 joins: ', recvSessionId);
                resolve();
            });
        });
    
        const user1CollaboratorJoinedPromise = new Promise((resolve) => {
            user1.on('collaborator-joined', (userId) => {
                expect(userId).toBe('PxJ3lVtWz8Kq');
                console.log('collaborator-joined: ', userId);
                user1.emit('recv-join');
                resolve();
            });
        });

        user2 = io(socketURL, {
            query: {
                userId: 'PxJ3lVtWz8Kq',
                sessionId: sessionId
            }
        });

        const user2JoinPromise = new Promise((resolve) => {
            user2.on('join', (recvSessionId) => {
                expect(recvSessionId).toBe(sessionId);
                console.log('user2 joins: ', recvSessionId);
                resolve();
            });
        });
    
        const user2CollaboratorRecvJoinPromise = new Promise((resolve) => {
            user2.on('collaborator-recv-join', (userId) => {
                expect(userId).toBe('Gc2Bz9Nl8Wx4');
                console.log('collaborator-recv-join: ', userId);
                resolve();
            });
        });

        await Promise.all([
            user1JoinPromise,
            user2JoinPromise,
            user1CollaboratorJoinedPromise,
            user2CollaboratorRecvJoinPromise,
        ]);

        user1.disconnect();
        user2.disconnect();

    });
    
});