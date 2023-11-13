const collaborationService = require('../services/collaborationService');

async function getHistory(req, res, next) {
    try {
        const sessionId = req.params.sessionId;

        const response = await collaborationService.getCollaborationHistory(sessionId);

        if (response[0] === 'None') {
            
            await res.status(500).json({ status: 'error', message: 'Collaboration data does not exist'});

        } else {
            const jsonRes = {
                status: "success",
                initTime: response[0],
                language: response[1],
                codes: response[2],
            }

            await res.status(200).json(jsonRes);
        }

    } catch (error) {
        console.log(error);

        await res.status(500).json({ status: 'error', message: error })
    }
}

module.exports = {
    getHistory,
};