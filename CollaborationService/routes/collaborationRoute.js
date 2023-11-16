const express = require('express');
const router = express.Router();
const controller = require('../controllers/collaborationController');

router.get('/', (req, res) => {
    res.status(200).send('<h1>Collaboration Service is up!</h1>');
});

router.get('/getCollaborationHistory/:sessionId', controller.getHistory);

router.delete('/deleteSessionHistory/:sessionId', controller.deleteHistory);

module.exports = router;