const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Appointment = require('../models/Appointment');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkAppointments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');

        const appointments = await Appointment.find({});
        console.log('--- APPOINTMENT CHECK ---');
        console.log(`Total Appointments: ${appointments.length}`);
        if (appointments.length > 0) {
            console.log(JSON.stringify(appointments, null, 2));
        } else {
            console.log("No appointments found.");
        }
        console.log('--- END CHECK ---');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkAppointments();
