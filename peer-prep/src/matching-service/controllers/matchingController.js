const matchingService = require('../services/matchingService');

async function findMatch(req, res, next) {
    try {
        const { id, language, proficiency, difficulty, topic } = req.body;
        console.log(req.body);
        console.log(`${id}, ${language}, ${proficiency}, ${difficulty}, ${topic}`);

        const matchResult = await matchingService.findMatch({ id, language, proficiency, difficulty, topic });

        res.status(200).json(matchResult);

    } catch (error) {
        next(error);
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