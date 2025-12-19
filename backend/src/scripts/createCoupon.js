const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Coupon = require('../models/Coupon');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const createDummyCoupon = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        const coupon = new Coupon({
            code: 'SAVE20',
            discountPercentage: 20,
            expirationDate: new Date('2025-12-31')
        });

        await coupon.save();
        console.log('Coupon SAVE20 created successfully!');
    } catch (error) {
        if (error.code === 11000) {
            console.log('Coupon SAVE20 already exists.');
        } else {
            console.error('Error creating coupon:', error);
        }
    } finally {
        await mongoose.disconnect();
    }
};

createDummyCoupon();
