const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require('socket.io-client');
const config = require('../config/config');
const { startCommunication } = require('../services/communicationService');

jest.setTimeout(50000);

describe('Collaboration Service', () => {
    let io, user1, user2, sessionId, port;
    
    sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

    beforeAll(async() => {
        const httpServer = createServer();
        io = new Server(httpServer);
        const serverReadyPromise = new Promise((resolve) => {
            httpServer.listen(() => {
              console.log('Server is running');
              io.on("connection", async(socket) => {
                console.log("socket connected: ", socket.id);
                await startCommunication(socket);
                });
              resolve();
            });
        });

        await serverReadyPromise;

        port = httpServer.address().port;

    });

    test('same session should be connected', async() => {
        user1 = ioc(`http://localhost:${port}`, {
            query: {
                userId: 'Gc2Bz9Nl8Wx4',
                sessionId: sessionId
            }
        });

        user2 = ioc(`http://localhost:${port}`, {
            query: {
                userId: 'PxJ3lVtWz8Kq',
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
        
        const user2RecvMessagePromise = new Promise((resolve) => {
            new Promise((resolve) => setTimeout(resolve, 200));

            user1.emit('message', { text: 'hello', fromSelf: true });
            console.log('user1 sends message');

            user2.on('new-message', async (message) => {
                console.log('user2 receives message: ', message);

                expect(message.text).toBe('hello');
                expect(message.sender).toBe('Gc2Bz9Nl8Wx4');

                console.log('user2 receives message: ', message.text);
                
                resolve();
            });
        });

        const user2RecvMessageLogPromise = new Promise((resolve) => {
            new Promise((resolve) => setTimeout(resolve, 300));

            user2.emit('get-message-log');
            console.log('user2 gets message log');

            user2.on('recv-message-log', async (messages) => {
                console.log('user2 receives message log: ', messages);

                expect(messages.length).toBe(1);
                expect(messages[0].text).toBe('hello');
                expect(messages[0].sender).toBe('Gc2Bz9Nl8Wx4');

                console.log('user2 receives message log: ', messages);
                
                resolve();
            });
        });
        
        const user1EndCallPromise = new Promise((resolve) => {
            new Promise((resolve) => setTimeout(resolve, 400));

            user1.emit('end-call');
            
            user2.on('collaborator-end-call', () => {
                console.log('user1 ends call');
                resolve();
            });
        });

        await Promise.all([
            user1JoinPromise,
            user2JoinPromise,
            user1CollaboratorJoinedPromise,
            user2CollaboratorRecvJoinPromise,
            user2RecvMessagePromise,
            user2RecvMessageLogPromise,
            user1EndCallPromise,
        ]);
        
        user1.disconnect();
        user2.disconnect();

    });
    
});