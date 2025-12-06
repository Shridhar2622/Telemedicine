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
      ref: "User",
      required: true
    },

    date: {
      type: String,
      required: true
    },

    timeSlot: {
      type: String,
      required: true
    },

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

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
