const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;
