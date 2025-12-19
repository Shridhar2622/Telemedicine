const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, markMessagesRead } = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send', authMiddleware, sendMessage);
router.get('/conversations', authMiddleware, getConversations);
router.put('/read/:senderId', authMiddleware, markMessagesRead); // Mark as read
router.get('/:userId', authMiddleware, getMessages);

module.exports = router;
