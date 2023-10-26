const { findMatch, cancelMatch } = require('../services/matchingService');
const { getCurrentMatchedPair, deleteAllMatchedPairs } = require('../database/matchedPairDb');
const { connectDB } = require('../server');
jest.setTimeout(200000);

describe('Matching Service', () => {

    const javaRequest1 = {
        id: 1,
        language: 'java',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const javaRequest2 = {
        id: 2,
        language: 'java',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const pythonRequest1 = {
        id: 3,
        language: 'python',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cppRequest1 = {
        id: 4,
        language: 'cpp',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cRequest1 = {
        id: 5,
        language: 'c',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cRequest2 = {
        id: 11,
        language: 'c',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cppRequest2 = {
        id: 6,
        language: 'cpp',
        proficiency: 'None',
        difficulty: 'None',
        topic: 'None'
    };

    const cppFullRequest1 = {
        id: 7,
        language: 'cpp',
        proficiency: 'basic',
        difficulty: 'easy',
        topic: 'arrays'
    };

    const javaFullRequest1 = {
        id: 8,
        language: 'java',
        proficiency: 'basic',
        difficulty: 'easy',
        topic: 'arrays'
    };

    const cppFullRequest2 = {
        id: 9,
        language: 'cpp',
        proficiency: 'basic',
        difficulty: 'easy',
        topic: 'arrays'
    };

    const javaFullRequest2 = {
        id: 10,
        language: 'java',
        proficiency: 'advanced',
        difficulty: 'easy',
        topic: 'arrays'
    };

    beforeAll(async() => {
        await connectDB();
    });

    beforeEach(async() => {
        await deleteAllMatchedPairs();
    });

    afterEach(async() => {
        await deleteAllMatchedPairs();
    });

    test('Matching basic requests with same language only', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(javaRequest2)
        ]);

        const expectResult1 = {
            status: 'success',
            isMatched: true,
            collaboratorId: javaRequest2.id,
            request: javaRequest1
        }

        const expectResult2 = {
            status: 'success',
            isMatched: true,
            collaboratorId: javaRequest1.id,
            request: javaRequest2
        }

        expect(matchResult1).toStrictEqual(expectResult1);
        expect(matchResult2).toStrictEqual(expectResult2);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);
        const matchedPair2 = await getCurrentMatchedPair(javaRequest2.id);

        expect(matchedPair1.sessionId).toStrictEqual(matchedPair2.sessionId);
    });

    test('Not Match for request with different language', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(cppRequest2),
            findMatch(cRequest2)
        ]);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: cppRequest2
        };

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: cRequest2
        };

        expect(matchResult1).toStrictEqual(expectResult1);
        expect(matchResult2).toStrictEqual(expectResult2);

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

        const expectResult1 = {
            status: 'success',
            isMatched: true,
            collaboratorId: cppFullRequest2.id,
            request: cppFullRequest1
        }

        const expectResult2 = {
            status: 'success',
            isMatched: true,
            collaboratorId: cppFullRequest1.id,
            request: cppFullRequest2
        }

        expect(matchResult1).toStrictEqual(expectResult1);
        expect(matchResult2).toStrictEqual(expectResult2);

        const matchedPair1 = await getCurrentMatchedPair(cppFullRequest1.id);
        const matchedPair2 = await getCurrentMatchedPair(cppFullRequest2.id);

        expect(matchedPair1.sessionId).toStrictEqual(matchedPair2.sessionId);

    });

    test('No match for complex requests with different fields', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(cppFullRequest1),
            findMatch(javaFullRequest1)
        ]);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: cppFullRequest1
        }

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: javaFullRequest1
        }

        expect(matchResult1).toStrictEqual(expectResult1);
        expect(matchResult2).toStrictEqual(expectResult2);
    });

    test('No match for simple request and complex request with different fields', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(javaFullRequest1)
        ]);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: javaRequest1
        }

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: javaFullRequest1
        }

        expect(matchResult1).toStrictEqual(expectResult1);
        expect(matchResult2).toStrictEqual(expectResult2);
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
            collaboratorId: null,
            request: javaRequest1
        }

        expect(matchResult).toStrictEqual(expectResult1);
        expect(cancelResult).toStrictEqual(true);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);

        expect(matchedPair1).toStrictEqual(null);
    });

});