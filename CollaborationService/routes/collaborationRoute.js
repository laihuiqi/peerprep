const express = require('express');
const router = express.Router();
const controller = require('../controllers/collaborationController');

router.get('/getCollaborationHistory/:sessionId', controller.getHistory);

module.exports = router;