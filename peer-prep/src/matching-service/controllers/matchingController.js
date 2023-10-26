const matchingService = require('../services/matchingService');

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
        console.error(error);
        res.status(500).json({ message: 'Failed to find a match. Please try again!' })
    }
}

async function cancelMatch(req, res, next) {
    try {
        const isCancelled = await matchingService.cancelMatch(req.params.userId);
        if (isCancelled) {
            res.status(200).json({ message: 'Match cancelled successfully' });
        } else {
            throw new Error('Failed to cancel match');
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    findMatch,
    cancelMatch
};