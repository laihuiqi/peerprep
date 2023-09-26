const express = require('express');
const router = express.Router();
const controller = require('../controllers/matchingController');

router.post('/home/:userId', controller.findMatch);

router.delete('/home/:userId/matching', controller.cancelMatch);

module.exports = router;