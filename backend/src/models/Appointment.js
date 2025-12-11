const mongoose=require("mongoose")

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },

    date: {
      type: String,
      required: true
    },
timeSlot: {
  start: {
    type: String, // "14:00"
    required: true
  },
  end: {
    type: String, // "14:30"
    required: true
  }
}

,

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    meetingRoom: {
      type: String // WebRTC room or link
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

