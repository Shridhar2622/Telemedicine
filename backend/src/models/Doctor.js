const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: {
    type: String,
    required: [true, "Please add a specialization"],
    enum: [
      "General Physician",
      "Cardiologist",
      "Dermatologist",
      "Pediatrician",
      "Orthopedic",
      "Neurologist",
      "Psychiatrist",
      "Gynecologist",
      "Dentist",
      "ENT Specialist",
    ],
  },
  qualification: {
    type: String,
    required: [true, "Please add qualification"],
  },
  experience: {
    type: Number,
    required: [true, "Please add years of experience"],
    min: 0,
  },
  consultationFee: {
    type: Number,
    required: [true, "Please add consultation fee"],
    min: 0,
  },
  availableTimes: [
    {
      day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
      startTime: String,
      endTime: String,
    },
  ],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Doctor", doctorSchema)
