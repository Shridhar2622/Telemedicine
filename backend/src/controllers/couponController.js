const Coupon = require('../models/Coupon');

// Create a new coupon
const createCoupon = async (req, res) => {
    try {
        const { code, discountPercentage, expirationDate, usageLimit } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code,
            discountPercentage,
            expirationDate,
            usageLimit: usageLimit ? Number(usageLimit) : null
        });

        await coupon.save();

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            coupon
        });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Validate a coupon
const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ message: 'This coupon is no longer active' });
        }

        if (new Date() > new Date(coupon.expirationDate)) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ message: 'This coupon has reached its usage limit' });
        }

        res.status(200).json({
            success: true,
            message: 'Coupon applied successfully',
            discountPercentage: coupon.discountPercentage,
            code: coupon.code
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all coupons (Admin)
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a coupon (Admin)
const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await Coupon.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createCoupon,
    validateCoupon,
    getAllCoupons,
    deleteCoupon
};
