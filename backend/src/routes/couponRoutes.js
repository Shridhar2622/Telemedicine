const express = require('express');
const router = express.Router();
const { createCoupon, validateCoupon, getAllCoupons, deleteCoupon } = require('../controllers/couponController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/validate', authMiddleware, validateCoupon);
router.post('/create', authMiddleware, createCoupon); // Admin only
router.get('/', authMiddleware, getAllCoupons); // Admin only
router.delete('/:id', authMiddleware, deleteCoupon); // Admin only

module.exports = router;
