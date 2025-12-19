const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getRazorpayKey } = require('../controllers/paymentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify', authMiddleware, verifyPayment);
router.get('/key', authMiddleware, getRazorpayKey);

module.exports = router;
