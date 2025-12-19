const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Appointment = require('../models/Appointment');
const Coupon = require('../models/Coupon');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const clearData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        const result = await Appointment.deleteMany({});
        console.log(`Deleted ${result.deletedCount} appointments`);

        // Also reset coupon counts for testing
        await Coupon.updateMany({}, { usedCount: 0 });
        console.log('Reset coupon usage counts');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

clearData();
