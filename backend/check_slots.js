const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const DB = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");
        
        const Doctor = require('./src/models/Doctor'); 
        
        const doctors = await Doctor.find({});
        console.log(`Found ${doctors.length} doctors.`);
        
        doctors.forEach(doc => {
            console.log(`\nDoctor: ${doc.name} (ID: ${doc._id})`);
            console.log(`Available Times Length: ${doc.availableTimes ? doc.availableTimes.length : 'undefined'}`);
            if (doc.availableTimes && doc.availableTimes.length > 0) {
                console.log(JSON.stringify(doc.availableTimes, null, 2));
            } else {
                console.log("No slots configured.");
            }
        });

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

DB();
