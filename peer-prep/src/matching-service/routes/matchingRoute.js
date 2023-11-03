const express = require('express');
const router = express.Router();
const controller = require('../controllers/matchingController');

router.post('/home/:userId', controller.findMatch);

router.get('/getMatchSession/:userId', controller.getActiveSession);

router.get('/getSession/:sessionId', controller.getSession);

router.delete('/end/:sessionId', controller.endSession);

router.delete('/home/:userId/matching', controller.cancelMatch);

module.exports = router;