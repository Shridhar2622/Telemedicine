const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Adjust path to .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const Review = require("./src/models/Review");
const Doctor = require("./src/models/Doctor");

const checkReviews = async () => {
    await connectDB();

    try {
        const reviews = await Review.find().populate('doctor', 'name').populate('patient', 'userName');
        console.log(`Total Reviews: ${reviews.length}`);
        
        if (reviews.length > 0) {
            reviews.forEach(r => {
                console.log(`\n--- Review ---`);
                console.log(`ID: ${r._id}`);
                console.log(`Doctor: ${r.doctor ? r.doctor.name : 'Unknown'} (${r.doctor?._id})`);
                console.log(`Patient: ${r.patient ? r.patient.userName : 'Unknown'}`);
                console.log(`Rating: ${r.rating}`);
                console.log(`Comment: ${r.comment}`);
            });
        } else {
            console.log("No reviews found in the database.");
        }

    } catch (error) {
        console.error("Error checking reviews:", error);
    } finally {
        mongoose.disconnect();
    }
};

checkReviews();
