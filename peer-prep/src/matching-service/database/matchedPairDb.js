const MatchedPair = require('../models/matchedPairModel');

// Some database utility function for the MatchedPair Schema
async function getMatchedPairBySessionId(sessionId) {
    try {
        const matchedPair = await MatchedPair.findOne({ sessionId: sessionId });

        console.log(`Get matched pair with session id ${sessionId}:`, matchedPair);

        return matchedPair;

    } catch (error) {
        console.log(`Error getting matched pair with session id ${sessionId}:`, error);
    }
}

async function getCurrentMatchedPair(id) {
    try {
        const matchedPair = await MatchedPair.findOne(
            { $and: [{ isEnded: false }, { $or: [{ id1: id }, { id2: id }] }] });

        console.log(`Get live matched pair for ${id}:`, matchedPair);

        return matchedPair;

    } catch (error) {
        console.log(`Error getting live matched pair for ${id}:`, error);

        return null;
    }
}

async function getCurrentActiveSession(id) {
    try {
        const matchedPair = await getCurrentMatchedPair(id);

        console.log('Get live session for', id, ':', matchedPair.sessionId);

        return matchedPair.sessionId;

    } catch (error) {
        console.error(`Error getting live session for ${id}:`, error);

        return null;
    }
}

async function addMatchedPair(matchedPair) {
    try {
        await matchedPair.save();

        console.log(`Successfully added:`, matchedPair);

    } catch (error) {
        console.log(`Failed to add matched pair ${matchedPair}:`, error);
    }
}

async function endSession(sessionId) {
    try {
        const filter = { sessionId: sessionId };
        const update = { $set: { isEnded: true } };
        const result = await MatchedPair.updateOne(filter, update);

        if (result.nModified === 0) {
            console.warn(`No session was updated for session ${sessionId}`);
        }

        console.log(`Successfully update session state for session ${sessionId}`);

    } catch (error) {
        console.log(`Failed to update session state for session ${sessionId}:`, error);
    }
}

async function modifyMatchedPair(sessionId, key, value) {
    try {
        const filter = { sessionId: sessionId };

        const update = {
            $set: {
                [key]: value
            }
        };

        await MatchedPair.updateOne(filter, update);

        console.log(`Successfully update ${key} state for session ${sessionId}: ${value}`);

    } catch (error) {
        console.log(`Failed to update ${key} state for session ${sessionId}:`, error);
    }
}

async function getQuestion(sessionId) {
    try {
        const matchedPair = await MatchedPair.findOne({ sessionId: sessionId });

        console.log(`Get questionId for session ${sessionId}:`, matchedPair.questionId);

        return matchedPair.questionId;

    } catch (error) {
        console.log(`Error getting questionId for session ${sessionId}`);

        return null;
    }
}

async function deleteMatchedPair(sessionId) {
    try {
        await MatchedPair.deleteOne({ sessionId: sessionId });

        console.log(`Successfully delete session ${sessionId} from database.`);

    } catch (error) {
        console.log(`Failed to delete session ${sessionId}`);
    }
}

async function deleteAllMatchedPairs() {
    try {
        await MatchedPair.deleteMany({});

        console.log(`Successfully delete all sessions from database.`);

    } catch (error) {
        console.log(`Failed to delete all sessions`);
    }
}

async function getSession(sessionId) {
    try {
        const matchedPair = await MatchedPair.findOne({ sessionId: sessionId });

        console.log(`Get session details for ${sessionId}:`, matchedPair);

        return matchedPair;

    } catch (error) {
        console.log(`Error getting session difficulty for ${sessionId}`);
        
        return null;
    }
}

module.exports = {
    getMatchedPairBySessionId,
    getCurrentMatchedPair,
    getCurrentActiveSession,
    addMatchedPair,
    endSession,
    modifyMatchedPair,
    getQuestion,
    deleteMatchedPair,
    deleteAllMatchedPairs,
    getSession
};