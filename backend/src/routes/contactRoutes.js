const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middlewares/authMiddleware');
const { adminRoleMiddleware } = require('../middlewares/roleMiddleware');

// Public route to submit form
router.post('/', contactController.submitContactForm);

// Protected Admin routes
router.get('/', authMiddleware, adminRoleMiddleware, contactController.getAllMessages);
router.patch('/:id/read', authMiddleware, adminRoleMiddleware, contactController.markAsRead);
router.delete('/:id', authMiddleware, adminRoleMiddleware, contactController.deleteMessage);

module.exports = router;
