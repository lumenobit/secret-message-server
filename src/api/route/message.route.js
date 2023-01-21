const express = require('express');
const { saveMessage, getAllMessages, deleteMessage } = require('../controller/message.controller');
const { validateAuth } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', saveMessage);
router.get('/', validateAuth, getAllMessages);
router.delete('/:id', validateAuth, deleteMessage);

module.exports = router;
