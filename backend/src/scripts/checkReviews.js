const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Review = require('../models/Review');
const Doctor = require('../models/Doctor');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkReviews = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        const reviews = await Review.find().populate('doctor', 'name').populate('patient', 'userName');
        console.log('--- REVIEW CHECK ---');
        console.log(`Total Reviews: ${reviews.length}`);
        
        if (reviews.length > 0) {
            reviews.forEach(r => {
                console.log(`\nReview ID: ${r._id}`);
                console.log(`Doctor: ${r.doctor ? r.doctor.name : 'Unknown'}`);
                console.log(`Patient: ${r.userName}`);
                console.log(`Rating: ${r.rating}`);
                console.log(`Comment: ${r.comment}`);
            });
        } else {
            console.log("No reviews found.");
        }
        console.log('--- END CHECK ---');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkReviews();
