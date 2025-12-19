const Review = require("../models/Review");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private (Patient only)
exports.addReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;
    const userId = req.user.id;
    
    // Fetch User to get accurate Name
    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }
    const userName = user.userName || user.fullName || "Anonymous";

    // 1. Verify Appointment matches User and is Accepted/Completed
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointment.patient.toString() !== userId) {
      return res.status(401).json({ success: false, message: "Unauthorized to review this appointment" });
    }

    if (appointment.status !== 'accepted' && appointment.status !== 'completed') {
        return res.status(400).json({ success: false, message: "Can only review accepted or completed appointments" });
    }

    // 2. Add Review
    const review = await Review.create({
      doctor: doctorId,
      patient: userId,
      appointment: appointmentId,
      userName: userName, 
      rating,
      comment,
    });

    // 3. Update Doctor's Aggregate Rating
    const doctor = await Doctor.findById(doctorId);
    if (doctor) {
        const reviews = await Review.find({ doctor: doctorId });
        const total = reviews.reduce((acc, item) => item.rating + acc, 0);
        const avgRating = total / reviews.length;
        
        doctor.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place
        doctor.totalRatings = reviews.length;
        await doctor.save();
    }

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Duplicate key error
        return res.status(400).json({ success: false, message: "You have already reviewed this appointment" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get reviews for a doctor
// @route   GET /api/reviews/:doctorId
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.doctorId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
