const { findMatch, cancelMatch } = require('../services/matchingService');
const { getCurrentMatchedPair, deleteAllMatchedPairs } = require('../database/matchedPairDb');
const { addQuestion } = require('../database/questionDb');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(200000);

describe('Matching Service', () => {

    let mongod;

    const questionJava = {
        _id: new mongoose.Types.ObjectId(1),
        title: 'Java Question',
        description: 'Java Question Description',
        complexity: 'easy',
        category: 'arrays',
        language: 'java',
        userTags: []
    };

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const mongoUri = mongod.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("testDB connected");
        await addQuestion(questionJava);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongod.stop();
    });

    beforeEach(async() => {
        await deleteAllMatchedPairs();
    });

    afterEach(async() => {
        await deleteAllMatchedPairs();
    });

    const javaRequest1 = {
        id: 'Jgk9LsH3pRi2',
        language: 'java',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const javaRequest2 = {
        id: 'Xy7QnWzA4vE1',
        language: 'java',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const pythonRequest1 = {
        id: 'FbRt6YpZuIv8',
        language: 'python',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cppRequest1 = {
        id: 'MnOq5PxS3dR7',
        language: 'cpp',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cRequest1 = {
        id: 'GhT2UkL4jEw9',
        language: 'c',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cRequest2 = {
        id: 'Df8GjR7hTk2L',
        language: 'c',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cppRequest2 = {
        id: 'NpQ5sV9mXc4Z',
        language: 'cpp',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cppFullRequest1 = {
        id: 'Yb1FnS6oAq3P',
        language: 'cpp',
        proficiency: 'basic',
        difficulty: 'easy',
        topic: 'arrays'
    };

    const javaFullRequest1 = {
        id: 'UvIz3wPxLk9Q',
        language: 'java',
        proficiency: 'basic',
        difficulty: 'easy',
        topic: 'arrays'
    };

    const cppFullRequest2 = {
        id: 'Jr7GpW2bXl8K',
        language: 'cpp',
        proficiency: 'basic',
        difficulty: 'easy',
        topic: 'arrays'
    };

    const javaFullRequest2 = {
        id: 'HtY5sRfZp2Jv',
        language: 'java',
        proficiency: 'advanced',
        difficulty: 'easy',
        topic: 'arrays'
    };

    function assertObjectsEqual(actual, expected) {
        for (const key in expected) {
            if (typeof expected[key] === 'object' && expected[key] !== null) {
              assertObjectsEqual(actual[key], expected[key]);
            } else {
              expect(actual[key]).toStrictEqual(expected[key]);
            }
        }
    }

    test('Matching basic requests with same language only', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(javaRequest2)
        ]);

        const matchPair = await getCurrentMatchedPair(javaRequest1.id);

        const expectResult1 = {
            status: 'success',
            isMatched: true,
            sessionId: matchPair.sessionId,
            question: questionJava,
            collaboratorId: javaRequest2.id,
            request: javaRequest1
        }

        const expectResult2 = {
            status: 'success',
            isMatched: true,
            sessionId: matchPair.sessionId,
            question: questionJava,
            collaboratorId: javaRequest1.id,
            request: javaRequest2
        }

        assertObjectsEqual(matchResult1, expectResult1);
        assertObjectsEqual(matchResult2, expectResult2);
    });

    test('Not Match for request with different language', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(cppRequest2),
            findMatch(cRequest2)
        ]);
        console.log(matchResult1);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: cppRequest2
        };

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: cRequest2
        };

        assertObjectsEqual(matchResult1, expectResult1);
        assertObjectsEqual(matchResult2, expectResult2);

        const matchedPair1 = await getCurrentMatchedPair(cppRequest1.id);
        const matchedPair2 = await getCurrentMatchedPair(cRequest1.id);

        expect(matchedPair1).toStrictEqual(null);
        expect(matchedPair2).toStrictEqual(null);
    });

    test('Matching complex requests with same all fields', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(cppFullRequest1),
            findMatch(cppFullRequest2)
        ]);
        
        const matchPair = await getCurrentMatchedPair(cppFullRequest1.id);

        const expectResult1 = {
            status: 'success',
            isMatched: true,
            sessionId: matchPair.sessionId, 
            question: null,
            collaboratorId: cppFullRequest2.id,
            request: cppFullRequest1
        }

        const expectResult2 = {
            status: 'success',
            isMatched: true,
            sessionId: matchPair.sessionId,
            question: null,
            collaboratorId: cppFullRequest1.id,
            request: cppFullRequest2
        }

        assertObjectsEqual(matchResult1, expectResult1);
        assertObjectsEqual(matchResult2, expectResult2);

    });

    test('No match for complex requests with different fields', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(cppFullRequest1),
            findMatch(javaFullRequest1)
        ]);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: cppFullRequest1
        }

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: javaFullRequest1
        }

        assertObjectsEqual(matchResult1, expectResult1);
        assertObjectsEqual(matchResult2, expectResult2);
    });

    test('No match for simple request and complex request with different fields', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(javaFullRequest1)
        ]);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: javaRequest1
        }

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: javaFullRequest1
        }

        assertObjectsEqual(matchResult1, expectResult1);
        assertObjectsEqual(matchResult2, expectResult2);
    });

    test('Cancel a match', async() => {
        const cancelResult1 = await cancelMatch(javaRequest1.id);

        expect(cancelResult1).toStrictEqual(true);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);

        expect(matchedPair1).toStrictEqual(null);
    });

    test('Cancel an existing match', async() => {
        const [matchResult, cancelResult] = await Promise.all([
            findMatch(javaRequest1),
            new Promise(resolve => setTimeout(resolve, 5000)).then(() => cancelMatch(javaRequest1.id))
        ]);

        const expectResult1 = {
            status: 'cancel',
            isMatched: false,
            sessionId: null, 
            question: null,
            collaboratorId: null,
            request: javaRequest1
        }

        assertObjectsEqual(matchResult, expectResult1);
        expect(cancelResult).toStrictEqual(true);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);

        expect(matchedPair1).toStrictEqual(null);
    });

});