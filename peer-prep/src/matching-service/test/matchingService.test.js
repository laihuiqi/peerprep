const { findMatch, cancelMatch } = require('../services/matchingService');
const { getCurrentMatchedPair, deleteAllMatchedPairs } = require('../database/matchedPairDb');
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

    beforeEach(async() => {
        await deleteAllMatchedPairs();
    });

    afterEach(async() => {
        await deleteAllMatchedPairs();
    });

    test('Matching basic requests with same language only', async() => {
        const [matchResult1, matchResult3] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(javaRequest2)
        ]);
        /*
        const [matchResult1, matchResult2, matchResult3, matchResult4] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(cppRequest1),
            findMatch(javaRequest2),
            findMatch(cppRequest2)
        ]);
        */

        const expectResult1 = {
            status: 'success',
            isMatched: true,
            collaboratorId: javaRequest2.id,
            request: javaRequest1
        }

        const expectResult2 = {
            status: 'success',
            isMatched: true,
            collaboratorId: cppRequest2.id,
            request: cppRequest1
        }

        const expectResult3 = {
            status: 'success',
            isMatched: true,
            collaboratorId: javaRequest1.id,
            request: javaRequest2
        }

        const expectResult4 = {
            status: 'success',
            isMatched: true,
            collaboratorId: cppRequest1.id,
            request: cppRequest2
        }

        expect(matchResult1).toBe(expectResult1);
        //expect(matchResult2).toBe(expectResult2);
        expect(matchResult3).toBe(expectResult3);
        //expect(matchResult4).toBe(expectResult4);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);
        //const matchedPair2 = await getCurrentMatchedPair(javaRequest2.id);
        const matchedPair3 = await getCurrentMatchedPair(cppRequest1.id);
        //const matchedPair4 = await getCurrentMatchedPair(cppRequest2.id);

        expect(matchedPair1.sessionId).toBe(matchedPair3.sessionId);
        //expect(matchedPair2.sessionId).toBe(matchedPair4.sessionId);
    });
    /*
    test('Not Match for request with different language', async() => {
        const [matchResult1, matchResult2, matchResult3, matchResult4] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(pythonRequest1),
            findMatch(cppRequest2),
            findMatch(cRequest2)
        ]);

        const expectResult1 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: javaRequest1
        };

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: pythonRequest1
        };

        const expectResult3 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: cppRequest1
        };

        const expectResult4 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: cRequest1
        };

        expect(matchResult1).toBe(expectResult1);
        expect(matchResult2).toBe(expectResult2);
        expect(matchResult3).toBe(expectResult3);
        expect(matchResult4).toBe(expectResult4);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);
        const matchedPair2 = await getCurrentMatchedPair(pythonRequest1.id);
        const matchedPair3 = await getCurrentMatchedPair(cppRequest1.id);
        const matchedPair4 = await getCurrentMatchedPair(cRequest1.id);

        expect(matchedPair1).toBe(null);
        expect(matchedPair2).toBe(null);
        expect(matchedPair3).toBe(null);
        expect(matchedPair4).toBe(null);
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

        expect(matchResult1).toBe(expectResult1);
        expect(matchResult2).toBe(expectResult2);

        const matchedPair1 = await getCurrentMatchedPair(cppFullRequest1.id);
        const matchedPair2 = await getCurrentMatchedPair(cppFullRequest2.id);

        expect(matchedPair1.sessionId).toBe(matchedPair2.sessionId);

    });

    test('No match for complex requests with different fields', async() => {
        const [matchResult1, matchResult2] = await Promise.all([
            findMatch(cppRequest1),
            findMatch(javaRequest1)
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

        expect(matchResult1).toBe(expectResult1);
        expect(matchResult2).toBe(expectResult2);
    });
    
    test('No match for simple request and complex request with different fields', async() => {
        const matchResult1 = await findMatch(javaRequest1);
        const matchResult2 = await findMatch(javaFullRequest1);
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

        expect(matchResult1).toBe(expectResult1);
        expect(matchResult2).toBe(expectResult2);
    });
    
    test('Combined matching', async() => {
        const [matchResult1, matchResult2, matchResult3, matchResult4, matchResult5, matchResult6] = await Promise.all([
            findMatch(javaRequest1),
            findMatch(javaFullRequest1),
            findMatch(cppFullRequest1),
            findMatch(javaRequest2),
            findMatch(pythonRequest1),
            findMatch(cppFullRequest2)
        ]);

        const expectResult1 = {
            status: 'success',
            isMatched: true,
            collaboratorId: javaRequest2.id,
            request: javaRequest1
        }

        const expectResult2 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: javaFullRequest1
        }

        const expectResult3 = {
            status: 'success',
            isMatched: true,
            collaboratorId: cppFullRequest2.id,
            request: cppFullRequest1
        }

        const expectResult4 = {
            status: 'success',
            isMatched: true,
            collaboratorId: javaRequest1.id,
            request: javaRequest2
        }

        const expectResult5 = {
            status: 'error',
            isMatched: false,
            collaboratorId: null,
            request: pythonRequest1
        }

        const expectResult6 = {
            status: 'success',
            isMatched: true,
            collaboratorId: cppFullRequest1.id,
            request: cppFullRequest2
        }

        expect(matchResult1).toBe(expectResult1);
        expect(matchResult2).toBe(expectResult2);
        expect(matchResult3).toBe(expectResult3);
        expect(matchResult4).toBe(expectResult4);
        expect(matchResult5).toBe(expectResult5);
        expect(matchResult6).toBe(expectResult6);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);
        const matchedPair2 = await getCurrentMatchedPair(javaFullRequest1.id);
        const matchedPair3 = await getCurrentMatchedPair(cppFullRequest1.id);
        const matchedPair4 = await getCurrentMatchedPair(javaRequest2.id);
        const matchedPair5 = await getCurrentMatchedPair(pythonRequest1.id);
        const matchedPair6 = await getCurrentMatchedPair(cppFullRequest2.id);

        expect(matchedPair1.sessionId).toBe(matchedPair4.sessionId);
        expect(matchedPair3.sessionId).toBe(matchedPair6.sessionId);
        expect(matchedPair2).toBe(null);
        expect(matchedPair5).toBe(null);
    });
    */

    test('Cancel a match', async() => {
        const cancelResult1 = await cancelMatch(javaRequest1.id);

        expect(cancelResult1).toBe(true);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);

        expect(matchedPair1).toBe(null);
    });

    /*
    test('Cancel an existing match', async() => {
        const [matchResult, cancelResult] = await Promise.all([
            findMatch(javaRequest1),
            cancelMatch(javaRequest1.id)
        ]);

        const expectResult1 = {
            status: 'cancel',
            isMatched: false,
            collaboratorId: null,
            request: javaRequest1
        }

        expect(matchResult).toBe(expectResult1);
        expect(cancelResult).toBe(true);

        const matchedPair1 = await getCurrentMatchedPair(javaRequest1.id);

        expect(matchedPair1).toBe(null);
    });
    */

});