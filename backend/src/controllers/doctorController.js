const Doctor = require("../models/Doctor");
const User = require("../models/User");


const createOrUpdateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Verify doctor role
    const user = await User.findById(userId);
    if (!user || user.role !== "Doctor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only doctors can manage profile.",
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

    if (!specialization || !qualification || experience === undefined || !consultationFee || !name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let doctor = await Doctor.findOne({ userId });

    if (doctor) {
      // Update existing profile
      doctor.name = name;
      doctor.specialization = specialization;
      doctor.qualification = qualification;
      doctor.experience = experience;
      doctor.consultationFee = consultationFee;
      if (availableTimes) doctor.availableTimes = availableTimes;
      doctor.bio = bio || "";

      await doctor.save();

      return res.status(200).json({
        success: true,
        message: "Doctor profile updated successfully",
        data: doctor,
      });
    }

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

  } catch (error) {
    console.error("Error in createOrUpdateDoctorProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



const updateDoctorSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { availableTimes } = req.body;


    if (!availableTimes) {
      return res.status(400).json({
        success: false,
        message: "availableTimes is required",
      });
    }

    const doctor = await Doctor.findOne({ userId });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found. Please complete your profile first.",
      });
    }

    doctor.availableTimes = availableTimes;
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      data: doctor,
    });

  } catch (error) {
    console.error("Error in updateDoctorSchedule:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



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
        message: "Doctor profile not found. Complete your profile.",
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



const getDoctorPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const doctor = await Doctor.findOne({ userId }).populate(
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
    console.error("Error in getDoctorPublicProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



const getAllDoctors = async (req, res) => {
  try {
    const { specialization, minRating, maxPrice } = req.query;

    const filter = {};
    if (specialization) filter.specialization = specialization;
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (maxPrice) filter.consultationFee = { $lte: Number(maxPrice) };

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
  updateDoctorSchedule,
  getDoctorProfile,
  getDoctorById,
  getDoctorPublicProfile,
  getAllDoctors,
  checkProfileStatus,
};
