const Doctor = require("../models/Doctor");
const User = require("../models/User");

// @desc    Create/Update doctor profile
// @route   POST /api/doctor/profile
// @access  Private (Doctor only)
const createOrUpdateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify user is a doctor
    const user = await User.findById(userId);
    if (!user || user.role !== "Doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can create/update profile.",
      });
    }

    const {
      specialization,
      qualification,
      experience,
      consultationFee,
      availableTimes,
      bio,
      name
    } = req.body;

    // Validation
    if (!specialization || !qualification || experience === undefined || !consultationFee || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: specialization, qualification, experience, and consultationFee",
      });
    }

    // Check if doctor profile already exists
    let doctor = await Doctor.findOne({ userId });

    if (doctor) {
      // Update existing profile
      doctor.specialization = specialization;
      doctor.qualification = qualification;
      doctor.experience = experience;
      doctor.consultationFee = consultationFee;
      doctor.availableTimes = availableTimes || [];
      doctor.bio = bio || "";

      await doctor.save();

      return res.status(200).json({
        success: true,
        message: "Doctor profile updated successfully",
        data: doctor,
      });
    } else {
      // Create new profile
      doctor = await Doctor.create({
        name,
        userId,
        specialization,
        qualification,
        experience,
        consultationFee,
        availableTimes: availableTimes || [],
        bio: bio || "",
      });

      return res.status(201).json({
        success: true,
        message: "Doctor profile created successfully",
        data: doctor,
      });
    }
  } catch (error) {
    console.error("Error in createOrUpdateDoctorProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctor/profile
// @access  Private (Doctor only)
const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ userId }).populate(
      "userId",
      "userName email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found. Please complete your profile.",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getDoctorProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get doctor profile by ID
// @route   GET /api/doctor/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate(
      "userId",
      "userName email"
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in getDoctorById:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctor
// @access  Public
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, minRating } = req.query;

    // Build filter
    const filter = {};
    if (specialization) {
      filter.specialization = specialization;
    }
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    const doctors = await Doctor.find(filter)
      .populate("userId", "userName email")
      .sort({ rating: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Check if doctor profile is completed
// @route   GET /api/doctor/profile/status
// @access  Private (Doctor only)
const checkProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const doctor = await Doctor.findOne({ userId });

    return res.status(200).json({
      success: true,
      isProfileCompleted: !!doctor,
      data: doctor || null,
    });
  } catch (error) {
    console.error("Error in checkProfileStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateDoctorProfile,
  getDoctorProfile,
  getDoctorById,
  getAllDoctors,
  checkProfileStatus,
};
