const matchingService = require('../services/matchingService');
const matchingDB = require('../database/matchedPairDb');

async function findMatch(req, res, next) {
    try {
        const { language, proficiency, difficulty, topic } = req.body;
        const id = req.params.userId; // Extract user id from request params

        console.log(req.body);
        console.log(`${id}, ${language}, ${proficiency}, ${difficulty}, ${topic}`);

        const matchResult = await matchingService.findMatch({ id, language, proficiency, difficulty, topic });

        console.log("send result:", matchResult, res.statusCode);

        switch (matchResult.status) {
            case 'success':
                await res.status(200).json(matchResult);
                break;

            case 'error':
                await res.status(500).json(matchResult);
                break;

            case 'cancel':
                await res.status(200).json(matchResult);
                break;

            default:
                await res.status(500).json({ message: 'Unknown error. Please try again!' });
        }

    } catch (error) {
        console.log(error);

        await res.status(500).json({ message: 'Failed to find a match. Please try again!' })
    }
}

async function getActiveSession(req, res, next) {
    try {
        const userId = req.params.userId;

        const session = await matchingDB.getCurrentActiveSession(userId);

        const jsonRes = {
            sessionId: session
        };

        if (session) {
            await res.status(200).json(jsonRes);

        } else {
            await res.status(200).json({ sessionId: null })
            
        }
    } catch (error) {
        await res.status(500).json({ sessionId: null })
    }
}

async function getSession(req, res, next) {
    try {
        const sessionId = req.params.sessionId;

        const session = await matchingDB.getSession(sessionId);

        const jsonRes = {
            sessionId: session.sessionId,
            session: session
        };

        if (session) {
            await res.status(200).json(jsonRes);

        } else {
            await res.status(200).json({ sessionId: null, session: null});
            
        }
    } catch (error) {
        await res.status(500).json({ sessionId: null, session: null});
    }
}

async function endSession(req, res, next) {
    try {
        const sessionId = req.params.sessionId;
        const sessionInfo = await matchingDB.getMatchedPairBySessionId(sessionId);
        const isEnded = await matchingDB.endSession(sessionId);

        if (isEnded) {
            await res.status(200).json({ status: 'success', message: 'Session ended successfully' });

        } else {
            await res.status(500).json({ status: 'error', message: 'Failed to end session' });
            
        }
    } catch (error) {
        console.log(error);
        await res.status(500).json({ status: 'error', message: 'Failed to end session' });
    }
}

async function cancelMatch(req, res, next) {
    try {
        const isCancelled = await matchingService.cancelMatch(req.params.userId);

        if (isCancelled) {
            await res.status(200).json({ message: 'Match cancelled successfully' });

        } else {
            await res.status(500).json({ message: 'Failed to cancel match' });
            
        }
    } catch (error) {
        await res.status(500).json({ message: 'Failed to cancel match' });
    }
}

module.exports = {
    findMatch,
    getActiveSession,
    getSession,
    endSession,
    cancelMatch
};