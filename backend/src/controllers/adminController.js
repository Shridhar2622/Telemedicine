const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const Prescription = require("../models/Prescription");
const generateToken = require("../utils/generateToken");

// --------------------------------------
// ADMIN LOGIN
// --------------------------------------
async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin does not exist" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(admin);

    return res.status(200).json({
      message: "Admin login successful",
      token,
      user: {
        _id: admin._id,
        email: admin.email,
        role: "Admin" // Explicitly setting role as Admin
      }
    });
  } catch (error) {
    console.log("Admin Login Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------------------------------
// GET ALL USERS
// --------------------------------------
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.log("Get All Users Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------------------------------
// GET ALL DOCTORS
// --------------------------------------
async function getAllDoctors(req, res) {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "userName email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });

  } catch (error) {
    console.log("Get All Doctors Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------------------------------
// APPROVE DOCTOR PROFILE
// --------------------------------------
async function approveDoctor(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== "Doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Doctor approved successfully"
    });

  } catch (error) {
    console.log("Approve Doctor Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------------------------------
// REJECT / BLOCK DOCTOR
// --------------------------------------
async function rejectDoctor(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== "Doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Doctor rejected / deactivated"
    });

  } catch (error) {
    console.log("Reject Doctor Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------------------------------
// BLOCK / UNBLOCK ANY USER
// --------------------------------------
async function toggleUserBlock(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: user.isActive ? "User unblocked" : "User blocked"
    });

  } catch (error) {
    console.log("Toggle Block Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// --------------------------------------
// SYSTEM STATISTICS
// --------------------------------------
async function getStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const totalPrescriptions = await Prescription.countDocuments();

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalPrescriptions
      }
    });

  } catch (error) {
    console.log("Stats Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  adminLogin,
  getAllUsers,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  toggleUserBlock,
  getStats
};
