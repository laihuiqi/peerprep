const MatchedPair = require('../models/matchedPairModel');

async function getCurrentMatchedPair(id) {
    try {
        const matchedPair = await MatchedPair.findOne({ $and: [{ isEnded: false }, { $or: [{ id1: id }, { id2: id }] }] });
        console.log(`Get live matched pair for ${id}:`, matchedPair);
        return matchedPair;

    } catch (error) {
        console.log(`Error getting live matched pair for ${id}`);
        return null;
    }
}

async function getCurrentActiveSession(id) {
    try {
        const matchedPair = await getCurrentMatchedPair(id);
        console.log('Get live session for', id, ':', matchedPair.sessionId);
        return matchedPair.sessionId;
    } catch (error) {
        console.log(`Error getting live session for ${id}`);
        return null;
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
        console.log(`Failed to update session state for session ${sessionId}`);
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
    getCurrentMatchedPair,
    getCurrentActiveSession,
    endSession,
    getSession
};