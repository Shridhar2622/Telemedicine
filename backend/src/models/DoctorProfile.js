const mongoose=require("mongoose")
const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    specialization: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true
    },

    qualification: {
      type: String,
      required: true
    },

    consultationFee: {
      type: Number,
      required: true
    },

    about: {
      type: String,
      maxlength: 500
    },

    timings: {
      startTime: String,
      endTime: String
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    rating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const DoctorProfile = mongoose.model(
  "DoctorProfile",
  doctorProfileSchema
);


module.exports = DoctorProfile


