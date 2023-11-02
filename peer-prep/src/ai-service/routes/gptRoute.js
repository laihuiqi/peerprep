const express = require('express');
const router = express.Router();
const controller = require('../controllers/gptController');

router.post('/generate', controller.getResponse);

module.exports = router;