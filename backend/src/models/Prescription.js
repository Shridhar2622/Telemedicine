const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    notes: {
        type: String,
        required: true,
        maxlength: 2000
    },

    medicines: [
        {
            name: String,
            dosage: String,
            frequency: String,
            duration: String
        }
    ],

    followUpDate: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);
