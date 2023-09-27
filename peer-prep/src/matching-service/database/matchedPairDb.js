const MatchedPair = require('../models/matchedPairModel');

// Some database utility function for the MatchedPair Schema
async function getMatchedPairBySessionId(sessionId) {
    try {
        const matchedPair = await MatchedPair.findOne({ sessionId: sessionId });
        console.log(`Get matched pair with session id ${sessionId}:`, matchedPair);
        return matchedPair;

    } catch (error) {
        console.error(`Error getting matched pair with session id ${sessionId}:`, error);
    }
}

async function getCurrentMatchedPair(id) {
    try {
        const matchedPair = await MatchedPair.findOne({ $and: [{ isEnded: false }, { $or: [{ id1: id }, { id2: id }] }] });
        console.log(`Get live matched pair for ${id}:`, matchedPair);
        return matchedPair;

    } catch (error) {
        console.error(`Error getting live matched pair for ${id}:`, error);
        return null;
    }
}

async function addMatchedPair(matchedPair) {
    try {
        await matchedPair.save();
        console.log(`Successfully added:`, matchedPair);

    } catch (error) {
        console.error(`Failed to add matched pair ${matchedPair}:`, error);
    }
}

async function endSession(sessionId) {
    try {
        const filter = { sessionId: sessionId };
        const update = { $set: { isEnded: true } };
        await MatchedPair.updateOne(filter, update);
        console.log(`Successfully update session state for session ${sessionId}`);

    } catch (error) {
        console.error(`Failed to update session state for session ${sessionId}:`, error);
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
        console.error(`Failed to update ${key} state for session ${sessionId}:`, error);
    }
}

async function deleteMatchedPair(sessionId) {
    try {
        await MatchedPair.deleteOne({ sessionId: sessionId });
        console.log(`Successfully delete session ${sessionId} from database.`);

    } catch (error) {
        console.error(`Failed to delete session ${sessionId}:`, error);
    }
}

module.exports = {
    getMatchedPairBySessionId,
    getCurrentMatchedPair,
    addMatchedPair,
    endSession,
    modifyMatchedPair,
    deleteMatchedPair
};