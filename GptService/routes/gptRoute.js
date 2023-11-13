const express = require('express');
const router = express.Router();
const controller = require('../controllers/gptController');

router.post('/generate', controller.getResponse);

router.delete('/exitGpt/:userId', controller.exitSession);

router.get('/getCache/:userId', controller.getCache);

module.exports = router;