const express = require('express');
const router = express.Router();
const controller = require('../controllers/matchingController');

router.get('/', (req, res) => {
    res.status(200).send('<h1>Matching Service is up!</h1>');
});

router.post('/home/:userId', controller.findMatch);

router.get('/getMatchSession/:userId', controller.getActiveSession);

router.get('/getSession/:sessionId', controller.getSession);

router.delete('/end/:sessionId', controller.endSession);

router.delete('/home/:userId/matching', controller.cancelMatch);

module.exports = router;