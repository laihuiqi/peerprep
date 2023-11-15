const { createServer } = require("node:http");
const { Server } = require("socket.io");
const ioc = require('socket.io-client');
const config = require('../config/config');
const { startCollaboration, getCollaborationHistory } = require('../services/collaborationService');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

jest.setTimeout(20000);

describe('Collaboration Service', () => {
    let io, user1, user2, mongod, port;

    const mockMatch = {
        sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d",
        id1: "Gc2Bz9Nl8Wx4",
        id2: "PxJ3lVtWz8Kq",
        isEnded: false,
        questionId: new mongoose.Types.ObjectId("65378371752185e6e1b5b342"),
        language: "Java",
        proficiency: "None",
        difficulty: "Easy",
        topic: "Arrays",
    };

    const testQuestion = {
        _id: new mongoose.Types.ObjectId("65378371752185e6e1b5b342"),
        title: "test1",
        description: "test1 desp",
        complexity: "Easy",
        category: "Arrays",
        language:"Java",
        userTags: [],
    };

    const sessionId = "123c44c9-9bc3-402f-ba56-689eb0d2774d";

    beforeAll(async() => {
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("testDB connected");

        const mock = new MockAdapter(axios);

        mock.onGet(`${config.matchingServiceUrl}/getMatchSession/Gc2Bz9Nl8Wx4`)
            .reply(200, {
                sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d"
            });

        mock.onGet(`${config.matchingServiceUrl}/getMatchSession/PxJ3lVtWz8Kq`)
            .reply(200, {
                sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d"
            });

        mock.onGet(`${config.matchingServiceUrl}/getSession/123c44c9-9bc3-402f-ba56-689eb0d2774d`)
            .reply(200, {
                sessionId: "123c44c9-9bc3-402f-ba56-689eb0d2774d",
                session: mockMatch
            });

        mock.onGet(`${config.questionServiceUrl}/65378371752185e6e1b5b342`)
            .reply(200, {
                questionId: "65378371752185e6e1b5b342",
                question: testQuestion,
            });

        mock.onDelete(`${config.matchingServiceUrl}/end/123c44c9-9bc3-402f-ba56-689eb0d2774d`)
            .reply(200, {status: "success"});

        const httpServer = createServer();
        io = new Server(httpServer);
        const serverReadyPromise = new Promise((resolve) => {
            httpServer.listen(() => {
              console.log('Server is running');
              io.on("connection", async(socket) => {
                console.log("socket connected: ", socket.id);
                await startCollaboration(socket, io);
                });
              resolve();
            });
        });

        await serverReadyPromise;

        port = httpServer.address().port;

    });

    let time, language, line, codeInput ,lastModifier, objectId;
    
    test("collaboration parameters can be set up correctly", async() => {
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

        user1.on("join", (recvSessionId) => {
            expect(recvSessionId).toBe(sessionId);
            console.log("user1 joins: ", recvSessionId);
        });

        user2.on("join", (recvSessionId) => {
            expect(recvSessionId).toBe(sessionId);
            console.log("user2 joins: ", recvSessionId);
        });

        user1.on("user-joined", userId => {
            expect(userId).toBe("PxJ3lVtWz8Kq");
            console.log("user-joined: ", userId);
        });

        user2.on("user-joined", userId => {
            expect(userId).toBe("Gc2Bz9Nl8Wx4");
            console.log("user-joined: ", userId);
        });

        user1.on("init-code", (recvLanguage, code) => {
            language = recvLanguage;
            expect(language).toBe("Java");
            codeExtract = code[0];
            line = codeExtract.line;
            codeInput = codeExtract.code;
            lastModifier = codeExtract.lastModifier;
            objectId = codeExtract._id;
            expect(lastModifier).toBe("PxJ3lVtWz8Kq");
            expect(codeInput).toBe("#Enter your code here");
            expect(line).toBe(1);
            console.log("init-code1");
        });

        user1.on("init-timer", (init, length) => {
            time = init;
            expect(length).toBe(config.DEFAULT_TIME_LIMIT.Easy);
            console.log("init-timer1: ", init, length);
        }); 

        user1.on("init-timer", (init, length) => {
            expect(init).toBe(time);
            expect(length).toBe(config.DEFAULT_TIME_LIMIT.Easy);
            console.log("init-timer2: ", init, length);
        }); 

        user2.on("init-code", (recvLanguage, code) => {
            expect(recvLanguage).toBe(language);
            code = code[0];
            expect(code.lastModifier).toBe(lastModifier);
            expect(code.code).toBe(codeInput);
            expect(code.line).toBe(line);
            expect(code._id).toBe(objectId);
            console.log("init-code2");
        });

        user1.on('recv-question', question => {
            expect(question.category).toBe(testQuestion.category);
            expect(question.complexity).toBe(testQuestion.complexity);
            expect(question.description).toBe(testQuestion.description);
            expect(question.language).toBe(testQuestion.language);
            expect(question.title).toBe(testQuestion.title);
            expect(JSON.stringify(question.userTags)).toBe(JSON.stringify(testQuestion.userTags));
            console.log('recv-question1: ', question);
        });

        user2.on('recv-question', question => {
            expect(question.category).toBe(testQuestion.category);
            expect(question.complexity).toBe(testQuestion.complexity);
            expect(question.description).toBe(testQuestion.description);
            expect(question.language).toBe(testQuestion.language);
            expect(question.title).toBe(testQuestion.title);
            expect(JSON.stringify(question.userTags)).toBe(JSON.stringify(testQuestion.userTags));
            console.log('recv-question2: ', question);
        });

        await new Promise(resolve => setTimeout(resolve, 4000));

    });

    test("collaboration history can be retrieved", async() => {
        const history = await getCollaborationHistory(sessionId);
        console.log('Get history: ', history);
        expect(history[0]).toBe(time);
        expect(history[1]).toBe(language);
        let codeHistory = history[2][0];
        expect(codeHistory.line).toBe(line);
        expect(codeHistory.code).toBe(codeInput);
        expect(codeHistory.lastModifier).toBe(lastModifier);
        expect(JSON.stringify(codeHistory._id)).toBe(JSON.stringify(objectId));
        console.log('Get history: ', history);
    });
    
    afterEach(async() => {
        await user1.disconnect();
        await user2.disconnect();
    });
    
});